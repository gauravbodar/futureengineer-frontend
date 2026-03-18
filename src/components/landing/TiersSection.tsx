import { Link } from 'react-router-dom'

const tiers = [
  {
    name: 'Spark',
    ageRange: '8–12',
    color: 'amber',
    tagline: 'First sparks of creation',
    builds: 'Games, interactive stories, basic apps',
    exampleProject: 'A choose-your-own-adventure game with custom artwork',
    highlight: false,
  },
  {
    name: 'Maker',
    ageRange: '12–15',
    color: 'teal',
    tagline: 'Building with real tools',
    builds: 'Web apps, AI tools, simulations, SaaS prototypes',
    exampleProject: 'A browser-based AI quiz app that adapts to your score',
    highlight: false,
  },
  {
    name: 'Creator',
    ageRange: '15–18',
    color: 'navy',
    tagline: 'Shipping like a pro',
    builds: 'Full-stack products, AI agents, revenue-generating apps',
    exampleProject: 'A SaaS tool with Stripe billing that earns real money',
    highlight: true,
  },
]

const colorMap: Record<string, { badge: string; border: string; bg: string; text: string }> = {
  amber: {
    badge: 'bg-amber-light/20 text-amber',
    border: 'border-amber/30',
    bg: 'bg-white',
    text: 'text-amber',
  },
  teal: {
    badge: 'bg-teal/10 text-teal',
    border: 'border-teal/30',
    bg: 'bg-white',
    text: 'text-teal',
  },
  navy: {
    badge: 'bg-navy text-white',
    border: 'border-navy',
    bg: 'bg-navy',
    text: 'text-teal-light',
  },
}

export default function TiersSection() {
  return (
    <section className="py-24 px-6 bg-off-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-teal font-semibold text-sm uppercase tracking-widest mb-4">
            Every creator starts somewhere
          </p>
          <h2
            className="font-display font-extrabold text-navy leading-tight tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
          >
            Three tiers. One mission.
          </h2>
          <p className="font-body text-gray-500 mt-4 max-w-xl mx-auto text-lg">
            The assessment finds exactly where your child belongs — then the platform
            adapts to grow with them.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const c = colorMap[tier.color]
            return (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 border-2 flex flex-col gap-5 transition-all ${c.bg} ${c.border} ${
                  tier.highlight ? 'shadow-2xl shadow-navy/20 scale-[1.02]' : 'shadow-sm'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-teal-light text-white text-xs font-body font-semibold whitespace-nowrap">
                    Most popular
                  </div>
                )}

                {/* Tier badge + age */}
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm font-body font-bold ${c.badge}`}>
                    {tier.name}
                  </span>
                  <span className={`text-sm font-body font-semibold ${tier.highlight ? 'text-white/60' : 'text-gray-400'}`}>
                    Ages {tier.ageRange}
                  </span>
                </div>

                {/* Tagline */}
                <div>
                  <p className={`font-body font-semibold text-sm ${c.text}`}>{tier.tagline}</p>
                  <p className={`font-display font-bold text-xl mt-1 ${tier.highlight ? 'text-white' : 'text-navy'}`}>
                    They build
                  </p>
                  <p className={`font-body text-sm mt-1 ${tier.highlight ? 'text-white/70' : 'text-gray-500'}`}>
                    {tier.builds}
                  </p>
                </div>

                {/* Example project */}
                <div className={`rounded-xl p-4 ${tier.highlight ? 'bg-white/10' : 'bg-gray-50'}`}>
                  <p className={`text-xs font-body font-semibold uppercase tracking-widest mb-1 ${c.text}`}>
                    Example project
                  </p>
                  <p className={`text-sm font-body ${tier.highlight ? 'text-white/80' : 'text-gray-600'}`}>
                    {tier.exampleProject}
                  </p>
                </div>

                <Link
                  to="/assess"
                  className={`mt-auto text-center py-3 px-6 rounded-xl font-body font-semibold text-sm transition-all ${
                    tier.highlight
                      ? 'bg-teal-light text-white hover:bg-teal'
                      : 'border border-current text-inherit hover:bg-gray-50'
                  } ${tier.highlight ? '' : c.text}`}
                >
                  Find my tier →
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
