'use client'
import { useState } from 'react'
import Link from 'next/link'
import ProductCard from './ProductCard'

interface Product {
  id: string; name: string; slug: string; price_inr: number
  primary_image_url: string; secondary_images: string[]; tags: string[]; stock: number
}

interface Props {
  newArrivals: Product[]
  bestsellers: Product[]
  favourites: Product[]
}

export default function ProductTabs({ newArrivals, bestsellers, favourites }: Props) {
  const [tab, setTab] = useState<'new' | 'best' | 'fav'>('new')

  const tabs = [
    { id: 'new' as const, label: 'New Arrivals', products: newArrivals, viewHref: '/products?filter=new' },
    { id: 'best' as const, label: 'Best Sellers', products: bestsellers, viewHref: '/products?filter=bestseller' },
    { id: 'fav' as const, label: "Amani's Favourites", products: favourites, viewHref: '/products?filter=favourite' },
  ]

  const current = tabs.find(t => t.id === tab)!

  return (
    <section className="py-20 px-6 md:px-12 bg-white">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="text-[10px] tracking-[5px] uppercase text-gold block mb-2">The Edit</span>
        <h2 className="font-cormorant text-[clamp(32px,4vw,52px)] font-light text-dark leading-[1.1]">
          Shop the <em className="text-gold italic">Collection</em>
        </h2>
        <div className="w-12 h-[1px] bg-gold mx-auto mt-3" />
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-border mb-12">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-6 md:px-9 py-3 text-[11px] tracking-[2.5px] uppercase font-medium border-b-2 -mb-[1px] transition-all ${
              tab === t.id ? 'text-gold border-gold' : 'text-muted border-transparent hover:text-dark'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {current.products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7 max-w-[1440px] mx-auto">
          {current.products.slice(0, 8).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted text-[13px] tracking-[1px] py-12">No products yet.</p>
      )}

      {/* View All */}
      <div className="text-center mt-14">
        <Link
          href={current.viewHref}
          className="inline-block px-11 py-[13px] border border-dark text-dark text-[10px] tracking-[3px] uppercase hover:bg-dark hover:text-white transition-all duration-300"
        >
          View All {current.label}
        </Link>
      </div>
    </section>
  )
}