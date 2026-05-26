'use client'

interface AirplaneSVGProps {
  color?: string
  size?: number
  className?: string
}

export default function AirplaneSVG({
  color = '#FFB6C1',
  size = 80,
  className = '',
}: AirplaneSVGProps) {
  // Derive slightly darker/lighter shades from the main color for depth
  const bodyColor = color
  const wingColor = color
  const darkDetail = '#1a1a1f'
  const windowColor = 'rgba(180, 230, 255, 0.85)'
  const shadowColor = 'rgba(0,0,0,0.18)'

  return (
    <svg
      width={size}
      height={size * 0.48}
      viewBox="0 0 160 77"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Flyby airplane"
      role="img"
    >
      {/* Drop shadow filter */}
      <defs>
        <filter id="plane-shadow" x="-10%" y="-20%" width="120%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor={shadowColor} />
        </filter>
        <linearGradient id="fuselage-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={bodyColor} stopOpacity="0.85" />
          <stop offset="60%" stopColor={bodyColor} />
          <stop offset="100%" stopColor={bodyColor} stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="wing-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={wingColor} />
          <stop offset="100%" stopColor={wingColor} stopOpacity="0.7" />
        </linearGradient>
      </defs>

      <g filter="url(#plane-shadow)">
        {/* ── Tail fin (vertical stabilizer) ── */}
        <path
          d="M18 38 L26 18 L36 32 Z"
          fill={wingColor}
          opacity="0.9"
        />

        {/* ── Horizontal stabilizer (rear small wing) ── */}
        <path
          d="M14 44 L38 42 L36 49 L16 50 Z"
          fill={wingColor}
          opacity="0.85"
        />

        {/* ── Main fuselage body ── */}
        <path
          d="M22 36 C22 36 90 26 130 30 C142 31 152 35 155 40 C152 45 142 49 130 50 C90 54 22 44 22 44 Z"
          fill="url(#fuselage-grad)"
        />

        {/* ── Nose cone ── */}
        <path
          d="M130 30 C142 31 152 35 155 40 C152 45 142 49 130 50 C136 44 138 40 136 36 Z"
          fill={bodyColor}
          opacity="0.95"
        />

        {/* ── Main wing (lower) ── */}
        <path
          d="M55 44 L60 44 L75 66 L45 64 Z"
          fill="url(#wing-grad)"
        />

        {/* ── Main wing (upper) ── */}
        <path
          d="M60 36 L65 36 L52 14 L38 16 Z"
          fill="url(#wing-grad)"
        />

        {/* ── Engine nacelle ── */}
        <ellipse cx="62" cy="55" rx="7" ry="4.5" fill={darkDetail} opacity="0.7" />
        <ellipse cx="65" cy="55" rx="5" ry="3.5" fill={bodyColor} opacity="0.6" />

        {/* ── Cockpit windows ── */}
        <ellipse cx="136" cy="38" rx="6.5" ry="4.5" fill={windowColor} />
        <ellipse cx="125" cy="37.5" rx="5" ry="3.5" fill={windowColor} opacity="0.8" />

        {/* ── Window row along fuselage ── */}
        <ellipse cx="110" cy="37" rx="3" ry="2.5" fill={windowColor} opacity="0.55" />
        <ellipse cx="99" cy="37" rx="3" ry="2.5" fill={windowColor} opacity="0.55" />
        <ellipse cx="88" cy="37.5" rx="3" ry="2.5" fill={windowColor} opacity="0.45" />
        <ellipse cx="77" cy="38" rx="3" ry="2.5" fill={windowColor} opacity="0.4" />

        {/* ── Wing tip detail ── */}
        <ellipse cx="51" cy="15" rx="3" ry="2" fill={wingColor} opacity="0.6" />
        <ellipse cx="74" cy="65" rx="3" ry="2" fill={wingColor} opacity="0.6" />
      </g>
    </svg>
  )
}
