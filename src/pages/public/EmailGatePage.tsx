import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessStore } from '../../store/assessStore'
import { scoreAnswers, generateReport, scheduleNurture } from '../../lib/api'
import { useEffect } from 'react'

export default function EmailGatePage() {
  const navigate = useNavigate()
  const {
    age,
    interests,
    goal,
    answers,
    sessionId,
    setEmail,
    setTier,
    setReadiness,
    setReport,
    setTopProjectIdea,
  } = useAssessStore()

  const [email, setLocalEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Guard — redirect if there are no answers
  useEffect(() => {
    if (answers.length === 0) {
      navigate('/assess', { replace: true })
    }
  }, [answers, navigate])

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // a. Persist email
      setEmail(email)

      // b. Score answers — send all required fields
      if (!sessionId) throw new Error('Session ID missing — please restart the assessment.')
      const scored = await scoreAnswers({
        sessionId,
        age: age ?? 13,
        interests,
        goal: goal || 'build something cool',
        answers,
      })
      setTier(scored.tier)
      setReadiness(scored.readiness)

      // c. Generate full report
      const reportData = await generateReport(scored, age ?? 13, interests)

      // d. Merge into the Report shape the store and ResultsPage expect
      setReport({
        tier: scored.tier,
        headline: reportData.headline,
        projectIdeas: scored.project_ideas.map((p) => ({
          title: p.title,
          description: p.description,
          timeEstimate: p.time_estimate,
        })),
        skills: reportData.skills_to_earn,
        firstStep: reportData.first_step,
      })

      // e. Derive topProjectIdea from first project idea title
      const topIdea = scored.project_ideas[0]?.title ?? ''
      setTopProjectIdea(topIdea)

      // f. Send results email — await so we can surface failures
      await scheduleNurture(email, scored.tier, topIdea)

      // g. Route to results
      navigate('/assess/results')
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.toLowerCase().includes('resend') || msg.toLowerCase().includes('send') || msg.toLowerCase().includes('email')) {
        setError("We couldn't send your results. Please check your email address and try again.")
      } else {
        setError('Something went wrong. Please try again.')
      }
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-off-white flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal/10 mb-6">
            <span className="text-3xl">✨</span>
          </div>
          <h1
            className="font-display font-extrabold text-navy leading-tight tracking-tight"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}
          >
            Your Creator Profile is ready
          </h1>
          <p className="font-body text-gray-500 mt-3 text-lg leading-relaxed">
            Where should we send it? You'll also get your personalised
            7-day build plan.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col gap-5">

          <div>
            <label htmlFor="email" className="font-body font-semibold text-navy text-sm block mb-2">
              Your email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setLocalEmail(e.target.value); setError(null) }}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body text-navy text-base focus:outline-none focus:border-teal transition-colors"
              disabled={loading}
              required
            />
            {error && (
              <p className="mt-2 text-red-500 text-sm font-body">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-4 rounded-xl bg-teal text-white font-body font-bold text-lg transition-all hover:bg-teal-light disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Building your profile…
              </span>
            ) : (
              'Show my results →'
            )}
          </button>

          <p className="text-center font-body text-gray-400 text-xs leading-relaxed">
            No spam. Unsubscribe any time.
            We only send things about your build plan.
          </p>
        </form>
      </div>
    </div>
  )
}
