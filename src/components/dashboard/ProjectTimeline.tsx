import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Filter = 'all' | 'in-progress' | 'published' | 'this-week'

interface TimelineProject {
  id: string
  title: string
  description: string
  currentStep: number
  totalSteps: number
  percentComplete: number
  lastActive: string
  published: boolean
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'in-progress', label: 'In progress' },
  { key: 'published', label: 'Published' },
  { key: 'this-week', label: 'This week' },
]

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function StatusBadge({ published }: { published: boolean }) {
  return published ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal/10 text-teal text-[11px] font-body font-semibold border border-teal/20">
      <span className="w-1.5 h-1.5 rounded-full bg-teal" />
      Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber/10 text-amber text-[11px] font-body font-semibold border border-amber/20">
      <span className="w-1.5 h-1.5 rounded-full bg-amber" />
      In progress
    </span>
  )
}

function ProjectCard({ project }: { project: TimelineProject }) {
  return (
    <div className="relative pl-6">
      {/* Timeline dot */}
      <span className="absolute left-0 top-2 w-2.5 h-2.5 rounded-full border-2 border-gray-200 bg-white" />

      <div className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
        <div className="flex flex-wrap items-start gap-2 justify-between mb-2">
          <h3 className="font-body font-semibold text-navy text-sm leading-snug flex-1 min-w-0">
            {project.title}
          </h3>
          <StatusBadge published={project.published} />
        </div>

        {project.description && (
          <p className="font-body text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">
            {project.description}
          </p>
        )}

        <div className="flex items-center gap-3">
          {/* Progress bar */}
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal rounded-full"
              style={{ width: `${project.percentComplete}%` }}
            />
          </div>
          <span className="font-body text-xs text-gray-400 flex-shrink-0">
            {project.percentComplete}% · Step {project.currentStep}/{project.totalSteps}
          </span>
        </div>

        <p className="font-body text-gray-300 text-[11px] mt-2">{formatDate(project.lastActive)}</p>
      </div>
    </div>
  )
}

interface ProjectTimelineProps {
  childId: string
}

const ONE_WEEK_AGO = new Date(Date.now() - 7 * 86_400_000).toISOString()

export default function ProjectTimeline({ childId }: ProjectTimelineProps) {
  const [allProjects, setAllProjects] = useState<TimelineProject[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('projects')
      .select(
        'id, title, description, current_step, total_steps, percent_complete, last_active, published'
      )
      .eq('user_id', childId)
      .order('last_active', { ascending: false })
      .then(({ data }) => {
        if (data) {
          setAllProjects(
            data.map((d) => ({
              id: d.id,
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
  }, [childId])

  const visible = allProjects.filter((p) => {
    if (filter === 'published') return p.published
    if (filter === 'in-progress') return !p.published
    if (filter === 'this-week') return p.lastActive >= ONE_WEEK_AGO
    return true
  })

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="font-display font-bold text-navy text-lg">Project Timeline</h2>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 rounded-lg font-body text-xs font-semibold transition-colors ${
                filter === key ? 'bg-white text-navy shadow-sm' : 'text-gray-400 hover:text-navy'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="pl-6 relative">
              <span className="absolute left-0 top-2 w-2.5 h-2.5 rounded-full border-2 border-gray-200 bg-white" />
              <div className="bg-gray-100 rounded-xl h-20 animate-pulse" />
            </div>
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center">
          <p className="font-body text-gray-400 text-sm">
            {filter === 'all'
              ? 'No projects started yet.'
              : `No ${filter.replace('-', ' ')} projects.`}
          </p>
        </div>
      ) : (
        <div className="relative flex flex-col gap-4">
          {/* Vertical line */}
          <div className="absolute left-[4.5px] top-3 bottom-3 w-px bg-gray-100" />
          {visible.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </section>
  )
}
