import { computeProgress, getProgressLabel } from '../utils/progress'
import CircularProgress from './CircularProgress'
import ProgressInput from './ProgressInput'
import StepManager from './StepManager'
import EntryLog from './EntryLog'
import SubGoalManager from './SubGoalManager'

export default function GoalDetail({
  goal,
  onBack,
  onUpdateProgress,
  onAddStep,
  onToggleStep,
  onDeleteStep,
  onAddEntry,
  onDeleteEntry,
  onAddSubGoal,
  onUpdateSubGoalProgress,
  onDeleteSubGoal
}) {
  const progress = computeProgress(goal)
  const label = getProgressLabel(goal)
  const isComplete = progress >= 100

  return (
    <div className="max-w-2xl mx-auto w-full px-5 py-8 animate-fade-in">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-text-muted hover:text-text text-sm mb-8 transition-colors group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        All Goals
      </button>

      <div className="space-y-6">
        {/* Hero header */}
        <div className="relative rounded-2xl p-6 md:p-8 border border-border overflow-hidden card-shine"
          style={{
            background: `linear-gradient(145deg, rgba(${hexToRgb(goal.color)}, 0.08), var(--color-surface) 60%)`
          }}
        >
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 90% 10%, rgba(${hexToRgb(goal.color)}, 0.1), transparent 50%)`
            }}
          />

          {isComplete && (
            <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest text-success bg-success/10 border border-success/15 px-3 py-1 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Achieved
            </div>
          )}

          <div className="flex items-start gap-5 relative">
            <div className="text-5xl md:text-6xl">{goal.icon}</div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl md:text-3xl font-bold text-text tracking-tight">
                {goal.title}
              </h2>
              <p className="text-text-secondary text-sm mt-2 leading-relaxed">{goal.description}</p>
              <div className="mt-4 flex items-center gap-4">
                <span className="text-sm font-semibold tracking-wide" style={{ color: goal.color }}>{label}</span>
                <span className="text-text-muted/30">|</span>
                <span className="text-xs text-text-muted">{Math.round(progress)}% complete</span>
              </div>
            </div>
            <CircularProgress percentage={progress} size={80} strokeWidth={5} color={goal.color} />
          </div>

          {/* Full-width progress bar */}
          <div className="mt-6 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(100, progress)}%`,
                background: `linear-gradient(90deg, ${goal.color}88, ${goal.color})`
              }}
            />
          </div>
        </div>

        {/* Progress Input */}
        <section className="bg-surface/60 backdrop-blur-sm rounded-2xl p-6 border border-border card-shine">
          <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-accent/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Update Progress
          </h4>
          <ProgressInput
            goal={goal}
            onUpdateProgress={onUpdateProgress}
            onAddEntry={onAddEntry}
          />
        </section>

        {/* Sub-Goals */}
        {['muscle-up', 'vo2-max', 'legora-rollout', 'relationship-annie'].includes(goal.id) && (
          <section className="bg-surface/60 backdrop-blur-sm rounded-2xl p-6 border border-border card-shine">
            <SubGoalManager
              goal={goal}
              onAddSubGoal={onAddSubGoal}
              onUpdateSubGoalProgress={onUpdateSubGoalProgress}
              onDeleteSubGoal={onDeleteSubGoal}
            />
          </section>
        )}

        {/* Steps */}
        <section className="bg-surface/60 backdrop-blur-sm rounded-2xl p-6 border border-border card-shine">
          <StepManager
            steps={goal.steps || []}
            onAdd={onAddStep}
            onToggle={onToggleStep}
            onDelete={onDeleteStep}
          />
        </section>

        {/* Entry Log for frequency goals */}
        {goal.type === 'frequency' && (goal.progress?.entries?.length > 0) && (
          <section className="bg-surface/60 backdrop-blur-sm rounded-2xl p-6 border border-border card-shine">
            <EntryLog entries={goal.progress?.entries} period={goal.config?.period} trackMinutes={goal.config?.trackMinutes} onDelete={onDeleteEntry} />
          </section>
        )}
      </div>
    </div>
  )
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}
