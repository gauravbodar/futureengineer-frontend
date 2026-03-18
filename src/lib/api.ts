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

export function generateQuestions(age: number, interests: string[]) {
  return post<{ questions: Question[] }>(
    '/api/generate-questions',
    { age, interests }
  )
}

export function scoreAnswers(answers: { questionId: string; answer: string }[]) {
  return post<{ tier: string; scores: Record<string, number> }>(
    '/api/score-answers',
    { answers }
  )
}

export function generateReport(
  scores: Record<string, number>,
  age: number,
  interests: string[]
) {
  return post<{
    tier: string
    headline: string
    projectIdeas: { title: string; description: string; timeEstimate: string }[]
    skills: string[]
    firstStep: string
  }>('/api/generate-report', { scores, age, interests })
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

export function createCheckout(planId: string) {
  return post<{ url: string }>('/api/create-checkout', { planId })
}

export function verifyPayment(sessionId: string) {
  return post<{ active: boolean; plan: string }>('/api/verify-payment', { sessionId })
}

// ── Portfolio ─────────────────────────────────────────────────────────────────

export function generatePortfolio(projectId: string, userId: string) {
  return post<{ entry: Record<string, unknown> }>(
    '/api/generate-portfolio',
    { projectId, userId }
  )
}
