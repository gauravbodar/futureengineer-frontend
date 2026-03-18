import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessStore } from '../../store/assessStore'

const INTERESTS = [
  'Games',
  'Mobile apps',
  'AI tools',
  'Stories',
  'Simulations',
  'SaaS',
]

export default function AssessPage() {
  const navigate = useNavigate()
  const { setAge, setInterests } = useAssessStore()

  const [age, setLocalAge] = useState(13)
  const [selected, setSelected] = useState<string[]>([])

  const toggleInterest = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 3
        ? [...prev, interest]
        : prev
    )
  }

  const handleSubmit = () => {
    setAge(age)
    setInterests(selected)
    navigate('/assess/questions')
  }

  return (
    <div className="min-h-screen bg-off-white flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-body text-teal font-semibold text-sm uppercase tracking-widest mb-3">
            Free · 5 minutes · Instant results
          </p>
          <h1
            className="font-display font-extrabold text-navy leading-tight tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)' }}
          >
            Find out what you should build first.
          </h1>
          <p className="font-body text-gray-500 mt-3 text-lg">
            Tell us a little about yourself. We'll do the rest.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col gap-10">

          {/* Age slider */}
          <div>
            <label className="font-body font-semibold text-navy text-base mb-4 block">
              How old are you?
              <span className="ml-3 text-teal font-bold text-xl">{age}</span>
            </label>
            <input
              type="range"
              min={8}
              max={18}
              value={age}
              onChange={(e) => setLocalAge(Number(e.target.value))}
              className="w-full accent-teal h-2 rounded-full cursor-pointer"
            />
            <div className="flex justify-between mt-2 text-xs font-body text-gray-400">
              <span>8</span>
              <span>18</span>
            </div>
          </div>

          {/* Interest chips */}
          <div>
            <label className="font-body font-semibold text-navy text-base mb-1 block">
              What do you want to build?
            </label>
            <p className="font-body text-gray-400 text-sm mb-4">Pick up to 3.</p>
            <div className="flex flex-wrap gap-3">
              {INTERESTS.map((interest) => {
                const active = selected.includes(interest)
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full border text-sm font-body font-semibold transition-all ${
                      active
                        ? 'bg-teal text-white border-teal shadow-sm shadow-teal/20'
                        : 'bg-white text-navy border-gray-200 hover:border-teal/50 hover:text-teal'
                    }`}
                  >
                    {interest}
                  </button>
                )
              })}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleSubmit}
            disabled={selected.length === 0}
            className="w-full py-4 rounded-xl bg-teal text-white font-body font-bold text-lg transition-all hover:bg-teal-light hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-teal/20"
          >
            Find out what I should build →
          </button>
        </div>

        <p className="text-center text-gray-400 text-xs font-body mt-6">
          No account required. No credit card. Ever.
        </p>
      </div>
    </div>
  )
}
