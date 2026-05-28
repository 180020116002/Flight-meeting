import type { Metadata } from 'next'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy — Flyby',
  description: 'Privacy policy for Flyby, the meeting reminder desktop app.',
}

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-sm mb-12" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Last updated: May 2025
        </p>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Overview</h2>
            <p>
              Flyby is a desktop application that flies a small airplane across your screen before
              upcoming meetings. This policy explains what data Flyby accesses, how it is used, and
              how it is stored.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Data We Access</h2>
            <p className="mb-3">
              When you connect your Google account, Flyby requests read-only access to:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Your Google Calendar events (titles, start times, attendees)</li>
              <li>Your Google profile name and email address (to display in the app)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">How Your Data Is Used</h2>
            <p>
              Calendar data is used solely to show meeting reminders on your desktop. Your data is
              queried directly from Google's Calendar API and is never sent to any Flyby server,
              third-party service, or analytics platform.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Local Storage</h2>
            <p>
              OAuth tokens are stored locally on your device using Electron's encrypted storage
              (via the operating system's native keychain where available). No calendar data is
              persisted to disk — it is only held in memory while the app is running.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Data Sharing</h2>
            <p>
              Flyby does not share, sell, or transmit any of your personal data or calendar
              information to any third party.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Revoking Access</h2>
            <p>
              You can disconnect your Google account at any time from the Flyby settings window.
              This deletes all stored tokens from your device. You can also revoke access directly
              from your{' '}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#FFB6C1' }}
              >
                Google Account permissions
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Analytics & Crash Reporting</h2>
            <p>
              Flyby does not include any analytics SDK, crash reporter, or telemetry. The app makes
              no network requests except to Google's Calendar and OAuth APIs on your behalf.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Contact</h2>
            <p>
              If you have questions about this policy, please open an issue on{' '}
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
