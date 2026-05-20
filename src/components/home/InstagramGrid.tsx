'use client'
import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'

interface InstaPost { id: string; image_url: string; instagram_url: string }

export default function InstagramGrid({ posts }: { posts: InstaPost[] }) {
  return (
    <section className="py-20 px-6 md:px-12 bg-cream">
      <div className="text-center mb-4">
        <span className="text-[10px] tracking-[5px] uppercase text-gold block mb-2">Follow Along</span>
        <h2 className="font-cormorant text-[clamp(32px,4vw,52px)] font-light text-dark leading-[1.1]">
          We're on <em className="text-gold italic">Instagram</em>
        </h2>
        <div className="w-12 h-[1px] bg-gold mx-auto mt-3 mb-4" />
        
          <a href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-[13px] tracking-[2px] text-gold hover:text-dark transition-colors"
        >
          <Instagram size={16} />
          @amani.official
        </a>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-[3px] mt-10 max-w-[1440px] mx-auto">
        {posts.map((p, i) => (
          <motion.a
            key={p.id}
            href={p.instagram_url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="relative aspect-square overflow-hidden group"
          >
            <img
              src={p.image_url}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/30 transition-all flex items-center justify-center">
              <Instagram size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
