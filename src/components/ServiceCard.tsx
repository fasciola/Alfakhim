interface ServiceCardProps {
  title: string;
  description: string;
  index: number;
}

export default function ServiceCard({ title, description, index }: ServiceCardProps) {
  return (
    <div
      className="group transition-all duration-400"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px 28px',
        transitionTimingFunction: 'var(--ease-default)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = 'rgba(255,255,255,0.08)';
        el.style.borderColor = 'rgba(193,154,68,0.3)';
        el.style.transform = 'translateY(-4px)';
        el.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = 'rgba(255,255,255,0.04)';
        el.style.borderColor = 'rgba(255,255,255,0.08)';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
      }}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(193,154,68,0.1)',
        }}
      >
        <ServiceIcon index={index} />
      </div>

      {/* Title */}
      <h3
        className="font-display font-medium mt-5"
        style={{
          fontSize: '20px',
          lineHeight: '140%',
          color: 'var(--color-text-light)',
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="font-body mt-3"
        style={{
          fontSize: '15px',
          lineHeight: '160%',
          color: 'var(--color-text-muted-dark)',
        }}
      >
        {description}
      </p>
    </div>
  );
}

function ServiceIcon({ index }: { index: number }) {
  const icons = [
    // 1. Shield with document
    <svg key="1" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C19A44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4L26 8V15C26 21 21.5 26.5 16 28C10.5 26.5 6 21 6 15V8L16 4Z" />
      <line x1="11" y1="13" x2="21" y2="13" />
      <line x1="11" y1="17" x2="18" y2="17" />
      <line x1="11" y1="21" x2="15" y2="21" />
    </svg>,
    // 2. Identity card
    <svg key="2" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C19A44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="7" width="22" height="18" rx="2" />
      <circle cx="13" cy="14" r="3" />
      <path d="M9 22C9 19.5 11 17.5 13 17.5C15 17.5 17 19.5 17 22" />
      <rect x="20" y="12" width="5" height="1.5" rx="0.5" />
      <rect x="20" y="16" width="4" height="1.5" rx="0.5" />
    </svg>,
    // 3. Hard hat
    <svg key="3" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C19A44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 18C7 12 11 8 16 8C21 8 25 12 25 18" />
      <line x1="5" y1="18" x2="27" y2="18" />
      <path d="M11 18V22C11 24 13 26 16 26C19 26 21 24 21 22V18" />
      <line x1="22" y1="14" x2="26" y2="10" />
      <polyline points="24,14 26,14 26,12" />
    </svg>,
    // 4. Building with chart
    <svg key="4" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C19A44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="6" width="10" height="20" rx="1" />
      <rect x="8" y="9" width="3" height="3" />
      <rect x="8" y="14" width="3" height="3" />
      <rect x="8" y="19" width="3" height="3" />
      <rect x="12" y="9" width="2" height="3" />
      <rect x="12" y="14" width="2" height="3" />
      <rect x="12" y="19" width="2" height="3" />
      <rect x="19" y="18" width="3" height="8" rx="0.5" />
      <rect x="23" y="14" width="3" height="12" rx="0.5" />
      <line x1="18" y1="26" x2="28" y2="26" />
    </svg>,
    // 5. Handshake with star
    <svg key="5" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C19A44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4L17.5 10.5L24 12L17.5 13.5L16 20L14.5 13.5L8 12L14.5 10.5Z" />
      <path d="M6 18C6 18 9 16 12 17C14 18 15 20 16 20C17 20 18 18 20 17C23 16 26 18 26 18" />
      <path d="M6 22C6 22 9 20 12 21C14 22 15 24 16 24C17 24 18 22 20 21C23 20 26 22 26 22" />
    </svg>,
    // 6. Certificate
    <svg key="6" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C19A44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="5" width="20" height="16" rx="1" />
      <circle cx="16" cy="13" r="4" />
      <path d="M14 24L16 26L18 24" />
      <line x1="16" y1="21" x2="16" y2="26" />
      <path d="M12 21H20" />
    </svg>,
    // 7. Car with road
    <svg key="7" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C19A44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 14H8L10 10H22L24 14H26" />
      <rect x="6" y="14" width="20" height="7" rx="1" />
      <circle cx="10" cy="22" r="2.5" />
      <circle cx="22" cy="22" r="2.5" />
      <line x1="4" y1="27" x2="12" y2="27" strokeDasharray="2 2" />
      <line x1="20" y1="27" x2="28" y2="27" strokeDasharray="2 2" />
    </svg>,
    // 8. Rocket with building
    <svg key="8" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C19A44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4C16 4 22 10 22 18C22 22 20 26 16 28C12 26 10 22 10 18C10 10 16 4 16 4Z" />
      <circle cx="16" cy="17" r="2" />
      <path d="M12 24C12 24 10 26 10 28" />
      <path d="M20 24C20 24 22 26 22 28" />
      <rect x="23" y="20" width="5" height="6" rx="0.5" />
      <line x1="25" y1="20" x2="25" y2="17" />
    </svg>,
    // 9. Keyboard with paper
    <svg key="9" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C19A44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="14" width="18" height="12" rx="1" />
      <line x1="7" y1="18" x2="19" y2="18" />
      <line x1="7" y1="21" x2="19" y2="21" />
      <line x1="7" y1="24" x2="15" y2="24" />
      <rect x="20" y="6" width="8" height="12" rx="0.5" />
      <line x1="22" y1="9" x2="26" y2="9" />
      <line x1="22" y1="12" x2="25" y2="12" />
      <line x1="22" y1="15" x2="24" y2="15" />
    </svg>,
    // 10. Family with heart
    <svg key="10" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C19A44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="10" r="3" />
      <circle cx="21" cy="10" r="2.5" />
      <path d="M7 22C7 18 9 16 11 16C13 16 15 18 15 22" />
      <path d="M17 22C17 19 18.5 17.5 21 17.5C23.5 17.5 25 19 25 22" />
      <path d="M16 14C16 14 17.5 12 18.5 13C19.5 14 16 17 16 17C16 17 12.5 14 13.5 13C14.5 12 16 14 16 14Z" />
    </svg>,
  ];

  return <>{icons[index] || null}</>;
}
