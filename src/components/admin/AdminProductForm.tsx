'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Category { id: string; name: string }
interface Props { categories: Category[]; product?: any; mode: 'new' | 'edit' }

const SIZES = ['XS', 'S', 'M', 'L', 'XL']

export default function AdminProductForm({ categories, product, mode }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const defaultSizeInventory = SIZES.reduce((acc, s) => ({ ...acc, [s]: 0 }), {} as Record<string, number>)

  const [form, setForm] = useState({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    category_id: product?.category_id ?? categories[0]?.id ?? '',
    price_inr: product?.price_inr ?? '',
    primary_image_url: product?.primary_image_url ?? '',
    video_url: product?.video_url ?? '',
    secondary_images: product?.secondary_images ?? ['', '', '', '', ''],
    tags: product?.tags?.join(', ') ?? '',
    size_inventory: product?.size_inventory ?? defaultSizeInventory,
    is_active: product?.is_active ?? true,
    is_bestseller: product?.is_bestseller ?? false,
    is_amani_favourite: product?.is_amani_favourite ?? false,
  })

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const totalStock = SIZES.reduce((sum, s) => sum + (parseInt(String(form.size_inventory[s])) || 0), 0)

  const handleSlug = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    set('slug', slug)
  }

  const setSizeStock = (size: string, value: string) => {
    const num = Math.max(0, parseInt(value) || 0)
    setForm(f => ({ ...f, size_inventory: { ...f.size_inventory, [size]: num } }))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.slug || !form.price_inr || !form.category_id) {
      toast.error('Fill required fields: name, slug, price, category')
      return
    }
    setLoading(true)

    const payload = {
      ...form,
      price_inr: parseFloat(String(form.price_inr)),
      stock: totalStock,
      secondary_images: form.secondary_images.filter(Boolean),
      tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      size_inventory: form.size_inventory,
    }

    const url = mode === 'new' ? '/api/admin/products' : '/api/admin/products/' + product.id
    const method = mode === 'new' ? 'POST' : 'PATCH'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (data.error) { toast.error(data.error); setLoading(false); return }
    toast.success(mode === 'new' ? 'Product created!' : 'Product updated!')
    router.push('/admin/products')
    router.refresh()
  }

  const inputClass = "w-full px-4 py-3 text-[13px] border outline-none transition-colors"
  const inputStyle = { borderColor: '#e8e0d0', fontFamily: 'var(--font-dm-sans)' }

  return (
    <div className="max-w-[800px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Name */}
        <div className="md:col-span-2">
          <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Product Name *</label>
          <input type="text" value={form.name}
            onChange={e => { set('name', e.target.value); if (mode === 'new') handleSlug(e.target.value) }}
            className={inputClass} style={inputStyle}
            onFocus={e => (e.target.style.borderColor = '#B8952A')}
            onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
        </div>

        {/* Slug */}
        <div className="md:col-span-2">
          <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Slug *</label>
          <input type="text" value={form.slug} onChange={e => set('slug', e.target.value)}
            className={inputClass} style={inputStyle}
            onFocus={e => (e.target.style.borderColor = '#B8952A')}
            onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
        </div>

        {/* Category */}
        <div>
          <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Category *</label>
          <select value={form.category_id} onChange={e => set('category_id', e.target.value)}
            className={inputClass} style={inputStyle}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Price (INR) *</label>
          <input type="number" value={form.price_inr} onChange={e => set('price_inr', e.target.value)}
            className={inputClass} style={inputStyle}
            onFocus={e => (e.target.style.borderColor = '#B8952A')}
            onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
        </div>

        {/* Size Inventory */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <label className="text-[10px] tracking-[2px] uppercase" style={{ color: '#888' }}>
              Size Inventory
            </label>
            <span className="text-[11px] px-3 py-1 rounded-full" style={{ background: '#FDF6E3', color: '#B8952A' }}>
              Total stock: {totalStock}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {SIZES.map(size => (
              <div key={size} className="text-center">
                <label className="text-[11px] font-medium block mb-1" style={{ color: '#555' }}>{size}</label>
                <input
                  type="number"
                  min="0"
                  value={form.size_inventory[size] ?? 0}
                  onChange={e => setSizeStock(size, e.target.value)}
                  className="w-full text-center px-2 py-3 text-[14px] border outline-none font-medium"
                  style={{
                    borderColor: (form.size_inventory[size] ?? 0) > 0 ? '#B8952A' : '#e8e0d0',
                    color: (form.size_inventory[size] ?? 0) > 0 ? '#1a1a1a' : '#ccc',
                    fontFamily: 'var(--font-dm-sans)',
                    background: (form.size_inventory[size] ?? 0) > 0 ? '#FDF6E3' : '#fafafa',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#B8952A')}
                  onBlur={e => (e.target.style.borderColor = (form.size_inventory[size] ?? 0) > 0 ? '#B8952A' : '#e8e0d0')}
                />
                <p className="text-[9px] mt-1" style={{ color: (form.size_inventory[size] ?? 0) === 0 ? '#ccc' : '#888' }}>
                  {(form.size_inventory[size] ?? 0) === 0 ? 'Sold out' : 'in stock'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Tags (comma separated)</label>
          <input type="text" value={form.tags} onChange={e => set('tags', e.target.value)}
            placeholder="summer, silk, maxi, new"
            className={inputClass} style={inputStyle}
            onFocus={e => (e.target.style.borderColor = '#B8952A')}
            onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Description</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            rows={4} className={inputClass} style={{ ...inputStyle, resize: 'none' }}
            onFocus={e => (e.target.style.borderColor = '#B8952A')}
            onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
        </div>

        {/* Primary image */}
        <div className="md:col-span-2">
          <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Primary Image URL</label>
          <input type="url" value={form.primary_image_url} onChange={e => set('primary_image_url', e.target.value)}
            placeholder="https://..." className={inputClass} style={inputStyle}
            onFocus={e => (e.target.style.borderColor = '#B8952A')}
            onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
          {form.primary_image_url && (
            <img src={form.primary_image_url} alt="" className="mt-2 h-24 w-20 object-cover object-top" style={{ border: '1px solid #e8e0d0' }} />
          )}
        </div>

        {/* Video URL */}
        <div className="md:col-span-2">
          <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Video URL (YouTube / Vimeo)</label>
          <input type="url" value={form.video_url} onChange={e => set('video_url', e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className={inputClass} style={inputStyle}
            onFocus={e => (e.target.style.borderColor = '#B8952A')}
            onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
        </div>

        {/* Secondary images */}
        <div className="md:col-span-2">
          <label className="text-[10px] tracking-[2px] uppercase block mb-2" style={{ color: '#888' }}>Secondary Images (up to 5 URLs)</label>
          <div className="flex flex-col gap-2">
            {form.secondary_images.map((url: string, i: number) => (
              <input key={i} type="url" value={url}
                onChange={e => {
                  const imgs = [...form.secondary_images]
                  imgs[i] = e.target.value
                  set('secondary_images', imgs)
                }}
                placeholder={'Image ' + (i + 1) + ' URL'}
                className={inputClass} style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#B8952A')}
                onBlur={e => (e.target.style.borderColor = '#e8e0d0')} />
            ))}
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {form.secondary_images.filter(Boolean).map((url: string, i: number) => (
              <img key={i} src={url} alt="" className="h-16 w-12 object-cover object-top" style={{ border: '1px solid #e8e0d0' }} />
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="md:col-span-2 flex flex-wrap gap-6">
          {[
            { key: 'is_active', label: 'Active (visible on site)' },
            { key: 'is_bestseller', label: 'Bestseller' },
            { key: 'is_amani_favourite', label: "Amani's Favourite" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => set(key, !(form as any)[key])}
                className="w-10 h-5 rounded-full relative transition-all cursor-pointer"
                style={{ background: (form as any)[key] ? '#B8952A' : '#ddd' }}
              >
                <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all"
                  style={{ left: (form as any)[key] ? '22px' : '2px' }} />
              </div>
              <span className="text-[12px]" style={{ color: '#555' }}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={handleSubmit} disabled={loading}
          className="px-10 py-3 text-white text-[11px] tracking-[3px] uppercase transition-all"
          style={{ background: loading ? '#888' : '#1a1a1a' }}
          onMouseEnter={e => { if (!loading) (e.currentTarget.style.background = '#B8952A') }}
          onMouseLeave={e => { if (!loading) (e.currentTarget.style.background = '#1a1a1a') }}>
          {loading ? 'Saving...' : mode === 'new' ? 'Create Product' : 'Save Changes'}
        </button>
        <button onClick={() => router.back()}
          className="px-8 py-3 text-[11px] tracking-[2px] uppercase border"
          style={{ borderColor: '#e8e0d0', color: '#888' }}>
          Cancel
        </button>
      </div>
    </div>
  )
}
