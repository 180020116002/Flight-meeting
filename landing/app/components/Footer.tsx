function GitHubIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="relative w-full"
      style={{
        background: '#0A0A0B',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Top CTA band */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,182,193,0.06) 0%, transparent 60%)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20 text-center">
          <h2
            className="font-serif text-white mb-4"
            style={{
              fontFamily: 'var(--font-serif), Instrument Serif, Georgia, serif',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              lineHeight: 1.15,
            }}
          >
            Your next meeting deserves{' '}
            <span style={{ color: '#FFB6C1', fontStyle: 'italic' }}>an entrance.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={'https://github.com/180020116002/Flight-meeting/releases/download/v1.0.2/Flyby-Setup-1.0.2.exe'}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-[1.04] hover:shadow-lg active:scale-[0.97]"
              style={{
                background: '#FFB6C1',
                color: '#0A0A0B',
                boxShadow: '0 4px 24px rgba(255,182,193,0.3)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download for Mac
            </a>
            <a
              href={'https://github.com/180020116002/Flight-meeting/releases/download/v1.0.2/Flyby-Setup-1.0.2.exe'}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]"
              style={{
                background: 'transparent',
                borderColor: 'rgba(255,182,193,0.35)',
                color: '#FFB6C1',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 12V6.75l6-1.32v6.57H3zm17-9v8.75h-7V5.57L20 3zM3 13h6v6.57l-6-1.32V13zm17 .25V22l-7-1.43V13h7z" />
              </svg>
              Download for Windows
            </a>
          </div>
        </div>
      </div>

      {/* Footer bottom bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          {/* Wordmark */}
          <div
            className="font-serif text-2xl tracking-tight"
            style={{
              fontFamily: 'var(--font-serif), Instrument Serif, Georgia, serif',
              color: '#FFB6C1',
            }}
          >
            Flyby
          </div>

          {/* Center */}
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.28)' }}>
            Made with&nbsp;🩷&nbsp;in Mumbai
          </p>

          {/* Social links */}
          <div className="flex items-center gap-1">
            <a
              href="#"
              className="footer-social-link p-2.5 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-pink"
              aria-label="Flyby on GitHub"
            >
              <GitHubIcon />
            </a>
            <a
              href="#"
              className="footer-social-link p-2.5 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-pink"
              aria-label="Flyby on X (Twitter)"
            >
              <XIcon />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="mt-6 pt-5 text-center text-xs"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.2)',
          }}
        >
          &copy; {currentYear} Flyby
        </div>
      </div>
    </footer>
  )
}
