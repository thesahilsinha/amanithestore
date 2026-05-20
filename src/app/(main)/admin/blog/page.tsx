import { requireAdmin } from '@/lib/supabase/admin'
import { adminSupabase } from '@/lib/supabase/admin'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'

export default async function AdminBlogPage() {
  await requireAdmin()
  const { data: posts } = await adminSupabase.from('blog_posts').select('*').order('created_at', { ascending: false })

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] tracking-[4px] uppercase mb-1" style={{ color: '#B8952A' }}>Admin</p>
            <h1 className="font-cormorant text-[36px] font-light" style={{ color: '#1a1a1a' }}>Blog</h1>
          </div>
          <Link href="/admin/blog/new" className="flex items-center gap-2 px-6 py-3 text-white text-[11px] tracking-[2px] uppercase" style={{ background: '#1a1a1a' }}>
            <Plus size={14} /> New Post
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {posts?.map(p => (
            <div key={p.id} className="bg-white border px-5 py-4 flex items-center justify-between" style={{ borderColor: '#e8e0d0' }}>
              <div>
                <p className="text-[14px] font-medium mb-1">{p.title}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] tracking-[1px] uppercase px-2 py-0.5" style={{ background: p.is_published ? '#e8f5e9' : '#f5f5f5', color: p.is_published ? '#2e7d32' : '#888' }}>{p.is_published ? 'Published' : 'Draft'}</span>
                  <span className="text-[11px]" style={{ color: '#888' }}>{new Date(p.created_at).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
              <Link href={`/admin/blog/${p.id}`} className="flex items-center gap-1 text-[11px]" style={{ color: '#B8952A' }}>
                <Pencil size={13} strokeWidth={1.5} /> Edit
              </Link>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}