'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'

interface Props {
  primaryImage: string
  videoUrl?: string
  secondaryImages: string[]
  productName: string
}

const SIZE_CHART_URL = process.env.NEXT_PUBLIC_SIZE_CHART_URL || '/size-chart.png'

export default function ProductGallery({ primaryImage, videoUrl, secondaryImages, productName }: Props) {
  const gallery = [
    { type: 'image' as const, url: primaryImage, label: '' },
    ...(videoUrl ? [{ type: 'video' as const, url: videoUrl, label: '' }] : []),
    ...(secondaryImages ?? []).filter(Boolean).map(url => ({ type: 'image' as const, url, label: '' })),
    { type: 'image' as const, url: SIZE_CHART_URL, label: 'Size Chart' },
  ]

  const [current, setCurrent] = useState(0)

  // Listen for size chart event from ProductInfo
  useEffect(() => {
    const handler = () => setCurrent(gallery.length - 1)
    document.addEventListener('show-size-chart', handler)
    return () => document.removeEventListener('show-size-chart', handler)
  }, [gallery.length])

  const prev = () => setCurrent(i => (i - 1 + gallery.length) % gallery.length)
  const next = () => setCurrent(i => (i + 1) % gallery.length)

  const active = gallery[current]

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch')) {
      const id = new URL(url).searchParams.get('v')
      return `https://www.youtube.com/embed/${id}?autoplay=1`
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0]
      return `https://www.youtube.com/embed/${id}?autoplay=1`
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1]
      return `https://player.vimeo.com/video/${id}?autoplay=1`
    }
    return url
  }

  return (
    <div className="sticky top-[116px] grid gap-3" style={{ gridTemplateColumns: '72px 1fr', height: 'calc(180vh - 140px)', alignSelf: 'start' }}>
      {/* Thumbnails */}
      <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)', scrollbarWidth: 'none' }}>
        {gallery.map((item, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="flex-shrink-0 overflow-hidden relative"
            style={{
              width: 64, height: 80,
              border: `2px solid ${i === current ? '#B8952A' : 'transparent'}`,
              background: '#FAFAF7',
              transition: 'border-color 0.25s'
            }}
          >
            {item.type === 'video' ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Play size={18} style={{ color: '#888' }} />
              </div>
            ) : item.label === 'Size Chart' ? (
              <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: '#FDF6E3' }}>
                <span className="text-[8px] tracking-[1px] uppercase text-center leading-tight" style={{ color: '#B8952A' }}>Size{'\n'}Chart</span>
              </div>
            ) : (
              <img src={item.url} alt="" className="w-full h-full object-cover object-top" />
            )}
          </button>
        ))}
      </div>

      {/* Main media */}
      <div className="relative overflow-hidden" style={{ background: '#FAFAF7', height: 'calc(150vh - 160px)' }}>
        {active.type === 'video' ? (
          <iframe
            src={getVideoEmbedUrl(active.url)}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            style={{ border: 'none' }}
          />
        ) : (
          <>
            <img
              src={active.url}
              alt={active.label || productName}
              className="w-full h-full object-cover object-top"
              style={{ objectFit: active.label === 'Size Chart' ? 'contain' : 'cover', padding: active.label === 'Size Chart' ? '16px' : '0' }}
            />
            {active.label === 'Size Chart' && (
              <div className="absolute top-3 left-3 text-[9px] tracking-[2px] uppercase px-3 py-1" style={{ background: '#B8952A', color: '#fff' }}>
                Size Chart
              </div>
            )}
          </>
        )}

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center transition-all"
          style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #e8e0d0' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#B8952A')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.9)')}
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center transition-all"
          style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #e8e0d0' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#B8952A')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.9)')}
        >
          <ChevronRight size={16} />
        </button>

        {/* Counter */}
        <div className="absolute bottom-4 right-4 text-[10px] tracking-[1.5px] uppercase px-3 py-[6px]" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #e8e0d0', color: '#888' }}>
          {current + 1} / {gallery.length}
        </div>
      </div>
    </div>
  )
}
