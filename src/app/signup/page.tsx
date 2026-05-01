'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { SKILL_OPTIONS } from '@/lib/utils'

type Role = 'student' | 'recruiter' | 'sponsor'

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<Role>('student')
  const [skills, setSkills] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (step === 1) { setStep(2); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, role, skills, location } }
    })
    if (signUpError) { setError(signUpError.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id, email, full_name: fullName, role, skills, location,
        reputation_score: 0, subscription_tier: 'free'
      })
      router.push('/dashboard')
    }
  }

  const toggleSkill = (s: string) => setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  return (
    <div className="ds-grid-bg min-h-screen flex items-center justify-center p-4">
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--ds-text)', marginBottom: 32 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#7c5cfc,#00d4aa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 14, color: 'white' }}>D</div>
            <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18 }}>DreamStack</span>
          </Link>
          <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, marginBottom: 8 }}>
            {step === 1 ? 'Create your account' : 'Tell us about yourself'}
          </h1>
          <p style={{ color: 'var(--ds-text-muted)', fontSize: 14 }}>
            Step {step} of 2 — {step === 1 ? 'Account details' : 'Profile setup'}
          </p>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 16 }}>
            {[1, 2].map(s => (
              <div key={s} style={{ height: 3, width: 40, borderRadius: 99, background: s <= step ? '#7c5cfc' : 'var(--ds-border)', transition: 'background 0.3s' }} />
            ))}
          </div>
        </div>

        <div className="ds-card" style={{ padding: 32 }}>
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {step === 1 ? (
              <>
                <div>
                  <label className="ds-label">Full name</label>
                  <input className="ds-input" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" required />
                </div>
                <div>
                  <label className="ds-label">Email</label>
                  <input className="ds-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
                <div>
                  <label className="ds-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <input className="ds-input" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" required minLength={8} style={{ paddingRight: 44 }} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--ds-text-muted)', cursor: 'pointer' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="ds-label">I am a</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {(['student', 'recruiter', 'sponsor'] as Role[]).map(r => (
                      <button key={r} type="button" onClick={() => setRole(r)} style={{
                        padding: '10px 8px', borderRadius: 10, border: role === r ? '1px solid rgba(124,92,252,0.6)' : '1px solid var(--ds-border)',
                        background: role === r ? 'rgba(124,92,252,0.12)' : 'transparent', color: role === r ? '#a78bfa' : 'var(--ds-text-muted)',
                        fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 13, cursor: 'pointer', textTransform: 'capitalize'
                      }}>{r}</button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="ds-label">Location (city, country)</label>
                  <input className="ds-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Bangalore, India" />
                </div>
                {role === 'student' && (
                  <div>
                    <label className="ds-label">Your skills (pick all that apply)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                      {SKILL_OPTIONS.map(s => (
                        <button key={s} type="button" onClick={() => toggleSkill(s)} style={{
                          padding: '5px 12px', borderRadius: 99, fontSize: 12, cursor: 'pointer',
                          border: skills.includes(s) ? '1px solid rgba(124,92,252,0.6)' : '1px solid var(--ds-border)',
                          background: skills.includes(s) ? 'rgba(124,92,252,0.12)' : 'transparent',
                          color: skills.includes(s) ? '#a78bfa' : 'var(--ds-text-muted)',
                          fontWeight: skills.includes(s) ? 600 : 400, transition: 'all 0.15s'
                        }}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {error && <p style={{ fontSize: 13, color: '#ff6060', padding: '10px 14px', background: 'rgba(255,80,80,0.08)', borderRadius: 8 }}>{error}</p>}

            <button type="submit" className="ds-btn-primary" style={{ justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Creating account…' : step === 1 ? 'Continue' : 'Create account'} {!loading && <ArrowRight size={14} />}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--ds-text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#a78bfa', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
