import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../lib/supabase'
import type { Project } from '../../types'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3_600_000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 hover:border-teal/30 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-body font-semibold text-navy text-sm leading-snug line-clamp-2">
            {project.title}
          </h3>
          <p className="font-body text-gray-400 text-xs mt-0.5">
            Step {project.currentStep} of {project.totalSteps} · Last active{' '}
            {timeAgo(project.lastActive)}
          </p>
        </div>
        <span className="flex-shrink-0 font-body text-xs font-bold text-teal">
          {project.percentComplete}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal rounded-full transition-all duration-500"
          style={{ width: `${project.percentComplete}%` }}
        />
      </div>

      <Link
        to={`/project/${project.id}`}
        className="self-start inline-flex items-center gap-1.5 px-4 py-1.5 bg-teal/10 hover:bg-teal text-teal hover:text-white rounded-lg font-body font-semibold text-xs transition-all"
      >
        Continue →
      </Link>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col items-center text-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-teal-light flex items-center justify-center font-display font-bold text-white text-lg select-none">
        A
      </div>
      <div>
        <p className="font-body font-semibold text-navy text-sm">Atlas is ready for you</p>
        <p className="font-body text-gray-400 text-xs mt-1 leading-relaxed max-w-[220px]">
          "Tell me what you want to build. I'll map out your first three steps."
        </p>
      </div>
      <Link
        to="/create"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal hover:bg-teal-light text-white rounded-xl font-body font-semibold text-sm transition-colors"
      >
        Start a project
      </Link>
    </div>
  )
}

export default function ActiveProjects() {
  const { user } = useAuthStore()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('projects')
      .select(
        'id, user_id, title, description, current_step, total_steps, percent_complete, last_active, published'
      )
      .eq('user_id', user.id)
      .eq('published', false)
      .order('last_active', { ascending: false })
      .limit(4)
      .then(({ data }) => {
        if (data) {
          setProjects(
            data.map((d) => ({
              id: d.id,
              userId: d.user_id,
              title: d.title,
              description: d.description ?? '',
              currentStep: d.current_step ?? 1,
              totalSteps: d.total_steps ?? 5,
              percentComplete: d.percent_complete ?? 0,
              lastActive: d.last_active ?? new Date().toISOString(),
              published: d.published ?? false,
            }))
          )
        }
        setLoading(false)
      })
  }, [user])

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-navy text-lg">Active Projects</h2>
        <Link
          to="/create"
          className="font-body text-teal text-sm font-semibold hover:text-teal-light transition-colors"
        >
          + New project
        </Link>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl h-36 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </section>
  )
}
