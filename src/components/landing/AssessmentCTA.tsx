import { Link } from 'react-router-dom'

export default function AssessmentCTA() {
  return (
    <section className="py-24 px-6 bg-navy relative overflow-hidden">
      {/* Grid bg */}
      <div className="hero-grid absolute inset-0 pointer-events-none opacity-50" />

      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(15,110,86,0.15) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Headline */}
        <h2
          className="font-display font-extrabold text-white leading-tight tracking-tight mb-4"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
        >
          Find out what your child
          <br />
          <span className="text-teal-light">should build first.</span>
        </h2>

        {/* Sub */}
        <p className="font-body text-white/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          5-minute AI assessment. Personalised creator profile.
          Free — and credited toward your first month if you enrol.
        </p>

        {/* CTA */}
        <Link
          to="/assess"
          className="inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-teal font-body font-bold text-white text-xl transition-all hover:bg-teal-light hover:scale-105 shadow-xl shadow-teal/30"
        >
          Start the assessment
          <span>→</span>
        </Link>

        {/* Trust line */}
        <p className="mt-6 font-body text-white/40 text-sm">
          Instant results · No subscription required · Free assessment
        </p>
      </div>
    </section>
  )
}
