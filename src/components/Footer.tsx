import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/contexts/LanguageContext';
import { locales } from '@/lib/locales';

gsap.registerPlugin(ScrollTrigger);

const quickLinks = ['home', 'services', 'about', 'contact'] as const;

export default function Footer() {
  const { lang } = useLanguage();
  const t = locales[lang];
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;
    const children = footerRef.current.querySelectorAll('.footer-animate');

    gsap.set(children, { opacity: 0, y: 30 });
    const tween = gsap.to(children, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.06,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    });

    return () => { tween.kill(); };
  }, []);

  const handleLinkClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      ref={footerRef}
      style={{ backgroundColor: 'var(--color-navy)', padding: '64px 0 32px' }}
    >
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand Column */}
          <div className="footer-animate text-center md:text-left">
                      <div className="flex items-center">
                          <img
                              src="/logo.png"
                              alt="Al-Fakhim Businessmen Services"
                              style={{ height: '36px', width: 'auto' }}
                          />
                      </div>
            <p
              className="font-body mt-2"
              style={{ fontSize: '14px', color: 'var(--color-text-muted-dark)' }}
            >
              {t.footer.tagline}
            </p>
            <p
              className="font-mono mt-1"
              style={{ fontSize: '12px', color: 'var(--color-text-muted-dark)' }}
            >
              {t.footer.legal}
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-animate text-center md:text-left">
            <h4
              className="font-body font-medium uppercase"
              style={{
                fontSize: '14px',
                color: 'var(--color-gold)',
                letterSpacing: '0.05em',
              }}
            >
              {t.footer.quickLinks}
            </h4>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {quickLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(`#${link}`);
                  }}
                  className="font-body text-base transition-colors duration-300 hover:text-white"
                  style={{ color: 'var(--color-text-muted-dark)' }}
                >
                  {t.nav[link as keyof typeof t.nav]}
                </a>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="footer-animate text-center md:text-left">
            <h4
              className="font-body font-medium uppercase"
              style={{
                fontSize: '14px',
                color: 'var(--color-gold)',
                letterSpacing: '0.05em',
              }}
            >
              {t.footer.connect}
            </h4>
            <div className="flex flex-col gap-4 mt-6">
              <a
                href={`https://wa.me/${t.contact.primaryPhone.replace(/\s/g, '').replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-base transition-colors duration-300 hover:text-white"
                style={{ color: 'var(--color-text-muted-dark)' }}
              >
                {t.contact.primaryPhone}
              </a>
              <a
                href={`mailto:${t.contact.email}`}
                className="font-body text-base transition-colors duration-300 hover:text-white"
                style={{ color: 'var(--color-text-muted-dark)' }}
              >
                {t.contact.email}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="footer-animate mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          <p
            className="font-body text-center md:text-left"
            style={{ fontSize: '14px', color: 'var(--color-text-muted-dark)' }}
          >
            {t.footer.copyright}
          </p>
          <p
            className="font-body"
            style={{ fontSize: '14px', color: 'var(--color-text-muted-dark)' }}
          >
            {t.footer.location}
          </p>
        </div>
      </div>
    </footer>
  );
}
