import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const mine = searchParams.get('mine')

  let query = supabase.from('projects').select('*, profiles!projects_founder_id_fkey(full_name, avatar_url), project_members(count)').order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (mine === 'true') query = query.eq('founder_id', user.id)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ projects: data })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, description, tags, required_skills, team_size, blueprint, status } = body

  if (!title || !description) return NextResponse.json({ error: 'Title and description required' }, { status: 400 })

  const { data, error } = await supabase.from('projects').insert({
    founder_id: user.id,
    title, description, tags, required_skills, team_size,
    blueprint, status: status || 'draft',
    is_sponsored: false
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Add founder as member
  await supabase.from('project_members').insert({
    project_id: data.id,
    user_id: user.id,
    role: 'Founder',
    equity_percentage: 100 - (blueprint?.required_roles?.reduce((a: number, r: any) => a + r.equity, 0) || 0)
  })

  // Bump reputation
  await supabase.rpc('increment_reputation', { user_id: user.id, points: 10 })

  return NextResponse.json({ project: data })
}
