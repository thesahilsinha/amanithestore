'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { MessageCircle, Mail, MapPin } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) { toast.error('Fill all required fields'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success('Message sent! We\'ll reply within 24 hours.')
    setForm({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '13px 16px', fontSize: '13px',
    border: '1px solid #e8e0d0', outline: 'none',
    fontFamily: 'var(--font-dm-sans)', background: '#fff',
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF7' }}>
      <div className="py-12 text-center border-b" style={{ background: '#fff', borderColor: '#e8e0d0' }}>
        <p className="text-[10px] tracking-[5px] uppercase mb-2" style={{ color: '#B8952A' }}>Get in Touch</p>
        <h1 className="font-cormorant text-[48px] font-light" style={{ color: '#1a1a1a' }}>Contact Us</h1>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 md:px-12 py-16 grid md:grid-cols-[1fr_400px] gap-16">
        {/* Form */}
        <div>
          <div className="flex flex-col gap-4">
            {[
              { key: 'name', label: 'Your Name *' },
              { key: 'email', label: 'Email Address *', type: 'email' },
              { key: 'subject', label: 'Subject' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>{f.label}</label>
                <input
                  type={f.type ?? 'text'}
                  value={(form as any)[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#B8952A')}
                  onBlur={e => (e.target.style.borderColor = '#e8e0d0')}
                />
              </div>
            ))}
            <div>
              <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>Message *</label>
              <textarea
                value={form.message}
                onChange={e => set('message', e.target.value)}
                rows={5}
                style={{ ...inputStyle, resize: 'none' }}
                onFocus={e => (e.target.style.borderColor = '#B8952A')}
                onBlur={e => (e.target.style.borderColor = '#e8e0d0')}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="py-4 text-white text-[11px] tracking-[3px] uppercase transition-all"
              style={{ background: loading ? '#888' : '#1a1a1a' }}
              onMouseEnter={e => { if (!loading) (e.currentTarget.style.background = '#B8952A') }}
              onMouseLeave={e => { if (!loading) (e.currentTarget.style.background = '#1a1a1a') }}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          {[
            {
              icon: MessageCircle,
              title: 'WhatsApp',
              content: 'Chat with us directly for fastest response',
              action: { label: 'Open WhatsApp', href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}` }
            },
            {
              icon: Mail,
              title: 'Email',
              content: 'hello@amani.in',
              action: { label: 'Send Email', href: 'mailto:hello@amani.in' }
            },
            {
              icon: MapPin,
              title: 'Location',
              content: 'Mumbai, Maharashtra, India',
              action: null
            },
          ].map(({ icon: Icon, title, content, action }) => (
            <div key={title} className="p-6" style={{ background: '#fff', border: '1px solid #e8e0d0' }}>
              <Icon size={20} strokeWidth={1.5} style={{ color: '#B8952A', marginBottom: 12 }} />
              <p className="text-[11px] tracking-[2px] uppercase mb-1" style={{ color: '#888' }}>{title}</p>
              <p className="text-[13px] mb-3" style={{ color: '#2c2c2c' }}>{content}</p>
              {action && (
                <a href={action.href} target="_blank" rel="noreferrer" className="text-[11px] tracking-[1px] underline" style={{ color: '#B8952A' }}>
                  {action.label}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
