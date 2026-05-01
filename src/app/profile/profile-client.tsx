'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types'
import { Edit2, Save, GitBranch, Link2, Globe, Award, Folder } from "lucide-react"
import { getInitials, getReputationTier, SKILL_OPTIONS, formatDate } from '@/lib/utils'
import Link from 'next/link'

export default function ProfileClient({ profile, badges, projects }: {
  profile: Profile
  badges: any[]
  projects: any[]
}) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...profile })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const tier = getReputationTier(profile.reputation_score)

  async function save() {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('profiles').update({
      full_name: form.full_name,
      bio: form.bio,
      location: form.location,
      github_url: form.github_url,
      linkedin_url: form.linkedin_url,
      portfolio_url: form.portfolio_url,
      skills: form.skills,
    }).eq('id', profile.id)
    setSaving(false)
    if (!error) { setEditing(false); setMsg('Saved!') }
    else setMsg('Error saving')
    setTimeout(() => setMsg(''), 3000)
  }

  const toggleSkill = (s: string) => setForm(f => ({
    ...f,
    skills: f.skills.includes(s) ? f.skills.filter(x => x !== s) : [...f.skills, s]
  }))

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28 }}>My Profile</h1>
        <button className={editing ? 'ds-btn-primary' : 'ds-btn-secondary'} onClick={editing ? save : () => setEditing(true)} disabled={saving} style={{ gap: 8 }}>
          {editing ? <><Save size={15} /> {saving ? 'Saving…' : 'Save'}</> : <><Edit2 size={15} /> Edit</>}
        </button>
      </div>
      {msg && <div style={{ padding: '10px 16px', background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)', borderRadius: 8, fontSize: 13, color: '#00d4aa', marginBottom: 16 }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Main info */}
          <div className="ds-card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 24 }}>
              <div className="ds-avatar" style={{ width: 64, height: 64, fontSize: 22 }}>
                {profile.avatar_url
                  ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : getInitials(profile.full_name || profile.email)}
              </div>
              <div style={{ flex: 1 }}>
                {editing
                  ? <input className="ds-input" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Full name" style={{ marginBottom: 8 }} />
                  : <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>{profile.full_name}</div>
                }
                <div style={{ fontSize: 13, color: 'var(--ds-text-muted)', textTransform: 'capitalize' }}>{profile.role} · {profile.email}</div>
                {!editing && profile.location && <div style={{ fontSize: 13, color: 'var(--ds-text-muted)', marginTop: 2 }}>📍 {profile.location}</div>}
                {editing && <input className="ds-input" value={form.location || ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Location" style={{ marginTop: 8 }} />}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="ds-label">Bio</label>
              {editing
                ? <textarea className="ds-input" value={form.bio || ''} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell your story..." rows={3} style={{ resize: 'vertical' }} />
                : <p style={{ fontSize: 14, color: 'var(--ds-text-muted)', lineHeight: 1.7 }}>{profile.bio || 'No bio yet.'}</p>
              }
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {editing ? (
                <>
                  <input className="ds-input" value={form.github_url || ''} onChange={e => setForm(f => ({ ...f, github_url: e.target.value }))} placeholder="GitHub URL" style={{ flex: 1, minWidth: 180 }} />
                  <input className="ds-input" value={form.linkedin_url || ''} onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))} placeholder="LinkedIn URL" style={{ flex: 1, minWidth: 180 }} />
                  <input className="ds-input" value={form.portfolio_url || ''} onChange={e => setForm(f => ({ ...f, portfolio_url: e.target.value }))} placeholder="Portfolio URL" style={{ flex: 1, minWidth: 180 }} />
                </>
              ) : (
                <>
                  {profile.github_url && <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="ds-btn-secondary" style={{ padding: '7px 14px', fontSize: 13 }}><GitBranch size={14} /> GitHub</a>}
                  {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="ds-btn-secondary" style={{ padding: '7px 14px', fontSize: 13 }}><Link2 size={14} /> LinkedIn</a>}
                  {profile.portfolio_url && <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="ds-btn-secondary" style={{ padding: '7px 14px', fontSize: 13 }}><Globe size={14} /> Portfolio</a>}
                </>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="ds-card" style={{ padding: 28 }}>
            <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Skills</h3>
            {editing ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {SKILL_OPTIONS.map(s => (
                  <button key={s} onClick={() => toggleSkill(s)} style={{
                    padding: '4px 12px', borderRadius: 99, fontSize: 12, cursor: 'pointer',
                    border: form.skills.includes(s) ? '1px solid rgba(124,92,252,0.6)' : '1px solid var(--ds-border)',
                    background: form.skills.includes(s) ? 'rgba(124,92,252,0.12)' : 'transparent',
                    color: form.skills.includes(s) ? '#a78bfa' : 'var(--ds-text-muted)',
                    fontWeight: form.skills.includes(s) ? 600 : 400, transition: 'all 0.15s'
                  }}>{s}</button>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {profile.skills?.map(s => <span key={s} className="ds-badge">{s}</span>)}
                {(!profile.skills || profile.skills.length === 0) && <span style={{ fontSize: 13, color: 'var(--ds-text-muted)' }}>No skills added yet.</span>}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Reputation */}
          <div className="ds-card" style={{ padding: 20, textAlign: 'center' }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 42, color: '#a78bfa' }}>{profile.reputation_score}</div>
            <div style={{ fontSize: 13, color: 'var(--ds-text-muted)', marginBottom: 8 }}>Reputation points</div>
            <div className="ds-badge ds-badge-accent">{tier.label}</div>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="ds-card" style={{ padding: 20 }}>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 14, color: 'var(--ds-text-muted)' }}>BADGES</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {badges.map((b: any) => (
                  <span key={b.id} className="ds-badge ds-badge-accent" style={{ gap: 5 }}>
                    <Award size={11} />{b.badge_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="ds-card" style={{ padding: 20 }}>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 14, color: 'var(--ds-text-muted)' }}>MY PROJECTS</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {projects.map((p: any) => (
                  <Link key={p.id} href={`/projects/${p.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, background: 'var(--ds-surface-2)' }}>
                    <Folder size={13} color="var(--ds-text-muted)" />
                    <span style={{ fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--ds-text)' }}>{p.title}</span>
                    <span className={`ds-badge ${p.status === 'completed' ? 'ds-badge-green' : ''}`} style={{ fontSize: 10 }}>{p.status}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
