'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState({ customer_name: '', customer_handle: '', quote: '', display_order: 0, is_active: true })

  const load = () => fetch('/api/admin/testimonials').then(r => r.json()).then(d => setItems(d.testimonials ?? []))
  useEffect(() => { load() }, [])

  const handleCreate = async () => {
    if (!form.customer_name || !form.quote) { toast.error('Name and quote required'); return }
    await fetch('/api/admin/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    toast.success('Added!'); setForm({ customer_name: '', customer_handle: '', quote: '', display_order: 0, is_active: true }); await load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' }); await load()
  }

  const handleToggle = async (id: string, is_active: boolean) => {
    await fetch(`/api/admin/testimonials/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active }) })
    await load()
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <p className="text-[10px] tracking-[4px] uppercase mb-1" style={{ color: '#B8952A' }}>Admin</p>
          <h1 className="font-cormorant text-[36px] font-light" style={{ color: '#1a1a1a' }}>Testimonials</h1>
          <p className="text-[12px] mt-1" style={{ color: '#888' }}>Shown as "What Amani Girls Are Saying" on homepage</p>
        </div>
        <div className="bg-white border p-5 mb-6" style={{ borderColor: '#e8e0d0' }}>
          <p className="text-[10px] tracking-[3px] uppercase mb-3" style={{ color: '#B8952A' }}>Add New</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input type="text" value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))} placeholder="Customer Name *" className="px-3 py-2 text-[13px] border outline-none" style={{ borderColor: '#e8e0d0' }} onFocus={e => (e.target.style.borderColor = '#B8952A')} onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
            <input type="text" value={form.customer_handle} onChange={e => setForm(f => ({ ...f, customer_handle: e.target.value }))} placeholder="@handle (optional)" className="px-3 py-2 text-[13px] border outline-none" style={{ borderColor: '#e8e0d0' }} onFocus={e => (e.target.style.borderColor = '#B8952A')} onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
            <textarea value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} placeholder="Quote *" rows={3} className="px-3 py-2 text-[13px] border outline-none md:col-span-2 resize-none" style={{ borderColor: '#e8e0d0' }} onFocus={e => (e.target.style.borderColor = '#B8952A')} onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
          </div>
          <button onClick={handleCreate} className="flex items-center gap-2 px-5 py-2 text-white text-[11px] tracking-[2px] uppercase" style={{ background: '#1a1a1a' }}><Plus size={13} /> Add</button>
        </div>
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div key={item.id} className="bg-white border p-4 flex items-start gap-4" style={{ borderColor: '#e8e0d0' }}>
              <div className="flex-1">
                <p className="text-[13px] font-medium mb-0.5">{item.customer_name} <span className="font-normal text-[12px]" style={{ color: '#888' }}>{item.customer_handle}</span></p>
                <p className="text-[12px] italic" style={{ color: '#555' }}>"{item.quote}"</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
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
