'use client'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useCurrency } from '@/context/CurrencyContext'
import { formatPrice } from '@/lib/currency'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity } = useCart()
  const { currency, getRate } = useCurrency()

  const subtotal = items.reduce((sum, i) => sum + i.product.price_inr * i.quantity, 0)

  if (!items.length) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6" style={{ background: '#fff' }}>
        <p className="font-cormorant text-[32px] font-light" style={{ color: '#1a1a1a' }}>Your bag is empty</p>
        <p className="text-[13px]" style={{ color: '#888' }}>Looks like you haven't added anything yet.</p>
        <Link href="/products" className="px-10 py-3 text-white text-[10px] tracking-[3px] uppercase" style={{ background: '#1a1a1a' }}>
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>
      <div className="py-10 text-center border-b" style={{ background: '#FAFAF7', borderColor: '#e8e0d0' }}>
        <h1 className="font-cormorant text-[42px] font-light" style={{ color: '#1a1a1a' }}>Your Bag</h1>
        <p className="text-[12px] tracking-[2px] uppercase mt-1" style={{ color: '#888' }}>{items.length} {items.length === 1 ? 'item' : 'items'}</p>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 md:px-12 py-12">
        {/* Items */}
        <div className="flex flex-col divide-y" style={{ borderColor: '#e8e0d0' }}>
          {items.map(item => (
            <div key={item.id} className="flex gap-5 py-6">
              <Link href={`/products/${item.product.slug}`}>
                <img
                  src={item.product.primary_image_url}
                  alt={item.product.name}
                  className="w-24 h-32 object-cover object-top flex-shrink-0"
                  style={{ background: '#FAFAF7' }}
                />
              </Link>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <Link href={`/products/${item.product.slug}`} className="font-cormorant text-[18px] hover:text-[#B8952A] transition-colors" style={{ color: '#1a1a1a' }}>
                    {item.product.name}
                  </Link>
                  <button onClick={() => removeFromCart(item.id)} className="text-[#ccc] hover:text-[#c0392b] transition-colors ml-4">
                    <Trash2 size={16} strokeWidth={1.5} />
                  </button>
                </div>
                <p className="text-[11px] tracking-[1.5px] uppercase mb-3" style={{ color: '#888' }}>Size: {item.size}</p>
                <p className="text-[14px] mb-4">{formatPrice(item.product.price_inr, currency, getRate(currency))}</p>
                <div className="flex items-center border w-fit" style={{ borderColor: '#e8e0d0' }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Minus size={12} />
                  </button>
                  <span className="w-9 text-center text-[13px]">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border-t pt-8 mt-4" style={{ borderColor: '#e8e0d0' }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-[12px] tracking-[1px] uppercase mb-1" style={{ color: '#888' }}>Subtotal</p>
              <p className="font-cormorant text-[28px] font-light">{formatPrice(subtotal, currency, getRate(currency))}</p>
              <p className="text-[11px] mt-1" style={{ color: '#888' }}>Delivery calculated at checkout</p>
            </div>
            <Link
              href="/checkout"
              className="px-12 py-4 text-white text-[11px] tracking-[3px] uppercase transition-all"
              style={{ background: '#1a1a1a' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.background = '#B8952A')}
              onMouseLeave={e => ((e.target as HTMLElement).style.background = '#1a1a1a')}
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
