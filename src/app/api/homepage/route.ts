import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const [banner, categories, currencies] = await Promise.all([
    supabase.from('campaign_banners').select('*').eq('is_active', true).single(),
    supabase.from('categories').select('*').eq('is_active', true).order('display_order'),
    supabase.from('currency_settings').select('*').eq('is_active', true),
  ])

  return NextResponse.json({
    banner: banner.data,
    categories: categories.data,
    currencies: currencies.data,
  })
}