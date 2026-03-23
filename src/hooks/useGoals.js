import { useState, useEffect, useCallback } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { defaultGoals } from '../data/defaultGoals'
import { loadGoals, saveGoals, generateId } from '../utils/storage'

export function useGoals() {
  const { user } = useAuth()
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [useLocal, setUseLocal] = useState(false)

  // Load goals from Supabase or fallback to localStorage
  useEffect(() => {
    async function fetchGoals() {
      setLoading(true)
      if (user && supabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', user.id)
            .order('sort_order', { ascending: true })

          if (error) throw error

          if (data && data.length > 0) {
            // Merge in any new default sub-goals for existing goals
            let needsUpdate = false
            const merged = data.map(g => {
              const defaultGoal = defaultGoals.find(dg => dg.id === g.id)
              if (defaultGoal?.sub_goals?.length > 0 && (!g.sub_goals || g.sub_goals.length === 0)) {
                needsUpdate = true
                return { ...g, sub_goals: defaultGoal.sub_goals, config: { ...g.config, ...defaultGoal.config } }
              }
              return g
            })
            if (needsUpdate) {
              // Persist the merged sub-goals back to Supabase
              for (const g of merged) {
                const defaultGoal = defaultGoals.find(dg => dg.id === g.id)
                if (defaultGoal?.sub_goals?.length > 0 && (!data.find(d => d.id === g.id)?.sub_goals?.length)) {
                  await supabase
                    .from('goals')
                    .update({ sub_goals: g.sub_goals, config: g.config })
                    .eq('id', g.id)
                    .eq('user_id', user.id)
                }
              }
            }
            setGoals(merged)
          } else {
            // Seed default goals for new user
            const seeded = defaultGoals.map(g => ({ ...g, user_id: user.id }))
            const { data: inserted, error: insertError } = await supabase
              .from('goals')
              .insert(seeded)
              .select()
            if (insertError) throw insertError
            setGoals(inserted || seeded)
          }
          setUseLocal(false)
        } catch (err) {
          console.warn('Supabase unavailable, using localStorage:', err.message)
          setUseLocal(true)
          const local = loadGoals()
          setGoals(local || defaultGoals)
        }
      } else {
        // No auth / no supabase - use localStorage
        setUseLocal(true)
        const local = loadGoals()
        setGoals(local || defaultGoals)
      }
      setLoading(false)
    }
    fetchGoals()
  }, [user])

  // Persist to localStorage when in local mode
  useEffect(() => {
    if (useLocal && goals.length > 0) {
      saveGoals(goals)
    }
  }, [goals, useLocal])

  const persistGoal = useCallback(async (updatedGoal) => {
    if (!useLocal && user && supabase) {
      const { user_id, ...rest } = updatedGoal
      await supabase
        .from('goals')
        .update(rest)
        .eq('id', updatedGoal.id)
        .eq('user_id', user.id)
    }
  }, [useLocal, user])

  const updateGoalProgress = useCallback(async (goalId, newProgress) => {
    setGoals(prev => {
      const updated = prev.map(g =>
        g.id === goalId ? { ...g, progress: { ...g.progress, ...newProgress } } : g
      )
      const updatedGoal = updated.find(g => g.id === goalId)
      if (updatedGoal) persistGoal(updatedGoal)
      return updated
    })
  }, [persistGoal])

  const addStep = useCallback(async (goalId, text) => {
    const step = { id: generateId(), text, completed: false, createdAt: new Date().toISOString() }
    setGoals(prev => {
      const updated = prev.map(g =>
        g.id === goalId ? { ...g, steps: [...(g.steps || []), step] } : g
      )
      const updatedGoal = updated.find(g => g.id === goalId)
      if (updatedGoal) persistGoal(updatedGoal)
      return updated
    })
  }, [persistGoal])

  const toggleStep = useCallback(async (goalId, stepId) => {
    setGoals(prev => {
      const updated = prev.map(g =>
        g.id === goalId
          ? {
              ...g,
              steps: (g.steps || []).map(s =>
                s.id === stepId ? { ...s, completed: !s.completed } : s
              )
            }
          : g
      )
      const updatedGoal = updated.find(g => g.id === goalId)
      if (updatedGoal) persistGoal(updatedGoal)
      return updated
    })
  }, [persistGoal])

  const deleteStep = useCallback(async (goalId, stepId) => {
    setGoals(prev => {
      const updated = prev.map(g =>
        g.id === goalId
          ? { ...g, steps: (g.steps || []).filter(s => s.id !== stepId) }
          : g
      )
      const updatedGoal = updated.find(g => g.id === goalId)
      if (updatedGoal) persistGoal(updatedGoal)
      return updated
    })
  }, [persistGoal])

  const addFrequencyEntry = useCallback(async (goalId, note = '', minutes = null) => {
    const entry = { id: generateId(), date: new Date().toISOString(), note }
    if (minutes !== null) entry.minutes = minutes
    setGoals(prev => {
      const updated = prev.map(g =>
        g.id === goalId
          ? { ...g, progress: { ...g.progress, entries: [...(g.progress?.entries || []), entry] } }
          : g
      )
      const updatedGoal = updated.find(g => g.id === goalId)
      if (updatedGoal) persistGoal(updatedGoal)
      return updated
    })
  }, [persistGoal])

  const deleteFrequencyEntry = useCallback(async (goalId, entryId) => {
    setGoals(prev => {
      const updated = prev.map(g =>
        g.id === goalId
          ? { ...g, progress: { ...g.progress, entries: (g.progress?.entries || []).filter(e => e.id !== entryId) } }
          : g
      )
      const updatedGoal = updated.find(g => g.id === goalId)
      if (updatedGoal) persistGoal(updatedGoal)
      return updated
    })
  }, [persistGoal])

  // Sub-goal CRUD
  const addSubGoal = useCallback(async (goalId, subGoal) => {
    const newSub = {
      id: generateId(),
      title: subGoal.title,
      type: subGoal.type || 'numeric',
      config: subGoal.config || {},
      progress: subGoal.progress || {},
      createdAt: new Date().toISOString()
    }
    setGoals(prev => {
      const updated = prev.map(g =>
        g.id === goalId
          ? { ...g, sub_goals: [...(g.sub_goals || []), newSub] }
          : g
      )
      const updatedGoal = updated.find(g => g.id === goalId)
      if (updatedGoal) persistGoal(updatedGoal)
      return updated
    })
  }, [persistGoal])

  const updateSubGoalProgress = useCallback(async (goalId, subGoalId, newProgress) => {
    setGoals(prev => {
      const updated = prev.map(g =>
        g.id === goalId
          ? {
              ...g,
              sub_goals: (g.sub_goals || []).map(sg =>
                sg.id === subGoalId ? { ...sg, progress: { ...sg.progress, ...newProgress } } : sg
              )
            }
          : g
      )
      const updatedGoal = updated.find(g => g.id === goalId)
      if (updatedGoal) persistGoal(updatedGoal)
      return updated
    })
  }, [persistGoal])

  const deleteSubGoal = useCallback(async (goalId, subGoalId) => {
    setGoals(prev => {
      const updated = prev.map(g =>
        g.id === goalId
          ? { ...g, sub_goals: (g.sub_goals || []).filter(sg => sg.id !== subGoalId) }
          : g
      )
      const updatedGoal = updated.find(g => g.id === goalId)
      if (updatedGoal) persistGoal(updatedGoal)
      return updated
    })
  }, [persistGoal])

  return {
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
  }
}
