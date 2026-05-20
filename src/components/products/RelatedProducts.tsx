'use client'
import Link from 'next/link'
import { useCurrency } from '@/context/CurrencyContext'
import { formatPrice } from '@/lib/currency'

interface Product {
  id: string; name: string; slug: string; price_inr: number; primary_image_url: string; secondary_images: string[]
}

export default function RelatedProducts({ products }: { products: Product[] }) {
  const { currency, getRate } = useCurrency()
  if (!products.length) return null

  return (
    <section className="py-16 px-6 md:px-12 border-t" style={{ borderColor: '#e8e0d0' }}>
      <div className="text-center mb-10">
        <span className="text-[10px] tracking-[5px] uppercase block mb-2" style={{ color: '#B8952A' }}>You May Also Like</span>
        <h2 className="font-cormorant text-[36px] font-light" style={{ color: '#1a1a1a' }}>
          Complete the <em style={{ color: '#B8952A', fontStyle: 'italic' }}>Look</em>
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-[1440px] mx-auto">
        {products.map(p => (
          <Link key={p.id} href={`/products/${p.slug}`} className="group block">
            <div className="relative overflow-hidden mb-3" style={{ height: 360, background: '#FAFAF7' }}>
              <img
                src={p.primary_image_url}
                alt={p.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <p className="font-cormorant text-[16px] mb-1" style={{ color: '#1a1a1a' }}>{p.name}</p>
            <p className="text-[13px]" style={{ color: '#2c2c2c' }}>{formatPrice(p.price_inr, currency, getRate(currency))}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}