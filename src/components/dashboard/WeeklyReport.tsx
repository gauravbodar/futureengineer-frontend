import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../lib/supabase'
import { sendWeeklyReport } from '../../lib/api'
import { echo } from '../../lib/agents/echo'
import AgentBadge from '../agents/AgentBadge'
import type { ChildProfile } from '../../types'

// ── Section parser ──────────────────────────────────────────────────────────
// Echo is prompted to use **Section** headings. We split on those.

const SECTION_KEYS = ['Highlights', 'Progress', 'Next Steps', 'Parent Actions'] as const
type SectionKey = (typeof SECTION_KEYS)[number]

const SECTION_STYLES: Record<SectionKey, { icon: string; accent: string }> = {
  Highlights: { icon: '⭐', accent: 'border-l-amber' },
  Progress: { icon: '📈', accent: 'border-l-teal' },
  'Next Steps': { icon: '🗺️', accent: 'border-l-teal-light' },
  'Parent Actions': { icon: '👋', accent: 'border-l-navy' },
}

function parseSections(text: string): { key: SectionKey; body: string }[] {
  const results: { key: SectionKey; body: string }[] = []
  let remaining = text

  for (let i = 0; i < SECTION_KEYS.length; i++) {
    const key = SECTION_KEYS[i]
    const next = SECTION_KEYS[i + 1]
    const startPattern = new RegExp(`\\*\\*${key}\\*\\*|##\\s*${key}`, 'i')
    const startMatch = remaining.search(startPattern)
    if (startMatch === -1) continue

    const afterHeader = remaining.slice(startMatch).replace(startPattern, '').trimStart()

    let body: string
    if (next) {
      const endPattern = new RegExp(`\\*\\*${next}\\*\\*|##\\s*${next}`, 'i')
      const endMatch = afterHeader.search(endPattern)
      body = endMatch === -1 ? afterHeader.trim() : afterHeader.slice(0, endMatch).trim()
    } else {
      body = afterHeader.trim()
    }

    if (body) results.push({ key, body })
    remaining = afterHeader
  }

  return results
}

// ── Report prompt ───────────────────────────────────────────────────────────

function buildPrompt(child: ChildProfile, context: string): string {
  return `Generate a weekly parent report for ${child.username} (${child.tier} tier, ${child.streakCount}-day streak).

${context}

Write the report using exactly these four section headings in bold:
**Highlights**
**Progress**
**Next Steps**
**Parent Actions**

Keep each section to 2-4 sentences. Warm, clear, and jargon-free. Make the parent feel informed and proud.`
}

// ── Saved report type ────────────────────────────────────────────────────────

interface SavedReport {
  id: string
  content: string
  generated_at: string
}

// ── Component ────────────────────────────────────────────────────────────────

interface WeeklyReportProps {
  child: ChildProfile | null
}

export default function WeeklyReport({ child }: WeeklyReportProps) {
  const { user } = useAuthStore()
  const [report, setReport] = useState<string>('')
  const [generating, setGenerating] = useState(false)
  const [reportDate, setReportDate] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      abortRef.current?.abort()
    }
  }, [])

  // Load most recent saved report for this child
  useEffect(() => {
    if (!child) return
    supabase
      .from('weekly_reports')
      .select('id, content, generated_at')
      .eq('child_id', child.id)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setReport((data as SavedReport).content)
          setReportDate((data as SavedReport).generated_at)
        }
      })
  }, [child])

  const generate = useCallback(async () => {
    if (!child || generating) return
    setError(null)
    setGenerating(true)
    setSent(false)

    // Build context summary from recent data
    const [projectsRes, skillsRes] = await Promise.allSettled([
      supabase
        .from('projects')
        .select('title, percent_complete, published, last_active')
        .eq('user_id', child.id)
        .order('last_active', { ascending: false })
        .limit(5),
      supabase
        .from('skill_grants')
        .select('skill_name, earned_at')
        .eq('user_id', child.id)
        .order('earned_at', { ascending: false })
        .limit(10),
    ])

    const projects =
      projectsRes.status === 'fulfilled' ? (projectsRes.value.data ?? []) : []
    const skills =
      skillsRes.status === 'fulfilled' ? (skillsRes.value.data ?? []) : []

    const context = [
      projects.length
        ? `Recent projects: ${projects
            .map(
              (p: { title: string; percent_complete: number; published: boolean }) =>
                `"${p.title}" (${p.published ? 'published' : `${p.percent_complete}% complete`})`
            )
            .join(', ')}.`
        : 'No projects yet.',
      skills.length
        ? `Recently earned skills: ${skills.map((s: { skill_name: string }) => s.skill_name).join(', ')}.`
        : '',
    ]
      .filter(Boolean)
      .join(' ')

    const prompt = buildPrompt(child, context)

    const controller = new AbortController()
    abortRef.current = controller
    let full = ''

    try {
      for await (const token of echo.streamMessage(prompt, [], controller.signal)) {
        if (!mountedRef.current) break
        full += token
        setReport(full)
      }
    } catch (err) {
      if (!mountedRef.current) return
      if (err instanceof Error && err.name === 'AbortError') {
        setGenerating(false)
        return
      }
      // fallback to non-streaming
      try {
        full = await echo.sendMessage(prompt, [])
        if (mountedRef.current) setReport(full)
      } catch {
        if (mountedRef.current) setError('Could not generate report. Try again.')
        setGenerating(false)
        return
      }
    }

    if (!mountedRef.current) return
    setGenerating(false)

    const now = new Date().toISOString()
    setReportDate(now)

    // Persist to Supabase
    if (child) {
      supabase
        .from('weekly_reports')
        .upsert({ child_id: child.id, content: full, generated_at: now })
        .then(() => {})
    }
  }, [child, generating])

  const handleSendEmail = async () => {
    if (!child || !user?.email || !report) return
    setSending(true)
    try {
      await sendWeeklyReport(child.id, user.email)
      setSent(true)
    } catch {
      setError('Could not send email. Try again.')
    } finally {
      setSending(false)
    }
  }

  const sections = report ? parseSections(report) : []
  const hasStructure = sections.length >= 2

  const formattedDate = reportDate
    ? new Date(reportDate).toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
    : null

  return (
    <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <h2 className="font-display font-bold text-navy text-lg">Weekly Report</h2>
          <AgentBadge agentId="echo" />
        </div>
        <div className="flex items-center gap-2">
          {formattedDate && (
            <span className="font-body text-gray-300 text-xs hidden sm:block">{formattedDate}</span>
          )}
          {report && !generating && (
            <button
              onClick={handleSendEmail}
              disabled={sending || sent}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 font-body text-xs font-semibold text-gray-600 hover:border-teal/50 hover:text-teal transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sent ? (
                <>✓ Sent</>
              ) : sending ? (
                'Sending…'
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M1 1l10 5-10 5V7l7-1-7-1V1z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Send to email
                </>
              )}
            </button>
          )}
          <button
            onClick={generate}
            disabled={generating || !child}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy text-white font-body text-xs font-semibold hover:bg-navy/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <span className="w-2 h-2 rounded-full bg-teal-light animate-pulse" />
                Generating…
              </>
            ) : report ? (
              'Regenerate'
            ) : (
              'Generate report'
            )}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        {error && (
          <p className="font-body text-red-500 text-sm mb-4">{error}</p>
        )}

        {!report && !generating && (
          <div className="flex flex-col items-center text-center py-8 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-navy flex items-center justify-center font-display font-bold text-white text-lg select-none">
              E
            </div>
            <div>
              <p className="font-body font-semibold text-navy text-sm">Echo is ready</p>
              <p className="font-body text-gray-400 text-xs mt-1 leading-relaxed max-w-[260px]">
                Generate a personalised weekly summary of your child's progress, skills, and next steps.
              </p>
            </div>
          </div>
        )}

        {/* Streaming or complete — show raw text during generation, sections when done */}
        {report && (generating || !hasStructure) && (
          <div className="font-body text-navy text-sm leading-relaxed whitespace-pre-wrap">
            {report}
            {generating && (
              <span className="inline-flex items-end gap-0.5 ml-1 h-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1 h-1 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.12}s` }}
                  />
                ))}
              </span>
            )}
          </div>
        )}

        {/* Parsed sections — shown when generation is complete and structured */}
        {report && !generating && hasStructure && (
          <div className="flex flex-col gap-4">
            {sections.map(({ key, body }) => {
              const style = SECTION_STYLES[key]
              return (
                <div
                  key={key}
                  className={`border-l-2 pl-4 ${style.accent}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{style.icon}</span>
                    <h3 className="font-body font-bold text-navy text-sm">{key}</h3>
                  </div>
                  <p className="font-body text-gray-600 text-sm leading-relaxed">{body}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
