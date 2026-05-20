import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/contexts/LanguageContext';
import { locales } from '@/lib/locales';

gsap.registerPlugin(ScrollTrigger);

function GeometricStar({ size = 24, opacity = 0.4 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
      <path
        d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z"
        stroke="#C19A44"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

function CheckmarkIcon() {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center"
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: 'rgba(193,154,68,0.1)',
        border: '1px solid rgba(193,154,68,0.3)',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M3 6L5 8L9 4" stroke="#C19A44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function AboutSection() {
  const { lang } = useLanguage();
  const t = locales[lang];
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Left column animations
      if (leftRef.current) {
        const label = leftRef.current.querySelector('.about-label');
        const title = leftRef.current.querySelector('.about-title');
        const body = leftRef.current.querySelector('.about-body');
        const stats = leftRef.current.querySelectorAll('.about-stat');

        if (label) {
          gsap.set(label, { opacity: 0, y: 20 });
          gsap.to(label, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.2)', scrollTrigger: { trigger: leftRef.current, start: 'top 85%' } });
        }

        if (title) {
          gsap.set(title, { clipPath: 'inset(0 0 100% 0)' });
          gsap.to(title, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'power3.inOut', scrollTrigger: { trigger: leftRef.current, start: 'top 85%' } });
        }

        if (body) {
          gsap.set(body, { opacity: 0, y: 30 });
          gsap.to(body, { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.2)', delay: 0.2, scrollTrigger: { trigger: leftRef.current, start: 'top 85%' } });
        }

        if (stats.length) {
          gsap.set(stats, { opacity: 0, y: 20 });
          gsap.to(stats, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(1.2)', scrollTrigger: { trigger: leftRef.current, start: 'top 80%' } });
        }
      }

      // Divider animation
      if (dividerRef.current) {
        gsap.set(dividerRef.current, { scaleY: 0, transformOrigin: 'top' });
        gsap.to(dividerRef.current, {
          scaleY: 1,
          duration: 1.0,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        });
      }

      // Star animation
      if (starRef.current) {
        gsap.set(starRef.current, { scale: 0 });
        gsap.to(starRef.current, {
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.2)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 55%' },
        });
      }

      // Right column animations
      if (rightRef.current) {
        const items = rightRef.current.querySelectorAll('.diff-item');
        const xOffset = lang === 'ar' ? -40 : 40;

        gsap.set(items, { opacity: 0, x: xOffset });
        gsap.to(items, {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.2)',
          scrollTrigger: { trigger: rightRef.current, start: 'top 85%' },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [lang]);

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        backgroundColor: 'var(--color-cream)',
        padding: 'var(--space-section) 0',
      }}
    >
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-8 md:gap-16">
          {/* Left Column */}
          <div ref={leftRef}>
            <p
              className="about-label font-mono uppercase"
              style={{
                fontSize: '12px',
                color: 'var(--color-gold)',
                letterSpacing: '0.1em',
                marginBottom: '16px',
              }}
            >
              {t.about.label}
            </p>

            <h2
              className="about-title font-display font-medium"
              style={{
                fontSize: 'clamp(32px, 4vw, 48px)',
                lineHeight: '115%',
                letterSpacing: '-0.015em',
                color: 'var(--color-navy)',
                maxWidth: '480px',
              }}
            >
              {t.about.title}
            </h2>

            <p
              className="about-body font-body"
              style={{
                fontSize: '17px',
                lineHeight: '165%',
                color: 'var(--color-text-secondary)',
                maxWidth: '460px',
                marginTop: '24px',
              }}
            >
              {t.about.body}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-12 mt-10">
              {t.about.stats.map((stat, i) => (
                <div key={i} className="about-stat">
                  <span
                    className="font-display font-medium block"
                    style={{
                      fontSize: '36px',
                      color: 'var(--color-navy)',
                    }}
                  >
                    {stat.number}
                  </span>
                  <span
                    className="font-mono uppercase block"
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-text-secondary)',
                      letterSpacing: '0.05em',
                      marginTop: '4px',
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative Divider */}
          <div className="hidden md:flex items-center justify-center relative">
            <div
              ref={dividerRef}
              style={{
                width: '1px',
                height: '100%',
                background: 'var(--color-divider)',
              }}
            />
            <div
              ref={starRef}
              className="absolute"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
              <GeometricStar size={24} opacity={0.4} />
            </div>
          </div>

          {/* Mobile Divider */}
          <div className="flex md:hidden items-center justify-center py-4">
            <div className="flex items-center gap-4 w-full">
              <div className="flex-1 h-px" style={{ background: 'var(--color-divider)' }} />
              <GeometricStar size={20} opacity={0.4} />
              <div className="flex-1 h-px" style={{ background: 'var(--color-divider)' }} />
            </div>
          </div>

          {/* Right Column */}
          <div ref={rightRef}>
            <p
              className="font-mono uppercase"
              style={{
                fontSize: '12px',
                color: 'var(--color-gold)',
                letterSpacing: '0.1em',
                marginBottom: '32px',
              }}
            >
              {t.about.diffLabel}
            </p>

            <div className="flex flex-col" style={{ gap: '28px' }}>
              {t.about.differentiators.map((diff, i) => (
                <div key={i} className="diff-item flex items-start gap-4">
                  <CheckmarkIcon />
                  <div>
                    <h4
                      className="font-body font-medium"
                      style={{
                        fontSize: '18px',
                        color: 'var(--color-navy)',
                      }}
                    >
                      {diff.title}
                    </h4>
                    <p
                      className="font-body mt-1"
                      style={{
                        fontSize: '15px',
                        color: 'var(--color-text-secondary)',
                        lineHeight: '160%',
                      }}
                    >
                      {diff.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
