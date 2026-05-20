'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800&q=80',
    tag: 'New Collection',
    title: ['The Art of', 'Being', 'Radiant'],
    titleEm: 2,
    cta: { label: 'Explore Collection', href: '/products' },
    ctaSecondary: { label: 'Our Story', href: '/about' },
  },
  {
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1800&q=80',
    tag: 'Festive Edit',
    title: ['Dressed for', 'Every', 'Moment'],
    titleEm: 1,
    cta: { label: 'Shop the Edit', href: '/products?filter=new' },
    ctaSecondary: { label: 'View Bestsellers', href: '/products?filter=bestseller' },
  },
  {
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&q=80',
    tag: 'Timeless Luxury',
    title: ['Crafted for', 'The Bold &', 'The Beautiful'],
    titleEm: 0,
    cta: { label: 'Shop Now', href: '/products' },
    ctaSecondary: { label: 'New Arrivals', href: '/products?filter=new' },
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % slides.length), 5500)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative h-[88vh] overflow-hidden">
      <AnimatePresence mode="wait">
        {slides.map((slide, i) =>
          i === current ? (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0"
            >
              <img
  src={slide.image}
  alt=""
  className="w-full h-full object-cover object-center brightness-50 absolute inset-0"
/>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
        <motion.p
          key={`tag-${current}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[10px] tracking-[5px] uppercase text-gold-light mb-5"
        >
          {slides[current].tag}
        </motion.p>
        <motion.h1
          key={`title-${current}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="font-cormorant text-white font-light leading-[0.95] mb-9"
          style={{ fontSize: 'clamp(54px, 9vw, 108px)' }}
        >
          {slides[current].title.map((line, li) => (
            <span key={li} className={`block ${li === slides[current].titleEm ? 'text-gold-light italic' : ''}`}>
              {line}
            </span>
          ))}
        </motion.h1>
        <motion.div
          key={`btns-${current}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <Link
            href={slides[current].cta.href}
            className="px-10 py-[14px] bg-dark text-white text-[10px] tracking-[3px] uppercase border border-dark hover:bg-gold hover:border-gold hover:text-dark transition-all duration-300"
          >
            {slides[current].cta.label}
          </Link>
          <Link
            href={slides[current].ctaSecondary.href}
            className="px-10 py-[14px] bg-transparent text-white text-[10px] tracking-[3px] uppercase border border-white/60 hover:border-gold-light hover:text-gold-light transition-all duration-300"
          >
            {slides[current].ctaSecondary.label}
          </Link>
        </motion.div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-[2px] transition-all duration-300 ${i === current ? 'w-7 bg-gold-light' : 'w-7 bg-white/35'}`}
          />
        ))}
      </div>
    </section>
  )
}
