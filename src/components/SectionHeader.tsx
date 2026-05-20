import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  light?: boolean;
  centered?: boolean;
}

export default function SectionHeader({ label, title, subtitle, light = false, centered = true }: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const labelEl = ref.current.querySelector('.sh-label');
    const titleEl = ref.current.querySelector('.sh-title');
    const subtitleEl = ref.current.querySelector('.sh-subtitle');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    if (labelEl) {
      gsap.set(labelEl, { opacity: 0, y: 20 });
      tl.to(labelEl, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.2)' }, 0);
    }

    if (titleEl) {
      gsap.set(titleEl, { clipPath: 'inset(0 0 100% 0)' });
      tl.to(titleEl, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'power3.inOut' }, 0.1);
    }

    if (subtitleEl) {
      gsap.set(subtitleEl, { opacity: 0, y: 20 });
      tl.to(subtitleEl, { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.2)' }, 0.3);
    }

    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={ref} className={centered ? 'text-center' : ''}>
      <p
        className="sh-label font-mono uppercase"
        style={{
          fontSize: '12px',
          letterSpacing: '0.1em',
          color: light ? 'var(--color-gold)' : 'var(--color-gold)',
          marginBottom: '16px',
        }}
      >
        {label}
      </p>
      <h2
        className="sh-title font-display font-medium"
        style={{
          fontSize: 'clamp(32px, 4vw, 48px)',
          lineHeight: '115%',
          letterSpacing: '-0.015em',
          color: light ? 'var(--color-text-light)' : 'var(--color-navy)',
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="sh-subtitle font-body"
          style={{
            fontSize: '17px',
            lineHeight: '165%',
            color: light ? 'var(--color-text-muted-dark)' : 'var(--color-text-secondary)',
            marginTop: '16px',
            maxWidth: '600px',
            marginLeft: centered ? 'auto' : undefined,
            marginRight: centered ? 'auto' : undefined,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
