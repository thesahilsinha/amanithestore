import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const revalidate = 60

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id,title,slug,excerpt,featured_image_url,tags,published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>
      <div className="py-12 text-center border-b" style={{ background: '#FAFAF7', borderColor: '#e8e0d0' }}>
        <span className="text-[10px] tracking-[5px] uppercase block mb-2" style={{ color: '#B8952A' }}>Stories & Style</span>
        <h1 className="font-cormorant text-[clamp(36px,5vw,64px)] font-light" style={{ color: '#1a1a1a' }}>The AMANI Journal</h1>
      </div>
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-16">
        {!posts?.length ? (
          <p className="text-center text-[13px]" style={{ color: '#888' }}>No posts yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map(p => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="group block">
                {p.featured_image_url && (
                  <div className="aspect-[4/3] overflow-hidden mb-4" style={{ background: '#FAFAF7' }}>
                    <img src={p.featured_image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                {p.tags?.length > 0 && (
                  <p className="text-[10px] tracking-[3px] uppercase mb-2" style={{ color: '#B8952A' }}>{p.tags[0]}</p>
                )}
                <h2 className="font-cormorant text-[22px] font-light mb-2 group-hover:text-[#B8952A] transition-colors" style={{ color: '#1a1a1a' }}>{p.title}</h2>
                {p.excerpt && <p className="text-[13px] leading-relaxed" style={{ color: '#888' }}>{p.excerpt}</p>}
                <p className="text-[11px] tracking-[1px] mt-3" style={{ color: '#aaa' }}>
                  {p.published_at ? new Date(p.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
