import { requireAdmin } from '@/lib/supabase/admin-auth'
import { adminSupabase } from '@/lib/supabase/admin'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { Package, ShoppingBag, DollarSign, Clock, ArrowRight, TrendingUp } from 'lucide-react'

export default async function AdminDashboard() {
  await requireAdmin()

  const [
    { count: productCount },
    { count: orderCount },
    { count: pendingCount },
    { count: confirmedCount },
    { data: recentOrders },
  ] = await Promise.all([
    adminSupabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    adminSupabase.from('orders').select('*', { count: 'exact', head: true }),
    adminSupabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    adminSupabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    adminSupabase.from('orders').select('*').order('created_at', { ascending: false }).limit(8),
  ])

  const totalRevenue = recentOrders?.reduce((sum, o) => sum + (o.total_inr ?? 0), 0) ?? 0

  const stats = [
    { label: 'Active Products', value: productCount ?? 0, icon: Package, href: '/admin/products', color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Total Orders', value: orderCount ?? 0, icon: ShoppingBag, href: '/admin/orders', color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Pending', value: pendingCount ?? 0, icon: Clock, href: '/admin/orders', color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Revenue (recent)', value: '₹' + (totalRevenue).toLocaleString('en-IN'), icon: DollarSign, href: '/admin/orders', color: '#10b981', bg: '#ecfdf5' },
  ]

  const statusStyle = (s: string) =>
    s === 'delivered' ? { bg: '#dcfce7', color: '#166534' }
    : s === 'shipped' ? { bg: '#dbeafe', color: '#1e40af' }
    : s === 'confirmed' ? { bg: '#d1fae5', color: '#065f46' }
    : { bg: '#fef3c7', color: '#92400e' }

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[24px] font-semibold" style={{ color: '#111' }}>Dashboard</h1>
            <p className="text-[13px] mt-0.5" style={{ color: '#888' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="hidden md:flex items-center gap-2 px-4 py-2 text-white text-[12px] font-medium rounded"
            style={{ background: '#B8952A' }}
          >
            <Package size={14} /> New Product
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, href, color, bg }) => (
            <Link
              key={label}
              href={href}
              className="p-5 rounded-lg transition-all hover:shadow-md"
              style={{ background: '#fff', border: '1px solid #f0f0f0' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: bg }}>
                  <Icon size={17} style={{ color }} strokeWidth={2} />
                </div>
                <TrendingUp size={13} style={{ color: '#ccc' }} />
              </div>
              <p className="text-[26px] font-semibold mb-0.5" style={{ color: '#111' }}>{value}</p>
              <p className="text-[11px] font-medium uppercase tracking-[1px]" style={{ color: '#999' }}>{label}</p>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Add Product', href: '/admin/products/new', color: '#B8952A' },
            { label: 'View Orders', href: '/admin/orders', color: '#3b82f6' },
            { label: 'Edit Banner', href: '/admin/banners', color: '#8b5cf6' },
            { label: 'Blog Post', href: '/admin/blog/new', color: '#10b981' },
          ].map(({ label, href, color }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between px-4 py-3 rounded-lg text-[12px] font-medium transition-all hover:opacity-90"
              style={{ background: color, color: '#fff' }}
            >
              {label}
              <ArrowRight size={13} />
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="rounded-lg overflow-hidden" style={{ background: '#fff', border: '1px solid #f0f0f0' }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #f5f5f5' }}>
            <h2 className="text-[14px] font-semibold" style={{ color: '#111' }}>Recent Orders</h2>
            <Link href="/admin/orders" className="flex items-center gap-1 text-[12px]" style={{ color: '#B8952A' }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {/* Table header */}
          <div className="hidden md:grid grid-cols-5 px-6 py-2 text-[10px] uppercase tracking-[1.5px]" style={{ color: '#bbb', borderBottom: '1px solid #f5f5f5' }}>
            <span>Order</span>
            <span>Customer</span>
            <span>Items</span>
            <span>Total</span>
            <span>Status</span>
          </div>

          {!recentOrders?.length ? (
            <div className="text-center py-12">
              <ShoppingBag size={32} strokeWidth={1} style={{ color: '#ddd', margin: '0 auto 12px' }} />
              <p className="text-[13px]" style={{ color: '#bbb' }}>No orders yet</p>
            </div>
          ) : (
            recentOrders.map(order => {
              const sc = statusStyle(order.status)
              return (
                <Link
                  key={order.id}
                  href={'/admin/orders/' + order.id}
                  className="grid grid-cols-2 md:grid-cols-5 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
                  style={{ borderBottom: '1px solid #f9f9f9' }}
                >
                  <div>
                    <p className="text-[13px] font-medium" style={{ color: '#111' }}>#{order.order_number}</p>
                    <p className="text-[11px]" style={{ color: '#aaa' }}>
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-[13px]" style={{ color: '#444' }}>{order.customer_name}</p>
                    <p className="text-[11px]" style={{ color: '#aaa' }}>{order.customer_phone}</p>
                  </div>
                  <div className="hidden md:block text-[12px]" style={{ color: '#888' }}>
                    {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                  </div>
                  <div className="hidden md:block text-[13px] font-medium" style={{ color: '#B8952A' }}>
                    ₹{order.total_inr?.toLocaleString('en-IN')}
                  </div>
                  <div className="flex justify-end md:justify-start">
                    <span
                      className="text-[10px] font-medium px-3 py-1 rounded-full capitalize"
                      style={{ background: sc.bg, color: sc.color }}
                    >
                      {order.status}
                    </span>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </AdminLayout>
  )
}