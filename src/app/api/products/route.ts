import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)

  const filter = searchParams.get('filter')
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const tag = searchParams.get('tag')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = 12
  const offset = (page - 1) * limit

  let query = supabase
    .from('products')
    .select('id,name,slug,price_inr,primary_image_url,secondary_images,tags,stock,is_bestseller,is_amani_favourite,created_at', { count: 'exact' })
    .eq('is_active', true)
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false })

  if (filter === 'new') query = query.order('created_at', { ascending: false })
  if (filter === 'bestseller') query = query.eq('is_bestseller', true)
  if (filter === 'favourite') query = query.eq('is_amani_favourite', true)
  if (category) query = query.eq('category_id', category)
  if (search) query = query.ilike('name', `%${search}%`)

  const { data, count, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let filtered = data ?? []
  if (tag) {
    filtered = filtered.filter((p: any) =>
      p.tags?.some((t: string) => t.toLowerCase().includes(tag.toLowerCase()))
    )
  }

  return NextResponse.json({ products: filtered, total: count ?? 0, page, limit })
}