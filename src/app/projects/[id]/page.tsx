import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDate, getInitials } from '@/lib/utils'
import { Users, Calendar, GitBranch, ExternalLink, Zap, Award } from 'lucide-react'
import ApplyButton from './apply-button'

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('*, profiles!projects_founder_id_fkey(*), project_members(*, profiles(*))')
    .eq('id', params.id)
    .single()

  if (!project) notFound()

  const { data: myApplication } = await supabase
    .from('applications')
    .select('id, status')
    .eq('project_id', params.id)
    .eq('applicant_id', user.id)
    .single()

  const isFounder = project.founder_id === user.id

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <span className={`ds-badge ${project.status === 'recruiting' ? 'ds-badge-green' : project.status === 'in_progress' ? 'ds-badge-accent' : project.status === 'completed' ? 'ds-badge-orange' : ''}`}>
                {project.status?.replace('_', ' ')}
              </span>
              {project.is_sponsored && <span className="ds-badge ds-badge-orange">⚡ Sponsored</span>}
            </div>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 32, marginBottom: 8, lineHeight: 1.2 }}>{project.title}</h1>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: 'var(--ds-text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Users size={13} /> {project.team_size} team members
              </span>
              <span style={{ fontSize: 13, color: 'var(--ds-text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Calendar size={13} /> Posted {formatDate(project.created_at)}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {project.github_url && <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="ds-btn-secondary" style={{ padding: '9px 16px', fontSize: 13 }}><GitBranch size={14} /> GitHub</a>}
            {project.demo_url && <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="ds-btn-secondary" style={{ padding: '9px 16px', fontSize: 13 }}><ExternalLink size={14} /> Demo</a>}
            {isFounder && <Link href={`/projects/${project.id}/manage`} className="ds-btn-primary" style={{ fontSize: 13 }}>Manage</Link>}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Description */}
          <div className="ds-card" style={{ padding: 28 }}>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>About this project</h2>
            <p style={{ fontSize: 14, color: 'var(--ds-text-muted)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{project.description}</p>
          </div>

          {/* Blueprint */}
          {project.blueprint && (
            <div className="ds-card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <Zap size={18} color="#a78bfa" />
                <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18 }}>AI Blueprint</h2>
              </div>

              <p style={{ fontSize: 14, color: 'var(--ds-text-muted)', lineHeight: 1.7, marginBottom: 24 }}>{project.blueprint.overview}</p>

              {project.blueprint.tech_stack?.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 10, color: 'var(--ds-text-muted)' }}>TECH STACK</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {project.blueprint.tech_stack.map((t: string) => <span key={t} className="ds-badge ds-badge-accent">{t}</span>)}
                  </div>
                </div>
              )}

              {project.blueprint.milestones?.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 10, color: 'var(--ds-text-muted)' }}>MILESTONES</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {project.blueprint.milestones.map((m: string, i: number) => (
                      <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: 'var(--ds-surface-2)', borderRadius: 8 }}>
                        <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>Week {i + 1}</span>
                        <span style={{ fontSize: 13, color: 'var(--ds-text-muted)' }}>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.blueprint.required_roles?.length > 0 && (
                <div>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 10, color: 'var(--ds-text-muted)' }}>OPEN ROLES</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {project.blueprint.required_roles.map((r: any, i: number) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--ds-surface-2)', borderRadius: 8 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{r.role}</div>
                          <div style={{ fontSize: 12, color: 'var(--ds-text-muted)', marginTop: 2 }}>{r.skills?.join(', ')}</div>
                        </div>
                        <span className="ds-badge ds-badge-green">{r.equity}% equity</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Founder */}
          <div className="ds-card" style={{ padding: 20 }}>
            <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 14, color: 'var(--ds-text-muted)' }}>FOUNDER</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="ds-avatar">
                {project.profiles?.avatar_url
                  ? <img src={project.profiles.avatar_url} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : getInitials(project.profiles?.full_name || 'User')}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{project.profiles?.full_name}</div>
                <div style={{ fontSize: 12, color: 'var(--ds-text-muted)' }}>⭐ {project.profiles?.reputation_score} pts</div>
              </div>
            </div>
          </div>

          {/* Skills needed */}
          <div className="ds-card" style={{ padding: 20 }}>
            <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 12, color: 'var(--ds-text-muted)' }}>SKILLS NEEDED</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {project.required_skills?.map((s: string) => <span key={s} className="ds-badge" style={{ fontSize: 12 }}>{s}</span>)}
            </div>
          </div>

          {/* Team */}
          {project.project_members?.length > 0 && (
            <div className="ds-card" style={{ padding: 20 }}>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 14, color: 'var(--ds-text-muted)' }}>TEAM ({project.project_members.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {project.project_members.map((m: any) => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="ds-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
                      {getInitials(m.profiles?.full_name || 'U')}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{m.profiles?.full_name}</div>
                      <div style={{ fontSize: 11, color: 'var(--ds-text-muted)' }}>{m.role} · {m.equity_percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Apply */}
          {!isFounder && project.status === 'recruiting' && (
            <ApplyButton projectId={project.id} roles={project.blueprint?.required_roles || []} existingApplication={myApplication} />
          )}
        </div>
      </div>
    </div>
  )
}
