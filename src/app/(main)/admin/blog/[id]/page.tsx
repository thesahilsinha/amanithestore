'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import toast from 'react-hot-toast'
import { adminSupabase } from '@/lib/supabase/admin'

export default function EditBlogPage() {
  const { id } = useParams()
  const router = useRouter()
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }))

  useEffect(() => {
    adminSupabase.from('blog_posts').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setForm({ ...data, tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags ?? '' })
    })
  }, [id])

  const handleSave = async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/blog/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.error) { toast.error(data.error); setLoading(false); return }
    toast.success('Saved!'); router.push('/admin/blog')
  }

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    toast.success('Deleted'); router.push('/admin/blog')
  }

  if (!form) return <AdminLayout><div className="p-8 text-[13px]" style={{ color: '#888' }}>Loading...</div></AdminLayout>

  const inputClass = "w-full px-4 py-3 text-[13px] border outline-none"
  const inputStyle = { borderColor: '#e8e0d0', fontFamily: 'var(--font-dm-sans)' }

  return (
    <AdminLayout>
      <div className="p-8 max-w-[800px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] tracking-[4px] uppercase mb-1" style={{ color: '#B8952A' }}>Blog</p>
            <h1 className="font-cormorant text-[36px] font-light" style={{ color: '#1a1a1a' }}>Edit Post</h1>
          </div>
          <button onClick={handleDelete} className="px-4 py-2 text-[11px] tracking-[1px] uppercase border" style={{ borderColor: '#c0392b', color: '#c0392b' }}>Delete Post</button>
        </div>
        <div className="flex flex-col gap-4">
          {[
            { k: 'title', l: 'Title *' }, { k: 'slug', l: 'Slug *' },
            { k: 'featured_image_url', l: 'Featured Image URL' },
            { k: 'meta_title', l: 'Meta Title' }, { k: 'tags', l: 'Tags (comma separated)' },
          ].map(({ k, l }) => (
            <div key={k}>
              <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>{l}</label>
              <input type="text" value={form[k] ?? ''} onChange={e => set(k, e.target.value)} className={inputClass} style={inputStyle} onFocus={e => (e.target.style.borderColor = '#B8952A')} onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
            </div>
          ))}
          {[
            { k: 'excerpt', l: 'Excerpt', rows: 2 },
            { k: 'content', l: 'Content', rows: 14 },
            { k: 'meta_description', l: 'Meta Description', rows: 2 },
          ].map(({ k, l, rows }) => (
            <div key={k}>
              <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>{l}</label>
              <textarea value={form[k] ?? ''} onChange={e => set(k, e.target.value)} rows={rows} className={inputClass} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => (e.target.style.borderColor = '#B8952A')} onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
            </div>
          ))}
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => set('is_published', !form.is_published)} className="w-10 h-5 rounded-full relative cursor-pointer transition-all" style={{ background: form.is_published ? '#B8952A' : '#ddd' }}>
              <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all" style={{ left: form.is_published ? '22px' : '2px' }} />
            </div>
            <span className="text-[12px]" style={{ color: '#555' }}>Published</span>
          </label>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={loading} className="px-10 py-3 text-white text-[11px] tracking-[3px] uppercase" style={{ background: loading ? '#888' : '#1a1a1a' }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={() => router.back()} className="px-8 py-3 text-[11px] tracking-[2px] uppercase border" style={{ borderColor: '#e8e0d0', color: '#888' }}>Cancel</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}