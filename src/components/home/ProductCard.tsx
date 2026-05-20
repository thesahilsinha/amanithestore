'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Heart, ShoppingBag } from 'lucide-react'
import { useCurrency } from '@/context/CurrencyContext'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/currency'
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
}

export default function ProductCard({ product }: { product: Product }) {
  const { currency, getRate, getSymbol, isInternational } = useCurrency()
  const { addToCart } = useCart()
  const [hovered, setHovered] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [adding, setAdding] = useState(false)

  const altImage = product.secondary_images?.[0]
  const sizes = ['XS', 'S', 'M', 'L', 'XL']
  const isSoldOut = product.stock === 0
  const displayPrice = formatPrice(product.price_inr, currency, getRate(currency))

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!selectedSize) { toast.error('Please select a size'); return }
    if (isSoldOut) return
    setAdding(true)
    await addToCart(product.id, selectedSize)
    toast.success(`${product.name} added to cart`)
    setAdding(false)
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block cursor-pointer">
      {/* IMAGE */}
      <div
        className="relative h-[400px] overflow-hidden mb-[14px] bg-cream"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={product.primary_image_url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80'}
          alt={product.name}
          className={`w-full h-full object-cover object-top absolute inset-0 transition-opacity duration-500 ${hovered && altImage ? 'opacity-0' : 'opacity-100'}`}
        />
        {altImage && (
          <img
            src={altImage}
            alt={product.name}
            className={`w-full h-full object-cover object-top absolute inset-0 transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Badge */}
        {isSoldOut ? (
          <span className="absolute top-3 left-3 bg-[#888] text-white text-[9px] tracking-[1.5px] uppercase px-[10px] py-1 font-semibold z-10">
            Sold Out
          </span>
        ) : product.tags?.includes('new') ? (
          <span className="absolute top-3 left-3 bg-dark text-white text-[9px] tracking-[1.5px] uppercase px-[10px] py-1 font-semibold z-10">
            New
          </span>
        ) : null}

        {/* Hover Actions */}
        <div className={`absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-2 transition-transform duration-400 ${hovered ? 'translate-y-0' : 'translate-y-full'} z-20`}>
          {!isInternational ? (
            <button
              onClick={handleAddToCart}
              disabled={isSoldOut || adding}
              className="w-full py-[11px] bg-dark text-white text-[10px] tracking-[2.5px] uppercase font-medium hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSoldOut ? 'Sold Out' : adding ? 'Adding...' : 'Add to Cart'}
            </button>
          ) : (
            <button
              onClick={e => {
                e.preventDefault()
                window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I'm interested in ${product.name}\n${window.location.origin}/products/${product.slug}`)}`, '_blank')
              }}
              className="w-full py-[11px] bg-[#25D366] text-white text-[10px] tracking-[2.5px] uppercase font-medium hover:bg-[#20bd5a] transition-colors"
            >
              Enquire on WhatsApp
            </button>
          )}
        </div>
      </div>

      {/* SIZE PILLS */}
      <div className="flex gap-[6px] mb-2 flex-wrap" onClick={e => e.preventDefault()}>
        {sizes.map(s => (
          <button
            key={s}
            onClick={e => { e.preventDefault(); setSelectedSize(s) }}
            className={`text-[9px] px-2 py-[3px] border tracking-[1px] transition-all ${selectedSize === s ? 'border-gold text-gold' : 'border-border text-muted hover:border-gold hover:text-gold'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <p className="font-cormorant text-[17px] text-dark mb-[6px]">{product.name}</p>
      <p className="text-[13px] text-[#2c2c2c]">{displayPrice}</p>
    </Link>
  )
}