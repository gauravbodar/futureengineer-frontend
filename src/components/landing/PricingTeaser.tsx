import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Creator Pro',
    price: '$19',
    period: '/mo',
    tagline: 'Everything a kid needs to build, ship, and grow.',
    features: [
      'All projects + new drops monthly',
      'Atlas AI engineering mentor',
      'Community challenges',
      'Public portfolio URL',
    ],
    cta: 'Start building',
    ctaTo: '/signup',
    highlight: true,
  },
  {
    name: 'Family',
    price: '$29',
    period: '/mo',
    tagline: 'One subscription for every kid in the house.',
    features: [
      'Up to 3 children',
      'Parent dashboard for each',
      'Echo weekly reports',
      'Shared family portfolio',
    ],
    cta: 'Get family plan',
    ctaTo: '/pricing',
    highlight: false,
  },
  {
    name: 'School',
    price: 'From $499',
    period: '',
    tagline: 'License for classrooms, clubs, and after-school programs.',
    features: [
      'Unlimited students per cohort',
      'Teacher dashboard + admin tools',
      'Curriculum aligned to CS standards',
      'Custom school portfolio page',
    ],
    cta: 'Book a demo',
    ctaTo: '/schools',
    highlight: false,
  },
]

export default function PricingTeaser() {
  return (
    <section className="py-24 px-6 bg-off-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-teal font-semibold text-sm uppercase tracking-widest mb-4">
            Simple pricing
          </p>
          <h2
            className="font-display font-extrabold text-navy leading-tight tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
          >
            Start free. Grow at your pace.
          </h2>
          <p className="font-body text-gray-500 mt-4 max-w-xl mx-auto text-lg">
            Every plan unlocks the full platform. No feature gating.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col gap-5 border-2 transition-all ${
                plan.highlight
                  ? 'bg-navy border-teal-light shadow-2xl shadow-navy/20 scale-[1.02]'
                  : 'bg-white border-gray-100 shadow-sm'
              }`}
            >
              {/* Name + price */}
              <div>
                <p className={`font-body font-semibold text-sm ${plan.highlight ? 'text-teal-light' : 'text-teal'}`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mt-1">
                  <span className={`font-display font-extrabold text-4xl ${plan.highlight ? 'text-white' : 'text-navy'}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`font-body text-sm mb-1 ${plan.highlight ? 'text-white/60' : 'text-gray-400'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={`font-body text-sm mt-2 ${plan.highlight ? 'text-white/70' : 'text-gray-500'}`}>
                  {plan.tagline}
                </p>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className={`text-sm flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-teal-light' : 'text-teal'}`}>✓</span>
                    <span className={`font-body text-sm ${plan.highlight ? 'text-white/80' : 'text-gray-600'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to={plan.ctaTo}
                className={`mt-2 text-center py-3 px-6 rounded-xl font-body font-semibold text-sm transition-all ${
                  plan.highlight
                    ? 'bg-teal-light text-white hover:bg-teal'
                    : 'border border-navy text-navy hover:bg-navy hover:text-white'
                }`}
              >
                {plan.cta} →
              </Link>
            </div>
          ))}
        </div>

        {/* Link to full pricing */}
        <div className="text-center mt-10">
          <Link
            to="/pricing"
            className="font-body text-teal font-semibold hover:text-teal-light transition-colors text-sm"
          >
            See full pricing details →
          </Link>
        </div>
      </div>
    </section>
  )
}
