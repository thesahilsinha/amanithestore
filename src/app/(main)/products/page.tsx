import { createClient } from "@/lib/supabase/server"
import { Suspense } from "react"
import ProductGrid from "@/components/products/ProductGrid"
import ProductFilters from "@/components/products/ProductFilters"

export const revalidate = 60

export default async function ProductsPage({ searchParams }: any) {
  const params = await searchParams
  const filter = params?.filter ?? ""
  const category = params?.category ?? ""
  const search = params?.search ?? ""
  const page = parseInt(params?.page ?? "1")
  const limit = 12
  const offset = (page - 1) * limit

  const supabase = await createClient()

  let query = supabase
    .from("products")
    .select("id,name,slug,price_inr,primary_image_url,secondary_images,tags,stock,is_bestseller,is_amani_favourite,created_at", { count: "exact" })
    .eq("is_active", true)
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false })

  if (filter === "bestseller") query = query.eq("is_bestseller", true)
  if (filter === "favourite") query = query.eq("is_amani_favourite", true)
  if (search) query = query.ilike("name", "%" + search + "%")

  if (category) {
    const { data: cat } = await supabase.from("categories").select("id").eq("slug", category).single()
    if (cat) query = query.eq("category_id", cat.id)
  }

  const { data: products, count } = await query
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order")

  const title =
    filter === "new" ? "New Arrivals"
    : filter === "bestseller" ? "Best Sellers"
    : filter === "favourite" ? "Amani Favourites"
    : search ? "Search Results"
    : "All Collections"

  const totalPages = Math.ceil((count ?? 0) / limit)

  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      <div className="py-12 text-center border-b" style={{ background: "#FAFAF7", borderColor: "#e8e0d0" }}>
        <span className="text-[10px] tracking-[5px] uppercase block mb-2" style={{ color: "#B8952A" }}>The Collection</span>
        <h1 className="font-cormorant text-[clamp(36px,5vw,64px)] font-light" style={{ color: "#1a1a1a" }}>
          {title}
        </h1>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10">
        <Suspense fallback={null}>
          <ProductFilters categories={categories ?? []} totalCount={count ?? 0} />
        </Suspense>
        <ProductGrid products={products ?? []} />
      </div>
    </div>
  )
}
