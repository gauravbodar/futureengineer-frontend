import { useState, useRef, useEffect } from 'react'
import AgentChat from '../agents/AgentChat'
import type { AgentId } from '../../lib/agents/base'

type Tab = { id: AgentId; label: string }

const TABS: Tab[] = [
  { id: 'atlas', label: 'Atlas · Build' },
  { id: 'maya', label: 'Maya · Learn' },
  { id: 'nova', label: 'Nova · Community' },
]

const ATLAS_SUGGESTIONS = [
  'What should I build first?',
  'Help me debug my code',
  'Explain React hooks',
  'How do I deploy my project?',
]

const MAYA_SUGGESTIONS = [
  "What's my next lesson?",
  'Explain this concept simply',
  'Build me a learning plan',
]

const NOVA_SUGGESTIONS = [
  "What's the current challenge?",
  'Show me recent community builds',
  'How do I enter the challenge?',
]

const SUGGESTIONS: Record<AgentId, string[]> = {
  atlas: ATLAS_SUGGESTIONS,
  maya: MAYA_SUGGESTIONS,
  nova: NOVA_SUGGESTIONS,
  larry: [],
  echo: [],
}

export default function AgentMentorWidget() {
  const [open, setOpen] = useState(false)
  const [activeAgent, setActiveAgent] = useState<AgentId>('atlas')
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded panel */}
      {open && (
        <div
          ref={panelRef}
          className="w-[360px] max-w-[calc(100vw-3rem)] h-[520px] shadow-2xl rounded-2xl overflow-hidden border border-gray-100 flex flex-col bg-white"
        >
          {/* Tab bar */}
          <div className="bg-off-white border-b border-gray-100 px-3 py-2 flex items-center gap-1 flex-shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveAgent(tab.id)}
                className={`px-3 py-1 rounded-lg font-body text-xs font-semibold transition-colors ${
                  activeAgent === tab.id
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-gray-400 hover:text-navy'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-gray-300 hover:text-gray-500 transition-colors p-1 rounded-lg"
              aria-label="Close mentor panel"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 1l12 12M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Chat — key forces remount on agent switch to restore correct history */}
          <div className="flex-1 min-h-0">
            <AgentChat
              key={activeAgent}
              agentId={activeAgent}
              suggestedActions={SUGGESTIONS[activeAgent]}
              context="You are assisting a student on the FutureEngineer Academy dashboard."
            />
          </div>
        </div>
      )}

      {/* Bubble toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center font-display font-bold text-xl text-white transition-all hover:scale-105 active:scale-95 ${
          open ? 'bg-navy' : 'bg-teal-light'
        }`}
        aria-label={open ? 'Close mentor' : 'Open mentor chat'}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M1 1l16 16M17 1L1 17"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          'A'
        )}
      </button>

      {/* Tooltip — hidden once panel has been opened */}
      {!open && (
        <span className="bg-navy text-white font-body text-[11px] px-2.5 py-1 rounded-lg -mt-1 whitespace-nowrap shadow-lg pointer-events-none">
          Ask Atlas anything →
        </span>
      )}
    </div>
  )
}
