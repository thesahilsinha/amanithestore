'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import OrderSummary from './OrderSummary'
import { calculateDelivery } from '@/lib/delivery'
import toast from 'react-hot-toast'

declare global { interface Window { Razorpay: any } }

const INDIA_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh',
]

export default function CheckoutForm() {
  const { items, clearCart } = useCart()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [codEnabled, setCodEnabled] = useState(false)
  const [deliveryRates, setDeliveryRates] = useState({ mumbai: 150, maharashtra: 200, india: 250 })

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', state: 'Maharashtra', pincode: '',
    paymentMethod: 'razorpay' as 'razorpay' | 'cod',
  })

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        setCodEnabled(data.cod_enabled === true || data.cod_enabled === 'true')
        setDeliveryRates({
          mumbai: parseInt(data.delivery_mumbai ?? '150'),
          maharashtra: parseInt(data.delivery_maharashtra ?? '200'),
          india: parseInt(data.delivery_india ?? '250'),
        })
      })

    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    document.body.appendChild(script)
  }, [])

  const subtotal = items.reduce((sum, i) => sum + i.product.price_inr * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const deliveryCharge = form.city && form.state
    ? calculateDelivery(form.city, form.state, itemCount, deliveryRates)
    : 0
  const total = subtotal + deliveryCharge

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  const validateStep1 = () => {
    if (!form.name || !form.email || !form.phone) { toast.error('Fill all contact fields'); return false }
    if (!form.address || !form.city || !form.state || !form.pincode) { toast.error('Fill all address fields'); return false }
    if (!/^\d{6}$/.test(form.pincode)) { toast.error('Enter valid 6-digit pincode'); return false }
    return true
  }

  const handlePlaceOrder = async () => {
    if (!validateStep1()) return
    setLoading(true)

    try {
      if (form.paymentMethod === 'razorpay') {
        // Create Razorpay order
        const res = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total }),
        })
        const { orderId } = await res.json()

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: total * 100,
          currency: 'INR',
          name: 'AMANI',
          description: 'Fashion Order',
          order_id: orderId,
          handler: async (response: any) => {
            // Verify payment
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            })
            const { verified } = await verifyRes.json()

            if (!verified) { toast.error('Payment verification failed'); setLoading(false); return }

            // Create order
            await createOrder('razorpay', orderId, response.razorpay_payment_id)
          },
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: '#B8952A' },
          modal: { ondismiss: () => setLoading(false) },
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        // COD
        await createOrder('cod', '', '')
      }
    } catch (err) {
      toast.error('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  const createOrder = async (method: string, rzpOrderId: string, rzpPaymentId: string) => {
    const orderItems = items.map(i => ({
      product_id: i.product_id,
      name: i.product.name,
      size: i.size,
      quantity: i.quantity,
      price_inr: i.product.price_inr,
    }))

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: orderItems,
        subtotal_inr: subtotal,
        delivery_charge_inr: deliveryCharge,
        total_inr: total,
        payment_method: method,
        razorpay_order_id: rzpOrderId,
        razorpay_payment_id: rzpPaymentId,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        shipping_address: { address: form.address, city: form.city, state: form.state, pincode: form.pincode },
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      }),
    })

    const { order, error } = await res.json()
    if (error) { toast.error(error); setLoading(false); return }

    await clearCart()
    router.push(`/order-confirmation/${order.id}`)
  }

  if (!items.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-[13px] tracking-[2px] uppercase" style={{ color: '#888' }}>Your cart is empty</p>
        <a href="/products" className="px-8 py-3 text-white text-[10px] tracking-[3px] uppercase" style={{ background: '#1a1a1a' }}>Shop Now</a>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 grid md:grid-cols-[1fr_380px] gap-16">
      {/* LEFT: Form */}
      <div>
        <h1 className="font-cormorant text-[36px] font-light mb-8" style={{ color: '#1a1a1a' }}>Checkout</h1>

        {/* Contact */}
        <div className="mb-8">
          <p className="text-[10px] tracking-[3px] uppercase mb-4" style={{ color: '#B8952A' }}>01 — Contact</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Full Name', col: 2 },
              { key: 'email', label: 'Email Address', type: 'email' },
              { key: 'phone', label: 'Phone Number', type: 'tel' },
            ].map(f => (
              <div key={f.key} className={f.col === 2 ? 'md:col-span-2' : ''}>
                <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>{f.label}</label>
                <input
                  type={f.type ?? 'text'}
                  value={(form as any)[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  className="w-full px-4 py-3 text-[13px] border outline-none transition-colors"
                  style={{ borderColor: '#e8e0d0', fontFamily: 'var(--font-dm-sans)' }}
                  onFocus={e => (e.target.style.borderColor = '#B8952A')}
                  onBlur={e => (e.target.style.borderColor = '#e8e0d0')}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="mb-8">
          <p className="text-[10px] tracking-[3px] uppercase mb-4" style={{ color: '#B8952A' }}>02 — Shipping Address</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Full Address</label>
              <textarea
                value={form.address}
                onChange={e => set('address', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 text-[13px] border outline-none transition-colors resize-none"
                style={{ borderColor: '#e8e0d0', fontFamily: 'var(--font-dm-sans)' }}
                onFocus={e => (e.target.style.borderColor = '#B8952A')}
                onBlur={e => (e.target.style.borderColor = '#e8e0d0')}
              />
            </div>
            <div>
              <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>City</label>
              <input
                type="text"
                value={form.city}
                onChange={e => set('city', e.target.value)}
                className="w-full px-4 py-3 text-[13px] border outline-none"
                style={{ borderColor: '#e8e0d0', fontFamily: 'var(--font-dm-sans)' }}
                onFocus={e => (e.target.style.borderColor = '#B8952A')}
                onBlur={e => (e.target.style.borderColor = '#e8e0d0')}
              />
            </div>
            <div>
              <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>State</label>
              <select
                value={form.state}
                onChange={e => set('state', e.target.value)}
                className="w-full px-4 py-3 text-[13px] border outline-none"
                style={{ borderColor: '#e8e0d0', fontFamily: 'var(--font-dm-sans)' }}
              >
                {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Pincode</label>
              <input
                type="text"
                value={form.pincode}
                onChange={e => set('pincode', e.target.value)}
                maxLength={6}
                className="w-full px-4 py-3 text-[13px] border outline-none"
                style={{ borderColor: '#e8e0d0', fontFamily: 'var(--font-dm-sans)' }}
                onFocus={e => (e.target.style.borderColor = '#B8952A')}
                onBlur={e => (e.target.style.borderColor = '#e8e0d0')}
              />
            </div>
          </div>

          {/* Delivery charge preview */}
          {form.city && form.state && (
            <div className="mt-4 p-3 text-[12px]" style={{ background: '#FDF6E3', border: '1px solid #e8e0d0', color: '#888' }}>
              Delivery charge for {form.city}, {form.state}: <strong style={{ color: '#B8952A' }}>₹{deliveryCharge}</strong>
            </div>
          )}
        </div>

        {/* Payment */}
        <div className="mb-8">
          <p className="text-[10px] tracking-[3px] uppercase mb-4" style={{ color: '#B8952A' }}>03 — Payment</p>
          <div className="flex flex-col gap-3">
            <label
              className="flex items-center gap-4 p-4 border cursor-pointer transition-all"
              style={{ borderColor: form.paymentMethod === 'razorpay' ? '#1a1a1a' : '#e8e0d0' }}
            >
              <input
                type="radio"
                name="payment"
                value="razorpay"
                checked={form.paymentMethod === 'razorpay'}
                onChange={() => set('paymentMethod', 'razorpay')}
                style={{ accentColor: '#B8952A' }}
              />
              <div>
                <p className="text-[13px] font-medium">Pay Online</p>
                <p className="text-[11px]" style={{ color: '#888' }}>Credit/Debit card, UPI, Net Banking via Razorpay</p>
              </div>
            </label>

            {codEnabled && (
              <label
                className="flex items-center gap-4 p-4 border cursor-pointer transition-all"
                style={{ borderColor: form.paymentMethod === 'cod' ? '#1a1a1a' : '#e8e0d0' }}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={form.paymentMethod === 'cod'}
                  onChange={() => set('paymentMethod', 'cod')}
                  style={{ accentColor: '#B8952A' }}
                />
                <div>
                  <p className="text-[13px] font-medium">Cash on Delivery</p>
                  <p className="text-[11px]" style={{ color: '#888' }}>Pay when your order arrives</p>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Place Order */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full py-4 text-white text-[11px] tracking-[3px] uppercase font-medium transition-all"
          style={{ background: loading ? '#888' : '#1a1a1a' }}
          onMouseEnter={e => { if (!loading) (e.currentTarget.style.background = '#B8952A') }}
          onMouseLeave={e => { if (!loading) (e.currentTarget.style.background = '#1a1a1a') }}
        >
          {loading ? 'Processing...' : form.paymentMethod === 'cod' ? 'Place Order' : `Pay ₹${total.toLocaleString('en-IN')}`}
        </button>
      </div>

      {/* RIGHT: Summary */}
      <OrderSummary
        items={items}
        subtotal={subtotal}
        deliveryCharge={deliveryCharge}
        total={total}
      />
    </div>
  )
}