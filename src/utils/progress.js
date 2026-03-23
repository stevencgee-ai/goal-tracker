export function computeProgress(goal) {
  switch (goal.type) {
    case 'binary': {
      if (goal.progress?.completed) return 100
      // Auto-compute from sub-goals if configured
      if (goal.config?.autoProgressFromSubGoals && goal.sub_goals?.length > 0) {
        const subProgresses = goal.sub_goals.map(sg => {
          if (sg.type === 'binary') return sg.progress?.completed ? 100 : 0
          if (sg.type === 'numeric') {
            const { min = 0, max = 100 } = sg.config || {}
            const cur = sg.progress?.currentValue ?? min
            return max === min ? 0 : Math.min(100, ((cur - min) / (max - min)) * 100)
          }
          return sg.progress?.rating ?? 0
        })
        return subProgresses.reduce((sum, p) => sum + p, 0) / subProgresses.length
      }
      return 0
    }

    case 'numeric': {
      const { min = 0, max = 100 } = goal.config || {}
      const current = goal.progress?.currentValue ?? min
      if (max === min) return current >= max ? 100 : 0
      return Math.min(100, Math.max(0, ((current - min) / (max - min)) * 100))
    }

    case 'frequency': {
      const entries = goal.progress?.entries || []
      const { targetCount = 1, period = 'week', trackMinutes } = goal.config || {}
      const now = new Date()
      const periodEntries = entries.filter(e => isInCurrentPeriod(e.date, period, now))
      if (trackMinutes) {
        const totalMinutes = periodEntries.reduce((sum, e) => sum + (e.minutes || 0), 0)
        return Math.min(100, (totalMinutes / targetCount) * 100)
      }
      return Math.min(100, (periodEntries.length / targetCount) * 100)
    }

    case 'qualitative': {
      // Auto-compute from sub-goals if configured
      if (goal.config?.autoProgressFromSubGoals && goal.sub_goals?.length > 0) {
        const subProgresses = goal.sub_goals.map(sg => {
          if (sg.type === 'binary') return sg.progress?.completed ? 100 : 0
          if (sg.type === 'numeric') {
            const { min = 0, max = 100 } = sg.config || {}
            const cur = sg.progress?.currentValue ?? min
            return max === min ? 0 : Math.min(100, ((cur - min) / (max - min)) * 100)
          }
          return sg.progress?.rating ?? 0
        })
        return subProgresses.reduce((sum, p) => sum + p, 0) / subProgresses.length
      }
      return goal.progress?.rating ?? 0
    }

    default:
      return 0
  }
}

export function getProgressLabel(goal) {
  switch (goal.type) {
    case 'binary': {
      if (goal.progress?.completed) return 'Complete!'
      if (goal.config?.autoProgressFromSubGoals && goal.sub_goals?.length > 0) {
        const done = goal.sub_goals.filter(sg => {
          if (sg.type === 'binary') return sg.progress?.completed
          if (sg.type === 'numeric') return (sg.progress?.currentValue ?? 0) >= (sg.config?.max ?? 100)
          return (sg.progress?.rating ?? 0) >= 100
        }).length
        return `${done} / ${goal.sub_goals.length} milestones`
      }
      return 'Not yet'
    }

    case 'numeric': {
      const { min = 0, max = 100, unit = '' } = goal.config || {}
      const current = goal.progress?.currentValue ?? min
      // Show hours + minutes for meditation
      if (unit === 'minutes' && max >= 60) {
        const hrs = Math.floor(current / 60)
        const mins = Math.round(current % 60)
        const totalHrs = Math.floor(max / 60)
        if (hrs > 0) {
          return `${hrs}h ${mins}m / ${totalHrs} hours`
        }
        return `${mins}m / ${totalHrs} hours`
      }
      return `${formatNum(current)} / ${formatNum(max)} ${unit}`
    }

    case 'frequency': {
      const entries = goal.progress?.entries || []
      const { targetCount = 1, period = 'week', unit = '', trackMinutes } = goal.config || {}
      const now = new Date()
      const periodEntries = entries.filter(e => isInCurrentPeriod(e.date, period, now))
      if (trackMinutes) {
        const totalMinutes = periodEntries.reduce((sum, e) => sum + (e.minutes || 0), 0)
        return `${totalMinutes} / ${targetCount} ${unit} this ${period}`
      }
      return `${periodEntries.length} / ${targetCount} ${unit} this ${period}`
    }

    case 'qualitative': {
      if (goal.config?.autoProgressFromSubGoals && goal.sub_goals?.length > 0) {
        const done = goal.sub_goals.filter(sg => {
          if (sg.type === 'binary') return sg.progress?.completed
          if (sg.type === 'numeric') return (sg.progress?.currentValue ?? 0) >= (sg.config?.max ?? 100)
          return (sg.progress?.rating ?? 0) >= 100
        }).length
        return `${done} / ${goal.sub_goals.length} sub-goals`
      }
      return `${Math.round(goal.progress?.rating ?? 0)}%`
    }

    default:
      return ''
  }
}

function isInCurrentPeriod(dateStr, period, now) {
  const date = new Date(dateStr)
  if (period === 'week') {
    // Week starts on Monday
    const startOfWeek = new Date(now)
    const day = now.getDay()
    const diff = day === 0 ? 6 : day - 1 // Monday = 0 offset
    startOfWeek.setDate(now.getDate() - diff)
    startOfWeek.setHours(0, 0, 0, 0)
    return date >= startOfWeek
  }
  if (period === 'month') {
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }
  return true
}

function formatNum(n) {
  return Number.isInteger(n) ? n.toLocaleString() : n.toFixed(1)
}

export function getOverallProgress(goals) {
  if (!goals.length) return 0
  const total = goals.reduce((sum, g) => sum + computeProgress(g), 0)
  return total / goals.length
}

export function getYearProgress() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const end = new Date(now.getFullYear() + 1, 0, 1)
  return ((now - start) / (end - start)) * 100
}
