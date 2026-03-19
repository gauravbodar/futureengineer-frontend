import AgentChat from '../agents/AgentChat'
import type { ChildProfile, Tier } from '../../types'

const ECHO_SUGGESTIONS = [
  'Explain this week',
  'What should they build next?',
  'How do I help at home?',
  'Is my child on track?',
]

const TIER_CONTEXT: Record<Tier, string> = {
  Spark: 'a Spark-tier builder (ages 8–12), learning fundamentals through guided projects',
  Maker: 'a Maker-tier builder (ages 12–15), developing real projects with more independence',
  Creator: 'a Creator-tier builder (ages 15–18), shipping production-quality products',
}

interface EchoChatProps {
  child: ChildProfile | null
}

export default function EchoChat({ child }: EchoChatProps) {
  const context = child
    ? `The parent is asking about their child @${child.username}, who is ${TIER_CONTEXT[child.tier]}. ` +
      `The child has a ${child.streakCount}-day streak. ` +
      `Speak directly to the parent — warm, clear, and reassuring. ` +
      `Translate everything into skills, growth, and what it means for their child's future.`
    : 'A parent is asking about their child on the FutureEngineer Academy platform.'

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display font-bold text-navy text-lg">Ask Echo</h2>
      <div className="h-[420px]">
        <AgentChat
          agentId="echo"
          context={context}
          suggestedActions={ECHO_SUGGESTIONS}
        />
      </div>
    </section>
  )
}
