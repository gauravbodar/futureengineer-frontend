import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessStore } from '../../store/assessStore'

export default function AssessPage() {
  const navigate = useNavigate()
  const { setAge } = useAssessStore()

  const [age, setLocalAge] = useState(13)

  const handleSubmit = () => {
    setAge(age)
    navigate('/assess/questions')
  }

  const tierLabel =
    age <= 11 ? 'Spark' : age <= 14 ? 'Maker' : 'Creator'

  const tierDescription =
    age <= 11
      ? 'Ages 8–11 · Games, stories, and first builds'
      : age <= 14
      ? 'Ages 12–14 · Websites, apps, and real projects'
      : 'Ages 15–18 · AI tools, products, and real launches'

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

          {/* Age slider — Q1 */}
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

            {/* Tier preview */}
            <div className="mt-4 px-4 py-3 rounded-xl bg-teal/5 border border-teal/20 flex items-center gap-3">
              <span className="font-body font-bold text-teal text-sm">{tierLabel}</span>
              <span className="text-gray-300">·</span>
              <span className="font-body text-gray-500 text-sm">{tierDescription}</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-xl bg-teal text-white font-body font-bold text-lg transition-all hover:bg-teal-light hover:scale-[1.01] shadow-lg shadow-teal/20"
          >
            Next →
          </button>
        </div>

        <p className="text-center text-gray-400 text-xs font-body mt-6">
          No account required. No credit card. Ever.
        </p>
      </div>
    </div>
  )
}
