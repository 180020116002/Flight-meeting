'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import AirplaneSVG from './AirplaneSVG'

const COLOR_CHIPS = [
  { label: 'Pink',     value: '#FFB6C1' },
  { label: 'Blue',     value: '#B6D4FF' },
  { label: 'Mint',     value: '#B6FFD9' },
  { label: 'Peach',    value: '#FFD4B6' },
  { label: 'Lavender', value: '#D4B6FF' },
]

type AnimState = 'idle' | 'playing' | 'done'

const FLIGHT_DURATION = 4500   // ms
const PILL_DELAY      = 900    // ms — pill appears mid-flight
const REPLAY_DELAY    = 1800   // ms — auto-replay pause after done

export default function InteractiveDemo() {
  const [animState, setAnimState]     = useState<AnimState>('idle')
  const [selectedColor, setSelectedColor] = useState('#FFB6C1')
  const [showPill, setShowPill]       = useState(false)

  const pillTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const doneTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const replayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Watch the section coming into view — trigger autoplay
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { amount: 0.5, once: false })

  function clearAllTimers() {
    if (pillTimerRef.current)   clearTimeout(pillTimerRef.current)
    if (doneTimerRef.current)   clearTimeout(doneTimerRef.current)
    if (replayTimerRef.current) clearTimeout(replayTimerRef.current)
  }

  function runFlight() {
    setAnimState('playing')
    setShowPill(false)

    pillTimerRef.current = setTimeout(() => setShowPill(true), PILL_DELAY)

    doneTimerRef.current = setTimeout(() => {
      setAnimState('done')
      setShowPill(false)

      // Auto-replay after a pause
      replayTimerRef.current = setTimeout(() => {
        setAnimState('idle')
        // Small gap then kick off next flight
        replayTimerRef.current = setTimeout(() => runFlight(), 200)
      }, REPLAY_DELAY)
    }, FLIGHT_DURATION)
  }

  function handleTrigger() {
    if (animState === 'playing') return
    clearAllTimers()
    setAnimState('idle')
    setTimeout(() => runFlight(), 50)
  }

  function handleReplay() {
    clearAllTimers()
    setAnimState('idle')
    setTimeout(() => runFlight(), 50)
  }

  // Autoplay when scrolled into view
  useEffect(() => {
    if (isInView && animState === 'idle') {
      const t = setTimeout(() => runFlight(), 400)
      return () => clearTimeout(t)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView])

  // Cleanup on unmount
  useEffect(() => () => clearAllTimers(), [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full section-pad overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #0A0A0B 0%, #0f0f12 40%, #0A0A0B 100%)',
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,182,193,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="text-center mb-14">
          <span
            className="text-xs tracking-[0.2em] uppercase font-medium block mb-4"
            style={{ color: '#FFB6C1' }}
          >
            See it in action
          </span>
          <h2
            className="font-serif leading-tight text-white"
            style={{
              fontFamily: 'var(--font-serif), Instrument Serif, Georgia, serif',
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
            }}
          >
            It really does just fly across.
          </h2>
        </div>

        {/* Desktop Window Frame */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow:
              '0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(255,182,193,0.05)',
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-2 px-5 py-3.5"
            style={{
              background: 'rgba(20,20,24,0.95)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: '#FF5F57' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#FEBC2E' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#28C840' }} />
            </div>
            <div
              className="flex-1 text-center text-xs rounded-md py-1 px-4 max-w-[240px] mx-auto"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.3)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              your-meeting-notes.notion.so
            </div>
          </div>

          {/* Demo canvas */}
          <div
            className="relative overflow-hidden"
            style={{
              height: 280,
              background:
                'linear-gradient(135deg, #141418 0%, #0f0f14 50%, #131318 100%)',
            }}
          >
            {/* Mock document content */}
            <div className="absolute inset-0 flex flex-col gap-3 p-8 pt-10 pointer-events-none opacity-25">
              <div className="h-4 rounded-sm w-2/3" style={{ background: 'rgba(255,255,255,0.15)' }} />
              <div className="h-3 rounded-sm w-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="h-3 rounded-sm w-5/6" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="h-3 rounded-sm w-4/5" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="h-3 rounded-sm w-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="h-3 rounded-sm w-3/4" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="mt-2 h-3 rounded-sm w-2/3" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="h-3 rounded-sm w-4/5" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>

            {/* Airplane animation */}
            <AnimatePresence>
              {animState === 'playing' && (
                <motion.div
                  key="airplane"
                  className="absolute"
                  style={{ top: '38%', translateY: '-50%', left: 0 }}
                  initial={{ x: '-130px' }}
                  animate={{ x: '110vw' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: FLIGHT_DURATION / 1000, ease: [0.12, 0, 0.48, 1] }}
                >
                  <div className="relative inline-block">
                    {/* Trailing pill + dots */}
                    <motion.div
                      className="absolute top-1/2 right-full -translate-y-1/2 flex items-center"
                      style={{ paddingRight: 8 }}
                      animate={{ opacity: showPill ? 1 : 0, x: showPill ? 0 : 18 }}
                      transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                      <div
                        className="flex items-center gap-2 rounded-full whitespace-nowrap mr-2"
                        style={{
                          padding: '7px 16px 7px 12px',
                          background: 'rgba(255, 182, 193, 0.97)',
                          color: '#1a0a0f',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          boxShadow:
                            '0 4px 20px rgba(255,182,193,0.45), 0 2px 8px rgba(0,0,0,0.3)',
                        }}
                      >
                        <span>✈️</span>
                        <span>Meeting with Drew in 5 min</span>
                      </div>

                      <div className="flex items-center gap-[4px]">
                        {[
                          { size: 3,   op: 0.20 },
                          { size: 3.5, op: 0.28 },
                          { size: 4,   op: 0.38 },
                          { size: 4.5, op: 0.50 },
                          { size: 5,   op: 0.62 },
                        ].map((dot, i) => (
                          <div
                            key={i}
                            className="rounded-full flex-shrink-0"
                            style={{
                              width: dot.size,
                              height: dot.size,
                              background: selectedColor,
                              opacity: dot.op,
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>

                    <AirplaneSVG color={selectedColor} size={110} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Idle state */}
            {animState === 'idle' && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                <AirplaneSVG color={selectedColor} size={90} />
              </div>
            )}

            {/* Done state */}
            {animState === 'done' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div
                    className="text-4xl mb-2"
                    style={{ filter: 'drop-shadow(0 0 12px rgba(255,182,193,0.4))' }}
                  >
                    ✈️
                  </div>
                  <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Did you see it?
                  </p>
                </motion.div>
              </div>
            )}
          </div>
        </div>

        {/* Controls row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Color chips */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-xs font-medium mr-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Airplane color
            </span>
            {COLOR_CHIPS.map((chip) => (
              <button
                key={chip.value}
                onClick={() => setSelectedColor(chip.value)}
                title={chip.label}
                aria-label={`Set airplane color to ${chip.label}`}
                className="relative w-8 h-8 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                style={{
                  background: chip.value,
                  transform: selectedColor === chip.value ? 'scale(1.25)' : 'scale(1)',
                  boxShadow:
                    selectedColor === chip.value
                      ? `0 0 0 2px #0A0A0B, 0 0 0 4px ${chip.value}, 0 4px 12px ${chip.value}55`
                      : `0 2px 8px ${chip.value}44`,
                }}
              />
            ))}
          </div>

          {/* Trigger / Replay button */}
          <div>
            {animState !== 'done' ? (
              <button
                onClick={handleTrigger}
                disabled={animState === 'playing'}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-pink disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: animState === 'playing' ? 'rgba(255,182,193,0.4)' : '#FFB6C1',
                  color: '#0A0A0B',
                  boxShadow: animState === 'playing' ? 'none' : '0 4px 20px rgba(255,182,193,0.35)',
                  transform: animState === 'playing' ? 'scale(0.97)' : 'scale(1)',
                }}
              >
                {animState === 'playing' ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block"
                    >
                      ✈️
                    </motion.span>
                    Flying…
                  </>
                ) : (
                  <>
                    Trigger the airplane
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            ) : (
              <motion.button
                onClick={handleReplay}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border transition-all duration-200 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-pink"
                style={{
                  background: 'transparent',
                  borderColor: 'rgba(255,182,193,0.4)',
                  color: '#FFB6C1',
                }}
              >
                <span aria-hidden="true">↺</span>
                Replay
              </motion.button>
            )}
          </div>
        </div>

        <p className="text-center text-xs mt-5" style={{ color: 'rgba(255,255,255,0.22)' }}>
          Actual app behavior — this is exactly what happens on your screen.
        </p>
      </div>
    </section>
  )
}
