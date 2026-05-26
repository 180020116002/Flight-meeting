import type { Metadata, Viewport } from 'next'
import { Instrument_Serif, Inter } from 'next/font/google'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Flyby — Never miss a meeting again',
  description:
    'Flyby flies a little airplane across your screen 5 minutes before every meeting. A delightfully simple meeting reminder for Mac and Windows.',
  keywords: ['meeting reminder', 'calendar', 'productivity', 'mac app', 'windows app', 'desktop app'],
  authors: [{ name: 'Flyby' }],
  openGraph: {
    title: 'Flyby — Never miss a meeting again',
    description:
      'A tiny airplane flies across your screen before every meeting. Free for Mac & Windows.',
    type: 'website',
    url: 'https://flyby.app',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Flyby — A little airplane that reminds you about meetings',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flyby — Never miss a meeting again',
    description:
      'A tiny airplane flies across your screen before every meeting. Free for Mac & Windows.',
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0B',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`dark ${instrumentSerif.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-editorial-dark text-white antialiased font-sans"
        style={{ backgroundColor: '#0A0A0B' }}
      >
        {children}
      </body>
    </html>
  )
}
