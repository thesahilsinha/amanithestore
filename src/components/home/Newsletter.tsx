'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) { toast.error('Enter a valid email'); return }
    setLoading(true)
    // You can hook this to Resend or a DB table later
    await new Promise(r => setTimeout(r, 800))
    toast.success('You\'re on the list!')
    setEmail('')
    setLoading(false)
  }

  return (
    <section className="py-20 px-6 bg-[#1a1a1a]">
      <div className="max-w-2xl mx-auto text-center">
        <span className="text-[10px] tracking-[5px] uppercase text-gold-light block mb-3">Stay in the Loop</span>
        <h2 className="font-cormorant text-[clamp(36px,5vw,64px)] font-light text-white leading-[1.05] mb-4">
          Join the <em className="text-gold-light italic">Circle</em>
        </h2>
        <p className="text-[14px] text-[#aaa] mb-8 leading-relaxed">
          Be first for new arrivals, exclusive drops, and private sale access.<br />No spam — only the good stuff.
        </p>
        <div className="flex border border-[#444] focus-within:border-gold transition-colors max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 px-5 py-4 bg-transparent text-white text-[13px] outline-none placeholder:text-[#555]"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 bg-gold text-dark text-[10px] tracking-[2.5px] uppercase font-medium hover:bg-gold-light transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            {loading ? '...' : 'Subscribe'}
          </button>
        </div>
      </div>
    </section>
  )
}
