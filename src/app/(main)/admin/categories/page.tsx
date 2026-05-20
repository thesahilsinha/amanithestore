'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', slug: '', image_url: '', description: '', display_order: 0 })

  const load = async () => {
    const res = await fetch('/api/admin/categories')
    const data = await res.json()
    setCats(data.categories ?? [])
  }
  useEffect(() => { load() }, [])

  const handleCreate = async () => {
    if (!form.name || !form.slug) { toast.error('Name and slug required'); return }
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    toast.success('Category created!')
    setForm({ name: '', slug: '', image_url: '', description: '', display_order: 0 })
    await load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete category?')) return
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    toast.success('Deleted')
    await load()
  }

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  return (
    <AdminLayout>
      <div className="p-8 max-w-[700px]">
        <div className="mb-8">
          <p className="text-[10px] tracking-[4px] uppercase mb-1" style={{ color: '#B8952A' }}>Admin</p>
          <h1 className="font-cormorant text-[36px] font-light" style={{ color: '#1a1a1a' }}>Categories</h1>
        </div>
        <div className="bg-white border p-5 mb-6" style={{ borderColor: '#e8e0d0' }}>
          <p className="text-[10px] tracking-[3px] uppercase mb-3" style={{ color: '#B8952A' }}>New Category</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input type="text" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: autoSlug(e.target.value) }))}
              placeholder="Name *" className="px-3 py-2 text-[13px] border outline-none"
              style={{ borderColor: '#e8e0d0' }}
              onFocus={e => (e.target.style.borderColor = '#B8952A')}
              onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
            <input type="text" value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              placeholder="Slug *" className="px-3 py-2 text-[13px] border outline-none"
              style={{ borderColor: '#e8e0d0' }}
              onFocus={e => (e.target.style.borderColor = '#B8952A')}
              onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
            <input type="url" value={form.image_url}
              onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
              placeholder="Image URL" className="px-3 py-2 text-[13px] border outline-none col-span-2"
              style={{ borderColor: '#e8e0d0' }}
              onFocus={e => (e.target.style.borderColor = '#B8952A')}
              onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
          </div>
          <button onClick={handleCreate} className="flex items-center gap-2 px-5 py-2 text-white text-[11px] tracking-[2px] uppercase" style={{ background: '#1a1a1a' }}>
            <Plus size={13} /> Create
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {cats.map(c => (
            <div key={c.id} className="bg-white border px-5 py-4 flex items-center justify-between" style={{ borderColor: '#e8e0d0' }}>
              <div className="flex items-center gap-3">
                {c.image_url && <img src={c.image_url} alt="" className="w-10 h-10 rounded-full object-cover" />}
                <div>
                  <p className="text-[13px] font-medium">{c.name}</p>
                  <p className="text-[11px]" style={{ color: '#888' }}>/products?category={c.slug}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(c.id)} style={{ color: '#ccc' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#c0392b')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#ccc')}>
                <Trash2 size={15} strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
