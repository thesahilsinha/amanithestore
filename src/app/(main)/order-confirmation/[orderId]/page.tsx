import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
export default async function OrderConfirmationPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()
  if (!order) notFound()
  const statusSteps = ['confirmed', 'shipped', 'delivered']
  const currentStep = statusSteps.indexOf(order.status)
  return (
    <div className="min-h-screen py-16 px-6" style={{ background: '#FAFAF7' }}>
      <div className="max-w-[640px] mx-auto">
        <div className="text-center mb-10">
          <CheckCircle size={48} strokeWidth={1} style={{ color: '#B8952A', margin: '0 auto 16px' }} />
          <p className="text-[10px] tracking-[5px] uppercase mb-2" style={{ color: '#B8952A' }}>Order Confirmed</p>
          <h1 className="font-cormorant text-[40px] font-light mb-2" style={{ color: '#1a1a1a' }}>Thank You!</h1>
          <p className="text-[14px]" style={{ color: '#888' }}>
            Order <strong style={{ color: '#1a1a1a' }}>#{order.order_number}</strong> is confirmed.
          </p>
          <p className="text-[13px] mt-1" style={{ color: '#888' }}>
            Confirmation sent to <strong>{order.customer_email}</strong>
          </p>
        </div>
        <div className="p-6 mb-6" style={{ background: '#fff', border: '1px solid #e8e0d0' }}>
          <p className="text-[10px] tracking-[3px] uppercase mb-6" style={{ color: '#B8952A' }}>Order Status</p>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-3 left-0 right-0 h-[1px]" style={{ background: '#e8e0d0', zIndex: 0 }} />
            {statusSteps.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-2 z-10">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold"
                  style={{
                    background: i <= currentStep ? '#B8952A' : '#fff',
                    border: `2px solid ${i <= currentStep ? '#B8952A' : '#e8e0d0'}`,
                    color: i <= currentStep ? '#fff' : '#888'
                  }}
                >
                  {i + 1}
                </div>
                <span className="text-[10px] tracking-[1px] uppercase" style={{ color: i <= currentStep ? '#B8952A' : '#888' }}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 mb-6" style={{ background: '#fff', border: '1px solid #e8e0d0' }}>
          <p className="text-[10px] tracking-[3px] uppercase mb-4" style={{ color: '#B8952A' }}>Items Ordered</p>
          {order.items?.map((item: any, i: number) => (
            <div key={i} className="flex justify-between py-3 border-b text-[13px]" style={{ borderColor: '#e8e0d0' }}>
              <span>{item.name} — {item.size} × {item.quantity}</span>
              <span>₹{(item.price_inr * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 font-medium">
            <span>Total</span>
            <span style={{ color: '#B8952A' }}>₹{order.total_inr?.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <div className="p-6 mb-8" style={{ background: '#fff', border: '1px solid #e8e0d0' }}>
          <p className="text-[10px] tracking-[3px] uppercase mb-3" style={{ color: '#B8952A' }}>Shipping To</p>
          <p className="text-[13px] leading-relaxed" style={{ color: '#555' }}>
            {order.customer_name}<br />
            {order.shipping_address?.address}<br />
            {order.city}, {order.state} — {order.pincode}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/account/orders" className="flex-1 py-3 text-center text-white text-[10px] tracking-[3px] uppercase" style={{ background: '#1a1a1a' }}>
            View Orders
          </Link>
          <Link href="/products" className="flex-1 py-3 text-center text-[10px] tracking-[3px] uppercase border" style={{ borderColor: '#1a1a1a', color: '#1a1a1a' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
