'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import toast from 'react-hot-toast'
import { Plus, Trash2, CheckCircle } from 'lucide-react'

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', bg_image_url: '', heading: '', subheading: '', cta_text: '', cta_link: '' })

  const load = () => fetch('/api/admin/banners').then(r => r.json()).then(d => setBanners(d.banners ?? []))
  useEffect(() => { load() }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleCreate = async () => {
    if (!form.name || !form.bg_image_url || !form.heading) { toast.error('Name, image and heading required'); return }
    setLoading(true)
    await fetch('/api/admin/banners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    toast.success('Banner created!')
    setForm({ name: '', bg_image_url: '', heading: '', subheading: '', cta_text: '', cta_link: '' })
    await load()
    setLoading(false)
  }

  const handleActivate = async (id: string) => {
    await fetch(`/api/admin/banners/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active: true }) })
    toast.success('Banner activated! All others deactivated.')
    await load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return
    await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' })
    toast.success('Deleted')
    await load()
  }

  const inputClass = "w-full px-3 py-2 text-[13px] border outline-none"
  const inputStyle = { borderColor: '#e8e0d0', fontFamily: 'var(--font-dm-sans)' }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <p className="text-[10px] tracking-[4px] uppercase mb-1" style={{ color: '#B8952A' }}>Admin</p>
          <h1 className="font-cormorant text-[36px] font-light" style={{ color: '#1a1a1a' }}>Campaign Banners</h1>
          <p className="text-[12px] mt-1" style={{ color: '#888' }}>Only ONE banner can be active at a time.</p>
        </div>

        {/* Create form */}
        <div className="bg-white border p-6 mb-8" style={{ borderColor: '#e8e0d0' }}>
          <p className="text-[10px] tracking-[3px] uppercase mb-4" style={{ color: '#B8952A' }}>New Banner</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {[
              { k: 'name', p: 'Banner Name *' },
              { k: 'bg_image_url', p: 'Background Image URL *' },
              { k: 'heading', p: 'Heading * (use \\n for line break)' },
              { k: 'subheading', p: 'Subheading (optional)' },
              { k: 'cta_text', p: 'Button Text (optional)' },
              { k: 'cta_link', p: 'Button Link (optional)' },
            ].map(({ k, p }) => (
              <input key={k} type="text" value={(form as any)[k]} onChange={e => set(k, e.target.value)} placeholder={p}
                className={inputClass} style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#B8952A')}
                onBlur={e => (e.target.style.borderColor = '#e8e0d0')}
              />
            ))}
          </div>
          <button onClick={handleCreate} disabled={loading}
            className="flex items-center gap-2 px-6 py-3 text-white text-[11px] tracking-[2px] uppercase"
            style={{ background: loading ? '#888' : '#1a1a1a' }}>
            <Plus size={14} /> Create Banner
          </button>
        </div>

        {/* Banners list */}
        <div className="flex flex-col gap-4">
          {banners.map(b => (
            <div key={b.id} className="bg-white border p-5 flex items-center gap-4" style={{ borderColor: b.is_active ? '#B8952A' : '#e8e0d0' }}>
              <img src={b.bg_image_url} alt="" className="w-20 h-12 object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[14px] font-medium">{b.name}</p>
                  {b.is_active && <span className="text-[9px] tracking-[1px] uppercase px-2 py-0.5" style={{ background: '#e8f5e9', color: '#2e7d32' }}>Active</span>}
                </div>
                <p className="text-[12px] truncate" style={{ color: '#888' }}>{b.heading}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {!b.is_active && (
                  <button onClick={() => handleActivate(b.id)} className="flex items-center gap-1 px-3 py-2 text-[11px] uppercase border transition-colors"
                    style={{ borderColor: '#B8952A', color: '#B8952A' }}>
                    <CheckCircle size={13} /> Activate
                  </button>
                )}
                <button onClick={() => handleDelete(b.id)} className="p-2 transition-colors" style={{ color: '#ccc' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#c0392b')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#ccc')}>
                  <Trash2 size={15} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}