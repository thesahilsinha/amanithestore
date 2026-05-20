import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProductGallery from '@/components/products/ProductGallery'
import ProductInfo from '@/components/products/ProductInfo'
import RelatedProducts from '@/components/products/RelatedProducts'
export const revalidate = 60
interface Props { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('name,description').eq('slug', slug).single()
  if (!data) return { title: 'Product — AMANI' }
  return {
    title: `${data.name} — AMANI`,
    description: data.description?.slice(0, 160),
  }
}
export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select(`*, category:categories(id, name, slug)`)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  if (!product) notFound()
  const { data: related } = await supabase
    .from('products')
    .select('id,name,slug,price_inr,primary_image_url,secondary_images,tags,stock')
    .eq('is_active', true)
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .limit(4)
  return (
    <div style={{ background: '#fff' }}>
      <div className="px-6 md:px-12 py-3 flex items-center gap-2 text-[11px] tracking-[0.5px] border-b" style={{ background: '#FAFAF7', borderColor: '#e8e0d0', color: '#888' }}>
        <a href="/" className="hover:text-[#B8952A] transition-colors">Home</a>
        <span>/</span>
        <a href="/products" className="hover:text-[#B8952A] transition-colors">Shop</a>
        {product.category && <>
          <span>/</span>
          <a href={`/products?category=${product.category.slug}`} className="hover:text-[#B8952A] transition-colors">{product.category.name}</a>
        </>}
        <span>/</span>
        <span style={{ color: '#B8952A' }}>{product.name}</span>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid md:grid-cols-[56%_44%] gap-0 min-h-[120vh]">
        <ProductGallery
          primaryImage={product.primary_image_url}
          videoUrl={product.video_url}
          secondaryImages={product.secondary_images ?? []}
          productName={product.name}
        />
        <ProductInfo product={product} />
      </div>
      <RelatedProducts products={related ?? []} />
    </div>
  )
}
