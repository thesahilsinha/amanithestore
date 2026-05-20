import { requireAdmin } from '@/lib/supabase/admin-auth'
import { adminSupabase } from '@/lib/supabase/admin'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminProductForm from '@/components/admin/AdminProductForm'

export default async function NewProductPage() {
  await requireAdmin()
  const { data: categories } = await adminSupabase.from('categories').select('id, name').eq('is_active', true)

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <p className="text-[10px] tracking-[4px] uppercase mb-1" style={{ color: '#B8952A' }}>Products</p>
          <h1 className="font-cormorant text-[36px] font-light" style={{ color: '#1a1a1a' }}>New Product</h1>
        </div>
        <AdminProductForm categories={categories ?? []} mode="new" />
      </div>
    </AdminLayout>
  )
}
