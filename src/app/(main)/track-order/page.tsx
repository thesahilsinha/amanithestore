'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search } from 'lucide-react'

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const statusSteps = ['pending', 'confirmed', 'shipped', 'delivered']

  const handleTrack = async () => {
    if (!orderNumber || !email) { setError('Enter both order number and email'); return }
    setLoading(true)
    setError('')
    setOrder(null)

    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber.toUpperCase().trim())
      .eq('customer_email', email.toLowerCase().trim())
      .single()

    if (!data) { setError('No order found. Check your order number and email.'); setLoading(false); return }
    setOrder(data)
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '14px 16px', fontSize: '13px',
    border: '1px solid #e8e0d0', outline: 'none',
    fontFamily: 'var(--font-dm-sans)', background: '#fff',
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF7' }}>
      <div className="py-12 text-center border-b" style={{ background: '#fff', borderColor: '#e8e0d0' }}>
        <p className="text-[10px] tracking-[5px] uppercase mb-2" style={{ color: '#B8952A' }}>Order Status</p>
        <h1 className="font-cormorant text-[48px] font-light" style={{ color: '#1a1a1a' }}>Track Your Order</h1>
      </div>

      <div className="max-w-[560px] mx-auto px-6 py-16">
        <div className="p-8 mb-6" style={{ background: '#fff', border: '1px solid #e8e0d0' }}>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Order Number</label>
              <input
                type="text"
                value={orderNumber}
                onChange={e => setOrderNumber(e.target.value)}
                placeholder="AMN-12345678"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#B8952A')}
                onBlur={e => (e.target.style.borderColor = '#e8e0d0')}
              />
            </div>
            <div>
              <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#B8952A')}
                onBlur={e => (e.target.style.borderColor = '#e8e0d0')}
              />
            </div>
            {error && <p className="text-[12px]" style={{ color: '#c0392b' }}>{error}</p>}
            <button
              onClick={handleTrack}
              disabled={loading}
              className="w-full py-4 text-white text-[11px] tracking-[3px] uppercase flex items-center justify-center gap-2 transition-all"
              style={{ background: loading ? '#888' : '#1a1a1a' }}
              onMouseEnter={e => { if (!loading) (e.currentTarget.style.background = '#B8952A') }}
              onMouseLeave={e => { if (!loading) (e.currentTarget.style.background = '#1a1a1a') }}
            >
              <Search size={15} strokeWidth={1.5} />
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </div>
        </div>

        {/* Result */}
        {order && (
          <div className="p-6" style={{ background: '#fff', border: '1px solid #e8e0d0' }}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="font-medium text-[15px] mb-1">#{order.order_number}</p>
                <p className="text-[12px]" style={{ color: '#888' }}>
                  {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <p className="text-[15px] font-medium" style={{ color: '#B8952A' }}>₹{order.total_inr?.toLocaleString('en-IN')}</p>
            </div>

            {/* Tracking steps */}
            <div className="flex items-center justify-between relative mb-6">
              <div className="absolute top-3 left-0 right-0 h-[1px]" style={{ background: '#e8e0d0', zIndex: 0 }} />
              {statusSteps.map((s, i) => {
                const current = statusSteps.indexOf(order.status)
                return (
                  <div key={s} className="flex flex-col items-center gap-2 z-10">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold"
                      style={{
                        background: i <= current ? '#B8952A' : '#fff',
                        border: `2px solid ${i <= current ? '#B8952A' : '#e8e0d0'}`,
                        color: i <= current ? '#fff' : '#888'
                      }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-[10px] uppercase capitalize tracking-[1px]" style={{ color: i <= current ? '#B8952A' : '#aaa' }}>{s}</span>
                  </div>
                )
              })}
            </div>

            <div className="border-t pt-4" style={{ borderColor: '#e8e0d0' }}>
              <p className="text-[12px]" style={{ color: '#888' }}>
                Shipping to: {order.city}, {order.state}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
// ```

// ---

// ### Last step — enable Email Auth in Supabase

// Go to Supabase → **Authentication → Providers → Email** → make sure it's **enabled**.

// Also go to **Authentication → URL Configuration** and set:
// ```
// Site URL: http://localhost:3000
// Redirect URLs: http://localhost:3000/api/auth/callback