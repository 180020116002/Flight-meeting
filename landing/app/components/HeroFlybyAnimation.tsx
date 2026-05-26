'use client'

import { motion } from 'framer-motion'
import AirplaneSVG from './AirplaneSVG'

const FLIGHT_DURATION = 7   // seconds for one full crossing
const REPEAT_DELAY   = 2.5  // pause before looping

// Dot sizes + opacities: left (near pill) → right (near tail)
const TRAIL_DOTS = [
  { size: 3,   opacity: 0.20 },
  { size: 3.5, opacity: 0.28 },
  { size: 4,   opacity: 0.38 },
  { size: 4.5, opacity: 0.48 },
  { size: 5,   opacity: 0.60 },
]

// Pill fades in once the plane is on-screen, fades out just before it exits
const PILL_TIMES = [0, 0.10, 0.22, 0.80, 1.0] as const

export default function HeroFlybyAnimation() {
  return (
    <div
      className="relative w-full h-full min-h-[320px] overflow-hidden"
      aria-hidden="true"
    >
      {/* Ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 60% 50%, rgba(255,182,193,0.10) 0%, transparent 70%)',
        }}
      />

      {/* Dashed flight-path horizon line */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: '46%',
          height: 1,
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,182,193,0.14) 15%, rgba(255,182,193,0.14) 85%, transparent 100%)',
        }}
      />

      {/* ── Flying group: pill + dots + airplane ── */}
      <motion.div
        className="absolute"
        style={{ top: '42%', left: 0, translateY: '-50%' }}
        animate={{ x: ['-110%', '200vw'] }}
        transition={{
          duration: FLIGHT_DURATION,
          ease: [0.12, 0, 0.48, 1],
          repeat: Infinity,
          repeatDelay: REPEAT_DELAY,
          repeatType: 'loop',
        }}
      >
        {/* The airplane sits in normal flow; pill+dots hang off its left (tail) side */}
        <div className="relative inline-block">

          {/* Trailing banner: positioned to the LEFT of the airplane container */}
          <motion.div
            className="absolute top-1/2 right-full -translate-y-1/2 flex items-center"
            style={{ paddingRight: 10 }}
            animate={{ opacity: [0, 0, 1, 1, 0] }}
            transition={{
              duration: FLIGHT_DURATION,
              times: PILL_TIMES,
              repeat: Infinity,
              repeatDelay: REPEAT_DELAY,
              repeatType: 'loop',
            }}
          >
            {/* Pink notification pill */}
            <div
              className="flex items-center gap-2 rounded-full whitespace-nowrap mr-3"
              style={{
                padding: '8px 18px 8px 14px',
                background: 'rgba(255, 182, 193, 0.96)',
                color: '#1a0a0f',
                fontWeight: 600,
                fontSize: '0.875rem',
                letterSpacing: '-0.01em',
                boxShadow:
                  '0 4px 24px rgba(255,182,193,0.40), 0 2px 8px rgba(0,0,0,0.25)',
              }}
            >
              <span style={{ fontSize: '1rem' }}>✈️</span>
              <span>Meeting with Drew in 5 min</span>
            </div>

            {/* Dots connecting pill to airplane tail — dimmer on left, brighter toward tail */}
            <div className="flex items-center gap-[5px]">
              {TRAIL_DOTS.map((dot, i) => (
                <div
                  key={i}
                  className="rounded-full flex-shrink-0"
                  style={{
                    width:  dot.size,
                    height: dot.size,
                    background: '#FFB6C1',
                    opacity: dot.opacity,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Airplane */}
          <AirplaneSVG color="#FFB6C1" size={180} />
        </div>
      </motion.div>

      {/* Decorative orbit rings (static) */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%',
          left: '58%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 300,
            height: 300,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            border: '1px dashed rgba(255,182,193,0.09)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 430,
            height: 430,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            border: '1px dashed rgba(255,182,193,0.05)',
          }}
        />
      </div>
    </div>
  )
}
