const BASE_URL = import.meta.env.VITE_API_BASE_URL as string

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

// ── Assessment ────────────────────────────────────────────────────────────────

export interface Question {
  id: string
  text: string
  type: 'text' | 'choice' | 'slider'
  options?: string[]
}

// Shape returned by the backend before normalisation
interface BackendQuestion {
  id: string
  question: string          // backend field name
  question_type: 'multiple_choice' | 'yes_no'
  options?: string[]
  correct_answer?: string
  why_correct?: string
  hint?: string
  time_limit_seconds?: number
}

export function generateQuestions(age: number, interests: string[]) {
  return post<{ session_id: string; questions: BackendQuestion[] }>(
    '/api/generate-questions',
    { age, interests }
  ).then((data) => ({
    session_id: data.session_id,
    questions: data.questions.map((q): Question => ({
      id: q.id,
      text: q.question,   // normalise "question" → "text"
      type: q.question_type === 'multiple_choice' ? 'choice' : 'text',
      options: q.options,
    })),
  }))
}

interface BackendProjectIdea {
  title: string
  description: string
  time_estimate: string
  skills: string[]
}

interface ScoreAnswersResponse {
  session_id: string
  tier: string
  readiness: 'high' | 'medium' | 'low'
  score: number
  score_out_of: number
  strengths: string[]
  project_ideas: BackendProjectIdea[]
  creator_profile_summary: string
}

export function scoreAnswers(params: {
  sessionId: string
  age: number
  interests: string[]
  goal?: string
  answers: { questionId: string; answer: string }[]
}) {
  const payload = {
    session_id: params.sessionId,
    age: params.age,
    interests: params.interests,
    goal: params.goal ?? 'build something cool',
    // map camelCase questionId → snake_case question_id to match backend spec
    answers: params.answers.map((a) => ({ question_id: a.questionId, answer: a.answer })),
  }
  console.log('[scoreAnswers] payload:', JSON.stringify(payload, null, 2))
  return post<ScoreAnswersResponse>('/api/score-answers', payload)
}

export function generateReport(scored: ScoreAnswersResponse, age: number, interests: string[]) {
  return post<{
    session_id: string
    tier: string
    headline: string
    first_step: string
    skills_to_earn: string[]
    learning_path: { week: number; focus: string; project: string }[]
    encouragement: string
  }>('/api/generate-report', {
    session_id: scored.session_id,
    tier: scored.tier,
    age,
    interests,
    project_ideas: scored.project_ideas,
    creator_profile_summary: scored.creator_profile_summary,
  })
}

/** Fire-and-forget — call without await */
export function scheduleNurture(
  email: string,
  tier: string,
  topProjectIdea: string
): void {
  post('/api/schedule-nurture', { email, tier, topProjectIdea }).catch(() => {
    // intentional no-op — nurture failure must never block the UI
  })
}

// ── Checkout ──────────────────────────────────────────────────────────────────

export function createCheckout(plan: string, email: string) {
  return post<{ url: string }>('/api/create-checkout', { plan, email })
}

export function verifyPayment(sessionId: string) {
  return post<{ active: boolean; plan: string }>('/api/verify-payment', { sessionId })
}

// ── Echo weekly report ────────────────────────────────────────────────────────

export function sendWeeklyReport(childId: string, parentEmail: string) {
  return post<{ sent: boolean }>('/api/agents/echo/weekly-report', {
    childId,
    parentEmail,
  })
}

// ── Portfolio ─────────────────────────────────────────────────────────────────

export function generatePortfolio(projectId: string, userId: string) {
  return post<{ entry: Record<string, unknown> }>(
    '/api/generate-portfolio',
    { projectId, userId }
  )
}
