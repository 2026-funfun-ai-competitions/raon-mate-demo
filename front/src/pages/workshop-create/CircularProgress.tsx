function CircularProgress({ percent }: { percent: number }) {
  const radius = 26
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - percent / 100)

  return (
    <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#ede9fe" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#7c3aed"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-sm font-bold text-violet-700">{percent}%</span>
    </div>
  )
}

export default CircularProgress
