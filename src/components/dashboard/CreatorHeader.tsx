import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../lib/supabase'
import type { Tier } from '../../types'

interface Profile {
  username: string
  tier: Tier
  streak_count: number
  avatar_url: string | null
}

const TIER_STYLES: Record<Tier, string> = {
  Spark: 'bg-amber/20 text-amber border border-amber/40',
  Maker: 'bg-teal/20 text-teal border border-teal/40',
  Creator: 'bg-teal-light/20 text-teal-light border border-teal-light/40',
}

export default function CreatorHeader() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('username, tier, streak_count, avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data as Profile)
      })
  }, [user])

  const handle = profile?.username ?? user?.email?.split('@')[0] ?? 'creator'
  const tier: Tier = profile?.tier ?? 'Spark'
  const streak = profile?.streak_count ?? 0
  const initials = handle.slice(0, 2).toUpperCase()

  return (
    <div className="bg-navy rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
      {/* Avatar */}
      <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-teal flex items-center justify-center font-display font-bold text-2xl text-white select-none">
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h2 className="font-display font-bold text-white text-xl leading-tight">
            @{handle}
          </h2>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-body font-bold ${TIER_STYLES[tier]}`}
          >
            {tier}
          </span>
          {streak > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber/20 border border-amber/40 text-amber-light text-xs font-body font-semibold">
              🔥 {streak}-day streak
            </span>
          )}
        </div>
        <p className="font-body text-gray-400 text-sm leading-relaxed">
          You don't just use the future. You build it.
        </p>
      </div>

      {/* CTA */}
      <Link
        to="/create"
        className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-teal hover:bg-teal-light rounded-xl font-body font-semibold text-white text-sm transition-colors"
      >
        Start building
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 7h10M7 2l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  )
}
