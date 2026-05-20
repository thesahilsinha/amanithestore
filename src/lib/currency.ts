export const CURRENCY_CONFIG: Record<string, { symbol: string; flag: string; name: string }> = {
  INR: { symbol: '₹',    flag: '🇮🇳', name: 'Indian Rupee' },
  USD: { symbol: '$',    flag: '🇺🇸', name: 'US Dollar' },
  GBP: { symbol: '£',    flag: '🇬🇧', name: 'British Pound' },
  AED: { symbol: 'د.إ', flag: '🇦🇪', name: 'UAE Dirham' },
  SGD: { symbol: 'S$',  flag: '🇸🇬', name: 'Singapore Dollar' },
}

export function formatPrice(priceInr: number, currencyCode: string, rate: number): string {
  const config = CURRENCY_CONFIG[currencyCode]
  if (!config) return `₹${priceInr.toLocaleString('en-IN')}`
  if (currencyCode === 'INR') return `₹${priceInr.toLocaleString('en-IN')}`
  const converted = priceInr * rate
  return `${config.symbol}${converted.toFixed(2)}`
}

export function generateWhatsAppLink(
  productName: string,
  size: string,
  productUrl: string,
  whatsappNumber: string
): string {
  const message = encodeURIComponent(
    `Hi! I'm interested in ${productName} (Size: ${size})\nLink: ${productUrl}`
  )
  return `https://wa.me/${whatsappNumber}?text=${message}`
}