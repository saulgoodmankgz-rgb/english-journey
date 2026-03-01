interface ProgressRingProps {
  value: number  // 0-100
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
  label?: string
  sublabel?: string
}

export default function ProgressRing({
  value,
  size = 80,
  strokeWidth = 6,
  color = '#58a6ff',
  trackColor = '#30363d',
  label,
  sublabel,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      {(label || sublabel) && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}>
          {label && (
            <span style={{ fontSize: size < 60 ? 11 : 14, fontWeight: 700, color: '#e6edf3', lineHeight: 1 }}>
              {label}
            </span>
          )}
          {sublabel && (
            <span style={{ fontSize: size < 60 ? 9 : 11, color: '#8b949e', marginTop: 2 }}>
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
