'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'

interface CurrencyRate {
  currency_code: string
  currency_symbol: string
  conversion_rate: number
  is_active: boolean
}

interface CurrencyContextType {
  currency: string
  setCurrency: (c: string) => void
  rates: Record<string, CurrencyRate>
  getRate: (code: string) => number
  getSymbol: (code: string) => string
  isInternational: boolean
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'INR',
  setCurrency: () => {},
  rates: {},
  getRate: () => 1,
  getSymbol: () => '₹',
  isInternational: false,
})

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState('INR')
  const [rates, setRates] = useState<Record<string, CurrencyRate>>({})
  const supabase = createClient()

  useEffect(() => {
    const stored = localStorage.getItem('amani_currency')
    if (stored) setCurrencyState(stored)

    supabase
      .from('currency_settings')
      .select('*')
      .eq('is_active', true)
      .then(({ data }) => {
        if (data) {
          const map: Record<string, CurrencyRate> = {}
          data.forEach((r: CurrencyRate) => { map[r.currency_code] = r })
          setRates(map)
        }
      })
  }, [])

  const setCurrency = (c: string) => {
    setCurrencyState(c)
    localStorage.setItem('amani_currency', c)
  }

  const getRate = (code: string) => rates[code]?.conversion_rate ?? 1
  const getSymbol = (code: string) => rates[code]?.currency_symbol ?? '₹'
  const isInternational = currency !== 'INR'

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, getRate, getSymbol, isInternational }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => useContext(CurrencyContext)
