import { createClient } from '@/lib/supabase/server'
import HeroSlider from '@/components/home/HeroSlider'
import CampaignBanner from '@/components/home/CampaignBanner'
import TrustBar from '@/components/home/TrustBar'
import CategoryBubbles from '@/components/home/CategoryBubbles'
import ProductTabs from '@/components/home/ProductTabs'
import AmaniFavouritesEdit from '@/components/home/AmaniFavouritesEdit'
import ClientDiaries from '@/components/home/ClientDiaries'
import Testimonials from '@/components/home/Testimonials'
import InstagramGrid from '@/components/home/InstagramGrid'
import Newsletter from '@/components/home/Newsletter'

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()

  const [
    { data: banner },
    { data: categories },
    { data: newArrivals },
    { data: bestsellers },
    { data: favourites },
    { data: diaries },
    { data: testimonials },
    { data: instaPosts },
  ] = await Promise.all([
    supabase.from('campaign_banners').select('*').eq('is_active', true).single(),
    supabase.from('categories').select('*').eq('is_active', true).order('display_order'),
    supabase.from('products').select('id,name,slug,price_inr,primary_image_url,secondary_images,tags,stock').eq('is_active', true).order('created_at', { ascending: false }).limit(8),
    supabase.from('products').select('id,name,slug,price_inr,primary_image_url,secondary_images,tags,stock').eq('is_active', true).eq('is_bestseller', true).limit(8),
    supabase.from('products').select('id,name,slug,price_inr,primary_image_url,secondary_images,tags,stock').eq('is_active', true).eq('is_amani_favourite', true).limit(8),
    supabase.from('client_diaries').select('*').eq('is_active', true).order('display_order').limit(12),
    supabase.from('testimonials').select('*').eq('is_active', true).order('display_order').limit(6),
    supabase.from('instagram_posts').select('*').eq('is_active', true).order('display_order').limit(6),
  ])

  return (
    <>
      <HeroSlider />
      {banner && <CampaignBanner banner={banner} />}
      <TrustBar />
      <CategoryBubbles categories={categories ?? []} />
      <ProductTabs
        newArrivals={newArrivals ?? []}
        bestsellers={bestsellers ?? []}
        favourites={favourites ?? []}
      />
      <AmaniFavouritesEdit products={favourites ?? []} />
      {diaries && diaries.length > 0 && <ClientDiaries diaries={diaries} />}
      {testimonials && testimonials.length > 0 && <Testimonials testimonials={testimonials} />}
      {instaPosts && instaPosts.length > 0 && <InstagramGrid posts={instaPosts} />}
      <Newsletter />
    </>
  )
}
