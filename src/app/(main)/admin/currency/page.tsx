'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import toast from 'react-hot-toast'
import { CURRENCY_CONFIG } from '@/lib/currency'

export default function AdminCurrencyPage() {
  const [currencies, setCurrencies] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const load = () => fetch('/api/admin/currency').then(r => r.json()).then(d => setCurrencies(d.currencies ?? []))
  useEffect(() => { load() }, [])

  const handleUpdate = async (id: string, conversion_rate: number, is_active: boolean) => {
    setLoading(true)
    await fetch('/api/admin/currency', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, conversion_rate, is_active }),
    })
    toast.success('Currency updated!')
    await load()
    setLoading(false)
  }

  return (
    <AdminLayout>
      <div className="p-8 max-w-[600px]">
        <div className="mb-8">
          <p className="text-[10px] tracking-[4px] uppercase mb-1" style={{ color: '#B8952A' }}>Admin</p>
          <h1 className="font-cormorant text-[36px] font-light" style={{ color: '#1a1a1a' }}>Currency Settings</h1>
          <p className="text-[12px] mt-1" style={{ color: '#888' }}>INR is the base currency (rate = 1). All other rates are multiplied against INR price.</p>
        </div>

        <div className="flex flex-col gap-4">
          {currencies.map(c => {
            const cfg = CURRENCY_CONFIG[c.currency_code]
            return (
              <div key={c.id} className="bg-white border p-5" style={{ borderColor: '#e8e0d0' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cfg?.flag}</span>
                    <span className="font-medium">{c.currency_code}</span>
                    <span className="text-[12px]" style={{ color: '#888' }}>{c.currency_name}</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-[11px] uppercase tracking-[1px]" style={{ color: '#888' }}>Active</span>
                    <div
                      onClick={() => c.currency_code !== 'INR' && handleUpdate(c.id, c.conversion_rate, !c.is_active)}
                      className="w-10 h-5 rounded-full relative transition-all"
                      style={{
                        background: c.is_active ? '#B8952A' : '#ddd',
                        cursor: c.currency_code === 'INR' ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all" style={{ left: c.is_active ? '22px' : '2px' }} />
                    </div>
                  </label>
                </div>
                {c.currency_code !== 'INR' && (
                  <div className="flex items-center gap-3">
                    <label className="text-[10px] tracking-[2px] uppercase flex-shrink-0" style={{ color: '#888' }}>Rate (1 INR =)</label>
                    <input
                      type="number"
                      step="0.0001"
                      defaultValue={c.conversion_rate}
                      onBlur={e => handleUpdate(c.id, parseFloat(e.target.value), c.is_active)}
                      className="flex-1 px-3 py-2 text-[13px] border outline-none"
                      style={{ borderColor: '#e8e0d0' }}
                      onFocus={e => (e.target.style.borderColor = '#B8952A')}
                    />
                    <span className="text-[12px]" style={{ color: '#888' }}>{cfg?.symbol}</span>
                  </div>
                )}
                <p className="text-[11px] mt-2" style={{ color: '#aaa' }}>
                  Last updated: {new Date(c.updated_at).toLocaleDateString('en-IN')}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </AdminLayout>
  )
}