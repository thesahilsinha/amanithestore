export default function Ticker() {
  const items = [
    // 'Free shipping on orders above ₹999',
    'New arrivals every month',
    'Handcrafted with love in India',
    // 'L',
    'WhatsApp us for international orders',
  ]

  const content = [...items, ...items]

  return (
    <div className="bg-[#1a1a1a] text-white text-[11px] tracking-[3px] uppercase py-[9px] overflow-hidden whitespace-nowrap">
      <div className="ticker-animate inline-block">
        {content.map((item, i) => (
          <span key={i} className="mx-12">
            <span className="text-gold-light mr-12">✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}