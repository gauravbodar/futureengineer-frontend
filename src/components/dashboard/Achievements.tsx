import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../lib/supabase'

interface Stats {
  skillsEarned: number
  projectsPublished: number
  challengeEntries: number
  portfolioViews: number
}

const STAT_CONFIG: {
  key: keyof Stats
  label: string
  icon: string
  bg: string
  fg: string
}[] = [
  {
    key: 'skillsEarned',
    label: 'Skills Earned',
    icon: '⚡',
    bg: 'bg-teal/10',
    fg: 'text-teal',
  },
  {
    key: 'projectsPublished',
    label: 'Projects Published',
    icon: '🚀',
    bg: 'bg-amber/10',
    fg: 'text-amber',
  },
  {
    key: 'challengeEntries',
    label: 'Challenge Entries',
    icon: '🏆',
    bg: 'bg-teal-light/10',
    fg: 'text-teal-light',
  },
  {
    key: 'portfolioViews',
    label: 'Portfolio Views',
    icon: '👁',
    bg: 'bg-navy/10',
    fg: 'text-navy',
  },
]

export default function Achievements() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<Stats>({
    skillsEarned: 0,
    projectsPublished: 0,
    challengeEntries: 0,
    portfolioViews: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    Promise.allSettled([
      supabase
        .from('skill_grants')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id),
      supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('published', true),
      supabase
        .from('challenge_entries')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id),
      supabase
        .from('portfolio_entries')
        .select('views')
        .eq('user_id', user.id),
    ]).then(([skills, published, challenges, portfolio]) => {
      const views =
        portfolio.status === 'fulfilled' && portfolio.value.data
          ? portfolio.value.data.reduce(
              (sum: number, e: { views: number }) => sum + (e.views ?? 0),
              0
            )
          : 0

      setStats({
        skillsEarned:
          skills.status === 'fulfilled' ? (skills.value.count ?? 0) : 0,
        projectsPublished:
          published.status === 'fulfilled' ? (published.value.count ?? 0) : 0,
        challengeEntries:
          challenges.status === 'fulfilled' ? (challenges.value.count ?? 0) : 0,
        portfolioViews: views,
      })
      setLoading(false)
    })
  }, [user])

  return (
    <section>
      <h2 className="font-display font-bold text-navy text-lg mb-4">Achievements</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STAT_CONFIG.map(({ key, label, icon, bg, fg }) => (
          <div
            key={key}
            className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${bg} ${fg}`}
            >
              {icon}
            </div>
            {loading ? (
              <div className="w-8 h-7 bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <span className="font-display font-bold text-navy text-2xl leading-none">
                {stats[key]}
              </span>
            )}
            <span className="font-body text-gray-400 text-[11px] leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
