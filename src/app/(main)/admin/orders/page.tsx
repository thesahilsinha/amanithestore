import { requireAdmin } from '@/lib/supabase/admin-auth'
import { adminSupabase } from '@/lib/supabase/admin'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'

export default async function AdminOrdersPage() {
  await requireAdmin()
  const { data: orders } = await adminSupabase.from('orders').select('*').order('created_at', { ascending: false })

  const statusColor = (s: string) =>
    s === 'delivered' ? { bg: '#e8f5e9', color: '#2e7d32' }
    : s === 'shipped' ? { bg: '#e3f2fd', color: '#1565c0' }
    : s === 'confirmed' ? { bg: '#e8f5e9', color: '#2e7d32' }
    : { bg: '#FDF6E3', color: '#B8952A' }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <p className="text-[10px] tracking-[4px] uppercase mb-1" style={{ color: '#B8952A' }}>Admin</p>
          <h1 className="font-cormorant text-[36px] font-light" style={{ color: '#1a1a1a' }}>Orders</h1>
        </div>

        <div className="bg-white border overflow-x-auto" style={{ borderColor: '#e8e0d0' }}>
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b" style={{ borderColor: '#e8e0d0' }}>
                {['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] tracking-[2px] uppercase" style={{ color: '#888' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders?.map(o => {
                const sc = statusColor(o.status)
                return (
                  <tr key={o.id} className="border-b hover:bg-gray-50" style={{ borderColor: '#f5f5f5' }}>
                    <td className="px-4 py-3">
                      <p className="text-[13px] font-medium">#{o.order_number}</p>
                      <p className="text-[11px]" style={{ color: '#888' }}>{new Date(o.created_at).toLocaleDateString('en-IN')}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[13px]">{o.customer_name}</p>
                      <p className="text-[11px]" style={{ color: '#888' }}>{o.customer_phone}</p>
                    </td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: '#888' }}>{o.items?.length} item{o.items?.length !== 1 ? 's' : ''}</td>
                    <td className="px-4 py-3 text-[13px]" style={{ color: '#B8952A' }}>₹{o.total_inr?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className="text-[9px] tracking-[1px] uppercase px-2 py-0.5 capitalize"
                        style={{ background: o.payment_status === 'paid' ? '#e8f5e9' : '#FDF6E3', color: o.payment_status === 'paid' ? '#2e7d32' : '#B8952A' }}>
                        {o.payment_method} · {o.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[9px] tracking-[1px] uppercase px-2 py-0.5" style={{ background: sc.bg, color: sc.color }}>{o.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="text-[11px] underline" style={{ color: '#B8952A' }}>Manage</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}