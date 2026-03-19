import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Category = 'Engineering' | 'Design' | 'AI' | 'Product' | 'Business'

const CATEGORY_CONFIG: Record<
  Category,
  { icon: string; bg: string; fg: string; keywords: string[] }
> = {
  Engineering: {
    icon: '⚙️',
    bg: 'bg-teal/10',
    fg: 'text-teal',
    keywords: [
      'code', 'build', 'debug', 'deploy', 'api', 'function', 'react', 'html', 'css',
      'javascript', 'typescript', 'python', 'git', 'database', 'server', 'component',
      'algorithm', 'loop', 'variable', 'logic',
    ],
  },
  Design: {
    icon: '🎨',
    bg: 'bg-amber/10',
    fg: 'text-amber',
    keywords: [
      'design', 'ui', 'ux', 'layout', 'typography', 'color', 'figma', 'wireframe',
      'responsive', 'animation', 'css', 'visual', 'interface', 'prototype',
    ],
  },
  AI: {
    icon: '🤖',
    bg: 'bg-teal-light/10',
    fg: 'text-teal-light',
    keywords: [
      'ai', 'machine learning', 'ml', 'prompt', 'agent', 'llm', 'neural', 'model',
      'inference', 'fine-tune', 'embedding', 'rag', 'chatbot', 'automation',
    ],
  },
  Product: {
    icon: '🧭',
    bg: 'bg-navy/10',
    fg: 'text-navy',
    keywords: [
      'product', 'user', 'feature', 'roadmap', 'requirement', 'research', 'feedback',
      'iteration', 'launch', 'mvp', 'problem', 'solution', 'metric',
    ],
  },
  Business: {
    icon: '💡',
    bg: 'bg-amber-light/10',
    fg: 'text-amber-light',
    keywords: [
      'business', 'market', 'customer', 'revenue', 'pitch', 'startup', 'monetise',
      'brand', 'growth', 'strategy', 'competitor', 'pricing', 'audience',
    ],
  },
}

function categorise(skillName: string): Category {
  const lower = skillName.toLowerCase()
  for (const [cat, cfg] of Object.entries(CATEGORY_CONFIG) as [
    Category,
    (typeof CATEGORY_CONFIG)[Category],
  ][]) {
    if (cfg.keywords.some((kw) => lower.includes(kw))) return cat
  }
  return 'Engineering' // default
}

interface Skill {
  skill_name: string
  earned_at: string
  category?: Category
}

interface GroupedSkills {
  category: Category
  skills: Skill[]
}

interface SkillsMapProps {
  childId: string
}

export default function SkillsMap({ childId }: SkillsMapProps) {
  const [groups, setGroups] = useState<GroupedSkills[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('skill_grants')
      .select('skill_name, earned_at, category')
      .eq('user_id', childId)
      .order('earned_at', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          // Group by category — use DB category if present, else derive from keyword
          const map = new Map<Category, Skill[]>()
          for (const row of data as Skill[]) {
            const cat: Category = row.category ?? categorise(row.skill_name)
            const existing = map.get(cat) ?? []
            existing.push(row)
            map.set(cat, existing)
          }
          // Sort groups by number of skills desc
          const grouped = Array.from(map.entries())
            .sort((a, b) => b[1].length - a[1].length)
            .map(([category, skills]) => ({ category, skills }))
          setGroups(grouped)
        } else {
          setGroups([])
        }
        setLoading(false)
      })
  }, [childId])

  return (
    <section>
      <h2 className="font-display font-bold text-navy text-lg mb-4">Skills Map</h2>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-32 animate-pulse" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center">
          <p className="font-body text-gray-400 text-sm">
            No skills earned yet — they appear here as your child completes projects.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map(({ category, skills }) => {
            const cfg = CATEGORY_CONFIG[category]
            return (
              <div
                key={category}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-3"
              >
                {/* Category header */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-base ${cfg.bg}`}
                  >
                    {cfg.icon}
                  </div>
                  <div>
                    <p className={`font-body font-bold text-sm ${cfg.fg}`}>{category}</p>
                    <p className="font-body text-gray-300 text-[11px]">
                      {skills.length} skill{skills.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Skill tags */}
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span
                      key={s.skill_name + s.earned_at}
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-body font-semibold border ${cfg.bg} ${cfg.fg} border-current/20`}
                    >
                      {s.skill_name}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
