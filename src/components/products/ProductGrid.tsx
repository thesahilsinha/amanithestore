'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { useCurrency } from '@/context/CurrencyContext'
import { useCart } from '@/context/CartContext'
import { formatPrice, generateWhatsAppLink } from '@/lib/currency'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  price_inr: number
  primary_image_url: string
  secondary_images: string[]
  tags: string[]
  stock: number
  size_inventory: Record<string, number>
  is_bestseller: boolean
  is_amani_favourite: boolean
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL']

function ProductCard({ product }: { product: Product }) {
  const { currency, getRate, isInternational } = useCurrency()
  const { addToCart } = useCart()
  const [hovered, setHovered] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [adding, setAdding] = useState(false)

  const sizeInventory: Record<string, number> = product.size_inventory ?? {}
  const isSizeAvailable = (s: string) => (sizeInventory[s] ?? product.stock ?? 0) > 0
  const isSoldOut = SIZES.every(s => !isSizeAvailable(s))
  const altImage = product.secondary_images?.[0]
  const displayPrice = formatPrice(product.price_inr, currency, getRate(currency))

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!selectedSize) { toast.error('Select a size first'); return }
    if (!isSizeAvailable(selectedSize)) { toast.error('Size not available'); return }
    setAdding(true)
    await addToCart(product.id, selectedSize)
    toast.success('Added to cart')
    setAdding(false)
  }

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault()
    const link = generateWhatsAppLink(
      product.name,
      selectedSize || 'Not selected',
      `${window.location.origin}/products/${product.slug}`,
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!
    )
    window.open(link, '_blank')
  }

  return (
    <Link href={'/products/' + product.slug} className="group block">
      {/* Image */}
      <div
        className="relative overflow-hidden mb-[14px]"
        style={{ height: '400px', background: '#FAFAF7' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={product.primary_image_url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-top absolute inset-0 transition-opacity duration-500"
          style={{ opacity: hovered && altImage ? 0 : 1 }}
        />
        {altImage && (
          <img
            src={altImage}
            alt={product.name}
            className="w-full h-full object-cover object-top absolute inset-0 transition-opacity duration-500"
            style={{ opacity: hovered ? 1 : 0 }}
          />
        )}

        {/* Badge */}
        {isSoldOut && (
          <span className="absolute top-3 left-3 z-10 text-white text-[9px] tracking-[1.5px] uppercase px-[10px] py-1 font-semibold" style={{ background: '#888' }}>Sold Out</span>
        )}
        {!isSoldOut && product.is_bestseller && (
          <span className="absolute top-3 left-3 z-10 text-white text-[9px] tracking-[1.5px] uppercase px-[10px] py-1 font-semibold" style={{ background: '#B8952A' }}>Bestseller</span>
        )}
        {!isSoldOut && !product.is_bestseller && product.tags?.includes('new') && (
          <span className="absolute top-3 left-3 z-10 text-white text-[9px] tracking-[1.5px] uppercase px-[10px] py-1 font-semibold" style={{ background: '#1a1a1a' }}>New</span>
        )}

        {/* Hover CTA */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-2 z-20 transition-transform duration-300"
          style={{ transform: hovered ? 'translateY(0)' : 'translateY(100%)' }}
        >
          {!isInternational ? (
            <button
              onClick={handleAddToCart}
              disabled={isSoldOut || adding}
              className="w-full py-[11px] text-white text-[10px] tracking-[2.5px] uppercase font-medium transition-colors"
              style={{ background: isSoldOut ? '#888' : '#1a1a1a' }}
              onMouseEnter={e => { if (!isSoldOut) (e.currentTarget as HTMLElement).style.background = '#B8952A' }}
              onMouseLeave={e => { if (!isSoldOut) (e.currentTarget as HTMLElement).style.background = '#1a1a1a' }}
            >
              {isSoldOut ? 'Sold Out' : adding ? 'Adding...' : 'Add to Cart'}
            </button>
          ) : (
            <button
              onClick={handleWhatsApp}
              className="w-full py-[11px] text-white text-[10px] tracking-[2px] uppercase font-medium"
              style={{ background: '#25D366' }}
            >
              Enquire on WhatsApp
            </button>
          )}
        </div>
      </div>

      {/* Size pills */}
      <div className="flex gap-[6px] mb-2 flex-wrap" onClick={e => e.preventDefault()}>
        {SIZES.map(s => {
          const available = isSizeAvailable(s)
          return (
            <button
              key={s}
              onClick={e => { e.preventDefault(); if (available) setSelectedSize(s) }}
              disabled={!available}
              className="text-[9px] px-2 py-[3px] tracking-[1px] transition-all border"
              style={{
                borderColor: selectedSize === s ? '#B8952A' : available ? '#e8e0d0' : '#f0f0f0',
                color: selectedSize === s ? '#B8952A' : available ? '#888' : '#ccc',
                textDecoration: !available ? 'line-through' : 'none',
                cursor: available ? 'pointer' : 'not-allowed',
              }}
            >
              {s}
            </button>
          )
        })}
      </div>

      <p className="font-cormorant text-[17px] mb-[6px]" style={{ color: '#1a1a1a' }}>{product.name}</p>
      <p className="text-[13px]" style={{ color: '#2c2c2c' }}>{displayPrice}</p>
    </Link>
  )
}

export default function ProductGrid({ products, loading }: { products: Product[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-[400px] bg-gray-100 mb-3" />
            <div className="h-3 bg-gray-100 w-3/4 mb-2" />
            <div className="h-3 bg-gray-100 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="text-center py-20">
        <p className="text-[13px] tracking-[2px] uppercase" style={{ color: '#888' }}>No products found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}