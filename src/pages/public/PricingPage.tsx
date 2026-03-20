import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Creator Pro',
    price: '$19',
    period: '/month',
    description: 'For young builders who want to ship real products with AI mentorship.',
    features: [
      'Unlimited projects',
      'Full AI mentor access (Atlas, Maya, Nova)',
      'Portfolio & publishing',
      'Streak tracking & achievements',
      'Priority support',
    ],
    cta: 'Start Building',
    ctaHref: '/assess',
    highlight: true,
  },
  {
    name: 'Family',
    price: '$29',
    period: '/month',
    description: 'All builder features for your child — plus a parent dashboard so you see everything.',
    features: [
      'All builder features included',
      'Parent progress dashboard',
      'Weekly email reports',
      'Echo parent AI assistant',
      'Up to 3 children',
    ],
    cta: 'Get Started',
    ctaHref: '/assess',
    highlight: false,
  },
  {
    name: 'School',
    price: 'Contact us',
    period: '',
    description: 'Cohort licensing for institutions and coding programmes with admin controls.',
    features: [
      'Volume seat pricing',
      'Admin dashboard',
      'Cohort & class management',
      'Curriculum alignment tools',
      'Dedicated onboarding',
    ],
    cta: 'Get a Demo',
    ctaHref: '/schools',
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-off-white py-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-body text-teal font-semibold text-sm uppercase tracking-widest mb-3">
            Simple pricing
          </p>
          <h1
            className="font-display font-extrabold text-navy leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
          >
            Invest in your kid's future
          </h1>
          <p className="font-body text-gray-500 max-w-xl mx-auto text-lg">
            Start with a free assessment. No credit card needed. Upgrade when you're ready.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col gap-6 ${
                plan.highlight
                  ? 'bg-navy text-white shadow-xl shadow-navy/20 ring-2 ring-teal'
                  : 'bg-white border border-gray-100 shadow-sm'
              }`}
            >
              {/* Plan name & price */}
              <div>
                <p className={`font-body font-semibold text-sm uppercase tracking-widest mb-2 ${
                  plan.highlight ? 'text-teal-light' : 'text-teal'
                }`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-3">
                  <span className={`font-display font-extrabold text-4xl ${
                    plan.highlight ? 'text-white' : 'text-navy'
                  }`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`font-body text-base mb-1 ${
                      plan.highlight ? 'text-white/60' : 'text-gray-400'
                    }`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={`font-body text-sm ${plan.highlight ? 'text-white/70' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 font-body text-sm">
                    <span className="text-teal mt-0.5">✓</span>
                    <span className={plan.highlight ? 'text-white/80' : 'text-gray-600'}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to={plan.ctaHref}
                className={`mt-auto w-full py-3 rounded-xl font-body font-bold text-center text-sm transition-all ${
                  plan.highlight
                    ? 'bg-teal text-white hover:bg-teal-light shadow-md shadow-teal/30'
                    : 'bg-navy text-white hover:bg-navy/90'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ micro-copy */}
        <p className="text-center font-body text-gray-400 text-sm mt-10">
          All plans include a free assessment · Cancel anytime · Secure payment via Stripe
        </p>
      </div>
    </div>
  )
}
