import { useState } from 'react'

export default function ProgressInput({ goal, onUpdateProgress, onAddEntry }) {
  const [numValue, setNumValue] = useState('')
  const [note, setNote] = useState('')
  const [minutes, setMinutes] = useState('')

  switch (goal.type) {
    case 'binary':
      return (
        <button
          onClick={() => onUpdateProgress({ completed: !goal.progress?.completed })}
          className={`w-full py-4 rounded-xl font-medium text-sm transition-all duration-300 ${
            goal.progress?.completed
              ? 'bg-success/10 text-success border border-success/20 shadow-[0_0_20px_rgba(74,222,128,0.08)]'
              : 'bg-white/[0.03] text-text-muted border border-border hover:border-border-hover hover:bg-white/[0.05]'
          }`}
        >
          {goal.progress?.completed ? '✓  Goal Achieved!' : 'Mark as Complete'}
        </button>
      )

    case 'numeric': {
      const { min = 0, max = 100, unit = '' } = goal.config || {}
      const current = goal.progress?.currentValue ?? min
      const pct = max === min ? 0 : ((current - min) / (max - min)) * 100
      return (
        <div className="space-y-4">
          {/* Visual progress bar */}
          <div className="relative h-2 bg-white/[0.04] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(100, pct)}%`,
                background: `linear-gradient(90deg, ${goal.color}88, ${goal.color})`
              }}
            />
          </div>

          {/* Slider */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const step = max <= 20 ? 0.5 : max <= 100 ? 1 : 10
                onUpdateProgress({ currentValue: Math.max(min, current - step) })
              }}
              className="w-9 h-9 rounded-lg bg-white/[0.04] text-text-muted hover:bg-white/[0.08] hover:text-text transition-all text-base"
            >
              −
            </button>
            <input
              type="range"
              min={min}
              max={max}
              step={max <= 20 ? 0.1 : 1}
              value={current}
              onChange={e => onUpdateProgress({ currentValue: parseFloat(e.target.value) })}
              className="flex-1"
            />
            <button
              onClick={() => {
                const step = max <= 20 ? 0.5 : max <= 100 ? 1 : 10
                onUpdateProgress({ currentValue: Math.min(max, current + step) })
              }}
              className="w-9 h-9 rounded-lg bg-white/[0.04] text-text-muted hover:bg-white/[0.08] hover:text-text transition-all text-base"
            >
              +
            </button>
          </div>

          {/* Direct input */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder={`Enter ${unit}`}
              value={numValue}
              onChange={e => setNumValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && numValue) {
                  onUpdateProgress({ currentValue: Math.min(max, Math.max(min, parseFloat(numValue))) })
                  setNumValue('')
                }
              }}
              className="flex-1 bg-white/[0.03] border border-border rounded-xl px-4 py-2.5 text-sm text-text
                         focus:outline-none focus:border-accent/40 placeholder:text-text-muted/40 transition-all"
            />
            <button
              onClick={() => {
                if (numValue) {
                  onUpdateProgress({ currentValue: Math.min(max, Math.max(min, parseFloat(numValue))) })
                  setNumValue('')
                }
              }}
              disabled={!numValue}
              className="px-5 py-2.5 bg-accent/15 text-accent rounded-xl text-sm font-medium
                         hover:bg-accent/25 transition-all disabled:opacity-30"
            >
              Set
            </button>
          </div>
        </div>
      )
    }

    case 'frequency': {
      const { trackMinutes } = goal.config || {}
      return (
        <div className="space-y-3">
          {trackMinutes ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Minutes"
                value={minutes}
                onChange={e => setMinutes(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && minutes) {
                    onAddEntry(note, parseInt(minutes))
                    setMinutes('')
                    setNote('')
                  }
                }}
                className="w-24 bg-white/[0.03] border border-border rounded-xl px-4 py-2.5 text-sm text-text
                           focus:outline-none focus:border-accent/40 placeholder:text-text-muted/40 transition-all"
              />
              <input
                type="text"
                placeholder="Note (optional)"
                value={note}
                onChange={e => setNote(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && minutes) {
                    onAddEntry(note, parseInt(minutes))
                    setMinutes('')
                    setNote('')
                  }
                }}
                className="flex-1 bg-white/[0.03] border border-border rounded-xl px-4 py-2.5 text-sm text-text
                           focus:outline-none focus:border-accent/40 placeholder:text-text-muted/40 transition-all"
              />
              <button
                onClick={() => {
                  if (minutes) {
                    onAddEntry(note, parseInt(minutes))
                    setMinutes('')
                    setNote('')
                  }
                }}
                disabled={!minutes}
                className="px-4 py-2.5 bg-success/10 text-success rounded-xl text-sm font-medium
                           hover:bg-success/20 transition-all whitespace-nowrap border border-success/10
                           disabled:opacity-30"
              >
                + Log
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a note (optional)"
                value={note}
                onChange={e => setNote(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    onAddEntry(note)
                    setNote('')
                  }
                }}
                className="flex-1 bg-white/[0.03] border border-border rounded-xl px-4 py-2.5 text-sm text-text
                           focus:outline-none focus:border-accent/40 placeholder:text-text-muted/40 transition-all"
              />
              <button
                onClick={() => {
                  onAddEntry(note)
                  setNote('')
                }}
                className="px-4 py-2.5 bg-success/10 text-success rounded-xl text-sm font-medium
                           hover:bg-success/20 transition-all whitespace-nowrap border border-success/10"
              >
                + Log Entry
              </button>
            </div>
          )}
        </div>
      )
    }

    case 'qualitative': {
      const rating = goal.progress?.rating ?? 0
      return (
        <div className="space-y-4">
          {/* Visual progress bar */}
          <div className="relative h-2 bg-white/[0.04] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${rating}%`,
                background: `linear-gradient(90deg, ${goal.color}88, ${goal.color})`
              }}
            />
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={rating}
            onChange={e => onUpdateProgress({ rating: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-[11px] text-text-muted uppercase tracking-wider">
            <span>Not started</span>
            <span className="font-semibold text-text text-sm normal-case" style={{ color: goal.color }}>
              {Math.round(rating)}%
            </span>
            <span>Achieved</span>
          </div>
          {goal.config?.milestones?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {goal.config.milestones.map((m, i) => {
                const threshold = ((i + 1) / goal.config.milestones.length) * 100
                const reached = rating >= threshold
                return (
                  <span
                    key={i}
                    className={`text-[11px] px-3 py-1 rounded-full transition-all duration-300 ${
                      reached
                        ? 'bg-success/10 text-success border border-success/15'
                        : 'bg-white/[0.03] text-text-muted/60 border border-border'
                    }`}
                  >
                    {reached ? '✓ ' : ''}{m}
                  </span>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    default:
      return null
  }
}
