'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered']

export default function AdminOrderDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`).then(r => r.json()).then(d => setOrder(d.order))
  }, [id])

  const updateStatus = async (status: string) => {
    setLoading(true)
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const data = await res.json()
    if (data.error) { toast.error(data.error); setLoading(false); return }
    setOrder(data.order)
    toast.success('Status updated!')
    setLoading(false)
  }

  if (!order) return (
    <AdminLayout>
      <div className="p-8 text-[13px]" style={{ color: '#888' }}>Loading...</div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      <div className="p-8 max-w-[700px]">
        <div className="mb-8">
          <p className="text-[10px] tracking-[4px] uppercase mb-1" style={{ color: '#B8952A' }}>Orders</p>
          <h1 className="font-cormorant text-[36px] font-light" style={{ color: '#1a1a1a' }}>#{order.order_number}</h1>
        </div>

        {/* Status updater */}
        <div className="p-6 bg-white border mb-6" style={{ borderColor: '#e8e0d0' }}>
          <p className="text-[10px] tracking-[3px] uppercase mb-4" style={{ color: '#B8952A' }}>Update Status</p>
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                disabled={loading || order.status === s}
                className="px-4 py-2 text-[11px] tracking-[1px] uppercase border capitalize transition-all"
                style={{
                  background: order.status === s ? '#1a1a1a' : 'transparent',
                  color: order.status === s ? '#fff' : '#888',
                  borderColor: order.status === s ? '#1a1a1a' : '#e8e0d0',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Order info */}
        <div className="p-6 bg-white border mb-6" style={{ borderColor: '#e8e0d0' }}>
          <p className="text-[10px] tracking-[3px] uppercase mb-4" style={{ color: '#B8952A' }}>Customer</p>
          <p className="text-[13px] mb-1">{order.customer_name}</p>
          <p className="text-[13px] mb-1" style={{ color: '#888' }}>{order.customer_email}</p>
          <p className="text-[13px]" style={{ color: '#888' }}>{order.customer_phone}</p>
        </div>

        <div className="p-6 bg-white border mb-6" style={{ borderColor: '#e8e0d0' }}>
          <p className="text-[10px] tracking-[3px] uppercase mb-4" style={{ color: '#B8952A' }}>Items</p>
          {order.items?.map((item: any, i: number) => (
            <div key={i} className="flex justify-between py-2 border-b text-[13px]" style={{ borderColor: '#f5f5f5' }}>
              <span>{item.name} — {item.size} × {item.quantity}</span>
              <span>₹{(item.price_inr * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 font-medium">
            <span>Total</span>
            <span style={{ color: '#B8952A' }}>₹{order.total_inr?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="p-6 bg-white border" style={{ borderColor: '#e8e0d0' }}>
          <p className="text-[10px] tracking-[3px] uppercase mb-3" style={{ color: '#B8952A' }}>Shipping</p>
          <p className="text-[13px] leading-relaxed" style={{ color: '#555' }}>
            {order.shipping_address?.address}<br />
            {order.city}, {order.state} — {order.pincode}
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}