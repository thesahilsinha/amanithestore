import { adminSupabase } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email === process.env.ADMIN_EMAIL ? user : null
}

export async function GET() {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await adminSupabase.from('campaign_banners').select('*').order('created_at', { ascending: false })
  return NextResponse.json({ banners: data })
}

export async function POST(req: NextRequest) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { data, error } = await adminSupabase.from('campaign_banners').insert({ ...body, is_active: false }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ banner: data })
}
