'use client'
import Link from 'next/link'

interface Banner {
  id: string
  heading: string
  subheading?: string
  bg_image_url: string
  cta_text?: string
  cta_link?: string
}

export default function CampaignBanner({ banner }: { banner: Banner | null }) {
  if (!banner) return null

  const lines = banner.heading.split('\\n')

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'clamp(400px, 60vh, 700px)' }}>
      {/* Background */}
      <img
        src={banner.bg_image_url}
        alt={banner.heading}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)' }} />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <h2 className="font-cormorant text-white font-light leading-[1.1] mb-4"
          style={{ fontSize: 'clamp(36px, 6vw, 80px)' }}>
          {lines.map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </h2>

        {banner.subheading && (
          <p className="text-[13px] tracking-[3px] uppercase mb-8"
            style={{ color: 'rgba(255,255,255,0.8)' }}>
            {banner.subheading}
          </p>
        )}

        {banner.cta_text && banner.cta_link && (
          <Link
            href={banner.cta_link}
            className="px-10 py-4 text-[11px] tracking-[4px] uppercase transition-all"
            style={{ background: '#B8952A', color: '#fff' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#fff', e.currentTarget.style.color = '#1a1a1a')}
            onMouseLeave={e => (e.currentTarget.style.background = '#B8952A', e.currentTarget.style.color = '#fff')}
          >
            {banner.cta_text}
          </Link>
        )}
      </div>
    </section>
  )
}