export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>
      <div className="py-12 text-center border-b" style={{ background: '#FAFAF7', borderColor: '#e8e0d0' }}>
        <p className="text-[10px] tracking-[5px] uppercase mb-2" style={{ color: '#B8952A' }}>Customer Care</p>
        <h1 className="font-cormorant text-[48px] font-light" style={{ color: '#1a1a1a' }}>Returns & Exchanges</h1>
      </div>

      <div className="max-w-[780px] mx-auto px-6 py-16">

        {/* Intro */}
        <div className="mb-10 p-6" style={{ background: '#FDF6E3', border: '1px solid #e8e0d0' }}>
          <p className="text-[13px] leading-relaxed" style={{ color: '#555' }}>
            At AMANI, each piece is crafted with care and inspected before dispatch. Please read our policy carefully before placing your order.
          </p>
        </div>

        {[
          {
            title: 'No Refunds',
            content: `We do not offer refunds under any circumstances. All sales are final.

We encourage you to carefully review product descriptions, sizing information, and images before placing your order. If you have any questions prior to purchasing, please reach out to us on WhatsApp.`,
          },
          {
            title: 'Exchange Policy',
            content: `We offer a ONE-TIME size exchange only, subject to the following conditions:

- Exchange request must be raised within 48 hours of delivery
- Item must be unused, unworn, unwashed, and in original packaging with all tags intact
- Items that show signs of wear, damage, or alteration will not be accepted
- Exchange is subject to size availability. If the requested size is unavailable, store credit will be issued valid for 3 months
- Only one exchange per order is permitted`,
          },
          {
            title: 'How to Raise an Exchange Request',
            content: `1. WhatsApp us within 48 hours of receiving your order
2. Share your order number, the item name, and reason for exchange
3. We will confirm eligibility and share the return address
4. Ship the item back at your own cost via a trackable courier
5. Once received and inspected, we will dispatch the new size within 5–7 working days`,
          },
          {
            title: 'Non-Exchangeable Items',
            content: `The following items are strictly non-exchangeable and non-returnable:

- Sale or discounted items
- Items purchased during promotional events
- Customised or made-to-order pieces
- Innerwear, accessories, and jewellery
- Items returned without prior approval`,
          },
          {
            title: 'Damaged or Incorrect Items',
            content: `In the rare case you receive a damaged or incorrect item, please contact us on WhatsApp within 24 hours of delivery with unboxing video evidence.

We will arrange a replacement or store credit at our discretion. Claims raised after 24 hours will not be entertained.`,
          },
          {
            title: 'Return Shipping',
            content: `Customers are responsible for return shipping costs. We recommend using a trackable shipping service. AMANI is not responsible for items lost in transit during return.`,
          },
          {
            title: 'Store Credit',
            content: `Store credit is valid for 3 months from date of issue. It cannot be redeemed for cash and is non-transferable.`,
          },
        ].map(({ title, content }) => (
          <div key={title} className="mb-8 pb-8 border-b" style={{ borderColor: '#e8e0d0' }}>
            <h2 className="font-cormorant text-[22px] font-light mb-3" style={{ color: '#1a1a1a' }}>{title}</h2>
            <p className="text-[13px] leading-[1.9] whitespace-pre-line" style={{ color: '#555' }}>{content}</p>
          </div>
        ))}

        {/* Contact */}
        <div className="p-6 text-center mt-4" style={{ background: '#FAFAF7', border: '1px solid #e8e0d0' }}>
          
          <p className="text-[11px] tracking-[2px] uppercase mb-1" style={{ color: '#B8952A' }}>Need Help?</p>
          
          <p className="text-[13px] mb-4" style={{ color: '#888' }}>
            For exchange requests or queries, reach us on WhatsApp within 48 hours of delivery.
          </p>
          
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block px-10 py-3 text-white text-[11px] tracking-[3px] uppercase"
            style={{ background: '#25D366' }}
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  )
}
