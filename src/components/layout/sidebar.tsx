'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, FolderOpen, Search, User, Star,
  LogOut, Zap, Settings, Shield, TrendingUp
} from 'lucide-react'
import { Profile } from '@/types'
import { getInitials, getReputationTier } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/projects/discover', label: 'Discover', icon: Search },
  { href: '/profile', label: 'My Profile', icon: User },
  { href: '/sponsor', label: 'Sponsor Feed', icon: Star },
]

export function Sidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const router = useRouter()
  const tier = getReputationTier(profile.reputation_score)

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="ds-sidebar">
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--ds-border)' }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--ds-text)' }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#7c5cfc,#00d4aa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 13, color: 'white' }}>D</div>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16 }}>DreamStack</span>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10,
              textDecoration: 'none', fontSize: 14, fontWeight: active ? 600 : 400,
              background: active ? 'rgba(124,92,252,0.12)' : 'transparent',
              color: active ? '#a78bfa' : 'var(--ds-text-muted)',
              border: active ? '1px solid rgba(124,92,252,0.2)' : '1px solid transparent',
              transition: 'all 0.15s',
            }}>
              <Icon size={16} />
              {label}
            </Link>
          )
        })}

        {profile.role === 'admin' && (
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, textDecoration: 'none', fontSize: 14, color: 'var(--ds-text-muted)', border: '1px solid transparent' }}>
            <Shield size={16} /> Admin
          </Link>
        )}
      </nav>

      {/* Profile */}
      <div style={{ padding: 12, borderTop: '1px solid var(--ds-border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Reputation */}
        <div style={{ padding: '10px 12px', background: 'var(--ds-surface-2)', borderRadius: 10, border: '1px solid var(--ds-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--ds-text-muted)' }}>Reputation</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#a78bfa' }}>{tier.label}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <TrendingUp size={12} color="#00d4aa" />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ds-text)' }}>{profile.reputation_score} pts</span>
          </div>
        </div>

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px' }}>
          <div className="ds-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              : getInitials(profile.full_name || profile.email)
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.full_name || 'User'}</div>
            <div style={{ fontSize: 11, color: 'var(--ds-text-muted)', textTransform: 'capitalize' }}>{profile.role}</div>
          </div>
          <button onClick={signOut} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ds-text-muted)', padding: 4 }}>
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
