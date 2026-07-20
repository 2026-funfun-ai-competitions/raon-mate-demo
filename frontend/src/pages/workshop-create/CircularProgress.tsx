function CircularProgress({
  percent,
  size = 64,
  strokeWidth = 6,
  labelClassName = 'text-sm font-bold text-violet-700',
}: {
  percent: number
  size?: number
  strokeWidth?: number
  labelClassName?: string
}) {
  const radius = (size - strokeWidth) / 2
  const center = size / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - percent / 100)

  return (
    <div
      className="relative flex flex-shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90" style={{ width: size, height: size }}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#ede9fe" strokeWidth={strokeWidth} />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#7c3aed"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className={`absolute ${labelClassName}`}>{percent}%</span>
    </div>
  )
}

export default CircularProgress
