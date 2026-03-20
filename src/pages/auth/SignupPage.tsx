import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

type Role = 'creator' | 'parent'

export default function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('creator')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role } },
      })

      if (signUpError) {
        const msg = signUpError.message.toLowerCase()
        if (msg.includes('already registered') || msg.includes('already in use') || msg.includes('user already')) {
          setError('This email is already registered. Please log in instead.')
        } else {
          setError(signUpError.message)
        }
        return
      }

      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
          <div className="text-5xl mb-4">✉️</div>
          <h2 className="font-display font-extrabold text-navy text-2xl mb-3">Check your email</h2>
          <p className="font-body text-gray-500">
            We sent a verification link to <strong>{email}</strong>. Click it to verify your account,
            then come back to complete onboarding.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 px-6 py-3 rounded-xl bg-teal text-white font-body font-bold hover:bg-teal-light transition-colors"
          >
            Go to Log In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display font-extrabold text-navy text-3xl mb-2">Create your account</h1>
          <p className="font-body text-gray-500">Join FutureEngineer Academy — free to start</p>
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

          {/* Role selector */}
          <div className="flex flex-col gap-2">
            <span className="font-body font-semibold text-navy text-sm">I am a…</span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRole('creator')}
                className={`flex-1 py-3 rounded-xl border-2 font-body font-semibold text-sm transition-all ${
                  role === 'creator'
                    ? 'border-teal bg-teal/5 text-teal'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                🚀 Creator (student)
              </button>
              <button
                type="button"
                onClick={() => setRole('parent')}
                className={`flex-1 py-3 rounded-xl border-2 font-body font-semibold text-sm transition-all ${
                  role === 'parent'
                    ? 'border-teal bg-teal/5 text-teal'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                👨‍👩‍👧 Parent
              </button>
            </div>
          </div>

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
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="font-body font-semibold text-navy text-sm">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body text-navy focus:outline-none focus:border-teal transition-colors"
              placeholder="Min. 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-teal text-white font-body font-bold text-lg transition-all hover:bg-teal-light disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-teal/20 mt-1"
          >
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>

          <p className="text-center font-body text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-teal font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
