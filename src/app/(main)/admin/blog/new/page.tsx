// new/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import toast from 'react-hot-toast'

export default function NewBlogPage() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', slug: '', content: '', excerpt: '', featured_image_url: '', tags: '', meta_title: '', meta_description: '', is_published: false })
  const [loading, setLoading] = useState(false)
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))
  const autoSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleSave = async () => {
    if (!form.title || !form.slug) { toast.error('Title and slug required'); return }
    setLoading(true)
    const res = await fetch('/api/admin/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.error) { toast.error(data.error); setLoading(false); return }
    toast.success('Post created!'); router.push('/admin/blog')
  }

  return <BlogForm form={form} set={set} autoSlug={autoSlug} handleSave={handleSave} loading={loading} mode="new" />
}

function BlogForm({ form, set, autoSlug, handleSave, loading, mode }: any) {
  const router = useRouter()
  const inputClass = "w-full px-4 py-3 text-[13px] border outline-none"
  const inputStyle = { borderColor: '#e8e0d0', fontFamily: 'var(--font-dm-sans)' }

  return (
    <AdminLayout>
      <div className="p-8 max-w-[800px]">
        <div className="mb-8">
          <p className="text-[10px] tracking-[4px] uppercase mb-1" style={{ color: '#B8952A' }}>Blog</p>
          <h1 className="font-cormorant text-[36px] font-light" style={{ color: '#1a1a1a' }}>{mode === 'new' ? 'New Post' : 'Edit Post'}</h1>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Title *</label>
            <input type="text" value={form.title} onChange={e => { set('title', e.target.value); if (mode === 'new') set('slug', autoSlug(e.target.value)) }} className={inputClass} style={inputStyle} onFocus={e => (e.target.style.borderColor = '#B8952A')} onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
          </div>
          <div>
            <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Slug *</label>
            <input type="text" value={form.slug} onChange={e => set('slug', e.target.value)} className={inputClass} style={inputStyle} onFocus={e => (e.target.style.borderColor = '#B8952A')} onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
          </div>
          <div>
            <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Featured Image URL</label>
            <input type="url" value={form.featured_image_url} onChange={e => set('featured_image_url', e.target.value)} className={inputClass} style={inputStyle} onFocus={e => (e.target.style.borderColor = '#B8952A')} onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
          </div>
          <div>
            <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Excerpt</label>
            <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2} className={inputClass} style={{ ...inputStyle, resize: 'none' }} onFocus={e => (e.target.style.borderColor = '#B8952A')} onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
          </div>
          <div>
            <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Content</label>
            <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={12} className={inputClass} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => (e.target.style.borderColor = '#B8952A')} onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Tags (comma separated)</label>
              <input type="text" value={form.tags} onChange={e => set('tags', e.target.value)} className={inputClass} style={inputStyle} onFocus={e => (e.target.style.borderColor = '#B8952A')} onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
            </div>
            <div>
              <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Meta Title</label>
              <input type="text" value={form.meta_title} onChange={e => set('meta_title', e.target.value)} className={inputClass} style={inputStyle} onFocus={e => (e.target.style.borderColor = '#B8952A')} onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
            </div>
          </div>
          <div>
            <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Meta Description</label>
            <textarea value={form.meta_description} onChange={e => set('meta_description', e.target.value)} rows={2} className={inputClass} style={{ ...inputStyle, resize: 'none' }} onFocus={e => (e.target.style.borderColor = '#B8952A')} onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => set('is_published', !form.is_published)} className="w-10 h-5 rounded-full relative cursor-pointer transition-all" style={{ background: form.is_published ? '#B8952A' : '#ddd' }}>
              <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all" style={{ left: form.is_published ? '22px' : '2px' }} />
            </div>
            <span className="text-[12px]" style={{ color: '#555' }}>Published</span>
          </label>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={loading} className="px-10 py-3 text-white text-[11px] tracking-[3px] uppercase" style={{ background: loading ? '#888' : '#1a1a1a' }}>
              {loading ? 'Saving...' : mode === 'new' ? 'Publish Post' : 'Save Changes'}
            </button>
            <button onClick={() => router.back()} className="px-8 py-3 text-[11px] tracking-[2px] uppercase border" style={{ borderColor: '#e8e0d0', color: '#888' }}>Cancel</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
