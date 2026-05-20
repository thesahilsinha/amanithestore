'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

interface Category { id: string; name: string; slug: string }

interface Props {
  categories: Category[]
  totalCount: number
}

export default function ProductFilters({ categories, totalCount }: Props) {
  const router = useRouter()
  const params = useSearchParams()
  const [open, setOpen] = useState(false)

  const currentFilter = params.get('filter') ?? ''
  const currentCategory = params.get('category') ?? ''
  const currentSearch = params.get('search') ?? ''

  const apply = (key: string, value: string) => {
    const p = new URLSearchParams(params.toString())
    if (value) p.set(key, value)
    else p.delete(key)
    p.delete('page')
    router.push(`/products?${p.toString()}`)
  }

  const clearAll = () => router.push('/products')

  const filters = [
    { id: '', label: 'All' },
    { id: 'new', label: 'New Arrivals' },
    { id: 'bestseller', label: 'Best Sellers' },
    { id: 'favourite', label: "Amani's Favourites" },
  ]

  const hasFilters = currentFilter || currentCategory || currentSearch

  return (
    <div className="border-b mb-8 pb-5" style={{ borderColor: '#e8e0d0' }}>
      {/* Top row */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[12px] tracking-[1px]" style={{ color: '#888' }}>
          {totalCount} {totalCount === 1 ? 'piece' : 'pieces'}
        </p>
        <div className="flex items-center gap-3">
          {hasFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-[11px] tracking-[1px] uppercase transition-colors"
              style={{ color: '#B8952A' }}
            >
              <X size={12} /> Clear filters
            </button>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-[11px] tracking-[1.5px] uppercase border px-3 py-2 transition-all"
            style={{ borderColor: open ? '#B8952A' : '#e8e0d0', color: open ? '#B8952A' : '#2c2c2c' }}
          >
            <SlidersHorizontal size={14} strokeWidth={1.5} />
            Filter
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-0 flex-wrap border-b" style={{ borderColor: '#e8e0d0' }}>
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => apply('filter', f.id)}
            className="px-5 py-3 text-[11px] tracking-[2px] uppercase border-b-2 -mb-[1px] transition-all"
            style={{
              borderBottomColor: currentFilter === f.id || (!currentFilter && f.id === '') ? '#B8952A' : 'transparent',
              color: currentFilter === f.id || (!currentFilter && f.id === '') ? '#B8952A' : '#888'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Expandable category filter */}
      {open && (
        <div className="pt-5">
          <p className="text-[10px] tracking-[3px] uppercase mb-3" style={{ color: '#B8952A' }}>Category</p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => apply('category', '')}
              className="px-4 py-2 text-[11px] tracking-[1px] uppercase border transition-all"
              style={{
                borderColor: !currentCategory ? '#1a1a1a' : '#e8e0d0',
                background: !currentCategory ? '#1a1a1a' : 'transparent',
                color: !currentCategory ? '#fff' : '#888'
              }}
            >
              All Categories
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => apply('category', c.slug)}
                className="px-4 py-2 text-[11px] tracking-[1px] uppercase border transition-all"
                style={{
                  borderColor: currentCategory === c.slug ? '#1a1a1a' : '#e8e0d0',
                  background: currentCategory === c.slug ? '#1a1a1a' : 'transparent',
                  color: currentCategory === c.slug ? '#fff' : '#888'
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
