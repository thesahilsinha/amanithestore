import { requireAdmin } from '@/lib/supabase/admin-auth'
import { adminSupabase } from '@/lib/supabase/admin'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react'

export default async function AdminProductsPage() {
  await requireAdmin()
  const { data: products } = await adminSupabase
    .from('products')
    .select('*, category:categories(name)')
    .order('created_at', { ascending: false })

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] tracking-[4px] uppercase mb-1" style={{ color: '#B8952A' }}>Admin</p>
            <h1 className="font-cormorant text-[36px] font-light" style={{ color: '#1a1a1a' }}>Products</h1>
          </div>
          <Link href="/admin/products/new" className="flex items-center gap-2 px-6 py-3 text-white text-[11px] tracking-[2px] uppercase" style={{ background: '#1a1a1a' }}>
            <Plus size={14} /> New Product
          </Link>
        </div>

        <div className="bg-white border" style={{ borderColor: '#e8e0d0' }}>
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#e8e0d0' }}>
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Flags', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] tracking-[2px] uppercase" style={{ color: '#888' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products?.map(p => (
                <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: '#f5f5f5' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.primary_image_url} alt="" className="w-10 h-12 object-cover object-top flex-shrink-0" style={{ background: '#f5f5f5' }} />
                      <span className="text-[13px] font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: '#888' }}>{(p.category as any)?.name}</td>
                  <td className="px-4 py-3 text-[13px]">₹{p.price_inr?.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-[13px]" style={{ color: p.stock === 0 ? '#c0392b' : '#2e7d32' }}>{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className="text-[9px] tracking-[1px] uppercase px-2 py-1"
                      style={{ background: p.is_active ? '#e8f5e9' : '#fce4e4', color: p.is_active ? '#2e7d32' : '#c0392b' }}>
                      {p.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {p.is_bestseller && <span className="text-[9px] px-2 py-0.5 tracking-[1px] uppercase" style={{ background: '#FDF6E3', color: '#B8952A' }}>BS</span>}
                      {p.is_amani_favourite && <span className="text-[9px] px-2 py-0.5 tracking-[1px] uppercase" style={{ background: '#f3e5f5', color: '#7b1fa2' }}>Fav</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${p.id}`} className="flex items-center gap-1 text-[11px] hover:text-[#B8952A] transition-colors" style={{ color: '#888' }}>
                      <Pencil size={13} strokeWidth={1.5} /> Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
