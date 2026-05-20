import { createClient } from '@/lib/supabase/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { sendOrderConfirmationEmail } from '@/lib/email'

function generateOrderNumber() {
  return `AMN-${Date.now().toString().slice(-8)}`
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const {
    items, subtotal_inr, delivery_charge_inr, total_inr,
    payment_method, razorpay_order_id, razorpay_payment_id,
    customer_name, customer_email, customer_phone,
    shipping_address, city, state, pincode,
  } = body

  const order_number = generateOrderNumber()

  const { data: order, error } = await adminSupabase
    .from('orders')
    .insert({
      user_id: user.id,
      order_number,
      items,
      subtotal_inr,
      delivery_charge_inr,
      total_inr,
      currency_code: 'INR',
      currency_rate: 1,
      total_in_currency: total_inr,
      payment_method,
      payment_status: payment_method === 'cod' ? 'pending' : 'paid',
      status: 'confirmed',
      razorpay_order_id,
      razorpay_payment_id,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      city,
      state,
      pincode,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Clear cart
  await adminSupabase.from('carts').delete().eq('user_id', user.id)

  // Send email
  try {
    await sendOrderConfirmationEmail({
      to: customer_email,
      customerName: customer_name,
      orderNumber: order_number,
      items,
      subtotal: subtotal_inr,
      deliveryCharge: delivery_charge_inr,
      total: total_inr,
      paymentMethod: payment_method,
      shippingAddress: { address: shipping_address?.address ?? '', city, state, pincode },
    })
  } catch (e) {
    console.error('Email failed:', e)
  }

  return NextResponse.json({ order })
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ orders: data ?? [] })
}
