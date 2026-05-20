import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { locales } from '@/lib/locales';
import SectionHeader from '@/components/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

const contactIcons = [MapPin, Phone, Mail, Clock];

export default function ContactSection() {
    const { lang } = useLanguage();
    const t = locales[lang];
    const sectionRef = useRef<HTMLElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Contact info items
            if (infoRef.current) {
                const items = infoRef.current.querySelectorAll('.contact-info-item');
                const xOffset = lang === 'ar' ? 20 : -20;

                gsap.set(items, { opacity: 0, x: xOffset });
                gsap.to(items, {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'back.out(1.2)',
                    scrollTrigger: { trigger: infoRef.current, start: 'top 85%' },
                });
            }

            // Map
            if (mapRef.current) {
                const xOffset = lang === 'ar' ? -30 : 30;
                gsap.set(mapRef.current, { opacity: 0, x: xOffset });
                gsap.to(mapRef.current, {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    ease: 'back.out(1.2)',
                    delay: 0.2,
                    scrollTrigger: { trigger: mapRef.current, start: 'top 85%' },
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [lang]);

    const contactData = [
        { icon: 0, label: t.contact.addressLabel, value: t.contact.address },
        { icon: 1, label: t.contact.phoneLabel, value: t.contact.phones, isPhone: true },
        { icon: 2, label: t.contact.emailLabel, value: t.contact.email, isEmail: true },
        { icon: 3, label: t.contact.hoursLabel, value: t.contact.hours },
    ];

    return (
        <section
            ref={sectionRef}
            id="contact"
            style={{
                backgroundColor: 'var(--color-cream)',
                padding: 'var(--space-section) 0',
            }}
        >
            <div className="container-main">
                <SectionHeader
                    label={t.contact.label}
                    title={t.contact.title}
                    subtitle={t.contact.subtitle}
                    light={false}
                    centered={false}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
                    {/* Left: Contact Info */}
                    <div ref={infoRef} className="flex flex-col" style={{ gap: '24px' }}>
                        {contactData.map((item, i) => {
                            const Icon = contactIcons[item.icon];
                            return (
                                <div key={i} className="contact-info-item flex items-start gap-4">
                                    <div
                                        className="flex-shrink-0 flex items-center justify-center"
                                        style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '50%',
                                            background: 'rgba(193,154,68,0.08)',
                                            marginTop: '2px',
                                        }}
                                    >
                                        <Icon size={20} style={{ color: 'var(--color-gold)' }} />
                                    </div>
                                    <div>
                                        <p
                                            className="font-body font-medium"
                                            style={{ fontSize: '14px', color: 'var(--color-navy)' }}
                                        >
                                            {item.label}
                                        </p>
                                        {item.isPhone ? (
                                            <div className="flex flex-col gap-1 mt-1">
                                                {([...(item.value as readonly string[])]).map((phone, j) => (
                                                    <a
                                                        key={j}
                                                        href={`tel:${phone.replace(/\s/g, '')}`}
                                                        className="font-body transition-colors duration-300 hover:text-[var(--color-gold)]"
                                                        style={{ fontSize: '16px', color: 'var(--color-text-secondary)' }}
                                                    >
                                                        {phone} {j === 0 && (
                                                            <span style={{ fontSize: '12px', color: 'var(--color-gold)' }}>
                                                                ({lang === 'en' ? 'Primary' : '\u0631\u0626\u064A\u0633\u064A'})
                                                            </span>
                                                        )}
                                                    </a>
                                                ))}
                                            </div>
                                        ) : item.isEmail ? (
                                            <a
                                                href={`mailto:${item.value}`}
                                                className="font-body transition-colors duration-300 hover:text-[var(--color-gold)]"
                                                style={{ fontSize: '16px', color: 'var(--color-text-secondary)' }}
                                            >
                                                {item.value as string}
                                            </a>
                                        ) : (
                                            <p
                                                className="font-body"
                                                style={{ fontSize: '16px', color: 'var(--color-text-secondary)' }}
                                            >
                                                {item.value as string}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right: Google Maps Embed */}
                    <div ref={mapRef} className="h-full">
                        <div
                            className="w-full h-full"
                            style={{
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--color-divider)',
                                overflow: 'hidden',
                                minHeight: '400px',
                            }}
                        >
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3604.648328138115!2d55.453828173690944!3d25.383100124148974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f596ee46301bf%3A0x56f284214d6d565!2z2KfZhNmB2K7ZitmFINmE2K7Yr9mF2KfYqiDYsdis2KfZhCDYp9mE2KfYudmF2KfZhCAtQUwgRkFLSElNIEJVU0lORVNTTUVOIFNFUlZJQ0VT!5e0!3m2!1sen!2sae!4v1779307422557!5m2!1sen!2sae"
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: '400px' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Al-Fakhim Location"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
