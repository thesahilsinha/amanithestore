'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignOutPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.signOut().then(() => {
      router.push('/')
      router.refresh()
    })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAFAF7' }}>
      <p className="text-[13px] tracking-[2px] uppercase" style={{ color: '#888' }}>Signing out...</p>
    </div>
  )
}
