export const defaultGoals = [
  {
    id: 'legora-rollout',
    title: 'Legora Rollout',
    description: 'Achieve a measurably successful rollout of Legora (AI tool) at White & Case',
    type: 'qualitative',
    config: {
      milestones: ['Pilot launched', 'User training complete', 'Positive feedback received', 'Firm-wide adoption']
    },
    progress: { rating: 0 },
    steps: [],
    sub_goals: [],
    icon: '🚀',
    color: '#60a5fa',
    sort_order: 0
  },
  {
    id: 'muscle-up',
    title: 'Do a Muscle-Up',
    description: 'Achieve a full muscle-up on the bar',
    type: 'binary',
    config: {},
    progress: { completed: false },
    steps: [],
    sub_goals: [],
    icon: '💪',
    color: '#f87171',
    sort_order: 1
  },
  {
    id: 'steve-jobs-book',
    title: 'Finish Steve Jobs Book',
    description: 'Complete reading the Steve Jobs biography (571 pages)',
    type: 'numeric',
    config: { min: 0, max: 571, unit: 'pages' },
    progress: { currentValue: 0 },
    steps: [],
    sub_goals: [],
    icon: '📖',
    color: '#a78bfa',
    sort_order: 2
  },
  {
    id: 'relationship-annie',
    title: 'Rebuild Intimacy with Annie',
    description: 'Rebuild a more intimate and connected relationship with Annie',
    type: 'qualitative',
    config: {
      milestones: ['Regular date nights', 'Open conversations', 'Physical closeness', 'Deep connection']
    },
    progress: { rating: 0 },
    steps: [],
    sub_goals: [],
    icon: '❤️',
    color: '#fb7185',
    sort_order: 3
  },
  {
    id: 'billable-hours',
    title: '1,200 Billable Hours',
    description: 'Hit 1,200 billable hours for the year',
    type: 'numeric',
    config: { min: 0, max: 1200, unit: 'hours' },
    progress: { currentValue: 0 },
    steps: [],
    sub_goals: [],
    icon: '⏱️',
    color: '#e8c170',
    sort_order: 4
  },
  {
    id: 'meditation',
    title: '10 Hours Meditation',
    description: 'Accumulate 10 hours (600 minutes) of meditation practice',
    type: 'numeric',
    config: { min: 0, max: 600, unit: 'minutes', displayUnit: 'minutes', displayMax: 600 },
    progress: { currentValue: 0 },
    steps: [],
    sub_goals: [],
    icon: '🧘',
    color: '#4ade80',
    sort_order: 5
  },
  {
    id: 'vo2-max',
    title: 'VO2 Max 42 → 46',
    description: 'Increase VO2 Max from 42 to 46 ml/kg/min',
    type: 'numeric',
    config: { min: 42, max: 46, unit: 'ml/kg/min' },
    progress: { currentValue: 42 },
    steps: [],
    sub_goals: [],
    icon: '🫁',
    color: '#2dd4bf',
    sort_order: 6
  },
  {
    id: 'quality-time-kids',
    title: 'Weekly Quality Time with Kids',
    description: 'Spend at least 60 minutes per week of quality time with kids',
    type: 'frequency',
    config: { targetCount: 60, period: 'week', unit: 'minutes', trackMinutes: true },
    progress: { entries: [] },
    steps: [],
    sub_goals: [],
    icon: '👨‍👧‍👦',
    color: '#fbbf24',
    sort_order: 7
  },
  {
    id: 'ask-kids-about-world',
    title: 'Ask Kids About Their World',
    description: 'Twice per month, have a meaningful conversation asking kids about their world',
    type: 'frequency',
    config: { targetCount: 2, period: 'month', unit: 'conversations' },
    progress: { entries: [] },
    steps: [],
    sub_goals: [],
    icon: '🌍',
    color: '#34d399',
    sort_order: 8
  }
]
