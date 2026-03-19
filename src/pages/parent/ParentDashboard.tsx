import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../lib/supabase'
import type { ChildProfile } from '../../types'
import ParentHeader from '../../components/dashboard/ParentHeader'
import WeeklyReport from '../../components/dashboard/WeeklyReport'
import ProjectTimeline from '../../components/dashboard/ProjectTimeline'
import SkillsMap from '../../components/dashboard/SkillsMap'
import EchoChat from '../../components/dashboard/EchoChat'

export default function ParentDashboard() {
  const { user, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const [child, setChild] = useState<ChildProfile | null>(null)
  const [childLoading, setChildLoading] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, isLoading, navigate])

  // Fetch child profile linked to this parent
  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('id, username, tier, streak_count, last_active, avatar_url')
      .eq('parent_id', user.id)
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setChild({
            id: data.id,
            username: data.username ?? 'student',
            tier: data.tier ?? 'Spark',
            streakCount: data.streak_count ?? 0,
            lastActive: data.last_active ?? new Date().toISOString(),
            avatarUrl: data.avatar_url ?? null,
          })
        }
        setChildLoading(false)
      })
  }, [user])

  if (isLoading || !user) return null

  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Header */}
        <ParentHeader child={child} loading={childLoading} />

        {/* Weekly Report + Echo Chat — side by side on large screens */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          <WeeklyReport child={child} />
          <EchoChat child={child} />
        </div>

        {/* Project Timeline — full width */}
        {child && <ProjectTimeline childId={child.id} />}

        {/* Skills Map — full width */}
        {child && <SkillsMap childId={child.id} />}
      </div>
    </div>
  )
}
