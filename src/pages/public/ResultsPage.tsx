import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAssessStore } from '../../store/assessStore'
import { createCheckout } from '../../lib/api'

const TIER_STYLES: Record<string, { badge: string; bg: string; label: string }> = {
  spark: {
    badge: 'bg-amber/10 text-amber border border-amber/30',
    bg: 'bg-amber/5',
    label: '⚡ Spark',
  },
  maker: {
    badge: 'bg-teal/10 text-teal border border-teal/30',
    bg: 'bg-teal/5',
    label: '🔧 Maker',
  },
  creator: {
    badge: 'bg-navy text-white border border-navy',
    bg: 'bg-navy/5',
    label: '🚀 Creator',
  },
}

const DEFAULT_TIER = 'maker'

// Upsell copy varies by readiness signal
const UPSELL_COPY = {
  high: {
    eyebrow: 'Your build plan is ready.',
    headline: 'Start building today',
    urgency: 'Your build plan is ready. Start now.',
    cta: 'Start building today →',
    trust: 'Takes 5 minutes to set up · Cancel anytime',
  },
  medium: {
    eyebrow: 'Ready to start?',
    headline: 'Start building today',
    urgency: null,
    cta: 'Start building now →',
    trust: 'Cancel anytime · No commitment · Takes 5 minutes to set up',
  },
  low: {
    eyebrow: 'When you\'re ready',
    headline: 'Explore Creator Pro',
    urgency: null,
    cta: 'See what\'s included →',
    trust: 'Your 7-day build plan is on its way to your inbox.',
  },
}

export default function ResultsPage() {
  const navigate = useNavigate()
  const { report, tier, readiness, email } = useAssessStore()

  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  // Guard — redirect if store is empty
  useEffect(() => {
    if (!report) {
      navigate('/assess', { replace: true })
    }
  }, [report, navigate])

  if (!report) return null

  const tierKey = (tier ?? DEFAULT_TIER).toLowerCase()
  const tierStyle = TIER_STYLES[tierKey] ?? TIER_STYLES[DEFAULT_TIER]
  const readinessKey = readiness ?? 'medium'
  const upsell = UPSELL_COPY[readinessKey]

  const handleStartBuilding = async () => {
    setCheckoutLoading(true)
    setCheckoutError(null)
    try {
      const { url } = await createCheckout('creator_pro', email)
      window.location.href = url
    } catch {
      setCheckoutError('Could not start checkout. Please try again.')
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-off-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        {/* Top nav */}
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="font-body text-teal text-sm font-semibold hover:text-teal-light transition-colors">
            ← FutureEngineer
          </Link>
          <span className="font-body text-gray-400 text-sm">Your creator profile</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── LEFT (60%) — Profile ─────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-6">

            {/* Tier badge + headline */}
            <div className={`rounded-2xl border p-8 ${tierStyle.bg}`}>
              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-body font-bold mb-4 ${tierStyle.badge}`}>
                {tierStyle.label}
              </span>
              <h1
                className="font-display font-extrabold text-navy leading-tight tracking-tight"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
              >
                {report.headline || `You are a ${tierKey}-tier builder.`}
              </h1>
            </div>

            {/* Top 3 project ideas */}
            <div>
              <h2 className="font-display font-bold text-navy text-lg mb-4">
                Your top 3 project ideas
              </h2>
              <div className="flex flex-col gap-3">
                {report.projectIdeas.slice(0, 3).map((idea, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex gap-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center font-display font-bold text-teal text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-body font-semibold text-navy text-sm">{idea.title}</p>
                      <p className="font-body text-gray-500 text-sm mt-1 leading-relaxed">
                        {idea.description}
                      </p>
                      <p className="font-body text-teal text-xs font-semibold mt-2">
                        ⏱ {idea.timeEstimate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills tag cloud */}
            {report.skills.length > 0 && (
              <div>
                <h2 className="font-display font-bold text-navy text-lg mb-3">
                  Skills you'll earn
                </h2>
                <div className="flex flex-wrap gap-2">
                  {report.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-white border border-gray-200 font-body text-navy text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* First step */}
            {report.firstStep && (
              <div className="bg-teal/5 border border-teal/20 rounded-xl p-5">
                <p className="font-body text-teal font-semibold text-xs uppercase tracking-widest mb-2">
                  Your first step
                </p>
                <p className="font-body text-navy font-medium leading-relaxed">
                  {report.firstStep}
                </p>
              </div>
            )}
          </div>

          {/* ── RIGHT (40%) — Upsell card ────────────────────────────────────── */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-navy rounded-2xl p-8 flex flex-col gap-5 sticky top-8">

              {/* Heading */}
              <div>
                <p className={`font-body font-semibold text-xs uppercase tracking-widest mb-2 ${
                  readinessKey === 'high' ? 'text-amber-light' : 'text-teal-light'
                }`}>
                  {upsell.eyebrow}
                </p>
                <h2 className="font-display font-extrabold text-white text-2xl leading-tight">
                  {upsell.headline}
                </h2>
                {/* Urgency line — only for high readiness */}
                {upsell.urgency && (
                  <p className="font-body text-amber-light text-sm font-semibold mt-2">
                    {upsell.urgency}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-end gap-1">
                <span className="font-display font-extrabold text-white text-5xl">$19</span>
                <span className="font-body text-white/60 text-sm mb-1">/month</span>
              </div>

              {/* Value prop */}
              <p className="font-body text-white/70 text-sm leading-relaxed">
                Access all projects, AI mentor, community challenges,
                and your live portfolio. Cancel anytime.
              </p>

              {/* Feature list */}
              <ul className="flex flex-col gap-2">
                {[
                  'Atlas AI engineering mentor',
                  'All projects + monthly drops',
                  'Community challenges',
                  'Public portfolio URL',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 font-body text-white/80 text-sm">
                    <span className="text-teal-light flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={handleStartBuilding}
                disabled={checkoutLoading}
                className={`w-full py-4 rounded-xl font-body font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  readinessKey === 'high'
                    ? 'bg-amber-light text-navy hover:opacity-90'
                    : 'bg-teal-light text-white hover:bg-teal'
                }`}
              >
                {checkoutLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    Loading…
                  </span>
                ) : (
                  upsell.cta
                )}
              </button>

              {checkoutError && (
                <p className="text-red-400 text-xs font-body text-center">{checkoutError}</p>
              )}

              {/* Trust line */}
              <p className="font-body text-white/40 text-xs text-center leading-relaxed">
                {upsell.trust}
              </p>

              <div className="border-t border-white/10 pt-4">
                <p className="font-body text-white/50 text-xs text-center">
                  Join 200+ creators already building
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
