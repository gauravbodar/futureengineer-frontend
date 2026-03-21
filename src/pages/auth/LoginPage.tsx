import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'

const PORTAL = 'https://app.futureengineracademy.com'

export default function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 1. Authenticate — signIn updates the Zustand store; errors thrown here
      //    are caught below and shown inline, never surfaced as unhandled exceptions.
      await signIn(email, password)

      // 2. Session is now in the store (Zustand set() is synchronous)
      const { user, session } = useAuthStore.getState()

      if (!user || !session) {
        throw new Error('Sign-in succeeded but no session was returned.')
      }

      // 3. Check subscription status.  The user's JWT is already set on the
      //    supabase client after signIn, so this query runs under their identity.
      const { data: sub, error: subError } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .maybeSingle()

      if (subError) {
        // Network / RLS failure — don't redirect to portal blindly
        throw new Error('Could not verify subscription. Please try again.')
      }

      if (sub?.status === 'active') {
        // 4a. Active subscriber — hand off the session cross-domain via URL fragment.
        //     The portal's Supabase client (detectSessionInUrl: true by default) reads
        //     access_token + refresh_token from the hash and calls setSession() on init.
        const fragment = new URLSearchParams({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          token_type: 'bearer',
          expires_in: String(session.expires_in ?? 3600),
        }).toString()

        window.location.href = `${PORTAL}#${fragment}`
        // Don't setLoading(false) — the page is navigating away
        return
      }

      // 4b. Account exists but subscription is inactive / missing
      navigate('/pricing', {
        replace: true,
        state: { notice: 'Your account exists but has no active subscription.' },
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Invalid email or password'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display font-extrabold text-navy text-3xl mb-2">Welcome back</h1>
          <p className="font-body text-gray-500">Sign in to your FutureEngineer account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col gap-5"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-body">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="font-body font-semibold text-navy text-sm">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body text-navy focus:outline-none focus:border-teal transition-colors"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="font-body font-semibold text-navy text-sm">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body text-navy focus:outline-none focus:border-teal transition-colors"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-teal text-white font-body font-bold text-lg transition-all hover:bg-teal-light disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-teal/20 mt-1"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Signing in…
              </span>
            ) : (
              'Log In'
            )}
          </button>

          <p className="text-center font-body text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-teal font-semibold hover:underline">
              Sign up free
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
