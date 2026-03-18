import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessStore } from '../../store/assessStore'
import { generateQuestions, type Question } from '../../lib/api'

export default function QuestionsPage() {
  const navigate = useNavigate()
  const { age, interests, addAnswer } = useAssessStore()

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Guard — redirect if no age/interests in store
  useEffect(() => {
    if (age === null || interests.length === 0) {
      navigate('/assess', { replace: true })
    }
  }, [age, interests, navigate])

  // Fetch questions on mount
  useEffect(() => {
    if (age === null || interests.length === 0) return

    generateQuestions(age, interests)
      .then((data) => setQuestions(data.questions))
      .catch(() => setError('Could not load questions. Please try again.'))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const current = questions[currentIdx]
  const handleNext = () => {
    if (!answer.trim()) return
    setSubmitting(true)

    addAnswer({ questionId: current.id, answer: answer.trim() })

    const isLast = currentIdx === questions.length - 1
    if (isLast) {
      navigate('/assess/email')
    } else {
      setCurrentIdx((i) => i + 1)
      setAnswer('')
      setSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && answer.trim()) {
      e.preventDefault()
      handleNext()
    }
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex flex-col items-center justify-center gap-4 px-6">
        <div className="w-10 h-10 rounded-full border-4 border-teal border-t-transparent animate-spin" />
        <p className="font-body text-gray-500 text-sm">Personalising your questions…</p>
      </div>
    )
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-off-white flex flex-col items-center justify-center gap-4 px-6">
        <p className="font-body text-red-500">{error ?? 'No questions returned.'}</p>
        <button
          onClick={() => navigate('/assess')}
          className="px-6 py-3 rounded-xl bg-teal text-white font-body font-semibold"
        >
          Start over
        </button>
      </div>
    )
  }

  // ── Question screen ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-off-white flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl">

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between font-body text-sm text-gray-400 mb-2">
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <span>{Math.round(((currentIdx + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal rounded-full transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
          {/* Step dots */}
          <div className="flex justify-between mt-3">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i < currentIdx
                    ? 'bg-teal'
                    : i === currentIdx
                    ? 'bg-teal scale-125'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col gap-6">

          {/* Question text */}
          <div>
            <p className="font-body text-teal font-semibold text-xs uppercase tracking-widest mb-3">
              Question {currentIdx + 1}
            </p>
            <h2 className="font-display font-bold text-navy text-2xl leading-snug">
              {current.text}
            </h2>
          </div>

          {/* Answer input — choice chips or free text */}
          {current.options && current.options.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {current.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAnswer(opt)}
                  className={`px-4 py-2 rounded-full border text-sm font-body font-semibold transition-all ${
                    answer === opt
                      ? 'bg-teal text-white border-teal shadow-sm'
                      : 'bg-white text-navy border-gray-200 hover:border-teal/50 hover:text-teal'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer here…"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body text-navy text-base resize-none focus:outline-none focus:border-teal transition-colors"
            />
          )}

          {/* Next / Finish */}
          <button
            onClick={handleNext}
            disabled={!answer.trim() || submitting}
            className="w-full py-4 rounded-xl bg-teal text-white font-body font-bold text-lg transition-all hover:bg-teal-light disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {currentIdx === questions.length - 1 ? 'See my results →' : 'Next →'}
          </button>
        </div>

        {/* Back link */}
        {currentIdx > 0 && (
          <button
            onClick={() => { setCurrentIdx((i) => i - 1); setAnswer('') }}
            className="mt-4 mx-auto block font-body text-gray-400 text-sm hover:text-gray-600 transition-colors"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  )
}
