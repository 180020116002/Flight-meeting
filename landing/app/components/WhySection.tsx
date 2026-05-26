function BellIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="18" cy="18" r="17" stroke="rgba(255,182,193,0.2)" strokeWidth="1" />
      <path
        d="M18 8C14.134 8 11 11.134 11 15v6l-2 2v1h18v-1l-2-2v-6c0-3.866-3.134-7-7-7z"
        stroke="#FFB6C1"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M15.5 24c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5"
        stroke="#FFB6C1"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Notification dot */}
      <circle cx="23" cy="10" r="3" fill="#FFB6C1" />
      {/* Strike-through overlay */}
      <path
        d="M10 10 L26 26"
        stroke="rgba(255,182,193,0.35)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="18" cy="18" r="17" stroke="rgba(255,182,193,0.2)" strokeWidth="1" />
      <rect x="9" y="11" width="18" height="16" rx="2" stroke="#FFB6C1" strokeWidth="1.5" fill="none" />
      <path d="M9 16h18" stroke="#FFB6C1" strokeWidth="1.5" />
      <path d="M13 9v4M23 9v4" stroke="#FFB6C1" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="12" y="19" width="4" height="3" rx="0.5" fill="#FFB6C1" opacity="0.5" />
      <rect x="20" y="19" width="4" height="3" rx="0.5" fill="#FFB6C1" opacity="0.3" />
      <rect x="12" y="23" width="4" height="1.5" rx="0.5" fill="#FFB6C1" opacity="0.2" />
    </svg>
  )
}

function DockIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="18" cy="18" r="17" stroke="rgba(255,182,193,0.2)" strokeWidth="1" />
      {/* Screen */}
      <rect x="8" y="9" width="20" height="14" rx="1.5" stroke="#FFB6C1" strokeWidth="1.5" fill="none" />
      {/* Menu bar dots */}
      <circle cx="11" cy="12" r="1" fill="#FFB6C1" opacity="0.5" />
      <circle cx="14" cy="12" r="1" fill="#FFB6C1" opacity="0.35" />
      <circle cx="17" cy="12" r="1" fill="#FFB6C1" opacity="0.2" />
      {/* Airplane in menu bar */}
      <path
        d="M22 12 C22 12 24 11.3 25.5 12 C24 12.7 22 12 22 12Z"
        fill="#FFB6C1"
        opacity="0.8"
      />
      {/* Stand */}
      <path d="M18 23v3" stroke="#FFB6C1" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 26h8" stroke="#FFB6C1" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

interface CardProps {
  icon: React.ReactNode
  headline: string
  body: string
}

function WhyCard({ icon, headline, body }: CardProps) {
  return (
    <div
      className="group relative flex flex-col gap-5 p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-default"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 30% 30%, rgba(255,182,193,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Icon */}
      <div className="relative z-10">{icon}</div>

      {/* Headline */}
      <h3
        className="relative z-10 text-xl font-semibold leading-snug text-white"
        style={{ fontFamily: 'var(--font-sans), Inter, system-ui, sans-serif' }}
      >
        {headline}
      </h3>

      {/* Body */}
      <p
        className="relative z-10 text-base leading-relaxed"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        {body}
      </p>

      {/* Bottom accent line on hover */}
      <div
        className="absolute bottom-0 left-8 right-8 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'rgba(255,182,193,0.3)' }}
      />
    </div>
  )
}

const cards: CardProps[] = [
  {
    icon: <BellIcon />,
    headline: 'Notifications get ignored.',
    body: "An airplane at 10,000 feet? That's harder to miss. Your brain notices motion — we designed around that.",
  },
  {
    icon: <CalendarIcon />,
    headline: 'Works with Google Calendar.',
    body: 'Connect once in 30 seconds. Read-only OAuth — we never touch your events, we just watch the clock.',
  },
  {
    icon: <DockIcon />,
    headline: 'Lives in your menu bar.',
    body: 'One click away. Never in your way. Uses less than 1% CPU sitting quietly until the moment counts.',
  },
]

export default function WhySection() {
  return (
    <section
      className="relative w-full section-pad overflow-hidden"
      style={{ background: '#0A0A0B' }}
    >
      {/* Separator line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(255,182,193,0.2), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section label */}
        <div className="flex justify-center mb-14">
          <span
            className="text-xs tracking-[0.2em] uppercase font-medium"
            style={{ color: '#FFB6C1' }}
          >
            Why an airplane?
          </span>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card) => (
            <WhyCard key={card.headline} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}
