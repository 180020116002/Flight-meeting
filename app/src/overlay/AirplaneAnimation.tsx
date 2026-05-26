import React, { useState, useEffect, useRef } from 'react'
import { MeetingAlert, Settings } from '../shared/types'
import { AirplaneSVG } from './AirplaneSVG'
import { MeetingPill } from './MeetingPill'

interface AirplaneAnimationProps {
  meeting: MeetingAlert
  settings?: Partial<Settings>
  onComplete: () => void
}

interface ContrailDot {
  id: number
  x: number
  y: number
  size: number
  animClass: string
}

const ANIMATION_DURATION: Record<Settings['animationSpeed'], number> = {
  slow: 8000,
  normal: 5500,
  fast: 3500
}

const PILL_APPEAR_DELAY_MS = 1800
const AUTO_DISMISS_AFTER_MS = 8000

export function AirplaneAnimation({ meeting, settings, onComplete }: AirplaneAnimationProps) {
  const [pillVisible, setPillVisible] = useState(false)
  const [airplaneVisible, setAirplaneVisible] = useState(true)
  const [contrailDots, setContrailDots] = useState<ContrailDot[]>([])
  const [dismissed, setDismissed] = useState(false)
  const pillTimerRef = useRef<NodeJS.Timeout | null>(null)
  const autoDismissRef = useRef<NodeJS.Timeout | null>(null)
  const completeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const dotTimerRef = useRef<NodeJS.Timeout | null>(null)

  const speed = settings?.animationSpeed ?? 'normal'
  const color = settings?.airplaneColor ?? '#FFB6C1'
  const animDuration = ANIMATION_DURATION[speed]
  const animClass =
    speed === 'slow'
      ? 'animate-airplane-fly-slow'
      : speed === 'fast'
      ? 'animate-airplane-fly-fast'
      : 'animate-airplane-fly'

  useEffect(() => {
    // Spawn contrail dots periodically during flight
    let dotId = 0
    const spawnDots = () => {
      const dotCount = 3
      const dots: ContrailDot[] = Array.from({ length: dotCount }, (_, i) => ({
        id: dotId++,
        x: Math.random() * 60 + 5,
        y: 45 + Math.random() * 16 - 8,
        size: Math.random() * 6 + 3,
        animClass: `animate-contrail-${(i % 3) + 1}`
      }))

      setContrailDots((prev) => [...prev.slice(-9), ...dots])
    }

    // Spawn dots every 500ms during the airplane phase
    let elapsed = 0
    dotTimerRef.current = setInterval(() => {
      elapsed += 400
      if (elapsed < animDuration - 500) {
        spawnDots()
      } else {
        clearInterval(dotTimerRef.current!)
      }
    }, 400)

    // Show pill after delay
    pillTimerRef.current = setTimeout(() => {
      setAirplaneVisible(false)
      setPillVisible(true)
    }, PILL_APPEAR_DELAY_MS)

    // Auto-dismiss pill
    autoDismissRef.current = setTimeout(() => {
      handlePillDismiss()
    }, PILL_APPEAR_DELAY_MS + AUTO_DISMISS_AFTER_MS)

    return () => {
      if (pillTimerRef.current) clearTimeout(pillTimerRef.current)
      if (autoDismissRef.current) clearTimeout(autoDismissRef.current)
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current)
      if (dotTimerRef.current) clearInterval(dotTimerRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePillDismiss = () => {
    if (dismissed) return
    setDismissed(true)
    if (autoDismissRef.current) clearTimeout(autoDismissRef.current)

    // Give dismiss animation time to play
    completeTimerRef.current = setTimeout(() => {
      onComplete()
    }, 350)
  }

  // Vertical position: lower third of screen
  const yPercent = 72

  return (
    <div className="overlay-root" style={{ pointerEvents: 'none' }}>
      {/* Contrail dots */}
      {airplaneVisible &&
        contrailDots.map((dot) => (
          <div
            key={dot.id}
            className={dot.animClass}
            style={{
              position: 'absolute',
              left: `${dot.x}vw`,
              top: `${yPercent + (dot.y - 50) * 0.4}%`,
              width: dot.size,
              height: dot.size,
              borderRadius: '50%',
              background: `${color}cc`,
              pointerEvents: 'none'
            }}
          />
        ))}

      {/* Airplane */}
      {airplaneVisible && (
        <div
          className={animClass}
          style={{
            position: 'absolute',
            top: `${yPercent}%`,
            left: 0,
            pointerEvents: 'none',
            willChange: 'transform, opacity'
          }}
        >
          <AirplaneSVG color={color} size={72} />
        </div>
      )}

      {/* Notification pill — centered horizontally, lower region */}
      {pillVisible && (
        <div
          style={{
            position: 'absolute',
            bottom: '18%',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'auto',
            zIndex: 10
          }}
        >
          <MeetingPill meeting={meeting} onDismiss={handlePillDismiss} animateIn />
        </div>
      )}
    </div>
  )
}

export default AirplaneAnimation
