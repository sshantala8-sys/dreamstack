import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Plus, TrendingUp, Zap, Users, Award } from 'lucide-react'
import { formatDate, getReputationTier } from '@/lib/utils'
import { Project, Application, SkillBadge } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: myProjects } = await supabase.from('projects').select('*, project_members(count)').eq('founder_id', user.id).order('created_at', { ascending: false }).limit(5)
  const { data: myApplications } = await supabase.from('applications').select('*, projects(title, status)').eq('applicant_id', user.id).order('created_at', { ascending: false }).limit(5)
  const { data: badges } = await supabase.from('skill_badges').select('*, projects(title)').eq('user_id', user.id).order('issued_at', { ascending: false }).limit(6)

  const tier = getReputationTier(profile?.reputation_score || 0)

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, marginBottom: 4 }}>
          Welcome back, {profile?.full_name?.split(' ')[0] || 'Builder'} 👋
        </h1>
        <p style={{ color: 'var(--ds-text-muted)', fontSize: 14 }}>{formatDate(new Date().toISOString())}</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Reputation Score', value: profile?.reputation_score || 0, sub: tier.label, icon: <TrendingUp size={18} />, color: '#7c5cfc' },
          { label: 'My Projects', value: myProjects?.length || 0, sub: 'active', icon: <Zap size={18} />, color: '#00d4aa' },
          { label: 'Applications', value: myApplications?.length || 0, sub: 'sent', icon: <Users size={18} />, color: '#ff6b35' },
          { label: 'Badges Earned', value: badges?.length || 0, sub: 'verified', icon: <Award size={18} />, color: '#7c5cfc' },
        ].map(stat => (
          <div key={stat.label} className="ds-card" style={{ padding: 20, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${stat.color}18`, border: `1px solid ${stat.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, flexShrink: 0 }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 26 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: 'var(--ds-text-muted)' }}>{stat.label}</div>
              <div style={{ fontSize: 11, color: stat.color, fontWeight: 600, marginTop: 2 }}>{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {/* My Projects */}
        <div className="ds-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16 }}>My Projects</h2>
            <Link href="/projects/new" className="ds-btn-primary" style={{ padding: '7px 14px', fontSize: 13 }}>
              <Plus size={14} /> New
            </Link>
          </div>
          {myProjects && myProjects.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {myProjects.map((p: any) => (
                <Link key={p.id} href={`/projects/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '12px 14px', background: 'var(--ds-surface-2)', borderRadius: 10, border: '1px solid var(--ds-border)', cursor: 'pointer', transition: 'border-color 0.15s' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: 'var(--ds-text)' }}>{p.title}</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span className={`ds-badge ${p.status === 'completed' ? 'ds-badge-green' : p.status === 'in_progress' ? 'ds-badge-accent' : ''}`} style={{ fontSize: 11 }}>
                        {p.status?.replace('_', ' ')}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--ds-text-faint)' }}>{formatDate(p.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ color: 'var(--ds-text-muted)', fontSize: 14, marginBottom: 16 }}>No projects yet. Start building!</p>
              <Link href="/projects/new" className="ds-btn-primary" style={{ fontSize: 13 }}>
                <Plus size={14} /> Create first project
              </Link>
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="ds-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16 }}>Applications</h2>
            <Link href="/projects/discover" className="ds-btn-ghost" style={{ fontSize: 13 }}>
              Discover <ArrowRight size={12} />
            </Link>
          </div>
          {myApplications && myApplications.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {myApplications.map((a: any) => (
                <div key={a.id} style={{ padding: '12px 14px', background: 'var(--ds-surface-2)', borderRadius: 10, border: '1px solid var(--ds-border)' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{a.projects?.title}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className={`ds-badge ${a.status === 'accepted' ? 'ds-badge-green' : a.status === 'rejected' ? 'ds-badge-orange' : ''}`} style={{ fontSize: 11 }}>
                      {a.status}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--ds-text-faint)' }}>for {a.role}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ color: 'var(--ds-text-muted)', fontSize: 14 }}>No applications yet.</p>
            </div>
          )}
        </div>

        {/* Badges */}
        {badges && badges.length > 0 && (
          <div className="ds-card" style={{ padding: 24 }}>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Skill Badges</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {badges.map((b: any) => (
                <div key={b.id} className="ds-badge ds-badge-accent" style={{ gap: 6 }}>
                  <Award size={12} />
                  {b.badge_name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
