'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setName(data.user?.user_metadata?.full_name ?? '')
      setEmail(data.user?.email ?? '')
    })
  }, [])

  const handleUpdate = async () => {
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } })
    if (error) { toast.error(error.message); setLoading(false); return }
    toast.success('Profile updated!')
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const inputStyle = {
    width: '100%', padding: '14px 16px', fontSize: '13px',
    border: '1px solid #e8e0d0', outline: 'none',
    fontFamily: 'var(--font-dm-sans)', background: '#fff',
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF7' }}>
      <div className="py-10 text-center border-b" style={{ background: '#fff', borderColor: '#e8e0d0' }}>
        <p className="text-[10px] tracking-[5px] uppercase mb-2" style={{ color: '#B8952A' }}>My Account</p>
        <h1 className="font-cormorant text-[40px] font-light" style={{ color: '#1a1a1a' }}>My Profile</h1>
      </div>

      <div className="max-w-[520px] mx-auto px-6 py-12">
        <div className="p-8" style={{ background: '#fff', border: '1px solid #e8e0d0' }}>
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#B8952A')}
                onBlur={e => (e.target.style.borderColor = '#e8e0d0')}
              />
            </div>
            <div>
              <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Email Address</label>
              <input type="email" value={email} disabled style={{ ...inputStyle, background: '#f9f9f9', color: '#888' }} />
              <p className="text-[10px] mt-1" style={{ color: '#aaa' }}>Email cannot be changed</p>
            </div>

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full py-4 text-white text-[11px] tracking-[3px] uppercase transition-all"
              style={{ background: loading ? '#888' : '#1a1a1a' }}
              onMouseEnter={e => { if (!loading) (e.currentTarget.style.background = '#B8952A') }}
              onMouseLeave={e => { if (!loading) (e.currentTarget.style.background = '#1a1a1a') }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              onClick={handleSignOut}
              className="w-full py-3 text-[11px] tracking-[3px] uppercase border transition-all"
              style={{ borderColor: '#e8e0d0', color: '#888' }}
              onMouseEnter={e => { (e.currentTarget.style.borderColor = '#c0392b'); (e.currentTarget.style.color = '#c0392b') }}
              onMouseLeave={e => { (e.currentTarget.style.borderColor = '#e8e0d0'); (e.currentTarget.style.color = '#888') }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}