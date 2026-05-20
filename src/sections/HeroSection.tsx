import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useLanguage } from '@/contexts/LanguageContext';
import { locales } from '@/lib/locales';

// Geometric star SVG - defined locally, no import needed
function GeometricStar({ size = 24, opacity = 0.3 }: { size?: number; opacity?: number }) {
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

export default function HeroSection() {
    const { lang } = useLanguage();
    const t = locales[lang];
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const videoWrapRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!sectionRef.current || !contentRef.current) return;

        const ctx = gsap.context(() => {
            // Video fade in
            if (videoWrapRef.current) {
                gsap.fromTo(videoWrapRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: 'power2.out' });
            }

            // Content entrance timeline
            const tl = gsap.timeline({ delay: 0.3 });

            const label = contentRef.current!.querySelector('.hero-label');
            const headline = contentRef.current!.querySelector('.hero-headline');
            const subheadline = contentRef.current!.querySelector('.hero-subheadline');
            const ctas = contentRef.current!.querySelectorAll('.hero-cta');
            const bottomStrip = sectionRef.current!.querySelector('.hero-bottom-strip');

            if (label) {
                gsap.set(label, { opacity: 0, y: 20 });
                tl.to(label, { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.2)' }, 0.1);
            }

            if (headline) {
                gsap.set(headline, { clipPath: 'inset(0 0 100% 0)' });
                tl.to(headline, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'power3.inOut' }, 0.25);
            }

            if (subheadline) {
                gsap.set(subheadline, { opacity: 0, y: 20 });
                tl.to(subheadline, { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.2)' }, 0.4);
            }

            if (ctas.length) {
                gsap.set(ctas, { opacity: 0, y: 15 });
                tl.to(ctas, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.2)', stagger: 0.1 }, 0.55);
            }

            if (bottomStrip) {
                gsap.set(bottomStrip, { opacity: 0, y: 10 });
                tl.to(bottomStrip, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.7);
            }

            // Parallax + fade on scroll
            if (videoWrapRef.current) {
                gsap.to(videoWrapRef.current, {
                    yPercent: -40,
                    opacity: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: '+=50vh',
                        scrub: true,
                    },
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [lang]);

    // Handle video playback
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const playVideo = () => {
            video.play().catch(() => {
                // Autoplay blocked, user interaction needed
            });
        };

        // Try to play immediately
        playVideo();

        // Also try when document becomes visible
        const handleVisibility = () => {
            if (document.hidden) {
                video.pause();
            } else {
                playVideo();
            }
        };

        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, []);

    const handleScrollTo = (id: string) => {
        const el = document.querySelector(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="relative overflow-hidden"
            style={{ width: '100%', height: '100vh' }}
        >
            {/* Video Background */}
            <div ref={videoWrapRef} className="absolute inset-0 z-0">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ opacity: 0.7 }}
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                </video>
                {/* Cream overlay for readability */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(250,248,243,0.25) 0%, rgba(250,248,243,0.55) 60%, rgba(250,248,243,0.85) 100%)',
                    }}
                />
            </div>

            {/* Content Overlay */}
            <div
                ref={contentRef}
                className="relative z-10 flex flex-col items-center justify-center h-full pt-20 pb-32"
            >
                {/* Headline Group */}
                <div
                    className="container-main text-center px-6"
                    style={{ 
                        maxWidth: '800px',
                        marginTop: '120px',  // Add this to push content down
                        marginBottom: '140px' // Change from paddingBottom 
                    }}
                >
                    <p
                        className="hero-label font-mono uppercase mx-auto"
                        style={{
                            fontSize: '12px',
                            color: 'var(--color-text-secondary)',
                            letterSpacing: '0.08em',
                            marginBottom: '16px',
                            display: 'inline-block',
                        }}
                    >
                        {t.hero.label}
                    </p>

                    <h1
                        className="hero-headline font-display font-medium mx-auto"
                        style={{
                            fontSize: 'clamp(36px, 5vw, 64px)',
                            lineHeight: '110%',
                            letterSpacing: '-0.02em',
                            color: 'var(--color-navy)',
                            marginBottom: '20px',
                            maxWidth: '700px',
                        }}
                    >
                        {t.hero.headline}
                    </h1>

                    <p
                        className="hero-subheadline font-body mx-auto"
                        style={{
                            fontSize: '17px',
                            lineHeight: '165%',
                            color: 'var(--color-text-secondary)',
                            maxWidth: '600px',
                            marginBottom: '32px',
                        }}
                    >
                        {t.hero.subheadline}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            className="hero-cta font-body font-medium text-white transition-all duration-300 hover:scale-[1.03]"
                            style={{
                                backgroundColor: 'var(--color-gold)',
                                borderRadius: '100px',
                                padding: '14px 32px',
                                fontSize: '16px',
                            }}
                            onMouseEnter={(e) => {
                                (e.target as HTMLElement).style.backgroundColor = 'var(--color-gold-light)';
                            }}
                            onMouseLeave={(e) => {
                                (e.target as HTMLElement).style.backgroundColor = 'var(--color-gold)';
                            }}
                            onClick={() => handleScrollTo('#contact')}
                        >
                            {t.hero.ctaPrimary}
                        </button>
                        <button
                            className="hero-cta font-body font-medium transition-all duration-300 hover:bg-[rgba(10,22,40,0.05)]"
                            style={{
                                background: 'transparent',
                                color: 'var(--color-navy)',
                                border: '1px solid rgba(10,22,40,0.2)',
                                borderRadius: '100px',
                                padding: '14px 32px',
                                fontSize: '16px',
                            }}
                            onClick={() => handleScrollTo('#services')}
                        >
                            {t.hero.ctaSecondary}
                        </button>
                    </div>
                </div>

                {/* Bottom Narrative Strip */}
                <div
                    className="hero-bottom-strip absolute bottom-0 left-0 right-0 z-20"
                    style={{
                        background: 'linear-gradient(to top, rgba(250,248,243,0.95) 0%, rgba(250,248,243,0.7) 60%, transparent 100%)',
                        padding: '32px var(--container-padding) 28px',
                        borderTop: '1px solid var(--color-divider)',
                    }}
                >
                    <div className="container-main flex items-center justify-between px-6">
                        <p
                            className="font-mono uppercase"
                            style={{
                                fontSize: '12px',
                                color: 'var(--color-text-secondary)',
                                letterSpacing: '0.06em',
                            }}
                        >
                            {t.hero.bottomStrip}
                        </p>
                        <div className="hidden sm:block">
                            <GeometricStar size={24} opacity={0.3} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}