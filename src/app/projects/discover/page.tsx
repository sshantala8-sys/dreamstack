import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Search, Users, Calendar, TrendingUp, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function DiscoverPage({ searchParams }: { searchParams: { q?: string; skill?: string } }) {
  const supabase = await createClient()
  let query = supabase
    .from('projects')
    .select('*, profiles!projects_founder_id_fkey(full_name, avatar_url, reputation_score), project_members(count)')
    .eq('status', 'recruiting')
    .order('created_at', { ascending: false })

  if (searchParams.q) query = query.ilike('title', `%${searchParams.q}%`)
  if (searchParams.skill) query = query.contains('required_skills', [searchParams.skill])

  const { data: projects } = await query.limit(20)

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, marginBottom: 4 }}>Discover Projects</h1>
        <p style={{ color: 'var(--ds-text-muted)', fontSize: 14 }}>Find projects that match your skills and apply to join</p>
      </div>

      {/* Search */}
      <form method="GET" style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ds-text-faint)' }} />
          <input name="q" defaultValue={searchParams.q} className="ds-input" placeholder="Search projects…" style={{ paddingLeft: 42 }} />
        </div>
        <button type="submit" className="ds-btn-primary">Search</button>
      </form>

      {/* Projects grid */}
      {projects && projects.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {projects.map((p: any) => (
            <Link key={p.id} href={`/projects/${p.id}`} style={{ textDecoration: 'none' }}>
              <div className="ds-card" style={{ padding: 24, cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 8 }}>
                    <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, lineHeight: 1.4 }}>{p.title}</h3>
                    <span className="ds-badge ds-badge-green" style={{ flexShrink: 0, fontSize: 11 }}>Recruiting</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--ds-text-muted)', lineHeight: 1.6, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {p.required_skills?.slice(0, 4).map((s: string) => <span key={s} className="ds-badge" style={{ fontSize: 11 }}>{s}</span>)}
                    {p.required_skills?.length > 4 && <span className="ds-badge" style={{ fontSize: 11 }}>+{p.required_skills.length - 4}</span>}
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--ds-border)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--ds-text-muted)' }}>
                      <Users size={13} /> {p.team_size} members
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--ds-text-muted)' }}>
                      <Calendar size={13} /> {formatDate(p.created_at)}
                    </div>
                  </div>
                  <ArrowRight size={14} color="var(--ds-text-faint)" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ color: 'var(--ds-text-muted)', fontSize: 16 }}>No projects found. Be the first to post one!</p>
          <Link href="/projects/new" className="ds-btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>Create a project</Link>
        </div>
      )}
    </div>
  )
}
