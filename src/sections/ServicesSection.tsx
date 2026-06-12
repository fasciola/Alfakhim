import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/contexts/LanguageContext';
import { locales } from '@/lib/locales';
import SectionHeader from '@/components/SectionHeader';
import ServiceCard from '@/components/ServiceCard';

gsap.registerPlugin(ScrollTrigger);

// Define the service data with images
const servicesData = [
    { title: 'Visa Services', image: '/services/visa.png' },
    { title: 'Document Processing', image: '/services/documents.png' },
    { title: 'Business Setup', image: '/services/business.png' },
    { title: 'Legal Support', image: '/services/legal.png' },
    { title: 'Translation Services', image: '/services/translation.png' },
    { title: 'Government Liaison', image: '/services/government.png' },
    { title: 'Transport Services', image: '/services/transport.png' },
    { title: 'Rocket Services', image: '/services/rocket.png' },
];

export default function ServicesSection() {
    const { lang } = useLanguage();
    const t = locales[lang];
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!gridRef.current) return;
        const cards = gridRef.current.children;
        gsap.set(cards, { opacity: 0, y: 40 });
        gsap.to(cards, {
            opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: gridRef.current, start: 'top 85%' }
        });
    }, [lang]);

    return (
        <section id="services" className="relative py-20 px-4" style={{ backgroundColor: 'var(--color-dark-section)' }}>

            {/* Background Effect */}
            <div className="absolute inset-0 z-0 opacity-70">
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(ellipse at center, rgba(47,166,154,0.22) 0%, rgba(15,118,110,0.12) 36%, var(--color-dark-section) 72%)',
                    }}
                />
            </div>

            <div className="container-main relative z-10">
                <SectionHeader
                    label={t.services.label}
                    title={t.services.title}
                    subtitle={t.services.subtitle}
                    light
                    centered
                />

                <div
                    ref={gridRef}
                    className="grid gap-6 mt-12"
                    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
                >
                    {/* Loop through services */}
                    {servicesData.map((service, i) => (
                        <ServiceCard
                            key={i}
                            title={service.title}
                            description={t.services.items[i]?.desc || "Premium government assistance."}
                            image={service.image}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}