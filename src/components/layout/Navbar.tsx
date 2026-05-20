'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Search, User, Menu, X, ChevronDown } from 'lucide-react'
import { useCurrency } from '@/context/CurrencyContext'
import { useCart } from '@/context/CartContext'
import { CURRENCY_CONFIG } from '@/lib/currency'
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const { currency, setCurrency, rates } = useCurrency()
  const { count } = useCart()
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<any>(null)
  const [scrolled, setScrolled] = useState(false)
  const currencyRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const activeCurrencies = Object.keys(CURRENCY_CONFIG).filter(c => rates[c] || c === 'INR')
  const currentConfig = CURRENCY_CONFIG[currency]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-cream2 border-b border-border px-12 py-2 hidden md:flex justify-between items-center text-[11px] tracking-[1px] text-muted">
        <div className="flex gap-6">
          <Link href="/track-order" className="hover:text-gold transition-colors">Track Order</Link>
          <Link href="/size-guide" className="hover:text-gold transition-colors">Size Guide</Link>
          <Link href="/contact" className="hover:text-gold transition-colors">Contact</Link>
        </div>
        <div className="flex gap-6">
          <span>Free Shipping Above ₹999</span>
          <span>|</span>
          <span>Easy Returns</span>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className={`bg-white border-b border-border px-6 md:px-12 flex items-center justify-between h-[72px] sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>

        {/* LEFT: HAMBURGER (mobile) + NAV LINKS (desktop) */}
        <div className="flex items-center gap-8">
          <button className="md:hidden" onClick={() => setMobileOpen(true)}>
            <Menu size={22} strokeWidth={1.5} />
          </button>
          <ul className="hidden md:flex h-[72px] list-none gap-0">
            {[
              { label: 'New Arrivals', href: '/products?filter=new' },
              { label: 'Shop', href: '/products' },
              { label: 'Best Sellers', href: '/products?filter=bestseller' },
              { label: 'Blog', href: '/blog' },
            ].map(link => (
              <li key={link.href} className="flex items-center h-full">
                <Link
                  href={link.href}
                  className="px-4 text-[12px] tracking-[1.5px] uppercase font-medium text-[#2c2c2c] h-full flex items-center border-b-2 border-transparent hover:text-gold hover:border-gold transition-all"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CENTER: LOGO */}
        {/* <Link href="/" className="font-cormorant text-[28px] md:text-[30px] tracking-[10px] text-dark uppercase font-normal absolute left-1/2 -translate-x-1/2"> */}
        {/* AM<span className="text-gold">A</span>NI */}
        {/* </Link> */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <img src="/logo.png" alt="AMANI" className="h-28 w-auto" />
        </Link>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button onClick={() => setSearchOpen(!searchOpen)} className="hover:text-gold transition-colors">
            <Search size={20} strokeWidth={1.5} />
          </button>

          {/* Currency Switcher */}
          <div className="relative" ref={currencyRef}>
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="hidden md:flex items-center gap-1 text-[11px] tracking-[1.5px] uppercase hover:text-gold transition-colors"
            >
              <span>{currentConfig?.flag}</span>
              <span>{currency}</span>
              <ChevronDown size={12} className={`transition-transform ${currencyOpen ? 'rotate-180' : ''}`} />
            </button>
            {currencyOpen && (
              <div className="absolute right-0 top-8 bg-white border border-border shadow-lg z-50 min-w-[160px]">
                {activeCurrencies.map(code => {
                  const cfg = CURRENCY_CONFIG[code]
                  return (
                    <button
                      key={code}
                      onClick={() => { setCurrency(code); setCurrencyOpen(false) }}
                      className={`w-full px-4 py-3 text-left text-[11px] tracking-[1px] uppercase flex items-center gap-2 hover:bg-gold-pale hover:text-gold transition-colors ${currency === code ? 'text-gold bg-gold-pale' : ''}`}
                    >
                      <span>{cfg.flag}</span>
                      <span>{code}</span>
                      <span className="text-muted ml-auto">{cfg.symbol}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* User */}
          <Link href={user ? '/account' : '/login'} className="hover:text-gold transition-colors">
            <User size={20} strokeWidth={1.5} />
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative hover:text-gold transition-colors">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-white text-[9px] w-[15px] h-[15px] rounded-full flex items-center justify-center font-semibold">
                {count}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* SEARCH BAR */}
      {searchOpen && (
        <div className="sticky top-[72px] z-40 bg-white border-b border-border px-6 py-3 shadow-sm">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex border border-border focus-within:border-gold transition-colors">
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search dresses, styles, occasions..."
              className="flex-1 px-4 py-3 text-[13px] outline-none font-dm-sans"
            />
            <button type="submit" className="px-4 border-l border-border text-muted hover:text-gold transition-colors">
              <Search size={18} strokeWidth={1.5} />
            </button>
          </form>
        </div>
      )}

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-border">
            <span className="font-cormorant text-2xl tracking-[8px] uppercase">AM<span className="text-gold">A</span>NI</span>
            <button onClick={() => setMobileOpen(false)}><X size={22} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
            {[
              { label: 'New Arrivals', href: '/products?filter=new' },
              { label: 'Shop All', href: '/products' },
              { label: 'Best Sellers', href: '/products?filter=bestseller' },
              { label: 'Blog', href: '/blog' },
              { label: 'Track Order', href: '/track-order' },
              { label: 'Contact', href: '/contact' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-[14px] tracking-[2px] uppercase font-medium border-b border-border pb-4 hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {/* Mobile currency picker */}
            <div className="pt-4">
              <p className="text-[10px] tracking-[3px] uppercase text-muted mb-3">Currency</p>
              <div className="flex flex-wrap gap-2">
                {activeCurrencies.map(code => (
                  <button
                    key={code}
                    onClick={() => { setCurrency(code); setMobileOpen(false) }}
                    className={`px-3 py-2 text-[11px] tracking-[1px] uppercase border transition-colors ${currency === code ? 'border-gold text-gold bg-gold-pale' : 'border-border text-muted'}`}
                  >
                    {CURRENCY_CONFIG[code].flag} {code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
