'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Sparkles, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  'Show me bestsellers',
  'Something for a wedding?',
  'Under ₹5000',
  'What\'s new?',
]

function formatMessage(text: string) {
  // Convert markdown links [text](/url) to JSX
  const parts = text.split(/(\[.*?\]\(.*?\))/g)
  return parts.map((part, i) => {
    const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/)
    if (linkMatch) {
      return (
        <Link
          key={i}
          href={linkMatch[2]}
          className="underline font-medium"
          style={{ color: '#B8952A' }}
        >
          {linkMatch[1]}
        </Link>
      )
    }
    // Handle bold **text**
    const boldParts = part.split(/(\*\*.*?\*\*)/g)
    return (
      <span key={i}>
        {boldParts.map((bp, j) => {
          if (bp.startsWith('**') && bp.endsWith('**')) {
            return <strong key={j}>{bp.slice(2, -2)}</strong>
          }
          return <span key={j}>{bp}</span>
        })}
      </span>
    )
  })
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm AMANI's style assistant ✨ Tell me what you're looking for — an occasion, a vibe, a budget — and I'll help you find the perfect piece!"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  const send = async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || loading) return

    const userMessage: Message = { role: 'user', content: msg }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'assistant', content: data.message }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Sorry, something went wrong. Please try again!' }])
    }
    setLoading(false)
  }

  return (
    <>
      {/* Chat window */}
      <div
        className="fixed z-50 flex flex-col overflow-hidden transition-all duration-300"
        style={{
          bottom: '90px',
          right: '24px',
          width: open ? '360px' : '0px',
          height: open ? '520px' : '0px',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          background: '#fff',
          border: '1px solid #e8e0d0',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          borderRadius: '16px',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ background: '#1a1a1a', borderRadius: '16px 16px 0 0' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#B8952A' }}>
              <Sparkles size={14} color="#fff" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-white">AMANI Style Assistant</p>
              <p className="text-[10px]" style={{ color: '#B8952A' }}>● Online</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ scrollbarWidth: 'none' }}>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mr-2 mt-0.5" style={{ background: '#B8952A' }}>
                  <Sparkles size={10} color="#fff" />
                </div>
              )}
              <div
                className="max-w-[80%] px-3 py-2 text-[13px] leading-relaxed"
                style={{
                  background: m.role === 'user' ? '#1a1a1a' : '#FAFAF7',
                  color: m.role === 'user' ? '#fff' : '#2c2c2c',
                  borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  border: m.role === 'assistant' ? '1px solid #f0ebe3' : 'none',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {formatMessage(m.content)}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mr-2" style={{ background: '#B8952A' }}>
                <Sparkles size={10} color="#fff" />
              </div>
              <div className="px-4 py-3" style={{ background: '#FAFAF7', border: '1px solid #f0ebe3', borderRadius: '16px 16px 16px 4px' }}>
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: '#B8952A',
                        animation: 'bounce 1.2s infinite',
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2 flex gap-2 flex-wrap flex-shrink-0">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-[11px] px-3 py-1.5 rounded-full border transition-all"
                style={{ borderColor: '#e8e0d0', color: '#888' }}
                onMouseEnter={e => { (e.currentTarget.style.borderColor = '#B8952A'); (e.currentTarget.style.color = '#B8952A') }}
                onMouseLeave={e => { (e.currentTarget.style.borderColor = '#e8e0d0'); (e.currentTarget.style.color = '#888') }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-3 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-full" style={{ background: '#f5f5f5', border: '1px solid #e8e0d0' }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about styles, occasions..."
              className="flex-1 text-[13px] bg-transparent outline-none"
              style={{ color: '#2c2c2c', fontFamily: 'var(--font-dm-sans)' }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all flex-shrink-0"
              style={{ background: input.trim() ? '#B8952A' : '#ddd' }}
            >
              <Send size={13} color="#fff" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* FAB button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all"
        style={{
          bottom: '24px',
          right: '24px',
          background: open ? '#1a1a1a' : '#B8952A',
          transform: open ? 'rotate(0deg)' : 'rotate(0deg)',
        }}
      >
        {open
          ? <X size={20} color="#fff" />
          : <MessageCircle size={22} color="#fff" strokeWidth={1.5} />
        }
        {!open && messages.length > 1 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style={{ background: '#c0392b' }}>
            {messages.filter(m => m.role === 'assistant').length}
          </span>
        )}
      </button>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  )
}
