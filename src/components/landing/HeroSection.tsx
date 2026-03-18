import { Link } from 'react-router-dom'

export default function HeroSection() {
  const scrollToParent = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById('parent-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy">
      {/* Animated grid overlay */}
      <div className="hero-grid absolute inset-0 pointer-events-none" />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(15,110,86,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/60 text-sm font-body mb-8">
          <span className="w-2 h-2 rounded-full bg-teal-light animate-pulse" />
          The Fourth Age of Creation is here
        </div>

        {/* Headline */}
        <h1
          className="font-display font-extrabold text-white mb-6 leading-[1.05] tracking-tight"
          style={{ fontSize: 'clamp(2.8rem, 8vw, 5.5rem)' }}
        >
          The tools to build anything.
          <br />
          <span className="text-teal-light">At any age.</span>
        </h1>

        {/* Sub */}
        <p className="font-body text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
          AI-powered creation platform for kids who make real things —
          apps, games, AI agents, products that actually work.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/assess"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-teal font-body font-semibold text-white text-lg transition-all hover:bg-teal-light hover:scale-105 shadow-lg shadow-teal/20"
          >
            Take the Creator Assessment — Free
            <span className="text-xl">→</span>
          </Link>
          <a
            href="#parent-section"
            onClick={scrollToParent}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 font-body font-semibold text-white/80 text-lg transition-all hover:border-white/40 hover:text-white hover:bg-white/5"
          >
            I'm a parent — show me more
          </a>
        </div>

        {/* Trust micro-copy */}
        <p className="mt-6 text-white/40 text-sm font-body">
          Free · 5 minutes · Instant results
        </p>
      </div>

      {/* Bottom fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #ffffff)' }}
      />
    </section>
  )
}
