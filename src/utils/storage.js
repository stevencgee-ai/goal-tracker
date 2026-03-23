const STORAGE_KEY = 'goalTracker2026'

export function loadGoals() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function saveGoals(goals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
