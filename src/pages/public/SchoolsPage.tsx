import { useState, FormEvent } from 'react'

const benefits = [
  {
    icon: '🏫',
    title: 'Cohort management',
    description: "Manage classes, assign projects, and track every student's progress in one admin view.",
  },
  {
    icon: '📊',
    title: 'Real-time progress reports',
    description: 'Teachers and administrators see live dashboards — projects published, skills gained, streaks kept.',
  },
  {
    icon: '🤖',
    title: 'AI mentors for every student',
    description: 'Every student gets access to Atlas, Maya, and all five AI agents — personalised to their tier.',
  },
  {
    icon: '🎓',
    title: 'Curriculum alignment',
    description: 'Mapped to CS and digital literacy standards. Spark, Maker, and Creator tiers match key stages.',
  },
]

export default function SchoolsPage() {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [emailVal, setEmailVal] = useState('')

  const handleDemo = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-off-white">

      {/* Hero */}
      <section className="bg-navy text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-body text-teal-light font-semibold text-sm uppercase tracking-widest mb-4">
            For Schools &amp; Programmes
          </p>
          <h1
            className="font-display font-extrabold leading-tight mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Bring AI creation into your school
          </h1>
          <p className="font-body text-white/70 max-w-2xl mx-auto text-lg mb-8">
            FutureEngineer Academy gives every student — aged 8 to 18 — the tools, mentors, and
            curriculum to build real digital products. Fully managed for teachers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#demo"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-teal font-body font-bold text-white text-lg hover:bg-teal-light transition-all shadow-lg shadow-teal/20"
            >
              Book a Demo
            </a>
            <a
              href="#demo"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-white/20 font-body font-semibold text-white/80 text-lg hover:border-white/40 hover:text-white transition-all"
            >
              Contact School Team
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-extrabold text-navy text-2xl text-center mb-10">
            Built for schools from day one
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3">
                <span className="text-3xl">{b.icon}</span>
                <h3 className="font-display font-bold text-navy text-lg">{b.title}</h3>
                <p className="font-body text-gray-500 text-sm">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing note */}
      <section className="py-8 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-body text-gray-500 text-lg">
            School licensing is priced per seat with volume discounts.{' '}
            <strong className="text-navy">Contact us for a custom quote</strong> — most schools get
            started within a week.
          </p>
        </div>
      </section>

      {/* Demo / Contact form */}
      <section id="demo" className="py-16 px-6">
        <div className="max-w-lg mx-auto">
          <h2 className="font-display font-extrabold text-navy text-2xl text-center mb-2">
            Get a school demo
          </h2>
          <p className="font-body text-gray-500 text-center mb-8">
            We'll walk you through the platform and tailor a plan to your school's needs.
          </p>

          {submitted ? (
            <div className="bg-teal/5 border border-teal/20 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="font-display font-bold text-navy text-xl mb-2">Request received!</h3>
              <p className="font-body text-gray-500">
                Thanks {name}! Our school team will be in touch within 1 business day.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleDemo}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col gap-5"
            >
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contactName" className="font-body font-semibold text-navy text-sm">
                  Your name
                </label>
                <input
                  id="contactName"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body text-navy focus:outline-none focus:border-teal transition-colors"
                  placeholder="Alex Johnson"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="schoolNameInput" className="font-body font-semibold text-navy text-sm">
                  School name
                </label>
                <input
                  id="schoolNameInput"
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body text-navy focus:outline-none focus:border-teal transition-colors"
                  placeholder="Greenfield Academy"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="contactEmail" className="font-body font-semibold text-navy text-sm">
                  Work email
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  required
                  value={emailVal}
                  onChange={(e) => setEmailVal(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body text-navy focus:outline-none focus:border-teal transition-colors"
                  placeholder="you@school.edu"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-teal text-white font-body font-bold text-lg hover:bg-teal-light transition-all shadow-md shadow-teal/20"
              >
                Book a Demo
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
