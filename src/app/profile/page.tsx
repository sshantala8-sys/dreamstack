import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import ProfileClient from './profile-client'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: badges } = await supabase.from('skill_badges').select('*, projects(title)').eq('user_id', user.id)
  const { data: projects } = await supabase.from('projects').select('id, title, status, created_at').eq('founder_id', user.id)

  return (
    <div>
      <Sidebar profile={profile as any} />
      <main className="ds-page">
        <ProfileClient profile={profile as any} badges={badges || []} projects={projects || []} />
      </main>
    </div>
  )
}
