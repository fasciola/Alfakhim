import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useLanguage } from '@/contexts/LanguageContext';
import { locales } from '@/lib/locales';
import { useNavScroll } from '@/hooks/useNavScroll';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { key: 'home', href: '#hero' },
  { key: 'services', href: '#services' },
  { key: 'about', href: '#about' },
  { key: 'contact', href: '#contact' },
] as const;

export default function Navbar() {
  const { lang, toggleLanguage } = useLanguage();
  const { isScrolled, isVisible } = useNavScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);
  const t = locales[lang];

  useEffect(() => {
    if (menuOpen && menuItemsRef.current) {
      const items = menuItemsRef.current.children;
      gsap.fromTo(
        items,
        { opacity: 0, x: lang === 'ar' ? -40 : 40 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: 'expo.out', delay: 0.2 }
      );
    }
  }, [menuOpen, lang]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
        style={{
          transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
          transitionTimingFunction: 'var(--ease-default)',
          transitionDuration: '0.4s',
        }}
      >
        <div
          className="transition-all duration-300"
          style={{
            backgroundColor: isScrolled ? 'rgba(250, 248, 243, 0.95)' : 'transparent',
            backdropFilter: isScrolled ? 'blur(12px)' : 'none',
            borderBottom: isScrolled ? '1px solid rgba(10, 22, 40, 0.06)' : '1px solid transparent',
          }}
        >
          <div className="container-main flex items-center justify-between" style={{ height: '80px' }}>
            {/* Logo */}
                      <a
                          href="#hero"
                          onClick={(e) => { e.preventDefault(); handleNavClick('#hero'); }}
                          className="flex items-center"
                      >
                          <img
                              src="/logo.png"
                              alt="Al-Fakhim Businessmen Services"
                              style={{ height: '40px', width: 'auto' }}
                          />
                      </a>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center" style={{ gap: '40px' }}>
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className="font-body text-base transition-colors duration-300 hover:opacity-70"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {t.nav[link.key as keyof typeof t.nav]}
                </a>
              ))}
            </div>

            {/* Right Side: Language + CTA */}
            <div className="hidden md:flex items-center" style={{ gap: '16px' }}>
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="font-body text-sm flex items-center transition-all duration-300 hover:border-opacity-40"
                style={{
                  border: '1px solid rgba(10, 22, 40, 0.15)',
                  borderRadius: '100px',
                  padding: '6px 16px',
                  color: 'var(--color-navy)',
                }}
              >
                <span className="font-medium">{lang === 'en' ? 'EN' : 'العربية'}</span>
                <span className="mx-2 opacity-30">|</span>
                <span className="opacity-50">{lang === 'en' ? 'العربية' : 'EN'}</span>
              </button>

              {/* CTA Call Us */}
              <a
                href={`tel:${t.contact.primaryPhone.replace(/\s/g, '')}`}
                className="font-body font-medium text-base text-white transition-all duration-300 hover:scale-103"
                style={{
                  backgroundColor: 'var(--color-gold)',
                  borderRadius: '100px',
                  padding: '10px 24px',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = 'var(--color-gold-light)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = 'var(--color-gold)';
                }}
              >
                {t.nav.callUs}
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} style={{ color: 'var(--color-navy)' }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed inset-0 z-[60] flex flex-col"
          style={{ backgroundColor: 'var(--color-navy)' }}
        >
          <div className="flex items-center justify-between container-main" style={{ height: '64px' }}>
                      <span className="flex items-center">
                          <img
                              src="/logo.png"
                              alt="Al-Fakhim Businessmen Services"
                              style={{
                                  height: '60px!important', width: 'auto' }}
                          />
                      </span>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X size={32} color="white" />
            </button>
          </div>

          <div
            ref={menuItemsRef}
            className="flex-1 flex flex-col justify-center container-main"
            style={{ gap: '32px' }}
          >
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="font-display text-white font-medium"
                style={{ fontSize: '32px' }}
              >
                {t.nav[link.key as keyof typeof t.nav]}
              </a>
            ))}
          </div>

          <div className="container-main pb-8 flex flex-col items-center" style={{ gap: '24px' }}>
            <button
              onClick={toggleLanguage}
              className="font-body text-sm text-white flex items-center"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '100px',
                padding: '8px 20px',
              }}
            >
              <span className="font-medium">{lang === 'en' ? 'EN' : 'العربية'}</span>
              <span className="mx-2 opacity-30">|</span>
              <span className="opacity-50">{lang === 'en' ? 'العربية' : 'EN'}</span>
            </button>

            <a
              href={`tel:${t.contact.primaryPhone.replace(/\s/g, '')}`}
              className="font-body font-medium text-base text-white"
              style={{
                backgroundColor: 'var(--color-gold)',
                borderRadius: '100px',
                padding: '12px 32px',
              }}
            >
              {t.nav.callUs}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
