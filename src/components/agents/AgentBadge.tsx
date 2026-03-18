import { AGENT_CONFIGS, type AgentId } from '../../lib/agents/base'

interface AgentBadgeProps {
  agentId: AgentId
  /** 'sm' (default) renders inline. 'md' adds more padding for standalone use. */
  size?: 'sm' | 'md'
}

export default function AgentBadge({ agentId, size = 'sm' }: AgentBadgeProps) {
  const cfg = AGENT_CONFIGS[agentId]
  if (!cfg) return null

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-body font-semibold ${
        size === 'sm'
          ? 'px-2 py-0.5 text-xs'
          : 'px-3 py-1 text-sm'
      } bg-white/10 border border-white/10`}
    >
      {/* Coloured initial dot */}
      <span
        className={`inline-flex items-center justify-center rounded-full text-white font-bold ${
          cfg.avatarColor
        } ${size === 'sm' ? 'w-4 h-4 text-[10px]' : 'w-5 h-5 text-xs'}`}
      >
        {cfg.initial}
      </span>
      <span className={cfg.accentColor}>{cfg.name}</span>
    </span>
  )
}
