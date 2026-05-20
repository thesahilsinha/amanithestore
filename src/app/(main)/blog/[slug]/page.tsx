import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
export const revalidate = 60
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('blog_posts').select('meta_title,meta_description,title').eq('slug', slug).single()
  return { title: data?.meta_title || `${data?.title} — AMANI`, description: data?.meta_description || '' }
}
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase.from('blog_posts').select('*').eq('slug', slug).eq('is_published', true).single()
  if (!post) notFound()
  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>
      {post.featured_image_url && (
        <div className="h-[50vh] overflow-hidden">
          <img src={post.featured_image_url} alt={post.title} className="w-full h-full object-cover brightness-75" />
        </div>
      )}
      <div className="max-w-[720px] mx-auto px-6 py-16">
        {post.tags?.length > 0 && <p className="text-[10px] tracking-[3px] uppercase mb-3" style={{ color: '#B8952A' }}>{post.tags.join(' · ')}</p>}
        <h1 className="font-cormorant text-[clamp(32px,5vw,56px)] font-light mb-4 leading-[1.15]" style={{ color: '#1a1a1a' }}>{post.title}</h1>
        <p className="text-[12px] mb-10" style={{ color: '#aaa' }}>
          {post.published_at ? new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
        </p>
        {post.excerpt && <p className="text-[16px] font-cormorant italic mb-8 pb-8 border-b leading-relaxed" style={{ color: '#555', borderColor: '#e8e0d0' }}>{post.excerpt}</p>}
        <div className="prose max-w-none text-[14px] leading-[1.8]" style={{ color: '#2c2c2c' }}>
          {post.content?.split('\n').map((para: string, i: number) =>
            para.trim() ? <p key={i} className="mb-4">{para}</p> : <br key={i} />
          )}
        </div>
      </div>
    </div>
  )
}
