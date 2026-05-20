'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({ cod_enabled: false, delivery_mumbai: 150, delivery_maharashtra: 200, delivery_india: 250, whatsapp_number: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => setSettings(s => ({ ...s, ...d })))
  }, [])

  const set = (k: string, v: any) => setSettings(s => ({ ...s, [k]: v }))

  const handleSave = async () => {
    setLoading(true)
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    toast.success('Settings saved!')
    setLoading(false)
  }

  const inputClass = "w-full px-4 py-3 text-[13px] border outline-none"
  const inputStyle = { borderColor: '#e8e0d0', fontFamily: 'var(--font-dm-sans)' }

  return (
    <AdminLayout>
      <div className="p-8 max-w-[560px]">
        <div className="mb-8">
          <p className="text-[10px] tracking-[4px] uppercase mb-1" style={{ color: '#B8952A' }}>Admin</p>
          <h1 className="font-cormorant text-[36px] font-light" style={{ color: '#1a1a1a' }}>Settings</h1>
        </div>

        <div className="bg-white border p-6" style={{ borderColor: '#e8e0d0' }}>
          <div className="flex flex-col gap-5">
            {/* COD Toggle */}
            <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: '#f5f5f5' }}>
              <div>
                <p className="text-[13px] font-medium">Cash on Delivery</p>
                <p className="text-[11px]" style={{ color: '#888' }}>Enable COD as a payment option at checkout</p>
              </div>
              <div
                onClick={() => set('cod_enabled', !settings.cod_enabled)}
                className="w-10 h-5 rounded-full relative cursor-pointer transition-all"
                style={{ background: settings.cod_enabled ? '#B8952A' : '#ddd' }}
              >
                <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all" style={{ left: settings.cod_enabled ? '22px' : '2px' }} />
              </div>
            </div>

            {/* Delivery charges */}
            <div>
              <p className="text-[10px] tracking-[3px] uppercase mb-3" style={{ color: '#B8952A' }}>Delivery Charges (₹ per dress)</p>
              <div className="flex flex-col gap-3">
                {[
                  { key: 'delivery_mumbai', label: 'Mumbai' },
                  { key: 'delivery_maharashtra', label: 'Maharashtra (non-Mumbai)' },
                  { key: 'delivery_india', label: 'Rest of India' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-4">
                    <label className="text-[12px] w-48 flex-shrink-0" style={{ color: '#555' }}>{label}</label>
                    <input
                      type="number"
                      value={(settings as any)[key]}
                      onChange={e => set(key, parseInt(e.target.value))}
                      className={inputClass}
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = '#B8952A')}
                      onBlur={e => (e.target.style.borderColor = '#e8e0d0')}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <label className="text-[10px] tracking-[2px] uppercase block mb-1" style={{ color: '#888' }}>WhatsApp Number (with country code)</label>
              <input
                type="text"
                value={settings.whatsapp_number}
                onChange={e => set('whatsapp_number', e.target.value)}
                placeholder="919876543210"
                className={inputClass}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#B8952A')}
                onBlur={e => (e.target.style.borderColor = '#e8e0d0')}
              />
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full py-4 text-white text-[11px] tracking-[3px] uppercase transition-all"
              style={{ background: loading ? '#888' : '#1a1a1a' }}
              onMouseEnter={e => { if (!loading) (e.currentTarget.style.background = '#B8952A') }}
              onMouseLeave={e => { if (!loading) (e.currentTarget.style.background = '#1a1a1a') }}
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
