import React, { useState } from 'react'
import { MeetingAlert } from '../shared/types'

interface MeetingPillProps {
  meeting: MeetingAlert
  onDismiss: () => void
  animateIn?: boolean
}

export function MeetingPill({ meeting, onDismiss, animateIn = true }: MeetingPillProps) {
  const [dismissing, setDismissing] = useState(false)

  const handleDismiss = () => {
    setDismissing(true)
    window.electronAPI.overlay.dismiss()
    setTimeout(() => {
      onDismiss()
    }, 280)
  }

  const handleJoin = () => {
    if (meeting.meetLink) {
      window.open(meeting.meetLink, '_blank')
    }
  }

  const timeLabel =
    meeting.minutesUntilStart === 0
      ? 'Starting now'
      : meeting.minutesUntilStart === 1
      ? 'In 1 minute'
      : `In ${meeting.minutesUntilStart} minutes`

  const startTime = new Date(meeting.startTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div
      className={[
        'meeting-pill overlay-interactive',
        'flex items-center gap-3 px-5 py-3',
        'max-w-sm w-full select-none',
        animateIn && !dismissing ? 'animate-pill-float' : '',
        dismissing ? 'animate-pill-dismiss' : ''
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        background: 'rgba(255, 182, 193, 0.92)',
        backdropFilter: 'blur(20px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
        border: '1px solid rgba(255,255,255,0.6)',
        boxShadow: '0 8px 32px rgba(255,100,130,0.25), 0 2px 8px rgba(0,0,0,0.08)',
        borderRadius: 9999
      }}
    >
      {/* Airplane emoji accent */}
      <span style={{ fontSize: 22, flexShrink: 0 }}>✈️</span>

      {/* Text content */}
      <div className="flex flex-col min-w-0 flex-1">
        <span
          className="font-semibold text-sm leading-tight truncate"
          style={{ color: '#4a1e2e' }}
          title={meeting.title}
        >
          {meeting.title}
        </span>
        <span className="text-xs mt-0.5" style={{ color: '#7a3d54' }}>
          {timeLabel} · {startTime}
          {meeting.attendeeCount > 1 && (
            <span className="ml-1 opacity-75">· {meeting.attendeeCount} attendees</span>
          )}
        </span>
      </div>

      {/* Join button */}
      {meeting.meetLink && (
        <button
          onClick={handleJoin}
          className="overlay-interactive flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 active:scale-95"
          style={{
            background: 'rgba(255,255,255,0.85)',
            color: '#b5294e',
            border: '1px solid rgba(255,255,255,0.9)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            ;(e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,1)'
          }}
          onMouseLeave={(e) => {
            ;(e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.85)'
          }}
        >
          Join
        </button>
      )}

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="overlay-interactive flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-150 active:scale-90"
        style={{
          background: 'rgba(0,0,0,0.08)',
          color: '#7a3d54',
          border: 'none',
          cursor: 'pointer',
          fontSize: 14,
          lineHeight: 1
        }}
        onMouseEnter={(e) => {
          ;(e.target as HTMLButtonElement).style.background = 'rgba(0,0,0,0.15)'
        }}
        onMouseLeave={(e) => {
          ;(e.target as HTMLButtonElement).style.background = 'rgba(0,0,0,0.08)'
        }}
        aria-label="Dismiss"
        title="Dismiss"
      >
        ×
      </button>
    </div>
  )
}

export default MeetingPill
