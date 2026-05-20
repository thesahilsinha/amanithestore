import { requireAdmin } from '@/lib/supabase/admin-auth'
import { adminSupabase } from '@/lib/supabase/admin'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminProductForm from '@/components/admin/AdminProductForm'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const [{ data: product }, { data: categories }] = await Promise.all([
    adminSupabase.from('products').select('*').eq('id', id).single(),
    adminSupabase.from('categories').select('id, name').eq('is_active', true),
  ])
  if (!product) notFound()

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <p className="text-[10px] tracking-[4px] uppercase mb-1" style={{ color: '#B8952A' }}>Products</p>
          <h1 className="font-cormorant text-[36px] font-light" style={{ color: '#1a1a1a' }}>Edit Product</h1>
        </div>
        <AdminProductForm categories={categories ?? []} product={product} mode="edit" />
      </div>
    </AdminLayout>
  )
}