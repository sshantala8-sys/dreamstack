import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, description, required_skills, team_size } = body

  const prompt = `You are an expert technical project manager and startup advisor. Analyze this student project idea and generate a detailed technical blueprint.

Project Title: ${title}
Description: ${description}
Required Skills: ${required_skills?.join(', ') || 'Not specified'}
Team Size: ${team_size}

Respond ONLY with a valid JSON object (no markdown, no backticks) with this exact structure:
{
  "overview": "2-3 sentence summary of the project and its key value proposition",
  "tech_stack": ["list", "of", "technologies"],
  "milestones": ["Week 1-2 goal", "Week 3-4 goal", "Week 5-6 goal", "Week 7-8 goal", "Week 9-10 goal"],
  "required_roles": [
    { "role": "Role Name", "skills": ["skill1", "skill2"], "equity": 15 }
  ],
  "estimated_weeks": 10
}

Rules:
- required_roles should have ${team_size - 1} roles (excluding the founder)
- equity for all roles combined should not exceed 60 (founder keeps the rest)
- Be specific and realistic for student builders`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      const err = await response.json()
      return NextResponse.json({ error: 'AI service error: ' + (err.error?.message || 'Unknown') }, { status: 500 })
    }

    const data = await response.json()
    const text = data.choices[0].message.content.trim()
    
    let blueprint
    try {
      blueprint = JSON.parse(text)
    } catch {
      const match = text.match(/\{[\s\S]*\}/)
      if (match) blueprint = JSON.parse(match[0])
      else return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    return NextResponse.json({ blueprint })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'AI service unavailable' }, { status: 500 })
  }
}
