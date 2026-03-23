import { useAuth } from '../contexts/AuthContext'

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
]

function getQuote() {
  const day = Math.floor(Date.now() / 86400000)
  return quotes[day % quotes.length]
}

export default function LoginScreen() {
  const { signInWithGoogle, loading } = useAuth()
  const supabaseConfigured = !!import.meta.env.VITE_SUPABASE_URL
  const quote = getQuote()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent/[0.04] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple/[0.06] blur-[100px]" />
        <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-info/[0.03] blur-[80px]" />
      </div>

      {/* Decorative grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 text-center space-y-10 max-w-lg w-full">
        {/* Logo / Brand */}
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/10 shadow-[0_0_60px_rgba(212,168,83,0.1)]">
            <span className="text-4xl">🎯</span>
          </div>

          <div>
            <h1 className="text-5xl md:text-6xl font-extralight tracking-tight text-text">
              <span className="font-bold bg-gradient-to-r from-accent via-amber-300 to-accent bg-clip-text text-transparent">2026</span>
              <span className="block text-3xl md:text-4xl font-light mt-1 text-text/90">Goal Tracker</span>
            </h1>
            <p className="text-text-muted text-sm mt-4 max-w-xs mx-auto leading-relaxed">
              Track your ambitions. Measure your progress. Achieve what matters.
            </p>
          </div>
        </div>

        {/* Quote */}
        <div className="relative px-6">
          <div className="absolute left-0 top-0 text-4xl text-accent/20 font-serif leading-none">"</div>
          <blockquote className="text-text-secondary text-sm italic leading-relaxed pl-6">
            {quote.text}
          </blockquote>
          <p className="text-text-muted/60 text-xs mt-2 pl-6">— {quote.author}</p>
        </div>

        {/* Sign-in */}
        <div className="space-y-4 pt-2">
          {supabaseConfigured ? (
            <>
              <button
                onClick={signInWithGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium
                           py-3.5 px-6 rounded-2xl hover:bg-gray-50 transition-all duration-300 disabled:opacity-50
                           shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                           hover:scale-[1.01] active:scale-[0.99]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <p className="text-text-muted/40 text-xs">
                Your progress syncs across all your devices
              </p>
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-surface/80 backdrop-blur rounded-2xl p-5 border border-border text-left">
                <p className="text-sm text-text-muted leading-relaxed">
                  Cloud sync not configured. Your data will be stored locally in this browser.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-accent to-accent-dim text-bg font-semibold rounded-2xl
                           hover:opacity-90 transition-all shadow-[0_4px_24px_rgba(212,168,83,0.15)]"
              >
                Continue with Local Storage
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-text-muted/30 text-[11px] tracking-wider uppercase">
          Built for intentional living
        </p>
      </div>
    </div>
  )
}
