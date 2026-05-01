'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, ArrowRight, Loader, Plus, X } from 'lucide-react'
import { SKILL_OPTIONS } from '@/lib/utils'

const STEPS = ['Idea', 'Blueprint', 'Team', 'Publish']

export default function NewProjectPage() {
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [requiredSkills, setRequiredSkills] = useState<string[]>([])
  const [teamSize, setTeamSize] = useState(3)
  const [blueprint, setBlueprint] = useState<any>(null)
  const [loadingBlueprint, setLoadingBlueprint] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function generateBlueprint() {
    setLoadingBlueprint(true)
    setError('')
    try {
      const res = await fetch('/api/ai/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, required_skills: requiredSkills, team_size: teamSize })
      })
      const data = await res.json()
      if (data.blueprint) {
        setBlueprint(data.blueprint)
        setStep(1)
      } else {
        setError(data.error || 'Failed to generate blueprint')
      }
    } catch {
      setError('Failed to connect to AI service')
    }
    setLoadingBlueprint(false)
  }

  async function publishProject() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, tags, required_skills: requiredSkills, team_size: teamSize, blueprint, status: 'recruiting' })
      })
      const data = await res.json()
      if (data.project) {
        router.push(`/projects/${data.project.id}`)
      } else {
        setError(data.error || 'Failed to create project')
      }
    } catch {
      setError('Failed to create project')
    }
    setLoading(false)
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()])
      setTagInput('')
    }
  }

  const toggleSkill = (s: string) => setRequiredSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, marginBottom: 4 }}>New Project</h1>
        <p style={{ color: 'var(--ds-text-muted)', fontSize: 14 }}>Let AI analyze your idea and build the blueprint</p>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 32 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, fontFamily: 'Syne,sans-serif',
                background: i <= step ? '#7c5cfc' : 'var(--ds-surface-2)',
                color: i <= step ? 'white' : 'var(--ds-text-faint)',
                border: i <= step ? 'none' : '1px solid var(--ds-border)',
              }}>{i + 1}</div>
              <span style={{ fontSize: 13, color: i === step ? 'var(--ds-text)' : 'var(--ds-text-muted)', fontWeight: i === step ? 600 : 400 }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: i < step ? '#7c5cfc' : 'var(--ds-border)', margin: '0 12px' }} />}
          </div>
        ))}
      </div>

      <div className="ds-card" style={{ padding: 32 }}>
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="ds-label">Project title *</label>
              <input className="ds-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. AI-powered study planner for students" />
            </div>
            <div>
              <label className="ds-label">Description *</label>
              <textarea className="ds-input" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your project idea in detail. What problem does it solve? Who is it for?" rows={5} style={{ resize: 'vertical', fontFamily: 'DM Sans, sans-serif' }} />
            </div>
            <div>
              <label className="ds-label">Tags</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input className="ds-input" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag and press Enter" style={{ flex: 1 }} />
                <button onClick={addTag} className="ds-btn-secondary" style={{ padding: '0 16px', flexShrink: 0 }}><Plus size={16} /></button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {tags.map(t => (
                  <span key={t} className="ds-badge" style={{ gap: 6 }}>
                    {t}
                    <button onClick={() => setTags(prev => prev.filter(x => x !== t))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, display: 'flex' }}>
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="ds-label">Required skills</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {SKILL_OPTIONS.map(s => (
                  <button key={s} onClick={() => toggleSkill(s)} style={{
                    padding: '4px 12px', borderRadius: 99, fontSize: 12, cursor: 'pointer',
                    border: requiredSkills.includes(s) ? '1px solid rgba(124,92,252,0.6)' : '1px solid var(--ds-border)',
                    background: requiredSkills.includes(s) ? 'rgba(124,92,252,0.12)' : 'transparent',
                    color: requiredSkills.includes(s) ? '#a78bfa' : 'var(--ds-text-muted)',
                    fontWeight: requiredSkills.includes(s) ? 600 : 400, transition: 'all 0.15s'
                  }}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="ds-label">Team size: {teamSize} people</label>
              <input type="range" min={2} max={10} value={teamSize} onChange={e => setTeamSize(Number(e.target.value))} style={{ width: '100%', accentColor: '#7c5cfc' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ds-text-faint)', marginTop: 4 }}>
                <span>2</span><span>10</span>
              </div>
            </div>
            {error && <p style={{ fontSize: 13, color: '#ff6060', padding: '10px 14px', background: 'rgba(255,80,80,0.08)', borderRadius: 8 }}>{error}</p>}
            <button className="ds-btn-primary" style={{ justifyContent: 'center' }} onClick={generateBlueprint} disabled={!title || !description || loadingBlueprint}>
              {loadingBlueprint ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing with AI…</> : <><Zap size={16} /> Generate Blueprint</>}
            </button>
          </div>
        )}

        {step === 1 && blueprint && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ padding: 20, background: 'rgba(124,92,252,0.06)', borderRadius: 12, border: '1px solid rgba(124,92,252,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Zap size={16} color="#a78bfa" />
                <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, color: '#a78bfa' }}>AI Blueprint</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--ds-text-muted)', lineHeight: 1.6 }}>{blueprint.overview}</p>
            </div>

            <div>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Tech Stack</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {blueprint.tech_stack?.map((t: string) => <span key={t} className="ds-badge ds-badge-accent">{t}</span>)}
              </div>
            </div>

            <div>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Milestones</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {blueprint.milestones?.map((m: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: 'var(--ds-surface-2)', borderRadius: 8, fontSize: 14 }}>
                    <span style={{ color: '#a78bfa', fontWeight: 700, flexShrink: 0 }}>W{i + 1}</span>
                    <span style={{ color: 'var(--ds-text-muted)' }}>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Required Roles</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {blueprint.required_roles?.map((r: any, i: number) => (
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

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="ds-btn-secondary" onClick={() => setStep(0)} style={{ flex: 1, justifyContent: 'center' }}>← Edit idea</button>
              <button className="ds-btn-primary" onClick={() => setStep(2)} style={{ flex: 1, justifyContent: 'center' }}>Continue <ArrowRight size={14} /></button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ padding: 20, background: 'var(--ds-surface-2)', borderRadius: 12, border: '1px solid var(--ds-border)' }}>
              <p style={{ fontSize: 14, color: 'var(--ds-text-muted)', lineHeight: 1.6 }}>
                By publishing, you agree to the DreamStack <strong style={{ color: 'var(--ds-text)' }}>Digital Equity Agreement</strong>. This legally formalizes IP ownership and equity splits as defined in your blueprint. All team members will sign this agreement before joining.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {blueprint?.required_roles?.map((r: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--ds-surface-2)', borderRadius: 8, fontSize: 14 }}>
                  <span style={{ color: 'var(--ds-text)' }}>{r.role}</span>
                  <span style={{ color: '#00d4aa', fontWeight: 600 }}>{r.equity}%</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(124,92,252,0.08)', borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
                <span>You (Founder)</span>
                <span style={{ color: '#a78bfa' }}>{100 - (blueprint?.required_roles?.reduce((a: number, r: any) => a + r.equity, 0) || 0)}%</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="ds-btn-secondary" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>← Blueprint</button>
              <button className="ds-btn-primary" onClick={() => setStep(3)} style={{ flex: 1, justifyContent: 'center' }}>I agree <ArrowRight size={14} /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 0' }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24, marginBottom: 8 }}>Ready to publish!</div>
            <p style={{ color: 'var(--ds-text-muted)', fontSize: 15, maxWidth: 400, margin: '0 auto', lineHeight: 1.7 }}>
              Your project will go live on the platform. Our AI will start matching potential team members within minutes.
            </p>
            <div style={{ padding: 20, background: 'var(--ds-surface-2)', borderRadius: 12, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
              <div style={{ fontSize: 13, color: 'var(--ds-text-muted)' }}>Team size: {teamSize} • Estimated: {blueprint?.estimated_weeks} weeks</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {requiredSkills.slice(0, 4).map(s => <span key={s} className="ds-badge" style={{ fontSize: 11 }}>{s}</span>)}
              </div>
            </div>
            {error && <p style={{ fontSize: 13, color: '#ff6060', padding: '10px 14px', background: 'rgba(255,80,80,0.08)', borderRadius: 8 }}>{error}</p>}
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="ds-btn-secondary" onClick={() => setStep(2)} style={{ flex: 1, justifyContent: 'center' }}>← Back</button>
              <button className="ds-btn-primary" onClick={publishProject} disabled={loading} style={{ flex: 2, justifyContent: 'center' }}>
                {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Publishing…</> : '🚀 Publish Project'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
