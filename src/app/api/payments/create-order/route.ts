import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { plan } = body // 'premium'

  const amount = plan === 'premium' ? 49900 : 0 // ₹499 in paise

  if (amount === 0) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  const { data: profile } = await supabase.from('profiles').select('full_name, email').eq('id', user.id).single()

  const order = await razorpay.orders.create({
    amount,
    currency: 'INR',
    receipt: `order_${user.id}_${Date.now()}`,
    notes: { user_id: user.id, plan }
  })

  return NextResponse.json({
    order_id: order.id,
    amount: order.amount,
    currency: order.currency,
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    name: profile?.full_name || 'User',
    email: profile?.email || user.email,
  })
}
