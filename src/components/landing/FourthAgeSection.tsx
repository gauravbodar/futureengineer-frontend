const eras = [
  {
    decade: '1920s',
    name: 'Radio',
    democratized: 'Voice',
    description: 'For the first time, one person could speak to millions. Broadcast was born.',
    icon: '📻',
    highlight: false,
  },
  {
    decade: '1950s',
    name: 'Television',
    democratized: 'Visual storytelling',
    description: 'Moving pictures entered every home. Culture could be shared, not just described.',
    icon: '📺',
    highlight: false,
  },
  {
    decade: '1980s',
    name: 'Computers',
    democratized: 'Creation',
    description: 'Anyone could write, design, code, and publish. The individual became a studio.',
    icon: '💻',
    highlight: false,
  },
  {
    decade: 'NOW',
    name: 'AI',
    democratized: 'Intelligence',
    description: 'Every kid can build software, generate designs, train models, and ship products — alone.',
    icon: '⚡',
    highlight: true,
    label: "Your child's age",
  },
]

export default function FourthAgeSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-teal font-semibold text-sm uppercase tracking-widest mb-4">
            Why now matters
          </p>
          <h2
            className="font-display font-extrabold text-navy leading-tight tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
          >
            The Fourth Age of Creation
          </h2>
          <p className="font-body text-gray-500 mt-4 max-w-xl mx-auto text-lg">
            Every generation gets one window where new tools reshape who gets to create.
            This is that window.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {eras.map((era) => (
            <div
              key={era.name}
              className={`relative rounded-2xl p-6 flex flex-col gap-3 transition-all ${
                era.highlight
                  ? 'bg-navy border-2 border-teal-light shadow-xl shadow-teal/10'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              {era.highlight && era.label && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-teal-light text-white text-xs font-body font-semibold whitespace-nowrap">
                  {era.label}
                </div>
              )}

              <div className="text-3xl">{era.icon}</div>

              <div>
                <span className={`text-xs font-body font-semibold uppercase tracking-widest ${era.highlight ? 'text-teal-light' : 'text-gray-400'}`}>
                  {era.decade}
                </span>
                <h3 className={`font-display font-bold text-xl mt-1 ${era.highlight ? 'text-white' : 'text-navy'}`}>
                  {era.name}
                </h3>
              </div>

              <div className={`text-sm font-body font-semibold ${era.highlight ? 'text-teal-light' : 'text-teal'}`}>
                Democratized {era.democratized}
              </div>

              <p className={`text-sm font-body leading-relaxed ${era.highlight ? 'text-white/70' : 'text-gray-500'}`}>
                {era.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
