import React from 'react'

interface AirplaneSVGProps {
  color?: string
  size?: number
  className?: string
}

export function AirplaneSVG({
  color = '#FFB6C1',
  size = 64,
  className = ''
}: AirplaneSVGProps) {
  // Derive slightly darker shades for depth
  const darken = (hex: string, amount: number): string => {
    const num = parseInt(hex.replace('#', ''), 16)
    const r = Math.max(0, (num >> 16) - amount)
    const g = Math.max(0, ((num >> 8) & 0xff) - amount)
    const b = Math.max(0, (num & 0xff) - amount)
    return `rgb(${r},${g},${b})`
  }

  const bodyColor = color
  const wingColor = darken(color, 20)
  const detailColor = darken(color, 40)
  const windowColor = 'rgba(255,255,255,0.85)'
  const engineColor = darken(color, 30)

  return (
    <svg
      width={size}
      height={size * 0.55}
      viewBox="0 0 120 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main fuselage body */}
      <ellipse cx="60" cy="33" rx="48" ry="12" fill={bodyColor} />

      {/* Nose cone */}
      <path
        d="M108 33 C115 31 118 33 115 33 C118 33 115 35 108 33Z"
        fill={detailColor}
      />

      {/* Tail section */}
      <path
        d="M12 33 L4 28 L4 38 Z"
        fill={wingColor}
      />

      {/* Main wing (upper) */}
      <path
        d="M55 28 L72 10 L82 12 L68 28Z"
        fill={wingColor}
      />

      {/* Main wing (lower, symmetric) */}
      <path
        d="M55 38 L72 56 L82 54 L68 38Z"
        fill={wingColor}
      />

      {/* Horizontal stabilizer */}
      <path
        d="M18 30 L28 22 L32 24 L24 30Z"
        fill={wingColor}
      />
      <path
        d="M18 36 L28 44 L32 42 L24 36Z"
        fill={wingColor}
      />

      {/* Vertical stabilizer */}
      <path
        d="M14 33 L14 21 L22 26 L22 33Z"
        fill={detailColor}
      />

      {/* Engine pod */}
      <ellipse cx="62" cy="42" rx="10" ry="5" fill={engineColor} />
      <ellipse cx="62" cy="42" rx="7" ry="3.5" fill={darken(color, 50)} />

      {/* Windows */}
      <circle cx="80" cy="30" r="3.5" fill={windowColor} />
      <circle cx="70" cy="30" r="3.5" fill={windowColor} />
      <circle cx="60" cy="30" r="3.5" fill={windowColor} />
      <circle cx="90" cy="30" r="3.5" fill={windowColor} />

      {/* Door line accent */}
      <rect x="86" y="26" width="1.5" height="14" rx="0.75" fill={detailColor} opacity="0.5" />

      {/* Cockpit window */}
      <path
        d="M100 27 C106 27 109 30 109 33 C109 30 106 37 100 37 L95 37 L95 27Z"
        fill={windowColor}
        opacity="0.7"
      />
    </svg>
  )
}

export default AirplaneSVG
