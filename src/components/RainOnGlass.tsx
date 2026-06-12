import { useEffect, useRef } from 'react';

const VERT_SRC = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG_SRC = `
precision highp float;
uniform float u_time;
uniform vec2 u_res;
uniform vec2 u_mouse;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = r * p * 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float aspect = u_res.x / u_res.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  float t = u_time * 0.35;

  vec2 warp = vec2(
    fbm(p * 2.0 + vec2(t, 1.7)),
    fbm(p * 2.0 + vec2(8.3, -t))
  );

  vec2 q = p + (warp - 0.5) * 0.8;
  float folds = sin(q.x * 9.0 + q.y * 5.0 + t * 2.0);
  folds += sin(q.x * -4.0 + q.y * 12.0 - t * 1.5) * 0.55;
  folds += sin((q.x + q.y) * 7.0 + t) * 0.35;

  float fabric = smoothstep(-1.2, 1.2, folds);
  float sheen = pow(max(0.0, sin(folds * 2.0 + t * 2.0)), 9.0);
  float vignette = 1.0 - smoothstep(0.2, 1.1, length(p * vec2(0.9, 1.15)));

  vec3 base = mix(vec3(0.005), vec3(0.13), fabric);
  vec3 highlight = vec3(0.72) * sheen;
  vec3 col = (base + highlight) * (0.35 + 0.85 * vignette);

  float grain = hash(gl_FragCoord.xy + fract(u_time) * 100.0);
  col += (grain - 0.5) * 0.015;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export default function RainOnGlass() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) {
      console.error('WebGL not available');
      return;
    }

    const canvasEl: HTMLCanvasElement = canvas;
    const glContext: WebGLRenderingContext = gl;

    const compile = (type: number, source: string): WebGLShader | null => {
      const shader = glContext.createShader(type);
      if (!shader) return null;

      glContext.shaderSource(shader, source);
      glContext.compileShader(shader);

      if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        console.error('Shader error:', glContext.getShaderInfoLog(shader));
        glContext.deleteShader(shader);
        return null;
      }

      return shader;
    };

    const vertexShader = compile(glContext.VERTEX_SHADER, VERT_SRC);
    const fragmentShader = compile(glContext.FRAGMENT_SHADER, FRAG_SRC);
    if (!vertexShader || !fragmentShader) return;

    const program = glContext.createProgram();
    if (!program) return;

    glContext.attachShader(program, vertexShader);
    glContext.attachShader(program, fragmentShader);
    glContext.linkProgram(program);

    if (!glContext.getProgramParameter(program, glContext.LINK_STATUS)) {
      console.error('Link error:', glContext.getProgramInfoLog(program));
      return;
    }

    glContext.useProgram(program);

    const buffer = glContext.createBuffer();
    if (!buffer) return;

    glContext.bindBuffer(glContext.ARRAY_BUFFER, buffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), glContext.STATIC_DRAW);

    const position = glContext.getAttribLocation(program, 'a_pos');
    glContext.enableVertexAttribArray(position);
    glContext.vertexAttribPointer(position, 2, glContext.FLOAT, false, 0, 0);

    const uTime = glContext.getUniformLocation(program, 'u_time');
    const uRes = glContext.getUniformLocation(program, 'u_res');
    const uMouse = glContext.getUniformLocation(program, 'u_mouse');

    let frame = 0;
    let running = true;
    let needsResize = true;
    let mouseX = -1;
    let mouseY = -1;

    const resize = () => {
      needsResize = false;
      const parent = canvasEl.parentElement;
      const rect = parent?.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect?.width || window.innerWidth));
      const height = Math.max(1, Math.round(rect?.height || window.innerHeight));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvasEl.width = Math.round(width * dpr);
      canvasEl.height = Math.round(height * dpr);
      canvasEl.style.width = `${width}px`;
      canvasEl.style.height = `${height}px`;
      glContext.viewport(0, 0, canvasEl.width, canvasEl.height);
      glContext.uniform2f(uRes, canvasEl.width, canvasEl.height);
    };

    const render = (now: number) => {
      if (!running) return;
      if (needsResize) resize();

      glContext.uniform1f(uTime, now * 0.001);
      glContext.uniform2f(uMouse, mouseX, mouseY);
      glContext.drawArrays(glContext.TRIANGLES, 0, 3);
      frame = requestAnimationFrame(render);
    };

    const onMove = (event: MouseEvent) => {
      const rect = canvasEl.getBoundingClientRect();
      mouseX = (event.clientX - rect.left) * (canvasEl.width / rect.width);
      mouseY = (rect.height - (event.clientY - rect.top)) * (canvasEl.height / rect.height);
    };

    const onLeave = () => {
      mouseX = -1;
      mouseY = -1;
    };

    const onResize = () => {
      needsResize = true;
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        frame = requestAnimationFrame(render);
      }
    };

    canvasEl.addEventListener('mousemove', onMove);
    canvasEl.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibilityChange);

    resize();
    frame = requestAnimationFrame(render);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      canvasEl.removeEventListener('mousemove', onMove);
      canvasEl.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ zIndex: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}
