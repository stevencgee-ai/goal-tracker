import { useAuth } from '../contexts/AuthContext'
import { getOverallProgress, getYearProgress } from '../utils/progress'

const quotes = [
  "The only way to do great work is to love what you do.",
  "What you do today can improve all your tomorrows.",
  "Success is the sum of small efforts repeated day in and day out.",
  "The secret of getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "You are never too old to set another goal or to dream a new dream.",
  "It always seems impossible until it's done.",
  "Discipline is choosing between what you want now and what you want most.",
  "The pain of discipline is far less than the pain of regret.",
  "Small daily improvements are the key to staggering long-term results.",
]

function getQuote() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  return quotes[dayOfYear % quotes.length]
}

export default function Header({ goals }) {
  const { user, signOut } = useAuth()
  const overall = getOverallProgress(goals)
  const yearPct = getYearProgress()
  const completedCount = goals.filter(g => {
    if (g.type === 'binary') return g.progress?.completed
    if (g.type === 'numeric') return (g.progress?.currentValue ?? 0) >= (g.config?.max ?? 100)
    if (g.type === 'qualitative') return (g.progress?.rating ?? 0) >= 100
    return false
  }).length

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  // Are we ahead or behind schedule?
  const pacing = overall - yearPct
  const pacingLabel = pacing >= 0 ? 'Ahead of pace' : 'Behind pace'
  const pacingColor = pacing >= 5 ? 'text-success' : pacing >= -5 ? 'text-accent' : 'text-danger'

  return (
    <header className="relative px-6 pt-8 pb-6 md:px-10">
      {/* Ambient glow at top */}
      <div className="absolute inset-x-0 top-0 h-[200px] pointer-events-none bg-gradient-to-b from-accent/[0.03] to-transparent" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="max-w-5xl mx-auto relative">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/10 flex items-center justify-center">
              <span className="text-sm">🎯</span>
            </div>
            <p className="text-text-secondary text-sm tracking-wide hidden sm:block">{today}</p>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-surface/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt=""
                    className="w-5 h-5 rounded-full"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                )}
                <span className="text-xs text-text-muted max-w-[120px] truncate">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
                <button
                  onClick={signOut}
                  className="text-xs text-text-muted/50 hover:text-text transition-colors ml-1"
                  title="Sign out"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-text mb-2">
            <span className="font-bold bg-gradient-to-r from-accent via-amber-300 to-accent bg-clip-text text-transparent">2026</span>
            {' '}Goals
          </h1>
          <p className="text-text-muted/60 text-xs italic max-w-sm mx-auto">
            "{getQuote()}"
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Overall Progress */}
          <div className="bg-surface/50 backdrop-blur-sm rounded-2xl p-4 border border-border card-shine group hover:border-accent/10 transition-all">
            <div className="text-[10px] text-text-muted uppercase tracking-[0.15em] mb-2">Overall</div>
            <div className="text-2xl md:text-3xl font-bold text-accent">{Math.round(overall)}%</div>
            <div className="mt-2 h-1 bg-white/[0.04] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${overall}%`, background: 'linear-gradient(90deg, #d4a853, #e8c170)' }}
              />
            </div>
          </div>

          {/* Goals Completed */}
          <div className="bg-surface/50 backdrop-blur-sm rounded-2xl p-4 border border-border card-shine group hover:border-success/10 transition-all">
            <div className="text-[10px] text-text-muted uppercase tracking-[0.15em] mb-2">Completed</div>
            <div className="text-2xl md:text-3xl font-bold text-text">
              {completedCount}<span className="text-text-muted text-base font-normal">/{goals.length}</span>
            </div>
            <div className="mt-2 h-1 bg-white/[0.04] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-success/60 transition-all duration-1000"
                style={{ width: `${(completedCount / goals.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Year Elapsed */}
          <div className="bg-surface/50 backdrop-blur-sm rounded-2xl p-4 border border-border card-shine group hover:border-purple/10 transition-all">
            <div className="text-[10px] text-text-muted uppercase tracking-[0.15em] mb-2">Year Elapsed</div>
            <div className="text-2xl md:text-3xl font-bold text-purple">{Math.round(yearPct)}%</div>
            <div className="mt-2 h-1 bg-white/[0.04] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-purple/40 transition-all duration-1000"
                style={{ width: `${yearPct}%` }}
              />
            </div>
          </div>

          {/* Pacing */}
          <div className="bg-surface/50 backdrop-blur-sm rounded-2xl p-4 border border-border card-shine group hover:border-border-hover transition-all">
            <div className="text-[10px] text-text-muted uppercase tracking-[0.15em] mb-2">Pacing</div>
            <div className={`text-2xl md:text-3xl font-bold ${pacingColor}`}>
              {pacing >= 0 ? '+' : ''}{Math.round(pacing)}%
            </div>
            <div className={`text-[10px] mt-2 ${pacingColor} opacity-70`}>{pacingLabel}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
