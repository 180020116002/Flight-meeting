function DownloadIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M14 4v14M8 13l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 22h18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CalendarConnectIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="4" y="6" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M4 11h20" stroke="currentColor" strokeWidth="1.75" />
      <path d="M9 4v4M19 4v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      {/* Link chain */}
      <circle cx="11" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 18h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function PlaneLifeIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Simplified side-view plane */}
      <path
        d="M4 14 C4 14 14 11 20 12 C23 12.5 24.5 13.5 25 14 C24.5 14.5 23 15.5 20 16 C14 17 4 14 4 14Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M10 14 L9 9 L13 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M5 14 L4 16 L8 15.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Checkmark */}
      <path
        d="M18 21 L20.5 23.5 L24 19"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface Step {
  number: string
  icon: React.ReactNode
  title: string
  description: string
}

const steps: Step[] = [
  {
    number: '01',
    icon: <DownloadIcon />,
    title: 'Download & install',
    description: 'One-click installer for Mac or Windows. No Homebrew, no terminal required.',
  },
  {
    number: '02',
    icon: <CalendarConnectIcon />,
    title: 'Connect Google Calendar',
    description: 'OAuth sign-in — read-only access to your events. Done in under 30 seconds.',
  },
  {
    number: '03',
    icon: <PlaneLifeIcon />,
    title: 'Get on with your life',
    description: "We'll handle the rest. Your next meeting gets an airplane. That's the whole thing.",
  },
]

export default function HowItWorks() {
  return (
    <section
      className="relative w-full section-pad overflow-hidden"
      style={{ background: '#111113' }}
    >
      {/* Top edge fade */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.06)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.06)' }}
        aria-hidden="true"
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 80% 80%, rgba(255,182,193,0.05) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <span
            className="text-xs tracking-[0.2em] uppercase font-medium block mb-4"
            style={{ color: '#FFB6C1' }}
          >
            Setup
          </span>
          <h2
            className="font-serif leading-tight text-white"
            style={{
              fontFamily: 'var(--font-serif), Instrument Serif, Georgia, serif',
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
            }}
          >
            How it works
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting dotted line — desktop only */}
          <div
            className="hidden lg:block absolute top-[3.25rem] left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                'repeating-linear-gradient(90deg, rgba(255,182,193,0.25) 0, rgba(255,182,193,0.25) 6px, transparent 6px, transparent 14px)',
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
            {steps.map((step, idx) => (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center lg:items-center gap-5"
              >
                {/* Vertical connector — mobile only */}
                {idx < steps.length - 1 && (
                  <div
                    className="lg:hidden absolute top-full left-1/2 -translate-x-1/2 w-px h-10 pointer-events-none"
                    aria-hidden="true"
                    style={{
                      background:
                        'linear-gradient(to bottom, rgba(255,182,193,0.3), transparent)',
                    }}
                  />
                )}

                {/* Step circle */}
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: 'rgba(255,182,193,0.1)',
                      border: '1.5px solid rgba(255,182,193,0.3)',
                      color: '#FFB6C1',
                    }}
                  >
                    {step.icon}
                  </div>

                  {/* Step number badge */}
                  <span
                    className="text-xs font-semibold tracking-widest"
                    style={{ color: 'rgba(255,182,193,0.45)' }}
                  >
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2.5 max-w-xs">
                  <h3
                    className="text-lg font-semibold text-white leading-snug"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.48)' }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA nudge */}
        <div className="mt-16 text-center">
          <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Three steps. Two minutes. Zero regrets.
          </p>
          <a
            href={process.env.NEXT_PUBLIC_DOWNLOAD_MAC ?? '#'}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-[1.04] hover:shadow-lg active:scale-[0.97]"
            style={{
              background: '#FFB6C1',
              color: '#0A0A0B',
              boxShadow: '0 4px 20px rgba(255,182,193,0.28)',
            }}
          >
            Download Flyby — it&apos;s free
          </a>
        </div>
      </div>
    </section>
  )
}
