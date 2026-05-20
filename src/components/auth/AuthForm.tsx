'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

interface Props { mode: 'login' | 'register' }

export default function AuthForm({ mode }: Props) {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') ?? '/account'
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const inputStyle = {
    width: '100%', padding: '14px 16px', fontSize: '13px',
    border: '1px solid #e8e0d0', outline: 'none',
    fontFamily: 'var(--font-dm-sans)', background: '#fff', color: '#2c2c2c',
  }

  const handleSubmit = async () => {
    if (!email || !password) { toast.error('Fill all fields'); return }
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { toast.error(error.message); setLoading(false); return }
      toast.success('Welcome back!')
      router.push(next)
      router.refresh()
    } else {
      if (!name) { toast.error('Enter your name'); setLoading(false); return }
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } }
      })
      if (error) { toast.error(error.message); setLoading(false); return }
      toast.success('Account created! Check your email to verify.')
      router.push('/login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#FAFAF7' }}>
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="font-cormorant text-[32px] tracking-[10px] uppercase" style={{ color: '#1a1a1a' }}>
            AM<span style={{ color: '#B8952A' }}>A</span>NI
          </Link>
        </div>

        {/* Card */}
        <div className="p-8" style={{ background: '#fff', border: '1px solid #e8e0d0' }}>
          <p className="text-[10px] tracking-[4px] uppercase mb-2 text-center" style={{ color: '#B8952A' }}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </p>
          <h1 className="font-cormorant text-[32px] font-light text-center mb-8" style={{ color: '#1a1a1a' }}>
            {mode === 'login' ? 'Sign In' : 'Join Amani'}
          </h1>

          <div className="flex flex-col gap-4">
            {mode === 'register' && (
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
            )}

            <div>
              <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#B8952A')}
                onBlur={e => (e.target.style.borderColor = '#e8e0d0')}
              />
            </div>

            <div>
              <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={{ ...inputStyle, paddingRight: '44px' }}
                  onFocus={e => (e.target.style.borderColor = '#B8952A')}
                  onBlur={e => (e.target.style.borderColor = '#e8e0d0')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#888' }}
                >
                  {showPass ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="text-right">
                <Link href="/forgot-password" className="text-[11px] tracking-[1px]" style={{ color: '#888' }}>
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 text-white text-[11px] tracking-[3px] uppercase font-medium mt-2 transition-all"
              style={{ background: loading ? '#888' : '#1a1a1a' }}
              onMouseEnter={e => { if (!loading) (e.currentTarget.style.background = '#B8952A') }}
              onMouseLeave={e => { if (!loading) (e.currentTarget.style.background = '#1a1a1a') }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          <p className="text-center text-[12px] mt-6" style={{ color: '#888' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <Link
              href={mode === 'login' ? '/register' : '/login'}
              className="underline transition-colors"
              style={{ color: '#B8952A' }}
            >
              {mode === 'login' ? 'Register' : 'Sign In'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
