'use client'
import { formatPrice } from '@/lib/currency'

interface CartItem {
  id: string
  size: string
  quantity: number
  product: { name: string; price_inr: number; primary_image_url: string; slug: string }
}

interface Props {
  items: CartItem[]
  subtotal: number
  deliveryCharge: number
  total: number
}

export default function OrderSummary({ items, subtotal, deliveryCharge, total }: Props) {
  return (
    <div className="sticky top-24">
      <p className="text-[10px] tracking-[3px] uppercase mb-6" style={{ color: '#B8952A' }}>Order Summary</p>

      {/* Items */}
      <div className="flex flex-col gap-4 mb-6">
        {items.map(item => (
          <div key={item.id} className="flex gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={item.product.primary_image_url}
                alt={item.product.name}
                className="w-16 h-20 object-cover object-top"
                style={{ background: '#FAFAF7' }}
              />
              <span
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-semibold"
                style={{ background: '#1a1a1a' }}
              >
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-cormorant text-[15px] leading-tight mb-1 truncate">{item.product.name}</p>
              <p className="text-[11px] tracking-[1px] uppercase" style={{ color: '#888' }}>Size: {item.size}</p>
              <p className="text-[13px] mt-1">₹{(item.product.price_inr * item.quantity).toLocaleString('en-IN')}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t pt-4 flex flex-col gap-2" style={{ borderColor: '#e8e0d0' }}>
        <div className="flex justify-between text-[13px]">
          <span style={{ color: '#888' }}>Subtotal</span>
          <span>₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span style={{ color: '#888' }}>Delivery</span>
          <span>{deliveryCharge > 0 ? `₹${deliveryCharge.toLocaleString('en-IN')}` : '—'}</span>
        </div>
        <div className="flex justify-between border-t pt-3 mt-1" style={{ borderColor: '#e8e0d0' }}>
          <span className="font-medium">Total</span>
          <span className="text-[16px] font-medium" style={{ color: '#B8952A' }}>
            ₹{total.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  )
}
