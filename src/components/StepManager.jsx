import { useState } from 'react'

export default function StepManager({ steps = [], onAdd, onToggle, onDelete }) {
  const [text, setText] = useState('')

  const handleAdd = () => {
    if (!text.trim()) return
    onAdd(text.trim())
    setText('')
  }

  return (
    <div className="space-y-4">
      <h4 className="text-[11px] font-medium text-text-muted uppercase tracking-[0.15em]">Steps</h4>
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Add a step toward this goal..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          className="flex-1 bg-white/[0.03] border border-border rounded-xl px-4 py-2.5 text-sm text-text
                     focus:outline-none focus:border-accent/40 focus:bg-white/[0.05]
                     placeholder:text-text-muted/40 transition-all"
        />
        <button
          onClick={handleAdd}
          disabled={!text.trim()}
          className="px-4 py-2.5 bg-accent/15 text-accent rounded-xl text-sm font-medium
                     hover:bg-accent/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
      {steps.length > 0 && (
        <ul className="space-y-1">
          {steps.map(step => (
            <li key={step.id} className="flex items-center gap-3 group py-1.5 px-1 rounded-lg hover:bg-white/[0.02] transition-colors">
              <button
                onClick={() => onToggle(step.id)}
                className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                  step.completed
                    ? 'bg-success/20 border-success/50 text-success'
                    : 'border-white/15 hover:border-white/30'
                }`}
              >
                {step.completed && (
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className={`flex-1 text-sm ${step.completed ? 'line-through text-text-muted/50' : 'text-text-secondary'}`}>
                {step.text}
              </span>
              <button
                onClick={() => onDelete(step.id)}
                className="opacity-0 group-hover:opacity-100 text-text-muted/30 hover:text-danger/70 text-xs transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
