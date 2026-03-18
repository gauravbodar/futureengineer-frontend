const agents = [
  {
    id: 'larry',
    name: 'Larry',
    initial: 'L',
    role: 'Marketing Director',
    description: 'Writes campaigns, landing copy, emails, and social scripts. Confident, creative, data-driven.',
    accent: 'bg-amber text-white',
    cardAccent: 'border-amber/20',
  },
  {
    id: 'maya',
    name: 'Maya',
    initial: 'M',
    role: 'Curriculum Architect',
    description: 'Designs lessons, projects, and learning paths. Warm, encouraging, and always detailed.',
    accent: 'bg-teal text-white',
    cardAccent: 'border-teal/20',
  },
  {
    id: 'atlas',
    name: 'Atlas',
    initial: 'A',
    role: 'Engineering Lead',
    description: 'Writes code, reviews builds, scaffolds projects, and mentors kids through debugging.',
    accent: 'bg-teal-light text-white',
    cardAccent: 'border-teal-light/20',
  },
  {
    id: 'nova',
    name: 'Nova',
    initial: 'N',
    role: 'Community Manager',
    description: 'Creates challenge briefs, hypes community wins, and keeps the energy electric.',
    accent: 'bg-amber-light text-white',
    cardAccent: 'border-amber-light/20',
  },
  {
    id: 'echo',
    name: 'Echo',
    initial: 'E',
    role: 'Parent Success Agent',
    description: 'Sends progress reports, answers parent questions, and keeps families in the loop.',
    accent: 'bg-white/20 text-white border border-white/30',
    cardAccent: 'border-white/10',
  },
]

export default function AgentTeamSection() {
  return (
    <section className="py-24 px-6 bg-navy">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-teal-light font-semibold text-sm uppercase tracking-widest mb-4">
            AI that works for your kid
          </p>
          <h2
            className="font-display font-extrabold text-white leading-tight tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
          >
            Meet the agent team
          </h2>
          <p className="font-body text-white/60 mt-4 max-w-xl mx-auto text-lg">
            Five specialised AI agents. Each one expert in their domain.
            Together they run the whole platform.
          </p>
        </div>

        {/* Agent cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`rounded-2xl p-6 border bg-white/5 flex flex-col gap-4 transition-all hover:bg-white/10 ${agent.cardAccent}`}
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-xl flex-shrink-0 ${agent.accent}`}>
                  {agent.initial}
                </div>
                <div>
                  <p className="font-display font-bold text-white text-lg leading-tight">{agent.name}</p>
                  <p className="font-body text-white/50 text-sm">{agent.role}</p>
                </div>
              </div>

              {/* Description */}
              <p className="font-body text-white/70 text-sm leading-relaxed">
                {agent.description}
              </p>
            </div>
          ))}

          {/* Fifth agent spans full width on medium / fills last slot on lg */}
        </div>
      </div>
    </section>
  )
}
