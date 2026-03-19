import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface Challenge {
  id: string
  title: string
  description: string
  ends_at: string
  entries_count: number
}

interface FeedEntry {
  id: string
  title: string
  excerpt: string
  project_url: string | null
  created_at: string
}

// Fallback used when no live challenge is found
const PLACEHOLDER_CHALLENGE: Challenge = {
  id: 'placeholder',
  title: 'Build an AI tool that helps someone',
  description:
    'Create any AI-powered project that solves a real problem for a real person. Games, apps, scripts — all valid. Ship it.',
  ends_at: new Date(Date.now() + 5 * 86_400_000).toISOString(),
  entries_count: 12,
}

function useCountdown(endsAt: string): string {
  const [label, setLabel] = useState('')

  useEffect(() => {
    const update = () => {
      const diff = new Date(endsAt).getTime() - Date.now()
      if (diff <= 0) {
        setLabel('Ended')
        return
      }
      const d = Math.floor(diff / 86_400_000)
      const h = Math.floor((diff % 86_400_000) / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      if (d > 0) setLabel(`${d}d ${h}h left`)
      else if (h > 0) setLabel(`${h}h ${m}m left`)
      else setLabel(`${m}m left`)
    }
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [endsAt])

  return label
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const countdown = useCountdown(challenge.ends_at)

  return (
    <div className="bg-navy rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="font-body text-teal-light text-[10px] font-bold uppercase tracking-wider">
            Weekly Challenge
          </span>
          <h3 className="font-display font-bold text-white text-base mt-0.5 leading-snug">
            {challenge.title}
          </h3>
        </div>
        <span className="flex-shrink-0 bg-amber/20 text-amber-light font-body text-xs font-bold px-2.5 py-1 rounded-lg border border-amber/30 whitespace-nowrap">
          {countdown}
        </span>
      </div>
      <p className="font-body text-gray-400 text-xs leading-relaxed">{challenge.description}</p>
      <div className="flex items-center justify-between">
        <span className="font-body text-gray-400 text-xs">
          {challenge.entries_count} entries so far
        </span>
        <Link
          to="/community"
          className="inline-flex items-center gap-1 px-4 py-1.5 bg-teal hover:bg-teal-light text-white rounded-lg font-body font-semibold text-xs transition-colors"
        >
          Join challenge →
        </Link>
      </div>
    </div>
  )
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 1) return 'Just now'
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function FeedCard({ entry }: { entry: FeedEntry }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-teal/10 flex items-center justify-center text-sm">
        🚀
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body font-semibold text-navy text-sm leading-tight">{entry.title}</p>
        {entry.excerpt && (
          <p className="font-body text-gray-400 text-xs mt-0.5 line-clamp-2">{entry.excerpt}</p>
        )}
      </div>
      <span className="flex-shrink-0 font-body text-gray-300 text-[10px] mt-0.5">
        {timeAgo(entry.created_at)}
      </span>
    </div>
  )
}

export default function CommunityPulse() {
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [feed, setFeed] = useState<FeedEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      supabase
        .from('challenges')
        .select('id, title, description, ends_at, entries_count')
        .gte('ends_at', new Date().toISOString())
        .order('ends_at', { ascending: true })
        .limit(1)
        .single(),
      supabase
        .from('community_feed')
        .select('id, title, excerpt, project_url, created_at')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(5),
    ]).then(([challengeRes, feedRes]) => {
      setChallenge(
        challengeRes.status === 'fulfilled' && challengeRes.value.data
          ? (challengeRes.value.data as Challenge)
          : PLACEHOLDER_CHALLENGE
      )
      setFeed(
        feedRes.status === 'fulfilled' && feedRes.value.data
          ? (feedRes.value.data as FeedEntry[])
          : []
      )
      setLoading(false)
    })
  }, [])

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-navy text-lg">Community Pulse</h2>
        <Link
          to="/community"
          className="font-body text-teal text-sm font-semibold hover:text-teal-light transition-colors"
        >
          See all →
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          <div className="bg-gray-100 rounded-2xl h-36 animate-pulse" />
          <div className="bg-gray-100 rounded-2xl h-24 animate-pulse" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <ChallengeCard challenge={challenge ?? PLACEHOLDER_CHALLENGE} />

          {feed.length > 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl px-4 py-1">
              {feed.map((entry) => (
                <FeedCard key={entry.id} entry={entry} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center">
              <p className="font-body text-gray-400 text-sm">
                No community posts yet. Be the first to publish!
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
