export default function CircularProgress({ percentage, size = 80, strokeWidth = 6, color = '#d4a853' }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, percentage) / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
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
          className="transition-all duration-1000 ease-out"
          style={{
            filter: percentage > 0 ? `drop-shadow(0 0 4px ${color}40)` : 'none'
          }}
        />
      </svg>
      <span
        className="absolute text-xs font-medium"
        style={{ color: percentage > 0 ? color : 'var(--color-text-muted)' }}
      >
        {Math.round(percentage)}%
      </span>
    </div>
  )
}
