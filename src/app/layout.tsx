import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { CurrencyProvider } from '@/context/CurrencyContext'
import { CartProvider } from '@/context/CartContext'
import { Toaster } from 'react-hot-toast'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'AMANI — Luxury Women\'s Fashion',
  description: 'Luxury women\'s fashion crafted for the bold, the elegant, and the unapologetically stylish.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="font-dm-sans bg-white text-[#2c2c2c] overflow-x-hidden">
        <CurrencyProvider>
          <CartProvider>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                style: { fontFamily: 'var(--font-dm-sans)', fontSize: '13px', letterSpacing: '0.5px' },
              }}
            />
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  )
}
