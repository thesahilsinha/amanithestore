import Link from 'next/link'
import { Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          {/* <Link href="/" className="font-cormorant text-[28px] tracking-[10px] uppercase text-white block mb-4"> */}
            {/* AM<span className="text-gold">A</span>NI */}
          {/* </Link> */}
          <Link href="/" className="block mb-4">
  <img src="/logo.png" alt="AMANI" className="h-20 w-auto" />
</Link>
          <p className="text-[13px] text-[#aaa] leading-relaxed">
            Luxury women's fashion crafted for the bold, the elegant, and the unapologetically stylish.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">
              <Instagram size={18} strokeWidth={1.5} />
            </a>
          </div>
        </div>
        {[
          {
            title: 'Shop',
            links: [
              { label: 'New Arrivals', href: '/products?filter=new' },
              { label: 'Best Sellers', href: '/products?filter=bestseller' },
              { label: 'All Products', href: '/products' },
              { label: 'Blog', href: '/blog' },
            ]
          },
          {
            title: 'Help',
            links: [
              { label: 'Size Guide', href: 'https://ik.imagekit.io/amaniecomm/WhatsApp%20Image%202026-04-20%20at%2013.05.42.jpeg' },
              { label: 'Shipping & Returns', href: '/returns-policy' },
              { label: 'Track Order', href: '/track-order' },
              { label: 'FAQs', href: '/' },
              { label: 'Contact Us', href: '/contact' },
            ]
          },
          {
            title: 'Connect',
            links: [
              { label: 'Instagram', href: 'https://instagram.com' },
              { label: 'WhatsApp', href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}` },
            ]
          }
        ].map(col => (
          <div key={col.title}>
            <h5 className="text-[10px] tracking-[3px] uppercase text-gold mb-5 font-medium">{col.title}</h5>
            <ul className="flex flex-col gap-3">
              {col.links.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-[#aaa] hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[#333] px-12 py-5 flex flex-col md:flex-row justify-between items-center gap-2 text-[12px] text-[#555]">
        <p>© 2025 AMANI. All rights reserved.</p>
        <p className="text-gold tracking-[2px] uppercase text-[11px]">Crafted with ♡ for the modern woman</p>
      </div>
    </footer>
  )
}
