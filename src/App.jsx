import { useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import { useGoals } from './hooks/useGoals'
import Header from './components/Header'
import GoalCard from './components/GoalCard'
import GoalDetail from './components/GoalDetail'
import LoginScreen from './components/LoginScreen'

export default function App() {
  const { user, loading: authLoading, supabaseConfigured } = useAuth()
  const {
    goals,
    loading,
    updateGoalProgress,
    addStep,
    toggleStep,
    deleteStep,
    addFrequencyEntry,
    deleteFrequencyEntry,
    addSubGoal,
    updateSubGoalProgress,
    deleteSubGoal
  } = useGoals()

  const [selectedGoalId, setSelectedGoalId] = useState(null)
  const selectedGoal = goals.find(g => g.id === selectedGoalId)

  // Show loading spinner while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center animate-pulse">
            <span className="text-xl">🎯</span>
          </div>
          <div className="text-text-muted text-xs tracking-[0.2em] uppercase">Loading...</div>
        </div>
      </div>
    )
  }

  // Show login screen if Supabase is configured but user isn't logged in
  if (supabaseConfigured && !user) {
    return <LoginScreen />
  }

  // Show loading while goals are being fetched
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center animate-pulse">
            <span className="text-xl">🎯</span>
          </div>
          <div className="text-text-muted text-xs tracking-[0.2em] uppercase">Loading goals...</div>
        </div>
      </div>
    )
  }

  if (selectedGoal) {
    return (
      <GoalDetail
        goal={selectedGoal}
        onBack={() => setSelectedGoalId(null)}
        onUpdateProgress={p => updateGoalProgress(selectedGoal.id, p)}
        onAddStep={text => addStep(selectedGoal.id, text)}
        onToggleStep={stepId => toggleStep(selectedGoal.id, stepId)}
        onDeleteStep={stepId => deleteStep(selectedGoal.id, stepId)}
        onAddEntry={(note, minutes) => addFrequencyEntry(selectedGoal.id, note, minutes)}
        onDeleteEntry={entryId => deleteFrequencyEntry(selectedGoal.id, entryId)}
        onAddSubGoal={sg => addSubGoal(selectedGoal.id, sg)}
        onUpdateSubGoalProgress={(sgId, p) => updateSubGoalProgress(selectedGoal.id, sgId, p)}
        onDeleteSubGoal={sgId => deleteSubGoal(selectedGoal.id, sgId)}
      />
    )
  }

  return (
    <div className="min-h-screen pb-16">
      <Header goals={goals} />
      <main className="max-w-5xl mx-auto px-5 md:px-8 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {goals.map((goal, i) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              index={i}
              onClick={() => setSelectedGoalId(goal.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-4">
          <p className="text-text-muted/20 text-[10px] tracking-[0.2em] uppercase">
            Stay consistent. Stay focused.
          </p>
        </div>
      </main>
    </div>
  )
}
