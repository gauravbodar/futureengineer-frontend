import { useState, useEffect, useRef, useCallback } from 'react'
import { AGENT_CONFIGS, type AgentId, type ChatMessage } from '../../lib/agents/base'
import { larry } from '../../lib/agents/larry'
import { maya } from '../../lib/agents/maya'
import { atlas } from '../../lib/agents/atlas'
import { nova } from '../../lib/agents/nova'
import { echo } from '../../lib/agents/echo'
import type { AgentChat as AgentChatClass } from '../../lib/agents/base'

const AGENT_INSTANCES: Record<AgentId, AgentChatClass> = { larry, maya, atlas, nova, echo }

const STORAGE_KEY = (id: AgentId) => `fe-agent-history-${id}`

interface AgentChatProps {
  agentId: AgentId
  /** Extra context injected into every request (project data, student profile, etc.) */
  context?: string
  suggestedActions?: string[]
}

// ── Typing indicator ───────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <span className="inline-flex items-end gap-1 h-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}

// ── Message bubble ─────────────────────────────────────────────────────────────
function MessageBubble({
  msg,
  agentId,
}: {
  msg: ChatMessage
  agentId: AgentId
}) {
  const cfg = AGENT_CONFIGS[agentId]
  const isUser = msg.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {!isUser && (
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-display font-bold text-xs text-white ${cfg.avatarColor}`}
        >
          {cfg.initial}
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl font-body text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-teal text-white rounded-tr-sm'
            : 'bg-white border border-gray-100 text-navy rounded-tl-sm shadow-sm'
        }`}
      >
        {msg.content}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function AgentChat({
  agentId,
  context,
  suggestedActions = [],
}: AgentChatProps) {
  const cfg = AGENT_CONFIGS[agentId]
  const agent = AGENT_INSTANCES[agentId]

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const mountedRef = useRef(true)

  // Restore history from localStorage on agent switch
  useEffect(() => {
    mountedRef.current = true
    const stored = localStorage.getItem(STORAGE_KEY(agentId))
    if (stored) {
      try {
        setMessages(JSON.parse(stored) as ChatMessage[])
      } catch {
        setMessages([])
      }
    } else {
      setMessages([])
    }
    setStreamingContent('')
    setIsStreaming(false)
    setError(null)

    return () => {
      mountedRef.current = false
      abortRef.current?.abort()
    }
  }, [agentId])

  // Persist history on change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY(agentId), JSON.stringify(messages))
    }
  }, [messages, agentId])

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  const buildContextualMessage = (raw: string) =>
    context ? `[Context: ${context}]\n\n${raw}` : raw

  const handleSend = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isStreaming) return

    setError(null)
    setInput('')

    const userMsg: ChatMessage = { role: 'user', content: trimmed }
    const nextHistory = [...messages, userMsg]
    setMessages(nextHistory)
    setIsStreaming(true)
    setStreamingContent('')

    const controller = new AbortController()
    abortRef.current = controller

    let full = ''
    try {
      const contextualText = buildContextualMessage(trimmed)
      for await (const token of agent.streamMessage(contextualText, messages, controller.signal)) {
        if (!mountedRef.current) break
        full += token
        setStreamingContent(full)
      }
    } catch (err) {
      if (!mountedRef.current) return
      if (err instanceof Error && err.name === 'AbortError') return

      // Fallback to non-streaming
      try {
        full = await agent.sendMessage(buildContextualMessage(trimmed), messages)
      } catch {
        setError('Could not reach the agent. Please try again.')
        setIsStreaming(false)
        setStreamingContent('')
        return
      }
    }

    if (!mountedRef.current) return

    const assistantMsg: ChatMessage = { role: 'assistant', content: full }
    setMessages([...nextHistory, assistantMsg])
    setStreamingContent('')
    setIsStreaming(false)
  }, [agent, messages, isStreaming, context]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(input)
    }
  }

  const handleClear = () => {
    abortRef.current?.abort()
    setMessages([])
    setStreamingContent('')
    setIsStreaming(false)
    localStorage.removeItem(STORAGE_KEY(agentId))
  }

  const showSuggestions = suggestedActions.length > 0 && !isStreaming && messages.length === 0

  return (
    <div className="flex flex-col h-full min-h-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0 ${cfg.avatarColor}`}>
          {cfg.initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-body font-semibold text-navy text-sm leading-tight">{cfg.name}</p>
          <p className="font-body text-gray-400 text-xs">{cfg.role}</p>
        </div>
        <div className="flex items-center gap-2">
          {isStreaming && (
            <span className="flex items-center gap-1 font-body text-teal text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-light animate-pulse" />
              Thinking…
            </span>
          )}
          {messages.length > 0 && !isStreaming && (
            <button
              onClick={handleClear}
              className="font-body text-xs text-gray-300 hover:text-gray-500 transition-colors"
              title="Clear conversation"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Messages ───────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 min-h-0">

        {/* Empty state */}
        {messages.length === 0 && !isStreaming && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8 gap-3">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-xl text-white ${cfg.avatarColor}`}>
              {cfg.initial}
            </div>
            <div>
              <p className="font-body font-semibold text-navy text-sm">{cfg.name}</p>
              <p className="font-body text-gray-400 text-xs mt-0.5 max-w-[200px] leading-relaxed">
                {agent.systemPromptPreview.split('\n')[1]?.replace('You ', '').trim() ?? cfg.role}
              </p>
            </div>
          </div>
        )}

        {/* Message history */}
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} agentId={agentId} />
        ))}

        {/* Streaming bubble */}
        {isStreaming && (
          <div className="flex gap-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-display font-bold text-xs text-white ${cfg.avatarColor}`}>
              {cfg.initial}
            </div>
            <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-tl-sm bg-white border border-gray-100 text-navy font-body text-sm leading-relaxed shadow-sm whitespace-pre-wrap">
              {streamingContent || <TypingDots />}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-center font-body text-red-500 text-xs py-2">{error}</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Suggested actions ──────────────────────────────────────────────── */}
      {showSuggestions && (
        <div className="px-4 pb-2 flex flex-wrap gap-2 flex-shrink-0">
          {suggestedActions.map((action) => (
            <button
              key={action}
              onClick={() => handleSend(action)}
              className="px-3 py-1.5 rounded-full border border-gray-200 font-body text-xs font-semibold text-gray-600 hover:border-teal/50 hover:text-teal transition-all bg-white"
            >
              {action}
            </button>
          ))}
        </div>
      )}

      {/* ── Input area ─────────────────────────────────────────────────────── */}
      <div className="px-4 pb-4 pt-2 flex-shrink-0 border-t border-gray-50">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${cfg.name}…`}
            rows={1}
            disabled={isStreaming}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm text-navy resize-none focus:outline-none focus:border-teal transition-colors disabled:opacity-50 max-h-32 overflow-y-auto"
            style={{ lineHeight: '1.5' }}
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isStreaming}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-teal text-white flex items-center justify-center transition-all hover:bg-teal-light disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h12M8 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <p className="font-body text-[10px] text-gray-300 mt-1.5 text-right">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
