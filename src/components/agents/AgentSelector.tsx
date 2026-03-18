import { AGENT_CONFIGS, type AgentId } from '../../lib/agents/base'

const AGENT_ORDER: AgentId[] = ['larry', 'maya', 'atlas', 'nova', 'echo']

interface AgentSelectorProps {
  activeAgent: AgentId
  onSelect: (id: AgentId) => void
  /** 'row' (default) for horizontal layout, 'col' for vertical sidebar */
  layout?: 'row' | 'col'
}

export default function AgentSelector({
  activeAgent,
  onSelect,
  layout = 'row',
}: AgentSelectorProps) {
  return (
    <div
      className={`flex gap-2 ${
        layout === 'col' ? 'flex-col items-center' : 'flex-row items-center flex-wrap'
      }`}
    >
      {AGENT_ORDER.map((id) => {
        const cfg = AGENT_CONFIGS[id]
        const isActive = id === activeAgent

        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            title={`${cfg.name} — ${cfg.role}`}
            className={`group relative flex flex-col items-center gap-1 p-1 rounded-xl transition-all ${
              isActive ? 'opacity-100' : 'opacity-60 hover:opacity-90'
            }`}
          >
            {/* Avatar circle */}
            <div
              className={`relative flex items-center justify-center w-10 h-10 rounded-xl font-display font-bold text-sm text-white transition-all ${
                cfg.avatarColor
              } ${isActive ? 'ring-2 ring-offset-2 ring-offset-white ring-current scale-110' : ''}`}
            >
              {cfg.initial}

              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-teal-light border-2 border-white" />
              )}
            </div>

            {/* Name label */}
            <span
              className={`font-body text-[10px] font-semibold transition-colors ${
                isActive ? 'text-navy' : 'text-gray-400'
              }`}
            >
              {cfg.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
