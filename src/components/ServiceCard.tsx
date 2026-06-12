interface ServiceCardProps {
    title: string;
    description: string;
    image: string; // Make this required for the big top image
    icon?: React.ReactNode; // Optional small icon in the top-left corner
}

export default function ServiceCard({ title, description, image, icon }: ServiceCardProps) {
    return (
        <div
            className="group relative flex flex-col h-full transition-all duration-500 ease-out"
            style={{
                background: 'rgba(3, 72, 63, 0.62)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.22)',
            }}
            onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(47, 166, 154, 0.55)';
                el.style.transform = 'translateY(-5px)';
                el.style.boxShadow = '0 15px 40px rgba(15, 118, 110, 0.22)';
            }}
            onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.22)';
            }}
        >
            {/* ================= TOP IMAGE SECTION ================= */}
            <div className="relative h-44 w-full overflow-hidden">
                {/* Background Image */}
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark Gradient Overlay at bottom of image to blend with text */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(3,72,63,0.92)] to-transparent opacity-65" />

                {/* Small Badge/Icon in Top-Left (Optional) */}
                {icon && (
                    <div
                        className="absolute top-4 left-4 p-2 rounded-full backdrop-blur-md"
                        style={{
                            background: 'rgba(255,255,255,0.12)',
                            border: '1px solid rgba(255,255,255,0.2)',
                        }}
                    >
                        {icon}
                    </div>
                )}
            </div>

            {/* ================= CONTENT SECTION ================= */}
            <div className="p-6 flex flex-col flex-1" style={{ background: 'transparent' }}>
                <h3
                    className="font-display font-semibold mb-2 text-white text-xl"
                    style={{ letterSpacing: '-0.02em' }}
                >
                    {title}
                </h3>
                <p
                    className="font-body text-sm leading-relaxed"
                    style={{
                        color: 'rgba(255,255,255,0.72)',
                        lineHeight: '160%',
                    }}
                >
                    {description}
                </p>
            </div>
        </div>
    );
}