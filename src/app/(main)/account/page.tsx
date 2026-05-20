import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, User, LogOut } from 'lucide-react'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, status, total_inr, created_at, items')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const name = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Customer'

  const links = [
    { icon: Package, label: 'My Orders', sub: 'Track & view orders', href: '/account/orders' },
    { icon: User, label: 'My Profile', sub: 'Edit your details', href: '/account/profile' },
    { icon: LogOut, label: 'Sign Out', sub: 'See you soon', href: '/account/signout' },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF7' }}>
      {/* Header */}
      <div className="py-10 text-center border-b" style={{ background: '#fff', borderColor: '#e8e0d0' }}>
        <p className="text-[10px] tracking-[5px] uppercase mb-2" style={{ color: '#B8952A' }}>My Account</p>
        <h1 className="font-cormorant text-[40px] font-light" style={{ color: '#1a1a1a' }}>
          Hello, {name}
        </h1>
      </div>

      <div className="max-w-[900px] mx-auto px-6 md:px-12 py-12">
        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {links.map(({ icon: Icon, label, sub, href }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 p-6 border hover:border-[#B8952A] transition-colors"
              style={{ background: '#fff', borderColor: '#e8e0d0' }}
            >
              <Icon size={22} strokeWidth={1.5} style={{ color: '#B8952A' }} />
              <div>
                <p className="text-[13px] font-medium" style={{ color: '#1a1a1a' }}>{label}</p>
                <p className="text-[11px]" style={{ color: '#888' }}>{sub}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-[10px] tracking-[3px] uppercase" style={{ color: '#B8952A' }}>Recent Orders</p>
            <Link href="/account/orders" className="text-[11px] tracking-[1px] underline" style={{ color: '#888' }}>View all</Link>
          </div>

          {!orders?.length ? (
            <div className="text-center py-12" style={{ background: '#fff', border: '1px solid #e8e0d0' }}>
              <p className="text-[13px] mb-4" style={{ color: '#888' }}>No orders yet</p>
              <Link href="/products" className="text-[10px] tracking-[3px] uppercase px-8 py-3 text-white inline-block" style={{ background: '#1a1a1a' }}>
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map(order => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="flex items-center justify-between p-5 border hover:border-[#B8952A] transition-colors"
                  style={{ background: '#fff', borderColor: '#e8e0d0' }}
                >
                  <div>
                    <p className="text-[13px] font-medium mb-1" style={{ color: '#1a1a1a' }}>#{order.order_number}</p>
                    <p className="text-[11px]" style={{ color: '#888' }}>
                      {order.items?.length} item{order.items?.length !== 1 ? 's' : ''} · {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] mb-1" style={{ color: '#B8952A' }}>₹{order.total_inr?.toLocaleString('en-IN')}</p>
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}