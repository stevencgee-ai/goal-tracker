import CircularProgress from './CircularProgress'
import { computeProgress, getProgressLabel } from '../utils/progress'

export default function GoalCard({ goal, onClick, index }) {
  const progress = computeProgress(goal)
  const label = getProgressLabel(goal)
  const completedSteps = (goal.steps || []).filter(s => s.completed).length
  const totalSteps = (goal.steps || []).length
  const subGoalCount = (goal.sub_goals || []).length
  const isComplete = progress >= 100

  return (
    <button
      onClick={onClick}
      className="animate-fade-in w-full text-left rounded-2xl p-5 md:p-6
                 transition-all duration-300 cursor-pointer
                 border border-border hover:border-border-hover
                 hover:scale-[1.02] active:scale-[0.98]
                 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)]
                 group card-shine relative overflow-hidden"
      style={{
        animationDelay: `${index * 60}ms`,
        background: `linear-gradient(145deg, rgba(${hexToRgb(goal.color)}, 0.07), var(--color-surface) 60%)`
      }}
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 80% 20%, rgba(${hexToRgb(goal.color)}, 0.08), transparent 60%)`
        }}
      />

      {/* Complete badge */}
      {isComplete && (
        <div className="absolute top-3 right-3 text-[9px] font-semibold uppercase tracking-widest text-success bg-success/10 border border-success/15 px-2 py-0.5 rounded-full">
          Done
        </div>
      )}

      <div className="flex items-start gap-4 relative">
        <div className="text-2xl md:text-3xl mt-0.5 grayscale-[30%] group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110">
          {goal.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-text font-medium text-[15px] leading-tight group-hover:text-white transition-colors pr-12">
            {goal.title}
          </h3>
          <p className="text-text-muted text-xs mt-1.5 font-light">{label}</p>

          {/* Meta row */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {totalSteps > 0 && (
              <span className="text-[10px] text-text-muted/60 flex items-center gap-1 bg-white/[0.03] px-2 py-0.5 rounded-full">
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {completedSteps}/{totalSteps} steps
              </span>
            )}
            {subGoalCount > 0 && (
              <span className="text-[10px] text-text-muted/60 bg-white/[0.03] px-2 py-0.5 rounded-full">
                {subGoalCount} sub-goal{subGoalCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        <CircularProgress percentage={progress} size={56} strokeWidth={4} color={goal.color} />
      </div>
    </button>
  )
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}
