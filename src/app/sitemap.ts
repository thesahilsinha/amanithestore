import { createClient } from '@/lib/supabase/server'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourdomain.com'

  const [{ data: products }, { data: posts }] = await Promise.all([
    supabase.from('products').select('slug, created_at').eq('is_active', true),
    supabase.from('blog_posts').select('slug, published_at').eq('is_published', true),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), priority: 1 },
    { url: `${siteUrl}/products`, lastModified: new Date(), priority: 0.9 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), priority: 0.5 },
    { url: `${siteUrl}/track-order`, lastModified: new Date(), priority: 0.4 },
  ]

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).map(p => ({
    url: `${siteUrl}/products/${p.slug}`,
    lastModified: new Date(p.created_at),
    priority: 0.8,
  }))

  const blogRoutes: MetadataRoute.Sitemap = (posts ?? []).map(p => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: new Date(p.published_at),
    priority: 0.6,
  }))

  return [...staticRoutes, ...productRoutes, ...blogRoutes]
}
