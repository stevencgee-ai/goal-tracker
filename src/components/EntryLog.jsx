export default function EntryLog({ entries = [], trackMinutes, onDelete }) {
  if (entries.length === 0) return null

  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="space-y-3">
      <h4 className="text-[11px] font-medium text-text-muted uppercase tracking-[0.15em]">
        Log <span className="text-text-muted/50">({entries.length})</span>
      </h4>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {sorted.map((entry, i) => {
          const date = new Date(entry.date)
          return (
            <div key={entry.id || i} className="flex items-center gap-3 text-sm py-1.5 px-1 rounded-lg hover:bg-white/[0.02] transition-colors group">
              <span className="w-1.5 h-1.5 rounded-full bg-success/60 flex-shrink-0" />
              <span className="text-text-muted text-xs">
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                <span className="text-text-muted/40 ml-1">
                  {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </span>
              </span>
              {trackMinutes && entry.minutes != null && (
                <span className="text-xs font-medium" style={{ color: 'var(--color-accent)' }}>
                  {entry.minutes}m
                </span>
              )}
              {entry.note && <span className="text-text-secondary text-xs truncate">{entry.note}</span>}
              {onDelete && entry.id && (
                <button
                  onClick={() => onDelete(entry.id)}
                  className="ml-auto opacity-0 group-hover:opacity-100 text-text-muted/30 hover:text-danger/70 transition-all flex-shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
