import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 v_uv;
  void main() {
    v_uv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_scale;
  uniform float u_rotationSpeed;
  uniform float u_patternIntensity;
  uniform float u_lineThickness;
  uniform float u_morphSpeed;

  varying vec2 v_uv;

  #define PI 3.14159265359
  #define TAU 6.28318530718

  // Tile colors
  vec3 tileColor1 = vec3(0.980, 0.973, 0.953); // #FAF8F3 cream
  vec3 tileColor2 = vec3(0.910, 0.886, 0.847); // #E8E2D8 warm stone
  vec3 tileColor3 = vec3(0.831, 0.898, 0.878); // #D4E5E0 soft teal
  vec3 lineColor = vec3(0.757, 0.604, 0.267);   // #C19A44 gold
  vec3 bgColor = vec3(0.980, 0.973, 0.953);      // #FAF8F3 cream

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float sdSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
  }

  float sdPolygon(vec2 p, float r, float n, float rot) {
    float angle = atan(p.y, p.x) + rot;
    float sector = TAU / n;
    float a = mod(angle + sector * 0.5, sector) - sector * 0.5;
    vec2 q = vec2(cos(a), abs(sin(a))) * length(p) - vec2(r * cos(sector * 0.5), r * sin(sector * 0.5));
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
  }

  float sdStar(vec2 p, float r, int n, float m) {
    float an = PI / float(n);
    float en = PI / m;
    vec2 acs = vec2(cos(an), sin(an));
    vec2 ecs = vec2(cos(en), sin(en));
    float bn = mod(atan(p.x, p.y), 2.0 * an) - an;
    p = length(p) * vec2(cos(bn), abs(sin(bn)));
    p -= r * acs;
    p += ecs * clamp(-dot(p, ecs), 0.0, r * acs.y / ecs.y);
    return length(p) * sign(p.x);
  }

  // Rotate UV
  vec2 rot(vec2 p, float a) {
    float c = cos(a), s = sin(a);
    return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
  }

  // Girih pattern in a single tile cell
  float girihPattern(vec2 p, float t) {
    float d = 1e5;
    float morph = sin(t * u_morphSpeed) * 0.5 + 0.5;

    // Central 8-pointed star
    float star = abs(sdStar(p, 0.12 + morph * 0.03, 4, 4.0));
    d = min(d, star);

    // Inner octagon
    float oct = abs(sdPolygon(p, 0.20 + morph * 0.02, 8.0, PI / 8.0));
    d = min(d, oct);

    // Radial lines from center
    for (int i = 0; i < 8; i++) {
      float angle = float(i) * PI / 4.0 + t * u_rotationSpeed * 0.2;
      vec2 dir = vec2(cos(angle), sin(angle));
      float line = sdSegment(p, dir * 0.20, dir * (0.38 + morph * 0.04));
      d = min(d, line);
    }

    // Corner bowtie patterns
    for (int i = 0; i < 4; i++) {
      float angle = float(i) * PI / 2.0 + PI / 4.0;
      vec2 corner = vec2(cos(angle), sin(angle)) * 0.35;
      float bowtie = abs(sdSegment(p, corner + vec2(0.04, 0.0) * cos(angle + PI/2.0), corner - vec2(0.04, 0.0) * cos(angle + PI/2.0)));
      d = min(d, bowtie);
    }

    // Diagonal crossing lines
    for (int i = 0; i < 4; i++) {
      float angle = float(i) * PI / 2.0 + PI / 4.0;
      vec2 start = vec2(cos(angle), sin(angle)) * 0.22;
      vec2 end = vec2(cos(angle + PI), sin(angle + PI)) * 0.22;
      float crossLine = sdSegment(p, start, vec2(0.0));
      d = min(d, crossLine);
    }

    return d;
  }

  void main() {
    // Normalize coordinates
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    // Scale for tile density
    float scale = u_scale;
    vec2 tileUv = p * scale;

    // Slow rotation of the entire pattern
    float globalRot = u_time * u_rotationSpeed * 0.1;
    tileUv = rot(tileUv, globalRot);

    // Tile ID
    vec2 id = floor(tileUv);
    vec2 f = fract(tileUv) - 0.5;

    // Per-tile random rotation (4 cardinal directions)
    float tileRand = hash(id);
    float tileRot = floor(tileRand * 4.0) * PI * 0.5;
    vec2 fp = rot(f, tileRot);

    // Per-tile color variation
    float colorRand = hash(id + 100.0);
    vec3 tileColor = mix(tileColor1, tileColor2, smoothstep(0.3, 0.7, colorRand));
    tileColor = mix(tileColor, tileColor3, smoothstep(0.8, 1.0, colorRand) * 0.5);

    // Girih pattern distance
    float patternD = girihPattern(fp, u_time);

    // Line thickness
    float lineW = u_lineThickness * 0.006;
    float lines = smoothstep(lineW, lineW * 0.3, patternD);

    // Tile border
    float borderD = max(abs(f.x), abs(f.y)) - 0.5;
    float border = smoothstep(0.008, 0.003, abs(borderD));

    // Combine
    float allLines = max(lines, border * 0.3);

    // Pattern intensity modulation
    allLines *= u_patternIntensity;

    // Compose color
    vec3 col = mix(tileColor, bgColor, 0.3);
    col = mix(col, lineColor, allLines * 0.7);

    // Subtle vignette
    float vig = 1.0 - length(p) * 0.5;
    col *= smoothstep(0.0, 0.7, vig);

    // Final mix toward background
    col = mix(bgColor, col, 0.85);

    gl_FragColor = vec4(col, 1.0);
  }
`;

interface TessellationCanvasProps {
  opacity?: number;
}

export default function TessellationCanvas({ opacity = 1 }: TessellationCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rafRef = useRef<number>(0);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Shader material
    const uniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(container.offsetWidth, container.offsetHeight) },
      u_scale: { value: 18.0 },
      u_rotationSpeed: { value: 0.03 },
      u_patternIntensity: { value: 0.85 },
      u_lineThickness: { value: 0.55 },
      u_morphSpeed: { value: 0.12 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mobile: denser pattern
    if (window.innerWidth < 768) {
      uniforms.u_scale.value = 22.0;
    }

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      if (!isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    // Intersection observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(container);

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      renderer.setSize(w, h);
      uniforms.u_resolution.value.set(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      resizeObserver.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        opacity,
        transition: 'opacity 0.3s ease',
      }}
    />
  );
}
