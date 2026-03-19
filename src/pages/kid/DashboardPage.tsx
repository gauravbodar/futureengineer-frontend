import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import CreatorHeader from '../../components/dashboard/CreatorHeader'
import ActiveProjects from '../../components/dashboard/ActiveProjects'
import Achievements from '../../components/dashboard/Achievements'
import CommunityPulse from '../../components/dashboard/CommunityPulse'
import AgentMentorWidget from '../../components/dashboard/AgentMentorWidget'

export default function DashboardPage() {
  const { user, isLoading } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, isLoading, navigate])

  if (isLoading || !user) return null

  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        <CreatorHeader />

        {/* Projects + Community — side by side on large screens */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div className="flex flex-col gap-8">
            <ActiveProjects />
            <Achievements />
          </div>
          <CommunityPulse />
        </div>
      </div>

      {/* Floating agent mentor — always accessible */}
      <AgentMentorWidget />
    </div>
  )
}
