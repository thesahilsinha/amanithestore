import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('name, slug, description, price_inr, tags, stock, is_bestseller, is_amani_favourite, category:categories(name)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const productContext = (products ?? []).map(p => {
    const cat = (p.category as any)?.name ?? 'Uncategorised'
    const tags = p.tags?.join(', ') ?? ''
    const stock = p.stock === 0 ? 'SOLD OUT' : 'In Stock'
    const flags = [p.is_bestseller && 'Bestseller', p.is_amani_favourite && "Amani's Favourite"].filter(Boolean).join(', ')
    return `- ${p.name} | ₹${p.price_inr.toLocaleString('en-IN')} | ${cat} | ${stock}${flags ? ' | ' + flags : ''}${tags ? ' | Tags: ' + tags : ''}${p.description ? '\n  Description: ' + p.description.slice(0, 200) : ''}\n  Link: /products/${p.slug}`
  }).join('\n')

  const systemPrompt = `You are AMANI's friendly fashion assistant. AMANI is a luxury Indian women's fashion brand based in Mumbai.

You help customers:
- Discover products based on their style preferences, occasion, budget, or vibe
- Get styling advice
- Answer questions about sizing, shipping, returns
- Feel excited about the collection

STORE POLICIES:
- Shipping: Flat ₹200 across India, dispatched in 3–5 working days
- Returns: Exchange only within 48 hours of delivery, no refunds
- Care: Dry clean only
- Sizes: XS, S, M, L, XL
- International orders: Via WhatsApp only
- Store is in Khar Bandra, on linking road. address=Shop No.4, Tulsi Building, Off linking Road, 14th Rd, Khar West, W, Maharashtra 400052
- WhatsApp number is 93244 19021

CURRENT PRODUCTS IN STOCK:
${productContext}

INSTRUCTIONS:
- When recommending products always show them as a neat list with name, price and link
- Format product links as markdown: [Product Name](/products/slug)
- Be warm, stylish and conversational like a knowledgeable friend who loves fashion
- If asked about a product not in the list say it may be out of stock and suggest alternatives
- Keep responses concise and helpful
- Use ₹ for prices
- Never make up products that are not in the list above`


  const groqMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m: any) => ({
      role: m.role,
      content: m.content
    }))
  ]

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.GROQ_API_KEY,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: groqMessages,
      temperature: 0.8,
      max_tokens: 1024,
    })
  })

  const data = await res.json()

  if (!res.ok) {
    console.error('Groq error:', JSON.stringify(data))
    return NextResponse.json({ message: "I'm having trouble connecting right now. Please try again!" })
  }

  const text = data.choices?.[0]?.message?.content ?? "I'm sorry, I couldn't process that. Please try again!"

  return NextResponse.json({ message: text })
}