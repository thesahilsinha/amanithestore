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
  const { data } = await adminSupabase.from('settings').select('*')
  const settings: Record<string, any> = {}
  data?.forEach((r: any) => {
    try { settings[r.key] = JSON.parse(r.value) } catch { settings[r.key] = r.value }
  })
  return NextResponse.json(settings)
}

export async function PATCH(req: NextRequest) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const updates = await req.json()
  for (const [key, value] of Object.entries(updates)) {
    await adminSupabase.from('settings').upsert({ key, value: JSON.stringify(value) })
  }
  return NextResponse.json({ success: true })
}