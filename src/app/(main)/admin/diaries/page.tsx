'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'

export default function AdminDiariesPage() {
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState({ image_url: '', caption: '', display_order: 0, is_active: true })

  const load = () => fetch('/api/admin/diaries').then(r => r.json()).then(d => setItems(d.diaries ?? []))
  useEffect(() => { load() }, [])

  const handleCreate = async () => {
    if (!form.image_url) { toast.error('Image URL required'); return }
    await fetch('/api/admin/diaries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    toast.success('Added!'); setForm({ image_url: '', caption: '', display_order: 0, is_active: true }); await load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return
    await fetch(`/api/admin/diaries/${id}`, { method: 'DELETE' }); toast.success('Deleted'); await load()
  }

  const handleToggle = async (id: string, is_active: boolean) => {
    await fetch(`/api/admin/diaries/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active }) })
    await load()
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <p className="text-[10px] tracking-[4px] uppercase mb-1" style={{ color: '#B8952A' }}>Admin</p>
          <h1 className="font-cormorant text-[36px] font-light" style={{ color: '#1a1a1a' }}>Client Diaries</h1>
        </div>
        <div className="bg-white border p-5 mb-6" style={{ borderColor: '#e8e0d0' }}>
          <p className="text-[10px] tracking-[3px] uppercase mb-3" style={{ color: '#B8952A' }}>Add New</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <input type="url" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="Image URL *" className="px-3 py-2 text-[13px] border outline-none" style={{ borderColor: '#e8e0d0' }} onFocus={e => (e.target.style.borderColor = '#B8952A')} onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
            <input type="text" value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="Caption (optional)" className="px-3 py-2 text-[13px] border outline-none" style={{ borderColor: '#e8e0d0' }} onFocus={e => (e.target.style.borderColor = '#B8952A')} onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
            <input type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) }))} placeholder="Order" className="px-3 py-2 text-[13px] border outline-none" style={{ borderColor: '#e8e0d0' }} />
          </div>
          <button onClick={handleCreate} className="flex items-center gap-2 px-5 py-2 text-white text-[11px] tracking-[2px] uppercase" style={{ background: '#1a1a1a' }}><Plus size={13} /> Add</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="relative bg-white border" style={{ borderColor: '#e8e0d0' }}>
              <img src={item.image_url} alt="" className="w-full aspect-square object-cover" />
              {item.caption && <p className="px-3 py-2 text-[11px]" style={{ color: '#888' }}>{item.caption}</p>}
              <div className="flex items-center justify-between px-3 py-2 border-t" style={{ borderColor: '#f5f5f5' }}>
                <button onClick={() => handleToggle(item.id, !item.is_active)} className="text-[9px] tracking-[1px] uppercase px-2 py-0.5" style={{ background: item.is_active ? '#e8f5e9' : '#fce4e4', color: item.is_active ? '#2e7d32' : '#c0392b' }}>{item.is_active ? 'Active' : 'Hidden'}</button>
                <button onClick={() => handleDelete(item.id)} style={{ color: '#ccc' }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#c0392b')} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#ccc')}><Trash2 size={14} strokeWidth={1.5} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
