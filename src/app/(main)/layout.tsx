import Navbar from '@/components/layout/Navbar'
import Ticker from '@/components/layout/Ticker'
import Footer from '@/components/layout/Footer'
import ChatBot from '@/components/chat/ChatBot'
import { headers } from 'next/headers'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-invoke-path') || ''
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) return <>{children}</>

  return (
    <>
      <Ticker />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ChatBot />
    </>
  )
}