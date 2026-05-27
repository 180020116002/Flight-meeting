'use client'

import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion'
import AirplaneSVG from './AirplaneSVG'

const EXE_URL = process.env.NEXT_PUBLIC_DOWNLOAD_WIN ?? 'https://github.com/180020116002/Flight-meeting/releases/download/v1.0.1/Flyby-Setup-1.0.1.exe'

const TRAIL_DOTS = [
  { size: 3,   op: 0.18 },
  { size: 3.5, op: 0.28 },
  { size: 4,   op: 0.40 },
  { size: 5,   op: 0.55 },
  { size: 6,   op: 0.70 },
]

export default function ScrollFlyby() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Tighter spring — plane feels responsive, not laggy
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 32,
    restDelta: 0.0005,
  })

  // Airplane travels off-screen left → off-screen right
  const planeX = useTransform(smooth, [0, 1], ['-12vw', '108vw'])

  // Gentle altitude arc
  const planeY = useTransform(
    smooth,
    [0, 0.3, 0.65, 1],
    ['50px', '-30px', '0px', '50px']
  )

  // Nose pitch
  const planeTilt = useTransform(
    smooth,
    [0, 0.25, 0.6, 1],
    ['-6deg', '-2deg', '0deg', '4deg']
  )

  // Pill: fades in 14%→24%, holds, fades out 76%→86%
  const pillOpacity = useTransform(smooth, [0.14, 0.24, 0.76, 0.86], [0, 1, 1, 0])
  const pillX       = useTransform(smooth, [0.14, 0.24], [20, 0])
  const trailOpacity = useTransform(smooth, [0.14, 0.26], [0, 1])

  // CTA fades in once plane "lands"
  const ctaOpacity = useTransform(smooth, [0.78, 0.96], [0, 1])
  const ctaY       = useTransform(smooth, [0.78, 0.96], [32, 0])

  // Sky glow follows the plane
  const skyGlow = useTransform(
    smooth,
    [0, 0.5, 1],
    [
      'radial-gradient(ellipse 60% 40% at 10% 50%, rgba(255,182,193,0.08) 0%, transparent 70%)',
      'radial-gradient(ellipse 60% 40% at 50% 45%, rgba(255,182,193,0.12) 0%, transparent 70%)',
      'radial-gradient(ellipse 60% 40% at 90% 50%, rgba(255,182,193,0.10) 0%, transparent 70%)',
    ]
  )

  // Progress dots — pre-computed OUTSIDE any loop (React hooks rule)
  const dot0 = useTransform(smooth, [0.08, 0.18], ['rgba(255,182,193,0.18)', 'rgba(255,182,193,0.95)'])
  const dot1 = useTransform(smooth, [0.33, 0.43], ['rgba(255,182,193,0.18)', 'rgba(255,182,193,0.95)'])
  const dot2 = useTransform(smooth, [0.58, 0.68], ['rgba(255,182,193,0.18)', 'rgba(255,182,193,0.95)'])
  const dot3 = useTransform(smooth, [0.80, 0.90], ['rgba(255,182,193,0.18)', 'rgba(255,182,193,0.95)'])
  const dotColors = [dot0, dot1, dot2, dot3]

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '260vh' }}
    >
      <div
        className="sticky top-0 w-full overflow-hidden flex flex-col items-center justify-center"
        style={{ height: '100vh', background: '#0A0A0B' }}
      >
        {/* Animated sky glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: skyGlow }}
        />

        {/* Subtle horizon line */}
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: '50%',
            height: 1,
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,182,193,0.08) 15%, rgba(255,182,193,0.08) 85%, transparent 100%)',
          }}
        />

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
            {/* Pill + dots anchored to tail */}
            <motion.div
              className="absolute top-1/2 right-full -translate-y-1/2 flex items-center"
              style={{
                paddingRight: 10,
                opacity: pillOpacity,
                x: pillX,
              }}
            >
              {/* Notification pill */}
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

              {/* Trail dots */}
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

            <AirplaneSVG color="#FFB6C1" size={200} />
          </div>
        </motion.div>

        {/* ── CTA: fades in as plane "lands" ── */}
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center flex flex-col items-center gap-6 px-6"
          style={{ opacity: ctaOpacity, y: ctaY }}
        >
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

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <a
              href={EXE_URL}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]"
              style={{
                background: '#FFB6C1',
                color: '#0A0A0B',
                boxShadow: '0 4px 24px rgba(255,182,193,0.35)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 12V6.75l6-1.32v6.57H3zm17-9v8.75h-7V5.57L20 3zM3 13h6v6.57l-6-1.32V13zm17 .25V22l-7-1.43V13h7z" />
              </svg>
              Download for Windows
            </a>

            <a
              href={EXE_URL}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold border transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]"
              style={{
                background: 'transparent',
                borderColor: 'rgba(255,182,193,0.4)',
                color: '#FFB6C1',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download for Mac
            </a>
          </div>

          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>
            Free · macOS 12+ · Windows 10+
          </p>
        </motion.div>

        {/* Scroll progress dots — use pre-computed MotionValues */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5">
          {dotColors.map((color, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                width: 4,
                height: 4,
                background: color,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
