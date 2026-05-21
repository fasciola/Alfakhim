import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Marquee from 'react-fast-marquee';
import { useLanguage } from '@/contexts/LanguageContext';
import { locales } from '@/lib/locales';
import SectionHeader from '@/components/SectionHeader';
import RainOnGlass from '@/components/RainOnGlass';

gsap.registerPlugin(ScrollTrigger);

const partnerFilenames = [
    'gov_justice.png',
    'gov_interior.png',
    'gov_faics.png',
    'gov_ajman.png',
    'gov_health.png',
    'air_arabia.png',
    'emirates.png',
    'flydubai.png',
    'ethiopian_airlines.png',
    'badr_aviation.png',
];

function PartnerLogo({ name, filename }: { name: string; filename: string }) {
    const [error, setError] = React.useState(false);

    if (error) {
        return (
            <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                    width: '160px',
                    height: '80px',
                    background: 'var(--color-surface-warm)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    marginRight: '24px',
                }}
            >
                <span
                    className="font-body font-medium text-center"
                    style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}
                >
                    {name}
                </span>
            </div>
        );
    }

    return (
        <div
            className="flex items-center justify-center flex-shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-400"
            style={{
                width: '160px',
                height: '80px',
                background: 'var(--color-surface-warm)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginRight: '24px',
            }}
        >
            <img
                src={`/partners/${filename}`}
                alt={name}
                className="max-w-full max-h-full object-contain"
                onError={() => setError(true)}
            />
        </div>
    );
}

function ValuePoint({ number, title, desc }: { number: string; title: string; desc: string }) {
    return (
        <div
            className="transition-all duration-300 hover:-translate-y-1"
            style={{
                background: 'rgba(10, 22, 40, 0.3)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(193, 154, 68, 0.2)',
                padding: '28px',
            }}
        >
            <span
                className="font-display font-medium block"
                style={{
                    fontSize: '40px',
                    color: 'var(--color-gold)',
                    opacity: 0.5,
                    lineHeight: '1',
                }}
            >
                {number}
            </span>
            <h4
                className="font-display font-medium mt-3"
                style={{ fontSize: '18px', color: '#FFFFFF' }}
            >
                {title}
            </h4>
            <p
                className="font-body mt-2"
                style={{
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.85)',
                    lineHeight: '160%',
                }}
            >
                {desc}
            </p>
        </div>
    );
}

export default function PartnersSection() {
    const { lang } = useLanguage();
    const t = locales[lang];
    const marqueeRef = useRef<HTMLDivElement>(null);
    const valuesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!marqueeRef.current) return;

        const dir = lang === 'ar' ? -100 : 100;
        gsap.set(marqueeRef.current, { x: `${dir}vw`, opacity: 0 });

        const tween = gsap.to(marqueeRef.current, {
            x: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.inOut',
            scrollTrigger: {
                trigger: marqueeRef.current,
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
        });

        return () => { tween.kill(); };
    }, [lang]);

    useEffect(() => {
        if (!valuesRef.current) return;
        const items = valuesRef.current.children;

        gsap.set(items, { opacity: 0, y: 20 });

        const tween = gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.2)',
            scrollTrigger: {
                trigger: valuesRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        });

        return () => { tween.kill(); };
    }, [lang]);

    return (
        <section
            id="partners"
            className="relative overflow-hidden"
            style={{
                padding: 'var(--space-section) 0',
            }}
        >
            {/* Rain on Glass Background */}
            <RainOnGlass />

            {/* Content Layer */}
            <div className="relative z-10">
                {/* Header with frosted card */}
                <div className="container-main">
                    <div
                        style={{
                            background: 'rgba(10, 22, 40, 0.25)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid rgba(193, 154, 68, 0.15)',
                            padding: '32px',
                            maxWidth: '720px',
                            margin: '0 auto',
                        }}
                    >
                        <SectionHeader
                            label={t.partners.label}
                            title={t.partners.title}
                            subtitle={t.partners.subtitle}
                            light
                            centered
                        />
                    </div>
                </div>

                {/* Marquee */}
                <div ref={marqueeRef} style={{ marginTop: '56px', overflow: 'hidden' }}>
                    <Marquee
                        speed={40}
                        gradient={false}
                        pauseOnHover
                        direction={lang === 'ar' ? 'right' : 'left'}
                    >
                        {t.partners.partnerNames.map((name, i) => (
                            <PartnerLogo
                                key={`${lang}-${i}`}
                                name={name}
                                filename={partnerFilenames[i]}
                            />
                        ))}
                    </Marquee>
                </div>

                {/* Value Proposition with frosted glass cards */}
                <div className="container-main" style={{ marginTop: '80px' }}>
                    <div
                        ref={valuesRef}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                    >
                        {t.partners.values.map((val, i) => (
                            <ValuePoint
                                key={`${lang}-${i}`}
                                number={`0${i + 1}`}
                                title={val.title}
                                desc={val.desc}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
