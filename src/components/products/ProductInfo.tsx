'use client'
import { useState } from 'react'
import { ChevronDown, MessageCircle, ShoppingBag, Share2 } from 'lucide-react'
import { useCurrency } from '@/context/CurrencyContext'
import { useCart } from '@/context/CartContext'
import { formatPrice, generateWhatsAppLink } from '@/lib/currency'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  price_inr: number
  stock: number
  size_inventory: Record<string, number>
  tags: string[]
  slug: string
  category: { name: string; slug: string }
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL']

export default function ProductInfo({ product }: { product: Product }) {
  const { currency, getRate, isInternational } = useCurrency()
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState('')
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)
  const [openAcc, setOpenAcc] = useState<string | null>(null)

  const sizeInventory: Record<string, number> = product.size_inventory ?? {
    XS: product.stock, S: product.stock, M: product.stock, L: product.stock, XL: product.stock
  }

  const getSizeStock = (size: string) => sizeInventory[size] ?? 0
  const isSizeAvailable = (size: string) => getSizeStock(size) > 0
  const selectedStock = selectedSize ? getSizeStock(selectedSize) : 0
  const isSoldOut = SIZES.every(s => getSizeStock(s) === 0)
  const displayPrice = formatPrice(product.price_inr, currency, getRate(currency))

  const maxQty = Math.min(selectedStock, 10)

  const handleAddToCart = async () => {
    if (!selectedSize) { toast.error('Please select a size'); return }
    if (!isSizeAvailable(selectedSize)) { toast.error('This size is sold out'); return }
    setAdding(true)
    for (let i = 0; i < qty; i++) await addToCart(product.id, selectedSize)
    toast.success('Added to cart!')
    setAdding(false)
  }

  const handleWhatsApp = () => {
    if (!selectedSize) { toast.error('Please select a size'); return }
    const link = generateWhatsAppLink(
      product.name, selectedSize,
      window.location.href,
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!
    )
    window.open(link, '_blank')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied!')
  }

  const accordions = [
    {
      id: 'shipping',
      label: 'Shipping & Delivery',
      content: 'Ready to ship — dispatched in 3 to 5 working days.\nFlat ₹200 shipping across India. Express shipping available on request via WhatsApp.',
      isLink: false,
    },
    {
      id: 'returns',
      label: 'Returns & Exchanges',
      content: '',
      isLink: true,
      linkLabel: 'View our Returns & Exchange Policy →',
      linkHref: '/returns-policy',
    },
  ]

  return (
    <div className="pl-10 border-l py-8" style={{ borderColor: '#e8e0d0' }}>
      <span className="text-[10px] tracking-[3px] uppercase block mb-2" style={{ color: '#B8952A' }}>
        House of Amani
      </span>

      <h1 className="font-cormorant text-[38px] font-normal leading-[1.15] mb-2" style={{ color: '#1a1a1a' }}>
        {product.name}
      </h1>
      <p className="text-[13px] mb-5" style={{ color: '#888' }}>{product.category?.name}</p>

      <div className="mb-5">
        <span className="text-[28px] font-light tracking-[1px]" style={{ color: '#2c2c2c' }}>
          {displayPrice}
        </span>
        {!isInternational && (
          <span className="text-[11px] ml-3 tracking-[1px]" style={{ color: '#888' }}>Incl. of all taxes</span>
        )}
      </div>

      {/* Description always visible */}
      {product.description && (
        <div className="mb-5 pb-5 border-b" style={{ borderColor: '#e8e0d0' }}>
          <p className="text-[13px] leading-relaxed whitespace-pre-line" style={{ color: '#555' }}>
            {product.description}
          </p>
        </div>
      )}

      {/* Hardcoded info */}
      <div className="mb-5 pb-5 border-b flex flex-col gap-[6px]" style={{ borderColor: '#e8e0d0' }}>
        <p className="text-[13px]" style={{ color: '#555' }}>Dry clean only</p>
        <p className="text-[13px]" style={{ color: '#555' }}>Size chart contains ready garment measurements</p>
        <p className="text-[13px]" style={{ color: '#555' }}>Ready to ship — dispatched in 3 to 5 working days</p>
      </div>

      {/* Tags */}
      {product.tags?.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-5">
          {product.tags.map(tag => (
            <span key={tag} className="text-[10px] tracking-[1px] uppercase px-3 py-1 border" style={{ borderColor: '#e8e0d0', color: '#888' }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Overall sold out */}
      {isSoldOut && (
        <div className="mb-5 py-3 px-4 text-[12px] tracking-[1px] uppercase text-center" style={{ background: '#f5f5f5', color: '#888' }}>
          Sold Out — Join waitlist via WhatsApp
        </div>
      )}

      {/* Size selector */}
      {!isSoldOut && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] tracking-[2px] uppercase" style={{ color: '#2c2c2c' }}>
              Size {selectedSize && <span style={{ color: '#B8952A' }}>— {selectedSize}</span>}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {SIZES.map(s => {
              const available = isSizeAvailable(s)
              const stock = getSizeStock(s)
              const isSelected = selectedSize === s
              return (
                <button
                  key={s}
                  onClick={() => { if (available) { setSelectedSize(s); setQty(1) } }}
                  disabled={!available}
                  title={available ? `${stock} in stock` : 'Sold out'}
                  className="relative w-14 h-12 text-[12px] tracking-[1px] transition-all border"
                  style={{
                    borderColor: isSelected ? '#1a1a1a' : available ? '#e8e0d0' : '#f0f0f0',
                    background: isSelected ? '#1a1a1a' : 'transparent',
                    color: isSelected ? '#fff' : available ? '#2c2c2c' : '#ccc',
                    cursor: available ? 'pointer' : 'not-allowed',
                  }}
                >
                  {s}
                  {!available && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span style={{
                        position: 'absolute', top: '50%', left: '10%', right: '10%',
                        height: '1px', background: '#ccc', transform: 'rotate(-20deg)'
                      }} />
                    </span>
                  )}
                  {available && stock <= 3 && (
                    <span className="absolute -top-1.5 -right-1.5 text-[8px] px-1 rounded-full text-white" style={{ background: '#c0392b' }}>
                      {stock}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          {selectedSize && selectedStock <= 3 && selectedStock > 0 && (
            <p className="text-[11px] mt-2" style={{ color: '#c0392b' }}>
              Only {selectedStock} left in {selectedSize}!
            </p>
          )}
        </div>
      )}

      {/* Size chart link */}
      <button
        onClick={() => document.dispatchEvent(new CustomEvent('show-size-chart'))}
        className="text-[11px] tracking-[1px] underline mb-5 block text-left"
        style={{ color: '#888' }}
      >
        View Size Chart
      </button>

      {/* Qty */}
      {!isInternational && !isSoldOut && selectedSize && (
        <div className="flex items-center gap-4 mb-6">
          <p className="text-[11px] tracking-[2px] uppercase" style={{ color: '#2c2c2c' }}>Quantity</p>
          <div className="flex items-center border" style={{ borderColor: '#e8e0d0' }}>
            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 text-lg hover:bg-gray-50 transition-colors">−</button>
            <span className="w-10 text-center text-[14px]">{qty}</span>
            <button onClick={() => setQty(q => Math.min(maxQty, q + 1))} className="w-10 h-10 text-lg hover:bg-gray-50 transition-colors">+</button>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex flex-col gap-3 mb-6">
        {!isInternational ? (
          <button
            onClick={handleAddToCart}
            disabled={isSoldOut || adding || !selectedSize}
            className="w-full py-4 text-white text-[11px] tracking-[3px] uppercase font-medium transition-all"
            style={{ background: isSoldOut ? '#888' : '#1a1a1a' }}
            onMouseEnter={e => { if (!isSoldOut) (e.currentTarget.style.background = '#B8952A') }}
            onMouseLeave={e => { if (!isSoldOut) (e.currentTarget.style.background = '#1a1a1a') }}
          >
            {isSoldOut ? 'Sold Out'
              : adding ? 'Adding...'
              : !selectedSize ? 'Select a Size'
              : <span className="flex items-center justify-center gap-2"><ShoppingBag size={16} strokeWidth={1.5} /> Add to Bag</span>
            }
          </button>
        ) : (
          <button
            onClick={handleWhatsApp}
            className="w-full py-4 text-white text-[11px] tracking-[3px] uppercase font-medium flex items-center justify-center gap-2"
            style={{ background: '#25D366' }}
          >
            <MessageCircle size={16} strokeWidth={1.5} />
            Enquire on WhatsApp
          </button>
        )}
        <button
          onClick={handleShare}
          className="w-full py-3 text-[11px] tracking-[2px] uppercase border flex items-center justify-center gap-2 transition-all"
          style={{ borderColor: '#e8e0d0', color: '#888' }}
          onMouseEnter={e => { (e.currentTarget.style.borderColor = '#B8952A'); (e.currentTarget.style.color = '#B8952A') }}
          onMouseLeave={e => { (e.currentTarget.style.borderColor = '#e8e0d0'); (e.currentTarget.style.color = '#888') }}
        >
          <Share2 size={14} strokeWidth={1.5} /> Share
        </button>
      </div>

      {isInternational && (
        <div className="p-4 mb-6 text-[12px] leading-relaxed" style={{ background: '#FDF6E3', border: '1px solid #e8e0d0', color: '#888' }}>
          International orders are handled via WhatsApp. Select your size and click Enquire to connect with us directly.
        </div>
      )}

      {/* Accordions */}
      <div className="border-t" style={{ borderColor: '#e8e0d0' }}>
        {accordions.map(acc => (
          <div key={acc.id} className="border-b" style={{ borderColor: '#e8e0d0' }}>
            <button
              onClick={() => setOpenAcc(openAcc === acc.id ? null : acc.id)}
              className="w-full flex items-center justify-between py-4 text-[11px] tracking-[2px] uppercase text-left transition-colors"
              style={{ color: openAcc === acc.id ? '#B8952A' : '#2c2c2c' }}
            >
              {acc.label}
              <ChevronDown
                size={14}
                strokeWidth={1.5}
                style={{ transition: 'transform 0.3s', transform: openAcc === acc.id ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
              />
            </button>
            {openAcc === acc.id && (
              <div className="pb-4 text-[13px] leading-relaxed whitespace-pre-line" style={{ color: '#555' }}>
                {acc.content}
                {acc.isLink && (
                  <a href={acc.linkHref} className="block mt-1 text-[12px] underline" style={{ color: '#B8952A' }}>
                    {acc.linkLabel}
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
