'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(next)
      router.refresh()
    }
  }

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback?next=${next}` }
    })
  }

  return (
    <div className="ds-grid-bg min-h-screen flex items-center justify-center p-4">
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--ds-text)', marginBottom: 32 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#7c5cfc,#00d4aa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 14, color: 'white' }}>D</div>
            <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18 }}>DreamStack</span>
          </Link>
          <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: 'var(--ds-text-muted)', fontSize: 14 }}>Sign in to your account</p>
        </div>

        <div className="ds-card" style={{ padding: 32 }}>
          <button onClick={handleGoogle} className="ds-btn-secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: 24 }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--ds-border)' }} />
            <span style={{ fontSize: 12, color: 'var(--ds-text-faint)' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--ds-border)' }} />
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="ds-label">Email</label>
              <input className="ds-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="ds-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input className="ds-input" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--ds-text-muted)', cursor: 'pointer' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p style={{ fontSize: 13, color: '#ff6060', padding: '10px 14px', background: 'rgba(255,80,80,0.08)', borderRadius: 8 }}>{error}</p>}

            <button type="submit" className="ds-btn-primary" style={{ justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'} {!loading && <ArrowRight size={14} />}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--ds-text-muted)' }}>
          No account?{' '}
          <Link href="/signup" style={{ color: '#a78bfa', textDecoration: 'none' }}>Create one free</Link>
        </p>
      </div>
    </div>
  )
}
