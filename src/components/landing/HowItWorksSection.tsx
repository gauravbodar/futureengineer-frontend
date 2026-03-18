const steps = [
  {
    number: '01',
    name: 'Create',
    description: 'Pick a project that matches your tier. Atlas scaffolds the structure so you start building immediately, not planning.',
    agent: 'Atlas',
    agentColor: 'bg-teal/10 text-teal',
  },
  {
    number: '02',
    name: 'Publish',
    description: 'Ship your project to the platform. Atlas reviews your code, generates docs, and gives you a public portfolio URL.',
    agent: 'Atlas + Nova',
    agentColor: 'bg-teal/10 text-teal',
  },
  {
    number: '03',
    name: 'Showcase',
    description: 'Your project lives on a real public URL. Nova announces it to the community. Echo sends your parents a milestone message.',
    agent: 'Nova + Echo',
    agentColor: 'bg-amber/10 text-amber',
  },
  {
    number: '04',
    name: 'Evolve',
    description: 'Maya logs your progress and unlocks the next challenge. Your skills compound. Your portfolio grows.',
    agent: 'Maya',
    agentColor: 'bg-navy/10 text-navy',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-teal font-semibold text-sm uppercase tracking-widest mb-4">
            The platform in action
          </p>
          <h2
            className="font-display font-extrabold text-navy leading-tight tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
          >
            How it works
          </h2>
          <p className="font-body text-gray-500 mt-4 max-w-xl mx-auto text-lg">
            Four steps. AI at every one. Real output at the end.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, i) => (
            <div key={step.name} className="flex gap-6">
              {/* Number */}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center">
                  <span className="font-display font-bold text-teal-light text-lg">{step.number}</span>
                </div>
                {/* Connector line — only for first two (left col) */}
                {i < steps.length - 1 && (
                  <div className="w-px h-full bg-gray-100 mx-auto mt-2 hidden" />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-display font-bold text-navy text-xl">{step.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold ${step.agentColor}`}>
                    {step.agent}
                  </span>
                </div>
                <p className="font-body text-gray-500 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
