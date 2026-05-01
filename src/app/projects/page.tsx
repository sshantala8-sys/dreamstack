import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Folder, Users, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: myProjects } = await supabase
    .from('projects')
    .select('*, project_members(count)')
    .eq('founder_id', user!.id)
    .order('created_at', { ascending: false })

  const { data: memberProjects } = await supabase
    .from('project_members')
    .select('projects(*, profiles!projects_founder_id_fkey(full_name))')
    .eq('user_id', user!.id)
    .neq('role', 'Founder')

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, marginBottom: 4 }}>Projects</h1>
          <p style={{ color: 'var(--ds-text-muted)', fontSize: 14 }}>Your founded and joined projects</p>
        </div>
        <Link href="/projects/new" className="ds-btn-primary"><Plus size={15} /> New Project</Link>
      </div>

      {/* Founded */}
      <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Founded by you</h2>
      {myProjects && myProjects.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16, marginBottom: 40 }}>
          {myProjects.map((p: any) => (
            <Link key={p.id} href={`/projects/${p.id}`} style={{ textDecoration: 'none' }}>
              <div className="ds-card" style={{ padding: 24, cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Folder size={20} color="var(--ds-text-muted)" />
                  <span className={`ds-badge ${p.status === 'completed' ? 'ds-badge-green' : p.status === 'in_progress' ? 'ds-badge-accent' : p.status === 'recruiting' ? 'ds-badge-orange' : ''}`} style={{ fontSize: 11 }}>
                    {p.status?.replace('_', ' ')}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--ds-text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 16 }}>{p.description}</p>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--ds-text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={12} /> {p.team_size}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {formatDate(p.created_at)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '48px', background: 'var(--ds-surface)', borderRadius: 16, border: '1px dashed var(--ds-border)', marginBottom: 40 }}>
          <p style={{ color: 'var(--ds-text-muted)', marginBottom: 16 }}>You haven't founded any projects yet.</p>
          <Link href="/projects/new" className="ds-btn-primary"><Plus size={14} /> Create your first project</Link>
        </div>
      )}

      {/* Member of */}
      {memberProjects && memberProjects.length > 0 && (
        <>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Projects you joined</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16 }}>
            {memberProjects.map((m: any, i: number) => {
              const p = m.projects
              if (!p) return null
              return (
                <Link key={i} href={`/projects/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div className="ds-card" style={{ padding: 24 }}>
                    <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{p.title}</h3>
                    <div style={{ fontSize: 12, color: 'var(--ds-text-muted)' }}>by {p.profiles?.full_name}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
