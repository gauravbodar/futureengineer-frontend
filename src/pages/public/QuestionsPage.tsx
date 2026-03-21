import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessStore } from '../../store/assessStore'

// Q3 answer → interests array passed to the backend
const Q3_TO_INTERESTS: Record<string, string[]> = {
  'A game character or story': ['Games', 'Stories'],
  'A working website or app': ['Mobile apps', 'SaaS'],
  'A chatbot or AI tool': ['AI tools'],
  'A real product I could charge for': ['SaaS'],
}

type ChoiceQuestion = {
  id: string
  text: string
  type: 'choice'
  options: string[]
}

type TextQuestion = {
  id: string
  text: string
  type: 'text'
  placeholder: string
  minLength: number
  maxLength: number
}

type AnyQuestion = ChoiceQuestion | TextQuestion

const QUESTIONS: AnyQuestion[] = [
  {
    id: 'q2',
    text: 'Which of these sounds most like you right now?',
    type: 'choice',
    options: [
      'I have a specific idea I want to build',
      'I want to learn to code first',
      "I've already built something and want to go further",
      'I want to impress someone (college, job, parent)',
    ],
  },
  {
    id: 'q3',
    text: "Pick the closest to what you'd build in your first month:",
    type: 'choice',
    options: [
      'A game character or story',
      'A working website or app',
      'A chatbot or AI tool',
      'A real product I could charge for',
    ],
  },
  {
    id: 'q4',
    text: "What's your biggest blocker right now?",
    type: 'choice',
    options: [
      "I don't know where to start",
      "I've started but got stuck",
      'I need better tools',
      'Nothing — I just need access',
    ],
  },
  {
    id: 'q5',
    text: 'Describe what you want to build in one sentence:',
    type: 'text',
    placeholder: 'e.g. "A game where you collect stars and solve puzzles"',
    minLength: 10,
    maxLength: 200,
  },
]

export default function QuestionsPage() {
  const navigate = useNavigate()
  const { age, addAnswer, setInterests, setGoal, setSessionId } = useAssessStore()

  const [currentIdx, setCurrentIdx] = useState(0)
  const [answer, setAnswer] = useState('')

  // Guard — redirect if age not set
  useEffect(() => {
    if (age === null) {
      navigate('/assess', { replace: true })
    }
  }, [age, navigate])

  const current = QUESTIONS[currentIdx]
  const isChoice = current.type === 'choice'
  const isText = current.type === 'text'

  const isValid = isText
    ? answer.length >= (current as TextQuestion).minLength
    : answer !== ''

  const handleNext = () => {
    if (!isValid) return

    addAnswer({ questionId: current.id, answer })

    // Q3: derive interests from what the child wants to build
    if (current.id === 'q3') {
      setInterests(Q3_TO_INTERESTS[answer] ?? [])
    }

    // Q5: store the free-text build goal
    if (current.id === 'q5') {
      setGoal(answer)
    }

    const isLast = currentIdx === QUESTIONS.length - 1
    if (isLast) {
      // Generate session ID client-side — no longer depends on generate-questions API
      const raw = crypto.randomUUID().replace(/-/g, '').slice(0, 12)
      setSessionId(`sess_${raw}`)
      navigate('/assess/email')
    } else {
      setCurrentIdx((i) => i + 1)
      setAnswer('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && isValid) {
      e.preventDefault()
      handleNext()
    }
  }

  const totalSteps = QUESTIONS.length
  const progress = ((currentIdx + 1) / totalSteps) * 100

  return (
    <div className="min-h-screen bg-off-white flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl">

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between font-body text-sm text-gray-400 mb-2">
            <span>Question {currentIdx + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-3">
            {QUESTIONS.map((_, i) => (
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

        {/* Question card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col gap-6">

          <div>
            <p className="font-body text-teal font-semibold text-xs uppercase tracking-widest mb-3">
              Question {currentIdx + 1}
            </p>
            <h2 className="font-display font-bold text-navy text-2xl leading-snug">
              {current.text}
            </h2>
          </div>

          {/* Choice chips */}
          {isChoice && (
            <div className="flex flex-col gap-3">
              {(current as ChoiceQuestion).options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAnswer(opt)}
                  className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-body font-medium transition-all ${
                    answer === opt
                      ? 'bg-teal text-white border-teal shadow-sm'
                      : 'bg-white text-navy border-gray-200 hover:border-teal/50 hover:text-teal'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Free-text input */}
          {isText && (
            <div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value.slice(0, (current as TextQuestion).maxLength))}
                onKeyDown={handleKeyDown}
                placeholder={(current as TextQuestion).placeholder}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body text-navy text-base resize-none focus:outline-none focus:border-teal transition-colors"
              />
              <p className={`text-right text-xs font-body mt-1 ${
                answer.length < (current as TextQuestion).minLength ? 'text-gray-400' : 'text-teal'
              }`}>
                {answer.length} / {(current as TextQuestion).maxLength}
              </p>
            </div>
          )}

          {/* Next / Finish */}
          <button
            onClick={handleNext}
            disabled={!isValid}
            className="w-full py-4 rounded-xl bg-teal text-white font-body font-bold text-lg transition-all hover:bg-teal-light disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {currentIdx === QUESTIONS.length - 1 ? 'See my results →' : 'Next →'}
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
