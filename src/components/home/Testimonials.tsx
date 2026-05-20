'use client'
import { motion } from 'framer-motion'

interface Testimonial {
  id: string; customer_name: string; customer_handle?: string; quote: string; avatar_url?: string
}

const avatarColors = ['#5b6abf', '#2e7d52', '#c0392b', '#8e44ad', '#d35400', '#1a5276']

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="py-20 px-6 md:px-12 bg-white">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-[10px] tracking-[5px] uppercase text-gold block mb-2">Customer Love</span>
        <h2 className="font-cormorant text-[clamp(32px,4vw,52px)] font-light text-dark leading-[1.1]">
          What Amani Girls <em className="text-gold italic">Are Saying</em>
        </h2>
        <div className="w-12 h-[1px] bg-gold mx-auto mt-3" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1200px] mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-cream p-8 border border-border"
          >
            <p className="text-[32px] text-gold leading-none mb-4 font-cormorant">"</p>
            <p className="text-[14px] text-[#444] leading-relaxed mb-6 italic font-cormorant text-[17px]">
              {t.quote}
            </p>
            <div className="flex items-center gap-3 border-t border-border pt-5">
              {t.avatar_url ? (
                <img src={t.avatar_url} alt={t.customer_name} className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-medium"
                  style={{ background: avatarColors[i % avatarColors.length] }}
                >
                  {t.customer_name[0]}
                </div>
              )}
              <div>
                <p className="text-[13px] font-medium text-dark">{t.customer_name}</p>
                {t.customer_handle && (
                  <p className="text-[11px] text-muted tracking-[0.5px]">{t.customer_handle}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}