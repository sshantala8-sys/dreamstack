'use client'
import { useState } from 'react'
import { CheckCircle, Send } from 'lucide-react'

export default function ApplyButton({ projectId, roles, existingApplication }: {
  projectId: string
  roles: { role: string; skills: string[] }[]
  existingApplication?: { id: string; status: string } | null
}) {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState(roles[0]?.role || '')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  if (existingApplication) {
    return (
      <div className="ds-card" style={{ padding: 20, textAlign: 'center' }}>
        <CheckCircle size={24} color="#00d4aa" style={{ margin: '0 auto 8px' }} />
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Application sent</div>
        <div style={{ fontSize: 12, color: 'var(--ds-text-muted)', textTransform: 'capitalize' }}>Status: {existingApplication.status}</div>
      </div>
    )
  }

  async function apply() {
    setLoading(true)
    setError('')
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId, role, cover_note: note })
    })
    const data = await res.json()
    if (data.application) { setDone(true); setOpen(false) }
    else setError(data.error || 'Failed to apply')
    setLoading(false)
  }

  if (done) return (
    <div className="ds-card" style={{ padding: 20, textAlign: 'center' }}>
      <CheckCircle size={24} color="#00d4aa" style={{ margin: '0 auto 8px' }} />
      <div style={{ fontSize: 14, fontWeight: 600 }}>Application sent! 🎉</div>
    </div>
  )

  return (
    <div className="ds-card" style={{ padding: 20 }}>
      {!open ? (
        <button className="ds-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setOpen(true)}>
          <Send size={15} /> Apply to join
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15 }}>Apply to join</h3>
          <div>
            <label className="ds-label">Role you want</label>
            <select className="ds-input" value={role} onChange={e => setRole(e.target.value)}>
              {roles.map((r: any) => <option key={r.role} value={r.role}>{r.role}</option>)}
            </select>
          </div>
          <div>
            <label className="ds-label">Why you? (cover note)</label>
            <textarea className="ds-input" value={note} onChange={e => setNote(e.target.value)} placeholder="Tell the founder why you're the right fit..." rows={4} style={{ resize: 'vertical' }} />
          </div>
          {error && <p style={{ fontSize: 13, color: '#ff6060' }}>{error}</p>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="ds-btn-ghost" onClick={() => setOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
            <button className="ds-btn-primary" onClick={apply} disabled={loading || !note} style={{ flex: 2, justifyContent: 'center' }}>
              {loading ? 'Sending…' : 'Send application'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
