'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'

interface CartItem {
  id: string
  product_id: string
  size: string
  quantity: number
  product: {
    name: string
    price_inr: number
    primary_image_url: string
    slug: string
  }
}

interface CartContextType {
  items: CartItem[]
  count: number
  loading: boolean
  addToCart: (productId: string, size: string, quantity?: number) => Promise<void>
  removeFromCart: (cartId: string) => Promise<void>
  updateQuantity: (cartId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType>({
  items: [], count: 0, loading: false,
  addToCart: async () => {}, removeFromCart: async () => {},
  updateQuantity: async () => {}, clearCart: async () => {},
  refreshCart: async () => {},
})

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const refreshCart = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setItems([]); return }

    const { data } = await supabase
      .from('carts')
      .select(`*, product:products(name, price_inr, primary_image_url, slug)`)
      .eq('user_id', user.id)

    setItems(data ?? [])
  }

  useEffect(() => { refreshCart() }, [])

  const addToCart = async (productId: string, size: string, quantity = 1) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const existing = items.find(i => i.product_id === productId && i.size === size)
    if (existing) {
      await supabase.from('carts').update({ quantity: existing.quantity + quantity }).eq('id', existing.id)
    } else {
      await supabase.from('carts').insert({ user_id: user.id, product_id: productId, size, quantity })
    }
    await refreshCart()
  }

  const removeFromCart = async (cartId: string) => {
    await supabase.from('carts').delete().eq('id', cartId)
    await refreshCart()
  }

  const updateQuantity = async (cartId: string, quantity: number) => {
    if (quantity < 1) { await removeFromCart(cartId); return }
    await supabase.from('carts').update({ quantity }).eq('id', cartId)
    await refreshCart()
  }

  const clearCart = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('carts').delete().eq('user_id', user.id)
    setItems([])
  }

  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, count, loading, addToCart, removeFromCart, updateQuantity, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
