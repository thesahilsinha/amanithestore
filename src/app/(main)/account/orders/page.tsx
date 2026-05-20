import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF7' }}>
      <div className="py-10 text-center border-b" style={{ background: '#fff', borderColor: '#e8e0d0' }}>
        <p className="text-[10px] tracking-[5px] uppercase mb-2" style={{ color: '#B8952A' }}>My Account</p>
        <h1 className="font-cormorant text-[40px] font-light" style={{ color: '#1a1a1a' }}>Order History</h1>
      </div>

      <div className="max-w-[900px] mx-auto px-6 md:px-12 py-12">
        {!orders?.length ? (
          <div className="text-center py-16">
            <p className="text-[13px] mb-6" style={{ color: '#888' }}>You haven't placed any orders yet.</p>
            <Link href="/products" className="px-10 py-3 text-white text-[10px] tracking-[3px] uppercase" style={{ background: '#1a1a1a' }}>Shop Now</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="p-6 transition-all block"
                style={{ background: '#fff', border: '1px solid #e8e0d0' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#B8952A')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#e8e0d0')}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-medium mb-1">#{order.order_number}</p>
                    <p className="text-[12px]" style={{ color: '#888' }}>
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium mb-1" style={{ color: '#B8952A' }}>₹{order.total_inr?.toLocaleString('en-IN')}</p>
                    <span
                      className="text-[9px] tracking-[1.5px] uppercase px-2 py-1"
                      style={{
                        background: order.status === 'delivered' ? '#e8f5e9' : order.status === 'shipped' ? '#e3f2fd' : '#FDF6E3',
                        color: order.status === 'delivered' ? '#2e7d32' : order.status === 'shipped' ? '#1565c0' : '#B8952A',
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {order.items?.map((item: any, i: number) => (
                    <p key={i} className="text-[12px]" style={{ color: '#888' }}>
                      {item.name} — {item.size} × {item.quantity}
                    </p>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
