import React, { useState, useEffect, useCallback } from 'react'
import { MeetingAlert, Settings } from '../shared/types'
import { AirplaneAnimation } from './AirplaneAnimation'

interface QueuedMeeting {
  meeting: MeetingAlert
  key: string
}

export function OverlayApp() {
  const [current, setCurrent] = useState<QueuedMeeting | null>(null)
  const [queue, setQueue] = useState<MeetingAlert[]>([])
  const [settings, setSettings] = useState<Partial<Settings>>({
    airplaneColor: '#FFB6C1',
    animationSpeed: 'normal'
  })

  // Load settings on mount
  useEffect(() => {
    window.electronAPI.settings.get().then((s) => {
      setSettings(s)
    }).catch(console.error)
  }, [])

  // Listen for settings changes
  useEffect(() => {
    const cleanup = window.electronAPI.onSettingsChanged((s) => {
      setSettings(s)
    })
    return cleanup
  }, [])

  // Listen for meeting alerts
  useEffect(() => {
    const cleanup = window.electronAPI.onMeetingAlert((payload: MeetingAlert) => {
      setQueue((prev) => {
        // Deduplicate by id
        if (prev.some((m) => m.id === payload.id)) return prev
        return [...prev, payload]
      })
    })
    return cleanup
  }, [])

  // Listen for test animations
  useEffect(() => {
    const cleanup = window.electronAPI.testAnimation((payload: MeetingAlert) => {
      setQueue((prev) => [...prev, { ...payload, id: `test-${Date.now()}` }])
    })
    return cleanup
  }, [])

  // Process queue
  useEffect(() => {
    if (current === null && queue.length > 0) {
      const [next, ...rest] = queue
      setQueue(rest)
      setCurrent({ meeting: next, key: `${next.id}-${Date.now()}` })

      // While animation is showing, make overlay interactive for the pill
      window.electronAPI.overlay.setIgnoreMouse(false)
    }
  }, [current, queue])

  const handleAnimationComplete = useCallback(() => {
    setCurrent(null)
    // Re-enable click-through when nothing is showing
    window.electronAPI.overlay.setIgnoreMouse(true)
  }, [])

  if (!current) {
    // Nothing to show — completely transparent and click-through
    return null
  }

  return (
    <AirplaneAnimation
      key={current.key}
      meeting={current.meeting}
      settings={settings}
      onComplete={handleAnimationComplete}
    />
  )
}

export default OverlayApp
