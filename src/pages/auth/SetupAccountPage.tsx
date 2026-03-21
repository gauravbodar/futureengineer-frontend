import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const API = import.meta.env.VITE_API_BASE_URL as string
const PORTAL_URL = 'https://app.futureengineracademy.com'

type Status =
  | { kind: 'loading' }
  | { kind: 'ready'; email: string; tier: string }
  | { kind: 'invalid'; message: string }
  | { kind: 'submitting' }
  | { kind: 'confirm_email'; email: string }
  | { kind: 'error'; message: string }

export default function SetupAccountPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''

  const [status, setStatus] = useState<Status>({ kind: 'loading' })
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)

  // Verify the token on mount
  useEffect(() => {
    if (!token) {
      setStatus({ kind: 'invalid', message: 'No setup token found in URL.' })
      return
    }

    fetch(`${API}/api/verify-setup-token?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (res.status === 404) throw new Error('This setup link is invalid or has already been used.')
        if (res.status === 410) throw new Error('This setup link has expired. Please contact support.')
        if (!res.ok) throw new Error('Unable to verify your setup link. Please try again.')
        return res.json() as Promise<{ email: string; tier: string }>
      })
      .then(({ email, tier }) => setStatus({ kind: 'ready', email, tier }))
      .catch((err: Error) => setStatus({ kind: 'invalid', message: err.message }))
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status.kind !== 'ready') return

    const { email } = status

    // Client-side validation
    if (!displayName.trim()) {
      setFieldError('Please enter a display name.')
      return
    }
    if (password.length < 8) {
      setFieldError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setFieldError('Passwords do not match.')
      return
    }

    setFieldError(null)
    setStatus({ kind: 'submitting' })

    try {
      // 1. Create Supabase auth account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName.trim() },
        },
      })

      if (signUpError) {
        throw new Error(signUpError.message)
      }

      const userId = signUpData.user?.id
      if (!userId) throw new Error('Account creation failed — no user ID returned.')

      // 2. Link subscription to this new Supabase user and mark token claimed
      const setupRes = await fetch(`${API}/api/complete-account-setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          supabase_user_id: userId,
          display_name: displayName.trim(),
        }),
      })

      if (!setupRes.ok) {
        const body = await setupRes.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error ?? 'Account setup failed.')
      }

      // 3. Sign in immediately
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

      if (signInError) {
        // Supabase email confirmation is likely required — let the user know
        if (signInError.message.toLowerCase().includes('email not confirmed')) {
          setStatus({ kind: 'confirm_email', email })
          return
        }
        throw new Error(signInError.message)
      }

      // 4. Redirect to the subscriber portal
      window.location.href = PORTAL_URL
    } catch (err) {
      setStatus({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      })
    }
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (status.kind === 'loading') {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-teal border-t-transparent animate-spin" />
          <p className="font-body text-gray-500 text-sm">Verifying your setup link…</p>
        </div>
      </div>
    )
  }

  // ── Invalid / expired ──────────────────────────────────────────────────────
  if (status.kind === 'invalid') {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
            <span className="text-4xl mb-4 block">🔒</span>
            <h1 className="font-display font-bold text-navy text-2xl mb-3">Link not valid</h1>
            <p className="font-body text-gray-500 text-base leading-relaxed mb-6">
              {status.message}
            </p>
            <a
              href="mailto:hello@futureengineracademy.com"
              className="font-body text-teal font-semibold text-sm hover:text-teal-light transition-colors"
            >
              Contact support →
            </a>
          </div>
        </div>
      </div>
    )
  }

  // ── Confirm email nudge ────────────────────────────────────────────────────
  if (status.kind === 'confirm_email') {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
            <span className="text-4xl mb-4 block">📬</span>
            <h1 className="font-display font-bold text-navy text-2xl mb-3">One more step</h1>
            <p className="font-body text-gray-500 text-base leading-relaxed mb-2">
              We've sent a confirmation email to
            </p>
            <p className="font-body font-semibold text-navy text-base mb-6">{status.email}</p>
            <p className="font-body text-gray-500 text-sm leading-relaxed">
              Click the link in that email, then{' '}
              <a href="/login" className="text-teal font-semibold hover:text-teal-light">
                sign in here
              </a>
              {' '}to access your account.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── Setup form (ready + submitting + error) ────────────────────────────────
  const email = status.kind === 'ready' ? status.email : ''
  const tier = status.kind === 'ready' ? status.tier : ''
  const isSubmitting = status.kind === 'submitting'
  const submitError = status.kind === 'error' ? status.message : null

  const tierLabel =
    tier === 'creator' ? '🚀 Creator' : tier === 'maker' ? '🔧 Maker' : '⚡ Spark'

  return (
    <div className="min-h-screen bg-off-white flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal/10 mb-6">
            <span className="text-3xl">🔑</span>
          </div>
          <h1
            className="font-display font-extrabold text-navy leading-tight tracking-tight"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 2.25rem)' }}
          >
            Set up your account
          </h1>
          <p className="font-body text-gray-500 mt-3 text-base leading-relaxed">
            Your payment was successful. Choose a display name and password to finish.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col gap-5"
        >
          {/* Tier badge */}
          <div className="flex items-center gap-3 pb-1">
            <span className="px-3 py-1 rounded-full bg-teal/10 text-teal text-xs font-body font-bold border border-teal/20">
              {tierLabel}
            </span>
            <span className="font-body text-gray-400 text-sm">Creator Pro · Active</span>
          </div>

          {/* Email — read only */}
          <div>
            <label className="font-body font-semibold text-navy text-sm block mb-2">
              Email address
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 font-body text-gray-500 text-base cursor-not-allowed"
            />
          </div>

          {/* Display name */}
          <div>
            <label htmlFor="display_name" className="font-body font-semibold text-navy text-sm block mb-2">
              Display name
            </label>
            <input
              id="display_name"
              type="text"
              value={displayName}
              onChange={(e) => { setDisplayName(e.target.value); setFieldError(null) }}
              placeholder="e.g. Alex"
              maxLength={50}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body text-navy text-base focus:outline-none focus:border-teal transition-colors"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="font-body font-semibold text-navy text-sm block mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldError(null) }}
              placeholder="At least 8 characters"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body text-navy text-base focus:outline-none focus:border-teal transition-colors"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="confirm" className="font-body font-semibold text-navy text-sm block mb-2">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setFieldError(null) }}
              placeholder="Same password again"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body text-navy text-base focus:outline-none focus:border-teal transition-colors"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Validation / submit error */}
          {(fieldError || submitError) && (
            <p className="text-red-500 text-sm font-body">
              {fieldError ?? submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-teal text-white font-body font-bold text-lg transition-all hover:bg-teal-light disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Creating your account…
              </span>
            ) : (
              'Create account & go to portal →'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
