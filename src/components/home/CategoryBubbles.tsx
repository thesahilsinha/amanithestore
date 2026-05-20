'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Category {
  id: string
  name: string
  slug: string
  image_url: string
}

export default function CategoryBubbles({ categories }: { categories: Category[] }) {
  if (!categories.length) return null

  return (
    <section className="py-16 px-6 bg-cream">
      <div className="flex justify-center gap-6 flex-wrap">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={`/products?category=${cat.slug}`} className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-border group-hover:border-gold transition-all duration-300 group-hover:scale-105">
                <img
                  src={cat.image_url || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <span className="text-[11px] tracking-[2px] uppercase font-medium group-hover:text-gold transition-colors">
                {cat.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}