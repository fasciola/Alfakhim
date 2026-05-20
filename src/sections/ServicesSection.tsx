import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/contexts/LanguageContext';
import { locales } from '@/lib/locales';
import SectionHeader from '@/components/SectionHeader';
import ServiceCard from '@/components/ServiceCard';

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
    const { lang } = useLanguage();
    const t = locales[lang];
    const sectionRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!gridRef.current) return;
        const cards = gridRef.current.children;

        gsap.set(cards, { opacity: 0, y: 30, scale: 0.97 });

        const tween = gsap.to(cards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.06,
            ease: 'back.out(1.2)',
            scrollTrigger: {
                trigger: gridRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        });

        return () => { tween.kill(); };
    }, [lang]);

    // Handle video playback
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => { });
                } else {
                    video.pause();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(video);

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="services"
            className="relative overflow-hidden"
            style={{
                padding: 'var(--space-section) 0',
            }}
        >
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="/services-video.mp4" type="video/mp4" />
                </video>
                {/* Dark navy overlay for readability */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: 'rgba(10, 22, 40, 0.50)',
                    }}
                />
            </div>

            {/* Content */}
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
                    className="grid gap-5"
                    style={{
                        marginTop: '64px',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                    }}
                >
                    {t.services.items.map((service, i) => (
                        <ServiceCard
                            key={`${lang}-${i}`}
                            title={service.title}
                            description={service.desc}
                            index={i}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
