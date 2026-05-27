'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AirplaneSVG from './AirplaneSVG'

const TRAIL_DOTS = [
  { size: 3,   op: 0.20 },
  { size: 3.5, op: 0.30 },
  { size: 4.5, op: 0.45 },
  { size: 5.5, op: 0.62 },
  { size: 6.5, op: 0.78 },
]

// Simulates the real Flyby notification flying across the top of the screen
export default function PageLoadFlyby() {
  const [visible, setVisible] = useState(false)
  const [showPill, setShowPill] = useState(false)

  useEffect(() => {
    // Short pause after page load, then launch
    const launch = setTimeout(() => setVisible(true), 800)
    // Pill appears once the plane is mid-screen
    const pill   = setTimeout(() => setShowPill(true), 1600)
    // Hide after flight completes
    const done   = setTimeout(() => {
      setShowPill(false)
      setVisible(false)
    }, 5200)

    return () => {
      clearTimeout(launch)
      clearTimeout(pill)
      clearTimeout(done)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-flyby"
          className="fixed z-[9999] pointer-events-none"
          style={{ top: 28, left: 0, right: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Airplane travels from left edge to right edge */}
          <motion.div
            className="absolute"
            initial={{ x: '-140px' }}
            animate={{ x: '110vw' }}
            transition={{
              duration: 4.2,
              ease: [0.12, 0, 0.48, 1],
              delay: 0,
            }}
          >
            <div className="relative inline-block">
              {/* Pill + dots anchored to the tail (right-full = left of airplane div) */}
              <motion.div
                className="absolute top-1/2 right-full -translate-y-1/2 flex items-center"
                style={{ paddingRight: 8 }}
                animate={{ opacity: showPill ? 1 : 0, x: showPill ? 0 : 16 }}
                transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              >
                {/* Notification pill */}
                <div
                  className="flex items-center gap-2 rounded-full whitespace-nowrap mr-2"
                  style={{
                    padding: '7px 18px 7px 12px',
                    background: 'rgba(255,182,193,0.97)',
                    color: '#1a0a0f',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    letterSpacing: '-0.01em',
                    boxShadow:
                      '0 4px 24px rgba(255,182,193,0.5), 0 2px 10px rgba(0,0,0,0.35)',
                  }}
                >
                  <span style={{ fontSize: '0.9rem' }}>✈️</span>
                  <span>Meeting with Drew in 5 min</span>
                </div>

                {/* Trail dots */}
                <div className="flex items-center gap-[4px]">
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
                </div>
              </motion.div>

              <AirplaneSVG color="#FFB6C1" size={90} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
