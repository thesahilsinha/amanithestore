'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Package, ShoppingBag, Tag, Image,
  Instagram, MessageSquare, BookOpen, DollarSign,
  Settings, Megaphone, Menu, X, ExternalLink,
  ChevronRight
} from 'lucide-react'

const nav = [
  { group: 'Overview', items: [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  ]},
  { group: 'Store', items: [
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Categories', href: '/admin/categories', icon: Tag },
  ]},
  { group: 'Content', items: [
    { label: 'Campaign Banners', href: '/admin/banners', icon: Megaphone },
    { label: 'Client Diaries', href: '/admin/diaries', icon: Image },
    { label: 'Instagram Posts', href: '/admin/instagram', icon: Instagram },
    { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
    { label: 'Blog', href: '/admin/blog', icon: BookOpen },
  ]},
  { group: 'Config', items: [
    { label: 'Currency', href: '/admin/currency', icon: DollarSign },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ]},
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const Sidebar = () => (
    <aside className="flex flex-col h-full" style={{ background: '#111', width: '240px' }}>
      {/* Logo */}
      <div className="px-5 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #222' }}>
        <div>
          <span className="font-cormorant text-[20px] tracking-[6px] uppercase text-white">
            AM<span style={{ color: '#B8952A' }}>A</span>NI
          </span>
          <p className="text-[9px] tracking-[3px] uppercase mt-0.5" style={{ color: '#444' }}>Admin Panel</p>
        </div>
        <button className="md:hidden text-gray-500" onClick={() => setMobileOpen(false)}>
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3" style={{ scrollbarWidth: 'none' }}>
        {nav.map(group => (
          <div key={group.group} className="mb-5">
            <p className="text-[9px] tracking-[3px] uppercase px-3 mb-2" style={{ color: '#444' }}>
              {group.group}
            </p>
            {group.items.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded text-[12px] mb-0.5 transition-all"
                  style={{
                    background: active ? 'rgba(184,149,42,0.12)' : 'transparent',
                    color: active ? '#B8952A' : '#777',
                    borderLeft: active ? '2px solid #B8952A' : '2px solid transparent',
                  }}
                >
                  <Icon size={14} strokeWidth={1.5} />
                  {label}
                  {active && <ChevronRight size={12} className="ml-auto" style={{ color: '#B8952A' }} />}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid #222' }}>
        <Link
          href="/"
          className="flex items-center gap-2 text-[11px] transition-colors"
          style={{ color: '#444' }}
        >
          <ExternalLink size={12} strokeWidth={1.5} />
          View Site
        </Link>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f5f5f5', fontFamily: 'var(--font-dm-sans)' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col flex-shrink-0" style={{ width: '240px' }}>
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="flex flex-col" style={{ width: '240px' }}>
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 flex-shrink-0" style={{ background: '#fff', borderBottom: '1px solid #e8e0d0', height: '56px' }}>
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setMobileOpen(true)}>
              <Menu size={20} style={{ color: '#555' }} />
            </button>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[12px]" style={{ color: '#888' }}>
              <span>Admin</span>
              {pathname !== '/admin' && (
                <>
                  <ChevronRight size={12} />
                  <span style={{ color: '#1a1a1a', textTransform: 'capitalize' }}>
                    {pathname.split('/').pop()?.replace(/-/g, ' ')}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] px-3 py-1 rounded-full" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
              ● Live
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}