import Link from 'next/link'
import dynamic from 'next/dynamic'

const EXE_URL = process.env.NEXT_PUBLIC_DOWNLOAD_WIN ?? 'https://github.com/180020116002/Flight-meeting/releases/download/v1.0.1/Flyby-Setup-1.0.1.exe'

// Client-only: uses Framer Motion for the looping flyby animation
const HeroFlybyAnimation = dynamic(
  () => import('./HeroFlybyAnimation'),
  { ssr: false, loading: () => <div className="w-full min-h-[320px]" /> }
)

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
              href={EXE_URL}
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
              href={EXE_URL}
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
          <HeroFlybyAnimation />
        </div>

        {/* Mobile airplane (smaller, centered below copy) */}
        <div className="lg:hidden relative h-48">
          <HeroFlybyAnimation />
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
