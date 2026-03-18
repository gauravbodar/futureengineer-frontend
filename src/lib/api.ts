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

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

// Assessment endpoints
export function generateQuestions(age: number, interests: string[]) {
  return post<{ questions: { id: string; text: string; type: string }[] }>(
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

export function generateReport(scores: Record<string, number>, age: number, interests: string[]) {
  return post<{
    tier: string
    headline: string
    projectIdeas: { title: string; description: string; timeEstimate: string }[]
    skills: string[]
    firstStep: string
  }>(
    '/api/generate-report',
    { scores, age, interests }
  )
}

export function generatePortfolio(projectId: string, userId: string) {
  return post<{ entry: Record<string, unknown> }>(
    '/api/generate-portfolio',
    { projectId, userId }
  )
}

// Subscription / payment endpoints
export function createCheckout(priceId: string, userId: string) {
  return post<{ url: string }>(
    '/api/create-checkout',
    { priceId, userId }
  )
}

export function verifyPayment(sessionId: string) {
  return post<{ active: boolean; plan: string }>(
    '/api/verify-payment',
    { sessionId }
  )
}

// Nurture sequence (email gate)
export function scheduleNurture(
  email: string,
  data: { answers: unknown[]; tier: string; topProjectIdea: string }
) {
  return post<{ scheduled: boolean }>(
    '/api/schedule-nurture',
    { email, ...data }
  )
}

// Webhook — called by Stripe, not directly by the frontend
// Exposed here for completeness / admin use
export function getWebhookStatus() {
  return get<{ ok: boolean }>('/api/webhook')
}
