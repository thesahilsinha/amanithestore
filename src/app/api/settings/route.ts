import { adminSupabase } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data } = await adminSupabase.from('settings').select('*')
  const settings: Record<string, any> = {}
  data?.forEach((row: any) => {
    try { settings[row.key] = JSON.parse(row.value) } catch { settings[row.key] = row.value }
  })
  return NextResponse.json(settings)
}