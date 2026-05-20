import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select(`*, category:categories(id, name, slug)`)
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (error || !product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Related products — same category, exclude self
  const { data: related } = await supabase
    .from('products')
    .select('id,name,slug,price_inr,primary_image_url,secondary_images,tags,stock')
    .eq('is_active', true)
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .limit(4)

  return NextResponse.json({ product, related: related ?? [] })
}