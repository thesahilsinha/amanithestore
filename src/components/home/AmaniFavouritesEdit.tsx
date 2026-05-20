'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCurrency } from '@/context/CurrencyContext'
import { formatPrice } from '@/lib/currency'

interface Product {
  id: string; name: string; slug: string; price_inr: number; primary_image_url: string
}

export default function AmaniFavouritesEdit({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState(0)
  const { currency, getRate } = useCurrency()

  if (!products.length) return null

  return (
    <section className="py-20 px-6 md:px-12 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[3/4] overflow-hidden bg-cream"
          >
            <img
              src={products[selected]?.primary_image_url || 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=900&q=80'}
              alt={products[selected]?.name}
              className="w-full h-full object-cover object-top transition-all duration-500"
            />
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            <span className="text-[10px] tracking-[5px] uppercase text-gold mb-3">Curated For You</span>
            <h2 className="font-cormorant text-[clamp(36px,4vw,56px)] font-light text-dark leading-[1.1] mb-6">
              Amani<br /><em className="text-gold italic">Favourites</em>
            </h2>
            <p className="text-[14px] text-muted leading-relaxed mb-8">
              Our founder personally selects pieces that embody the AMANI spirit — bold, feminine, and timelessly luxurious. These are the dresses she'd wear herself.
            </p>

            {/* Picks thumbnails */}
            <div className="flex gap-3 mb-8 flex-wrap">
              {products.slice(0, 4).map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(i)}
                  className={`w-[72px] h-[88px] overflow-hidden border-2 transition-all ${i === selected ? 'border-gold' : 'border-transparent'}`}
                >
                  <img src={p.primary_image_url} alt={p.name} className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>

            {/* Selected product info */}
            {products[selected] && (
              <div className="mb-6">
                <p className="font-cormorant text-[20px] text-dark mb-1">{products[selected].name}</p>
                <p className="text-[14px] text-[#2c2c2c]">{formatPrice(products[selected].price_inr, currency, getRate(currency))}</p>
              </div>
            )}

            <Link
              href={products[selected] ? `/products/${products[selected].slug}` : '/products?filter=favourite'}
              className="self-start px-10 py-[14px] bg-dark text-white text-[10px] tracking-[3px] uppercase border border-dark hover:bg-gold hover:border-gold hover:text-dark transition-all duration-300"
            >
              Shop The Edit
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
