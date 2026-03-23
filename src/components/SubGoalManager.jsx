import { useState } from 'react'
import CircularProgress from './CircularProgress'

export default function SubGoalManager({ goal, onAddSubGoal, onUpdateSubGoalProgress, onDeleteSubGoal }) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('numeric')
  const [max, setMax] = useState('')
  const [unit, setUnit] = useState('')

  const subGoals = goal.sub_goals || []

  const handleAdd = () => {
    if (!title.trim()) return
    const config = type === 'numeric'
      ? { min: 0, max: parseFloat(max) || 100, unit: unit || '' }
      : type === 'binary' ? {} : {}
    const progress = type === 'numeric'
      ? { currentValue: 0 }
      : type === 'binary' ? { completed: false } : { rating: 0 }

    onAddSubGoal({ title: title.trim(), type, config, progress })
    setTitle('')
    setMax('')
    setUnit('')
    setShowForm(false)
  }

  const getSubProgress = (sg) => {
    if (sg.type === 'binary') return sg.progress?.completed ? 100 : 0
    if (sg.type === 'numeric') {
      const { min = 0, max = 100 } = sg.config || {}
      const cur = sg.progress?.currentValue ?? min
      return max === min ? 0 : ((cur - min) / (max - min)) * 100
    }
    return sg.progress?.rating ?? 0
  }

  const getSubLabel = (sg) => {
    if (sg.type === 'binary') return sg.progress?.completed ? 'Done' : 'Not yet'
    if (sg.type === 'numeric') {
      const cur = sg.progress?.currentValue ?? 0
      const max = sg.config?.max ?? 100
      return `${cur} / ${max} ${sg.config?.unit || ''}`
    }
    return `${sg.progress?.rating ?? 0}%`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-medium text-text-muted uppercase tracking-[0.15em]">Sub-Goals</h4>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-[11px] px-3 py-1 bg-accent/10 text-accent/80 rounded-lg hover:bg-accent/20 hover:text-accent transition-all"
        >
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white/[0.02] rounded-xl p-4 space-y-3 border border-border">
          <input
            type="text"
            placeholder="Sub-goal title (e.g., 10 strict pull-ups)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-white/[0.03] border border-border rounded-xl px-4 py-2.5 text-sm text-text
                       focus:outline-none focus:border-accent/40 placeholder:text-text-muted/40 transition-all"
          />
          <div className="flex gap-2">
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="bg-white/[0.03] border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none"
            >
              <option value="numeric">Numeric</option>
              <option value="binary">Yes/No</option>
              <option value="qualitative">Qualitative</option>
            </select>
            {type === 'numeric' && (
              <>
                <input
                  type="number"
                  placeholder="Target"
                  value={max}
                  onChange={e => setMax(e.target.value)}
                  className="w-24 bg-white/[0.03] border border-border rounded-xl px-3 py-2.5 text-sm text-text
                             focus:outline-none placeholder:text-text-muted/40"
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="w-24 bg-white/[0.03] border border-border rounded-xl px-3 py-2.5 text-sm text-text
                             focus:outline-none placeholder:text-text-muted/40"
                />
              </>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={!title.trim()}
            className="px-5 py-2.5 bg-accent text-bg rounded-xl text-sm font-semibold
                       hover:bg-accent-dim transition-all disabled:opacity-30"
          >
            Add Sub-Goal
          </button>
        </div>
      )}

      {subGoals.length > 0 && (
        <div className="space-y-2">
          {subGoals.map(sg => (
            <div key={sg.id} className="bg-white/[0.02] rounded-xl p-3.5 border border-border hover:border-border-hover transition-all">
              <div className="flex items-center gap-3">
                <CircularProgress percentage={getSubProgress(sg)} size={36} strokeWidth={3} color={goal.color} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text truncate">{sg.title}</div>
                  <div className="text-[11px] text-text-muted">{getSubLabel(sg)}</div>
                </div>
                <button
                  onClick={() => onDeleteSubGoal(sg.id)}
                  className="text-text-muted/20 hover:text-danger/60 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-2.5">
                {sg.type === 'binary' && (
                  <button
                    onClick={() => onUpdateSubGoalProgress(sg.id, { completed: !sg.progress?.completed })}
                    className={`text-[11px] px-3 py-1.5 rounded-lg transition-all ${
                      sg.progress?.completed
                        ? 'bg-success/10 text-success border border-success/15'
                        : 'bg-white/[0.03] text-text-muted border border-border hover:border-border-hover'
                    }`}
                  >
                    {sg.progress?.completed ? '✓ Done' : 'Mark Done'}
                  </button>
                )}
                {sg.type === 'numeric' && (
                  <input
                    type="range"
                    min={sg.config?.min ?? 0}
                    max={sg.config?.max ?? 100}
                    step={1}
                    value={sg.progress?.currentValue ?? 0}
                    onChange={e => onUpdateSubGoalProgress(sg.id, { currentValue: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                )}
                {sg.type === 'qualitative' && (
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={sg.progress?.rating ?? 0}
                    onChange={e => onUpdateSubGoalProgress(sg.id, { rating: parseInt(e.target.value) })}
                    className="w-full"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
