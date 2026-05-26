'use client'

import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion'
import AirplaneSVG from './AirplaneSVG'

const MAC_URL = process.env.NEXT_PUBLIC_DOWNLOAD_MAC ?? '#'
const WIN_URL = process.env.NEXT_PUBLIC_DOWNLOAD_WIN ?? '#'

// Dot config: left = near pill (dim), right = near tail (bright)
const TRAIL_DOTS = [
  { size: 3,   op: 0.18 },
  { size: 3.5, op: 0.28 },
  { size: 4,   op: 0.40 },
  { size: 5,   op: 0.55 },
  { size: 6,   op: 0.70 },
]

export default function ScrollFlyby() {
  const sectionRef = useRef<HTMLDivElement>(null)

  // Track scroll progress through the sticky section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Spring-smooth the raw scroll value so the plane glides, not jerks
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 22,
    restDelta: 0.001,
  })

  // Airplane moves left → right across the screen (in vw units as a string)
  // We go -15vw → 110vw so it enters and exits fully off-screen
  const planeX = useTransform(smoothProgress, [0, 1], ['-15vw', '110vw'])

  // Slight sine-wave altitude: starts low, peaks mid, drops to land on CTA
  const planeY = useTransform(
    smoothProgress,
    [0, 0.3, 0.65, 1],
    ['60px', '-20px', '10px', '40px']
  )

  // Pitch tilt: nose slightly up on climb, level mid, nose slightly down on approach
  const planeTilt = useTransform(
    smoothProgress,
    [0, 0.25, 0.6, 1],
    ['-6deg', '-2deg', '0deg', '4deg']
  )

  // Pill fades in at 20% scroll, holds until 80%, fades out
  const pillOpacity = useTransform(smoothProgress, [0.15, 0.25, 0.75, 0.88], [0, 1, 1, 0])
  const pillX      = useTransform(smoothProgress, [0.15, 0.25], [24, 0])

  // Trail dot opacity pulses in with the pill
  const trailOpacity = useTransform(smoothProgress, [0.15, 0.28], [0, 1])

  // CTA section fades up as the plane "lands" (progress > 80%)
  const ctaOpacity = useTransform(smoothProgress, [0.78, 0.96], [0, 1])
  const ctaY       = useTransform(smoothProgress, [0.78, 0.96], [32, 0])

  // Sky background shifts colour as plane "flies"
  const skyGlow = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [
      'radial-gradient(ellipse 60% 40% at 10% 50%, rgba(255,182,193,0.08) 0%, transparent 70%)',
      'radial-gradient(ellipse 60% 40% at 50% 45%, rgba(255,182,193,0.12) 0%, transparent 70%)',
      'radial-gradient(ellipse 60% 40% at 90% 50%, rgba(255,182,193,0.10) 0%, transparent 70%)',
    ]
  )

  return (
    /*
     * The outer div is tall (300vh) so there's plenty of scroll distance.
     * The inner sticky container stays fixed in the viewport while you scroll.
     */
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '300vh' }}
    >
      <div
        className="sticky top-0 w-full overflow-hidden flex flex-col items-center justify-center"
        style={{ height: '100vh', background: '#0A0A0B' }}
      >
        {/* Animated sky glow follows the plane */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: skyGlow }}
        />

        {/* Dashed horizon runway */}
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: '50%',
            height: 1,
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,182,193,0.10) 15%, rgba(255,182,193,0.10) 85%, transparent 100%)',
          }}
        />

        {/* ── Section label (top) ── */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <span
            className="text-xs tracking-[0.22em] uppercase font-medium"
            style={{ color: 'rgba(255,182,193,0.5)' }}
          >
            scroll to fly
          </span>
        </div>

        {/* ── Flying group ── */}
        <motion.div
          className="absolute"
          style={{
            x: planeX,
            y: planeY,
            rotate: planeTilt,
            top: '42%',
            left: 0,
            translateY: '-50%',
          }}
        >
          <div className="relative inline-block">
            {/* Pill + dots anchored to tail (right-full = left of airplane container) */}
            <motion.div
              className="absolute top-1/2 right-full -translate-y-1/2 flex items-center"
              style={{
                paddingRight: 10,
                opacity: pillOpacity,
                x: pillX,
              }}
            >
              {/* Pink pill */}
              <div
                className="flex items-center gap-2 rounded-full whitespace-nowrap mr-3"
                style={{
                  padding: '9px 20px 9px 14px',
                  background: 'rgba(255, 182, 193, 0.97)',
                  color: '#1a0a0f',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  letterSpacing: '-0.01em',
                  boxShadow:
                    '0 4px 28px rgba(255,182,193,0.45), 0 2px 10px rgba(0,0,0,0.30)',
                }}
              >
                <span style={{ fontSize: '1.05rem' }}>✈️</span>
                <span>Meeting with Drew in 5 min</span>
              </div>

              {/* Dot connectors: dim → bright toward tail */}
              <motion.div
                className="flex items-center gap-[5px]"
                style={{ opacity: trailOpacity }}
              >
                {TRAIL_DOTS.map((dot, i) => (
                  <div
                    key={i}
                    className="rounded-full flex-shrink-0"
                    style={{
                      width: dot.size,
                      height: dot.size,
                      background: '#FFB6C1',
                      opacity: dot.op,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* Airplane */}
            <AirplaneSVG color="#FFB6C1" size={200} />
          </div>
        </motion.div>

        {/* ── CTA: fades in as plane "lands" at the end ── */}
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center flex flex-col items-center gap-6 px-6"
          style={{ opacity: ctaOpacity, y: ctaY }}
        >
          {/* Tag line */}
          <div
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium"
            style={{
              background: 'rgba(255,182,193,0.07)',
              borderColor: 'rgba(255,182,193,0.25)',
              color: '#FFB6C1',
            }}
          >
            <span>✈️</span>
            <span>Never miss a meeting again</span>
          </div>

          <p
            className="text-base max-w-sm leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Download Flyby — free, no account needed, works in 30 seconds.
          </p>

          {/* Download buttons */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <a
              href={MAC_URL}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]"
              style={{
                background: '#FFB6C1',
                color: '#0A0A0B',
                boxShadow: '0 4px 24px rgba(255,182,193,0.35)',
              }}
            >
              {/* Apple logo */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download for Mac
            </a>

            <a
              href={WIN_URL}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold border transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]"
              style={{
                background: 'transparent',
                borderColor: 'rgba(255,182,193,0.4)',
                color: '#FFB6C1',
              }}
            >
              {/* Windows logo */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 12V6.75l6-1.32v6.57H3zm17-9v8.75h-7V5.57L20 3zM3 13h6v6.57l-6-1.32V13zm17 .25V22l-7-1.43V13h7z" />
              </svg>
              Download for Windows
            </a>
          </div>

          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>
            Free · macOS 12+ · Windows 10+
          </p>
        </motion.div>

        {/* Scroll progress indicator */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5">
          {[0.15, 0.4, 0.65, 0.88].map((threshold, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                width: 4,
                height: 4,
                background: useTransform(
                  smoothProgress,
                  [threshold - 0.05, threshold + 0.05],
                  ['rgba(255,182,193,0.2)', 'rgba(255,182,193,0.9)']
                ),
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
