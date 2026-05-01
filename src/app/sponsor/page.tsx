import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import Link from 'next/link'
import { ExternalLink, Users, Award, TrendingUp } from 'lucide-react'
import { formatDate, getInitials, getReputationTier } from '@/lib/utils'

export default async function SponsorFeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  // Get completed projects (sponsor feed shows these)
  const { data: completed } = await supabase
    .from('projects')
    .select('*, profiles!projects_founder_id_fkey(full_name, avatar_url, reputation_score), project_members(count)')
    .eq('status', 'completed')
    .order('updated_at', { ascending: false })
    .limit(20)

  // Get sponsor quests
  const { data: quests } = await supabase
    .from('sponsor_quests')
    .select('*, profiles!sponsor_quests_sponsor_id_fkey(full_name, avatar_url)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div>
      <Sidebar profile={profile as any} />
      <main className="ds-page">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, marginBottom: 4 }}>Sponsor Feed</h1>
            <p style={{ color: 'var(--ds-text-muted)', fontSize: 14 }}>Completed projects — the talent recruiters are watching</p>
          </div>

          {/* Sponsor Quests */}
          {quests && quests.length > 0 && (
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>⚡ Innovation Quests</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {quests.map((q: any) => (
                  <div key={q.id} className="ds-card" style={{ padding: 24, border: '1px solid rgba(255,107,53,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span className="ds-badge ds-badge-orange">Sponsored</span>
                      <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, color: '#00d4aa', fontSize: 18 }}>₹{q.prize_amount?.toLocaleString('en-IN')}</span>
                    </div>
                    <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{q.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--ds-text-muted)', lineHeight: 1.6, marginBottom: 12 }}>{q.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
                      {q.required_skills?.map((s: string) => <span key={s} className="ds-badge" style={{ fontSize: 11 }}>{s}</span>)}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--ds-text-muted)' }}>
                      <span>By {q.profiles?.full_name}</span>
                      <span>Deadline: {formatDate(q.deadline)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Projects Feed */}
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>🚀 Completed Projects</h2>
          {completed && completed.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {completed.map((p: any) => {
                const tier = getReputationTier(p.profiles?.reputation_score || 0)
                return (
                  <div key={p.id} className="ds-card" style={{ padding: 28 }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      {/* Founder avatar */}
                      <div className="ds-avatar" style={{ width: 48, height: 48, fontSize: 16, flexShrink: 0 }}>
                        {p.profiles?.avatar_url
                          ? <img src={p.profiles.avatar_url} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                          : getInitials(p.profiles?.full_name || 'U')}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                          <div>
                            <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 2 }}>{p.title}</h3>
                            <div style={{ fontSize: 13, color: 'var(--ds-text-muted)' }}>
                              by {p.profiles?.full_name} · <span style={{ color: tier.color?.replace('text-', '') || '#a78bfa' }}>{tier.label}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <span className="ds-badge ds-badge-green">Completed</span>
                            {p.demo_url && (
                              <a href={p.demo_url} target="_blank" rel="noopener noreferrer" className="ds-btn-secondary" style={{ padding: '5px 12px', fontSize: 12 }}>
                                <ExternalLink size={12} /> Demo
                              </a>
                            )}
                          </div>
                        </div>

                        <p style={{ fontSize: 14, color: 'var(--ds-text-muted)', lineHeight: 1.7, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {p.description}
                        </p>

                        {p.blueprint?.tech_stack?.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                            {p.blueprint.tech_stack.map((t: string) => <span key={t} className="ds-badge ds-badge-accent" style={{ fontSize: 11 }}>{t}</span>)}
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--ds-text-muted)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={12} /> {p.project_members?.[0]?.count || 0} members</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><TrendingUp size={12} /> {p.profiles?.reputation_score} pts</span>
                          <span>{formatDate(p.updated_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ color: 'var(--ds-text-muted)', fontSize: 15 }}>No completed projects yet. Be the first to ship! 🚀</p>
              <Link href="/projects/new" className="ds-btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>Start a project</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
