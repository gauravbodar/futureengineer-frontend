import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const role = user?.user_metadata?.role ?? 'creator'
  const isParent = role === 'parent'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!displayName.trim()) return
    setSaving(true)
    try {
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          username: displayName.trim(),
          role,
          updated_at: new Date().toISOString(),
        })
      }
      navigate(isParent ? '/parent/dashboard' : '/dashboard', { replace: true })
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <p className="font-body text-teal font-semibold text-sm uppercase tracking-widest mb-2">
            {isParent ? 'Parent Setup' : 'Creator Setup'}
          </p>
          <h1 className="font-display font-extrabold text-navy text-3xl mb-2">
            {isParent ? 'Set up your parent account' : 'Set up your creator profile'}
          </h1>
          <p className="font-body text-gray-500">
            {isParent
              ? 'Tell us your name so we can personalise your dashboard and progress reports.'
              : 'Choose a display name that will appear on your portfolio and projects.'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col gap-6"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-body">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="displayName" className="font-body font-semibold text-navy text-sm">
              {isParent ? 'Your name' : 'Display name / handle'}
            </label>
            <input
              id="displayName"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body text-navy focus:outline-none focus:border-teal transition-colors"
              placeholder={isParent ? 'e.g. Alex Johnson' : 'e.g. CodeWizard42'}
            />
            {!isParent && (
              <p className="text-xs font-body text-gray-400">
                This will be your public @handle. Choose something fun.
              </p>
            )}
          </div>

          {/* Role confirmation badge */}
          <div className="flex items-center gap-3 px-4 py-3 bg-teal/5 rounded-xl border border-teal/20">
            <span className="text-2xl">{isParent ? '👨‍👩‍👧' : '🚀'}</span>
            <div>
              <p className="font-body font-semibold text-navy text-sm">
                {isParent ? 'Parent account' : 'Creator account'}
              </p>
              <p className="font-body text-gray-500 text-xs">
                {isParent
                  ? "You'll see your child's progress, skills and weekly reports."
                  : "You'll build real projects with AI mentors and showcase your work."}
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || !displayName.trim()}
            className="w-full py-3.5 rounded-xl bg-teal text-white font-body font-bold text-lg transition-all hover:bg-teal-light disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-teal/20"
          >
            {saving ? 'Saving…' : isParent ? 'Go to Parent Dashboard' : 'Start Building'}
          </button>
        </form>
      </div>
    </div>
  )
}
