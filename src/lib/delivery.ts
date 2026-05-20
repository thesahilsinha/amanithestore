export async function getDeliverySettings() {
  const res = await fetch('/api/settings')
  const data = await res.json()
  return {
    mumbai: parseInt(data.delivery_mumbai ?? '150'),
    maharashtra: parseInt(data.delivery_maharashtra ?? '200'),
    india: parseInt(data.delivery_india ?? '250'),
    cod_enabled: data.cod_enabled === 'true' || data.cod_enabled === true,
  }
}

export function calculateDelivery(
  city: string,
  state: string,
  itemCount: number,
  rates: { mumbai: number; maharashtra: number; india: number }
): number {
  const perDress =
    city.toLowerCase().trim() === 'mumbai' ? rates.mumbai
    : state.toLowerCase().trim() === 'maharashtra' ? rates.maharashtra
    : rates.india
  return perDress * itemCount
}