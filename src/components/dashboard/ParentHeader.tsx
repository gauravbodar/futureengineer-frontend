import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../lib/supabase'
import type { ChildProfile, Tier } from '../../types'

const TIER_STYLES: Record<Tier, string> = {
  Spark: 'bg-amber/15 text-amber border border-amber/30',
  Maker: 'bg-teal/15 text-teal border border-teal/30',
  Creator: 'bg-teal-light/15 text-teal-light border border-teal-light/30',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3_600_000)
  if (hours < 1) return 'Active recently'
  if (hours < 24) return `Active ${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Active yesterday'
  return `Active ${days} days ago`
}

interface StatPill {
  label: string
  value: string | number
}

interface ParentHeaderProps {
  child: ChildProfile | null
  loading: boolean
}

export default function ParentHeader({ child, loading }: ParentHeaderProps) {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<StatPill[]>([])

  useEffect(() => {
    if (!child) return

    Promise.allSettled([
      supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', child.id)
        .eq('published', true),
      supabase
        .from('skill_grants')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', child.id),
      supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', child.id)
        .eq('published', false),
    ]).then(([published, skills, inProgress]) => {
      setStats([
        {
          label: 'Projects published',
          value: published.status === 'fulfilled' ? (published.value.count ?? 0) : 0,
        },
        {
          label: 'Skills earned',
          value: skills.status === 'fulfilled' ? (skills.value.count ?? 0) : 0,
        },
        {
          label: 'In progress',
          value: inProgress.status === 'fulfilled' ? (inProgress.value.count ?? 0) : 0,
        },
        {
          label: 'Day streak',
          value: child.streakCount,
        },
      ])
    })
  }, [child])

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse h-28" />
    )
  }

  if (!child) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center">
        <p className="font-body text-gray-400 text-sm">No child profile linked yet.</p>
        <p className="font-body text-gray-300 text-xs mt-1">
          Invite your child to sign up with parent account:{' '}
          <span className="font-semibold">{user?.email}</span>
        </p>
      </div>
    )
  }

  const initials = child.username.slice(0, 2).toUpperCase()
  const tier = child.tier

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Avatar */}
        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-teal flex items-center justify-center font-display font-bold text-xl text-white select-none">
          {initials}
        </div>

        {/* Name + status */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="font-display font-bold text-navy text-xl leading-tight">
              @{child.username}
            </h2>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-body font-bold ${TIER_STYLES[tier]}`}
            >
              {tier} tier
            </span>
            {child.streakCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber/10 text-amber text-xs font-body font-semibold border border-amber/20">
                🔥 {child.streakCount}-day streak
              </span>
            )}
          </div>
          <p className="font-body text-gray-400 text-sm">
            {timeAgo(child.lastActive)}
          </p>
        </div>

        {/* Quick stats */}
        {stats.length > 0 && (
          <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display font-bold text-navy text-xl leading-none">{s.value}</p>
                <p className="font-body text-gray-400 text-[11px] mt-0.5 whitespace-nowrap">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
