import React, { useState, useEffect, useRef } from 'react'
import { MeetingAlert, Settings } from '../shared/types'
import { AirplaneSVG } from './AirplaneSVG'

interface AirplaneAnimationProps {
  meeting: MeetingAlert
  settings?: Partial<Settings>
  onComplete: () => void
}

// Slower durations (ms) — all speeds feel deliberate, not rushed
const ANIMATION_DURATION: Record<Settings['animationSpeed'], number> = {
  slow: 12000,
  normal: 9000,
  fast: 6500,
}

const TRAIL_DOTS = [
  { size: 4,   op: 0.20 },
  { size: 5,   op: 0.32 },
  { size: 6,   op: 0.46 },
  { size: 7,   op: 0.60 },
  { size: 8,   op: 0.74 },
]

export function AirplaneAnimation({ meeting, settings, onComplete }: AirplaneAnimationProps) {
  const [pillVisible, setPillVisible] = useState(false)
  const [planeGone, setPlaneGone] = useState(false)

  const pillTimerRef = useRef<NodeJS.Timeout | null>(null)
  const planeGoneRef = useRef<NodeJS.Timeout | null>(null)
  const completeRef  = useRef<NodeJS.Timeout | null>(null)

  const speed       = settings?.animationSpeed ?? 'normal'
  const color       = settings?.airplaneColor ?? '#FFB6C1'
  const animDuration = ANIMATION_DURATION[speed]

  useEffect(() => {
    // Pill visible immediately as plane enters
    pillTimerRef.current = setTimeout(() => setPillVisible(true), 300)

    // Plane exits — hide everything and complete
    planeGoneRef.current = setTimeout(() => setPlaneGone(true), animDuration)
    completeRef.current  = setTimeout(() => onComplete(), animDuration + 400)

    return () => {
      if (pillTimerRef.current)  clearTimeout(pillTimerRef.current)
      if (planeGoneRef.current)  clearTimeout(planeGoneRef.current)
      if (completeRef.current)   clearTimeout(completeRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const animClass =
    speed === 'slow'  ? 'animate-airplane-fly-slow'  :
    speed === 'fast'  ? 'animate-airplane-fly-fast'  :
                        'animate-airplane-fly'

  // Vertical position — upper-lower band of screen
  const yPercent = 72

  const pillStyle: React.CSSProperties = {
    display:        'flex',
    alignItems:     'center',
    gap:            7,
    padding:        '10px 22px 10px 16px',
    background:     `rgba(255, 182, 193, 0.97)`,
    borderRadius:   9999,
    whiteSpace:     'nowrap',
    fontWeight:     700,
    fontSize:       '0.92rem',
    color:          '#1a0a0f',
    letterSpacing:  '-0.01em',
    boxShadow:      '0 6px 32px rgba(255,182,193,0.5), 0 2px 12px rgba(0,0,0,0.28)',
    opacity:        pillVisible ? 1 : 0,
    transform:      pillVisible ? 'translateX(0)' : 'translateX(20px)',
    transition:     pillVisible
                      ? 'opacity 0.45s cubic-bezier(0.34,1.56,0.64,1), transform 0.45s cubic-bezier(0.34,1.56,0.64,1)'
                      : 'none',
  }

  return (
    <div className="overlay-root" style={{ pointerEvents: 'none' }}>

      {/* ── Flying group: pill + dots + plane all move together ── */}
      {!planeGone && (
        <div
          className={animClass}
          style={{
            position:      'absolute',
            top:           `${yPercent}%`,
            left:          0,
            display:       'flex',
            alignItems:    'center',
            pointerEvents: 'none',
            willChange:    'transform, opacity',
          }}
        >
          {/* Notification pill (left = trailing behind tail) */}
          <div style={pillStyle}>
            <span style={{ fontSize: '1rem' }}>✈️</span>
            <span>{meeting.title} in {meeting.minutesUntilStart} min</span>
          </div>

          {/* Trail dots between pill and plane */}
          <div
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        6,
              marginLeft: 6,
              opacity:    pillVisible ? 1 : 0,
              transition: pillVisible ? 'opacity 0.4s ease 0.15s' : 'none',
            }}
          >
            {TRAIL_DOTS.map((dot, i) => (
              <div
                key={i}
                style={{
                  width:        dot.size,
                  height:       dot.size,
                  borderRadius: '50%',
                  background:   color,
                  opacity:      dot.op,
                  flexShrink:   0,
                }}
              />
            ))}
          </div>

          {/* Airplane */}
          <AirplaneSVG color={color} size={72} />
        </div>
      )}

    </div>
  )
}

export default AirplaneAnimation
