const BASE_URL = import.meta.env.VITE_API_BASE_URL as string

// ── Shared types ───────────────────────────────────────────────────────────────

export type AgentId = 'larry' | 'maya' | 'atlas' | 'nova' | 'echo'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AgentConfig {
  id: AgentId
  name: string
  initial: string
  role: string
  tone: string
  avatarColor: string    // Tailwind bg class
  accentColor: string    // Tailwind text class
}

// ── Agent metadata ─────────────────────────────────────────────────────────────
// Imported by AgentSelector and AgentBadge — no class instantiation needed.

export const AGENT_CONFIGS: Record<AgentId, AgentConfig> = {
  larry: {
    id: 'larry',
    name: 'Larry',
    initial: 'L',
    role: 'Marketing Director',
    tone: 'Confident, creative, data-driven',
    avatarColor: 'bg-amber',
    accentColor: 'text-amber',
  },
  maya: {
    id: 'maya',
    name: 'Maya',
    initial: 'M',
    role: 'Curriculum Architect',
    tone: 'Warm, encouraging, detailed',
    avatarColor: 'bg-teal',
    accentColor: 'text-teal',
  },
  atlas: {
    id: 'atlas',
    name: 'Atlas',
    initial: 'A',
    role: 'Engineering Lead',
    tone: 'Precise, pragmatic, mentoring',
    avatarColor: 'bg-teal-light',
    accentColor: 'text-teal-light',
  },
  nova: {
    id: 'nova',
    name: 'Nova',
    initial: 'N',
    role: 'Community Manager',
    tone: 'Energetic, inclusive, hype',
    avatarColor: 'bg-amber-light',
    accentColor: 'text-amber-light',
  },
  echo: {
    id: 'echo',
    name: 'Echo',
    initial: 'E',
    role: 'Parent Success Agent',
    tone: 'Warm, clear, reassuring',
    avatarColor: 'bg-navy',
    accentColor: 'text-navy',
  },
}

// ── AgentChat class ────────────────────────────────────────────────────────────

export class AgentChat {
  readonly agentId: AgentId
  readonly config: AgentConfig
  readonly systemPromptPreview: string

  constructor(agentId: AgentId, systemPromptPreview: string) {
    this.agentId = agentId
    this.config = AGENT_CONFIGS[agentId]
    this.systemPromptPreview = systemPromptPreview
  }

  /** Non-streaming: returns the full reply once complete. */
  async sendMessage(message: string, history: ChatMessage[]): Promise<string> {
    const res = await fetch(`${BASE_URL}/api/agents/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId: this.agentId, message, history, stream: false }),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Agent API error ${res.status}: ${text}`)
    }
    const data = await res.json() as { content?: string; message?: string }
    return data.content ?? data.message ?? ''
  }

  /**
   * Streaming: yields tokens as they arrive via SSE.
   * Handles formats:
   *   data: {"token":"…"}          — token field
   *   data: {"delta":{"text":"…"}} — Anthropic streaming
   *   data: [DONE]                 — stream end sentinel
   */
  async *streamMessage(
    message: string,
    history: ChatMessage[],
    signal?: AbortSignal
  ): AsyncGenerator<string, void, unknown> {
    const res = await fetch(`${BASE_URL}/api/agents/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId: this.agentId, message, history, stream: true }),
      signal,
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Agent API error ${res.status}: ${text}`)
    }
    if (!res.body) throw new Error('No response body for streaming')

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data: ')) continue

          const payload = trimmed.slice(6)
          if (payload === '[DONE]') return

          try {
            const parsed = JSON.parse(payload) as {
              token?: string
              content?: string
              delta?: { text?: string }
            }
            const token =
              parsed.token ??
              parsed.content ??
              parsed.delta?.text ??
              ''
            if (token) yield token
          } catch {
            // Raw text — yield as-is if non-empty
            if (payload) yield payload
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }
}
