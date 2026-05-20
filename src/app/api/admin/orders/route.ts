import { adminSupabase } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.email !== process.env.ADMIN_EMAIL) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await adminSupabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  return NextResponse.json({ orders: data })
}