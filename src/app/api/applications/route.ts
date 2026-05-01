import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get('project_id')

  let query = supabase.from('applications').select('*, profiles!applications_applicant_id_fkey(*), projects(title)')

  if (projectId) query = query.eq('project_id', projectId)
  else query = query.eq('applicant_id', user.id)

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ applications: data })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { project_id, role, cover_note } = body

  if (!project_id || !role || !cover_note) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

  // Check not already applied
  const { data: existing } = await supabase.from('applications').select('id').eq('project_id', project_id).eq('applicant_id', user.id).single()
  if (existing) return NextResponse.json({ error: 'Already applied to this project' }, { status: 409 })

  // Check not founder
  const { data: project } = await supabase.from('projects').select('founder_id').eq('id', project_id).single()
  if (project?.founder_id === user.id) return NextResponse.json({ error: 'Cannot apply to your own project' }, { status: 400 })

  const { data, error } = await supabase.from('applications').insert({
    project_id, applicant_id: user.id, role, cover_note, status: 'pending'
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ application: data })
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { application_id, status } = body

  if (!['accepted', 'rejected'].includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })

  // Verify requester is the project founder
  const { data: app } = await supabase.from('applications').select('*, projects(founder_id)').eq('id', application_id).single()
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if ((app.projects as any).founder_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data, error } = await supabase.from('applications').update({ status }).eq('id', application_id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // If accepted, add to project_members
  if (status === 'accepted') {
    const { data: project } = await supabase.from('projects').select('blueprint').eq('id', app.project_id).single()
    const roleData = (project?.blueprint as any)?.required_roles?.find((r: any) => r.role === app.role)
    await supabase.from('project_members').insert({
      project_id: app.project_id,
      user_id: app.applicant_id,
      role: app.role,
      equity_percentage: roleData?.equity || 0
    })
    await supabase.rpc('increment_reputation', { user_id: app.applicant_id, points: 20 })
  }

  return NextResponse.json({ application: data })
}
