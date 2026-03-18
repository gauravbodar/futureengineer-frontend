const pillars = [
  {
    icon: '🔒',
    name: 'Safety',
    points: [
      'COPPA compliant — under-13 requires verifiable parental consent',
      'All kid content is moderated by AI before going public',
      'No direct kid-to-kid messaging without parent opt-in',
      'Zero third-party tracking on kid-facing routes',
    ],
    accent: 'text-teal border-teal/20',
    label: 'Built in',
  },
  {
    icon: '📈',
    name: 'Progress',
    points: [
      'Echo sends a weekly progress report straight to your inbox',
      'Skill tracking across Engineering, Design, AI, Product, and Business',
      'You see exactly what your child built, published, and learned',
      'Parent dashboard — always-on visibility, zero friction',
    ],
    accent: 'text-amber border-amber/20',
    label: 'Always on',
  },
  {
    icon: '🌐',
    name: 'Portfolio',
    points: [
      'Every published project gets a real, shareable public URL',
      'Projects are portfolio-ready for college applications',
      'Atlas documents each project automatically',
      'Skills are visible, verifiable, and provably real',
    ],
    accent: 'text-navy border-navy/20',
    label: 'Real output',
  },
]

export default function ParentTrustSection() {
  return (
    <section id="parent-section" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-teal font-semibold text-sm uppercase tracking-widest mb-4">
            For parents
          </p>
          <h2
            className="font-display font-extrabold text-navy leading-tight tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
          >
            You stay in control.
            <br />
            <span className="text-teal">They build freely.</span>
          </h2>
          <p className="font-body text-gray-500 mt-4 max-w-xl mx-auto text-lg">
            FutureEngineer is designed so parents always know what's happening —
            without needing to look over anyone's shoulder.
          </p>
        </div>

        {/* Three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <div key={pillar.name} className={`rounded-2xl border p-8 flex flex-col gap-5 ${pillar.accent}`}>
              {/* Icon + title */}
              <div>
                <div className="text-4xl mb-4">{pillar.icon}</div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-display font-bold text-navy text-2xl">{pillar.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold bg-current/10 ${pillar.accent.split(' ')[0]}`}>
                    {pillar.label}
                  </span>
                </div>
              </div>

              {/* Points */}
              <ul className="flex flex-col gap-3">
                {pillar.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className={`mt-0.5 text-sm flex-shrink-0 ${pillar.accent.split(' ')[0]}`}>✓</span>
                    <span className="font-body text-gray-600 text-sm leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
