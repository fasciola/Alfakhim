import React, { useRef, useEffect, useMemo, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/contexts/LanguageContext';
import { locales } from '@/lib/locales';
import SectionHeader from '@/components/SectionHeader';
import RainOnGlass from '@/components/RainOnGlass';

gsap.registerPlugin(ScrollTrigger);

const partnerFilenames = [
    'gov_justice.png', 'gov_interior.png', 'gov_faics.png', 'gov_ajman.png', 'gov_health.png',
    'air_arabia.png', 'emirates.png', 'flydubai.png', 'ethiopian_airlines.png', 'badr_aviation.png',
];

function PartnerLogo({ name, filename }: { name: string; filename: string }) {
    const [error, setError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const cardStyle: React.CSSProperties = {
        width: '160px',
        height: '80px',
        background: isHovered ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        marginRight: '24px',
        border: isHovered ? '1px solid rgba(193, 154, 68, 0.5)' : '1px solid rgba(255,255,255,0.12)',
        transition: 'all 0.25s ease-out',
        transform: isHovered ? 'translateY(-2px) scale(1.03)' : 'translateY(0) scale(1)',
        boxShadow: isHovered ? '0 6px 20px rgba(0,0,0,0.25)' : 'none',
        willChange: 'transform',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    };

    const imgStyle: React.CSSProperties = {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
        filter: isHovered ? 'none' : 'grayscale(1) brightness(0.85)',
        transition: 'filter 0.25s ease-out',
        opacity: 1,
    };

    if (error) {
        return (
            <div style={cardStyle} className="flex items-center justify-center">
                <span style={{ fontSize: '13px', color: '#ffffff', textAlign: 'center', fontWeight: 500 }}>
                    {name}
                </span>
            </div>
        );
    }

    return (
        <div
            style={cardStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img
                src={`/partners/${filename}`}
                alt={name}
                style={imgStyle}
                onError={() => setError(true)}
                loading="lazy"
                decoding="async"
            />
        </div>
    );
}

function ValuePoint({ number, title, desc }: { number: string; title: string; desc: string }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            style={{
                background: hovered ? 'rgba(10, 22, 40, 0.85)' : 'rgba(10, 22, 40, 0.6)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px 24px',
                border: hovered ? '1px solid rgba(193, 154, 68, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: hovered
                    ? '0 12px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                    : '0 6px 24px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.3s ease',
                transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <span
                style={{
                    fontSize: '44px',
                    background: 'linear-gradient(135deg, #C19A44 0%, #F0EDE7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: '1',
                    display: 'block',
                    marginBottom: '12px',
                }}
            >
                {number}
            </span>
            <h4 style={{ fontSize: '18px', color: '#ffffff', fontWeight: 600, marginBottom: '8px' }}>
                {title}
            </h4>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
                {desc}
            </p>
        </div>
    );
}

export default function PartnersSection() {
    const { lang } = useLanguage();
    const t = locales[lang];
    const valuesRef = useRef<HTMLDivElement>(null);
    const isArabic = lang === 'ar';

    // Memoize logo list
    const logoList = useMemo(() => {
        return t.partners.partnerNames.map((name, i) => (
            <PartnerLogo key={`${lang}-${i}`} name={name} filename={partnerFilenames[i]} />
        ));
    }, [lang, t.partners.partnerNames]);

    // GSAP animation for Value Points only
    useEffect(() => {
        if (!valuesRef.current) return;
        const items = valuesRef.current.children;
        gsap.set(items, { opacity: 0, y: 20 });
        const tween = gsap.to(items, {
            opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.2)',
            scrollTrigger: { trigger: valuesRef.current, start: 'top 85%', toggleActions: 'play none none none' }
        });
        return () => tween.kill();
    }, [lang]);

    // Refresh ScrollTrigger when language changes (for RTL layout shifts)
    useEffect(() => {
        ScrollTrigger.refresh();
    }, [lang]);

    return (
        <section id="partners" className="relative overflow-hidden" style={{ padding: 'var(--space-section) 0' }}>
            <RainOnGlass />

            <div className="relative z-10">
                <div className="container-main">
                    <SectionHeader label={t.partners.label} title={t.partners.title} subtitle={t.partners.subtitle} light centered />
                </div>

                {/* ==================== Pure CSS Marquee ==================== */}
                <div style={{ marginTop: '48px', overflow: 'hidden' }}>
                    <div
                        className={`marquee-track ${isArabic ? 'marquee-rtl' : 'marquee-ltr'}`}
                        style={{
                            display: 'flex',
                            gap: '24px',
                            direction: isArabic ? 'rtl' : 'ltr',
                        }}
                    >
                        {/* Quadruple copy for seamless infinite loop */}
                        {logoList}
                        {logoList}
                        {logoList}
                        {logoList}
                    </div>
                </div>

                {/* Value Proposition Cards */}
                <div className="container-main" style={{ marginTop: '64px' }}>
                    <div ref={valuesRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
                        {t.partners.values.map((val, i) => (
                            <ValuePoint key={`${lang}-${i}`} number={`0${i + 1}`} title={val.title} desc={val.desc} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}