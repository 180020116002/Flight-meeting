import dynamic from 'next/dynamic'
import Hero from './components/Hero'
import WhySection from './components/WhySection'
import HowItWorks from './components/HowItWorks'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

// Client-only components (Framer Motion / scroll APIs)
const InteractiveDemo = dynamic(
  () => import('./components/InteractiveDemo'),
  { ssr: false }
)
export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────── */}
      <Hero />

      {/* ── Why section ──────────────────────────── */}
      <WhySection />

      {/* ── Interactive demo ─────────────────────── */}
      <InteractiveDemo />

      {/* ── How it works ─────────────────────────── */}
      <HowItWorks />

      {/* ── FAQ ──────────────────────────────────── */}
      <FAQ />

      {/* ── Footer ───────────────────────────────── */}
      <Footer />
    </main>
  )
}
