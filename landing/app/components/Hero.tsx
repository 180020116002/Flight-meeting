import Link from 'next/link'

const MAC_URL = process.env.NEXT_PUBLIC_DOWNLOAD_MAC ?? '#'
const WIN_URL = process.env.NEXT_PUBLIC_DOWNLOAD_WIN ?? '#'

function HeroAirplane() {
  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[320px]">
      {/* Soft glow behind airplane */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 55% 45%, rgba(255,182,193,0.13) 0%, transparent 75%)',
        }}
      />

      {/* Dotted flight trail */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center px-4 animate-trail-dots pointer-events-none">
        <div className="flex gap-2 ml-4">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="rounded-full bg-pastel-pink"
              style={{
                width: 4,
                height: 4,
                opacity: Math.max(0.08, 0.45 - i * 0.022),
              }}
            />
          ))}
        </div>
      </div>

      {/* The airplane SVG rendered inline (server component safe) */}
      <div className="relative z-10 animate-hero-float drop-shadow-2xl">
        {/* Inline SVG airplane — no client component needed */}
        <svg
          width="220"
          height="106"
          viewBox="0 0 160 77"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Flyby airplane illustration"
          role="img"
        >
          <defs>
            <filter id="hero-shadow" x="-10%" y="-20%" width="130%" height="150%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(255,182,193,0.25)" />
            </filter>
            <linearGradient id="hero-fuselage" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#FFB6C1" />
              <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="hero-wing" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFB6C1" />
              <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <g filter="url(#hero-shadow)">
            <path d="M18 38 L26 18 L36 32 Z" fill="#FFB6C1" opacity="0.9" />
            <path d="M14 44 L38 42 L36 49 L16 50 Z" fill="#FFB6C1" opacity="0.85" />
            <path
              d="M22 36 C22 36 90 26 130 30 C142 31 152 35 155 40 C152 45 142 49 130 50 C90 54 22 44 22 44 Z"
              fill="url(#hero-fuselage)"
            />
            <path
              d="M130 30 C142 31 152 35 155 40 C152 45 142 49 130 50 C136 44 138 40 136 36 Z"
              fill="#FFB6C1"
              opacity="0.95"
            />
            <path d="M55 44 L60 44 L75 66 L45 64 Z" fill="url(#hero-wing)" />
            <path d="M60 36 L65 36 L52 14 L38 16 Z" fill="url(#hero-wing)" />
            <ellipse cx="62" cy="55" rx="7" ry="4.5" fill="#1a1a1f" opacity="0.7" />
            <ellipse cx="65" cy="55" rx="5" ry="3.5" fill="#FFB6C1" opacity="0.6" />
            <ellipse cx="136" cy="38" rx="6.5" ry="4.5" fill="rgba(180,230,255,0.85)" />
            <ellipse cx="125" cy="37.5" rx="5" ry="3.5" fill="rgba(180,230,255,0.85)" opacity="0.8" />
            <ellipse cx="110" cy="37" rx="3" ry="2.5" fill="rgba(180,230,255,0.85)" opacity="0.55" />
            <ellipse cx="99" cy="37" rx="3" ry="2.5" fill="rgba(180,230,255,0.85)" opacity="0.55" />
            <ellipse cx="88" cy="37.5" rx="3" ry="2.5" fill="rgba(180,230,255,0.85)" opacity="0.45" />
            <ellipse cx="77" cy="38" rx="3" ry="2.5" fill="rgba(180,230,255,0.85)" opacity="0.4" />
          </g>
        </svg>

        {/* Notification pill floating above the airplane */}
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium text-white border"
          style={{
            background: 'rgba(17,17,19,0.9)',
            borderColor: 'rgba(255,182,193,0.35)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 16px rgba(255,182,193,0.15)',
          }}
        >
          ✈️ &nbsp;Meeting with Andrew in 5 min
        </div>
      </div>

      {/* Subtle orbit rings */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 280,
          height: 280,
          border: '1px dashed rgba(255,182,193,0.1)',
          top: '50%',
          left: '55%',
          transform: 'translate(-50%,-50%)',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 380,
          height: 380,
          border: '1px dashed rgba(255,182,193,0.06)',
          top: '50%',
          left: '55%',
          transform: 'translate(-50%,-50%)',
        }}
      />
    </div>
  )
}

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: '#0A0A0B' }}
    >
      {/* Background radial glow top-left */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at -5% 5%, rgba(255,182,193,0.14) 0%, transparent 65%)',
        }}
      />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-0 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center min-h-screen">
        {/* ── Left: Copy ── */}
        <div className="flex flex-col gap-8 lg:gap-10">
          {/* Beta pill */}
          <div className="flex">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border"
              style={{
                background: 'rgba(255,182,193,0.08)',
                borderColor: 'rgba(255,182,193,0.25)',
                color: '#FFB6C1',
              }}
            >
              <span>✈️</span>
              <span>Now in beta — free to download</span>
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-serif leading-[1.05] tracking-tight"
            style={{
              fontFamily: 'var(--font-serif), Instrument Serif, Georgia, serif',
              fontSize: 'clamp(2.8rem, 5.5vw, 6rem)',
              color: '#fff',
            }}
          >
            Never get{' '}
            <span
              style={{
                color: '#FFB6C1',
                fontStyle: 'italic',
              }}
            >
              blindsided
            </span>{' '}
            by a meeting again.
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg lg:text-xl leading-relaxed max-w-lg"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Flyby flies a little airplane across your screen 5 minutes before every
            meeting. That&rsquo;s it. That&rsquo;s the app.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={MAC_URL}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-semibold transition-all duration-200 hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]"
              style={{
                background: '#FFB6C1',
                color: '#0A0A0B',
                boxShadow: '0 4px 24px rgba(255,182,193,0.3)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download for Mac
            </Link>

            <Link
              href={WIN_URL}
              className="win-dl-btn inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-semibold border transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: 'transparent',
                borderColor: 'rgba(255,182,193,0.4)',
                color: '#FFB6C1',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 12V6.75l6-1.32v6.57H3zm17-9v8.75h-7V5.57L20 3zM3 13h6v6.57l-6-1.32V13zm17 .25V22l-7-1.43V13h7z" />
              </svg>
              Download for Windows
            </Link>
          </div>

          {/* Fine print */}
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Free &middot; macOS 12+ &middot; Windows 10+
          </p>
        </div>

        {/* ── Right: Animated airplane ── */}
        <div className="relative lg:flex hidden">
          <HeroAirplane />
        </div>

        {/* Mobile airplane (smaller, centered below copy) */}
        <div className="lg:hidden relative h-48">
          <HeroAirplane />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce"
        aria-hidden="true"
      >
        <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
          scroll
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  )
}
