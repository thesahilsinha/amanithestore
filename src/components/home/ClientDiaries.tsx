'use client'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Diary {
  id: string
  image_url: string
  caption?: string
}

export default function ClientDiaries({ diaries }: { diaries: Diary[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (!diaries?.length) return null

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' })
  }

  return (
    <section className="py-16" style={{ background: '#FAFAF7' }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[10px] tracking-[5px] uppercase block mb-2" style={{ color: '#B8952A' }}>Real Women, Real Style</span>
            <h2 className="font-cormorant text-[clamp(32px,4vw,52px)] font-light" style={{ color: '#1a1a1a' }}>
              Styled by <em style={{ fontStyle: 'italic', color: '#B8952A' }}>You</em>
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 flex items-center justify-center border transition-all"
              style={{ borderColor: '#e8e0d0' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#B8952A')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e8e0d0')}
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 flex items-center justify-center border transition-all"
              style={{ borderColor: '#e8e0d0' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#B8952A')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e8e0d0')}
            >
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {diaries.map((d) => (
            <div
              key={d.id}
              className="flex-shrink-0 overflow-hidden relative group"
              style={{
                width: '280px',
                height: '380px',
                background: '#e8e0d0',
              }}
            >
              <img
                src={d.image_url}
                alt={d.caption ?? ''}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {d.caption && (
                <div
                  className="absolute bottom-0 left-0 right-0 px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}
                >
                  <p className="text-white text-[12px] tracking-[0.5px]">{d.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}