import type { Metadata } from 'next'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'Terms of Use — Flyby',
  description: 'Terms of use for Flyby, the meeting reminder desktop app.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0A0A0B', color: '#fff' }}>
      <div className="max-w-2xl mx-auto px-6 py-20">
        {/* Back link */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm mb-12 transition-colors"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Flyby
        </a>

        <h1
          className="mb-2"
          style={{
            fontFamily: 'var(--font-serif), Instrument Serif, Georgia, serif',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            lineHeight: 1.1,
            color: '#FFB6C1',
          }}
        >
          Terms of Use
        </h1>
        <p className="text-sm mb-12" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Last updated: May 2025
        </p>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Acceptance</h2>
            <p>
              By downloading or using Flyby, you agree to these terms. If you do not agree, please
              uninstall the application.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">License</h2>
            <p>
              Flyby is provided free of charge. You are granted a non-exclusive, non-transferable
              license to install and use the application on your personal devices for personal,
              non-commercial purposes.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Use of Google Services</h2>
            <p>
              Flyby uses the Google Calendar API to read your calendar events. By connecting your
              Google account, you also agree to{' '}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#FFB6C1' }}
              >
                Google's Terms of Service
              </a>
              . Flyby's use of Google user data is limited to what is described in the{' '}
              <a href="/privacy" style={{ color: '#FFB6C1' }}>
                Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Disclaimer of Warranties</h2>
            <p>
              Flyby is provided "as is" without warranty of any kind. We do not guarantee that the
              app will be error-free, uninterrupted, or that meeting reminders will always fire on
              time. Do not rely solely on Flyby for time-critical meetings.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Flyby and its creators shall not be liable for
              any indirect, incidental, or consequential damages arising from your use of the app,
              including missed meetings.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of Flyby after changes
              constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Contact</h2>
            <p>
              Questions? Open an issue on{' '}
              <a
                href="https://github.com/180020116002/Flight-meeting"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#FFB6C1' }}
              >
                GitHub
              </a>
              .
            </p>
          </section>

        </div>
      </div>
      <Footer />
    </div>
  )
}
