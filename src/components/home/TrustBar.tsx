import { Truck, RefreshCw, Shield, MessageCircle } from 'lucide-react'

const items = [
  { icon: Truck, label: 'Dispatched within 3-5 days' },
  { icon: RefreshCw, label: 'Latest Designs' },
  { icon: Shield, label: 'Secure Payments' },
  { icon: MessageCircle, label: 'WhatsApp Support' },
]

export default function TrustBar() {
  return (
    <div className="border-y" style={{ borderColor: '#e8e0d0', background: '#fff' }}>
      <div className="max-w-[1440px] mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center justify-center gap-2">
            <Icon size={15} strokeWidth={1.5} style={{ color: '#B8952A', flexShrink: 0 }} />
            <span className="text-[11px] tracking-[1.5px] uppercase" style={{ color: '#2c2c2c' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
