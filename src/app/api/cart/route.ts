import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ items: [] })

  const { data } = await supabase
    .from('carts')
    .select(`*, product:products(id, name, price_inr, primary_image_url, slug, stock)`)
    .eq('user_id', user.id)

  return NextResponse.json({ items: data ?? [] })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { product_id, size, quantity = 1 } = await req.json()

  const { data: existing } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', user.id)
    .eq('product_id', product_id)
    .eq('size', size)
    .single()

  if (existing) {
    await supabase.from('carts').update({ quantity: existing.quantity + quantity }).eq('id', existing.id)
  } else {
    await supabase.from('carts').insert({ user_id: user.id, product_id, size, quantity })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  await supabase.from('carts').delete().eq('id', id).eq('user_id', user.id)
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, quantity } = await req.json()
  if (quantity < 1) {
    await supabase.from('carts').delete().eq('id', id).eq('user_id', user.id)
  } else {
    await supabase.from('carts').update({ quantity }).eq('id', id).eq('user_id', user.id)
  }
  return NextResponse.json({ success: true })
}