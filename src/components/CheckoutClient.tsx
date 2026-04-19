'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCart, getCartTotal, type CartItem } from '@/lib/cart'
import type ukDict from '@/dictionaries/uk.json'
import type { Locale } from '@/lib/i18n'

type Dict = typeof ukDict
type Carrier = 'NOVAPOSHTA' | 'UKRPOSHTA'
type Payment = 'LIQPAY' | 'MONOBANK' | 'PORTMONE'

export default function CheckoutClient({ dict, lang }: { dict: Dict; lang: Locale }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [carrier, setCarrier] = useState<Carrier>('NOVAPOSHTA')
  const [payment, setPayment] = useState<Payment>('LIQPAY')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const c = dict.checkout

  useEffect(() => { setCart(getCart()) }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const form = new FormData(e.currentTarget)
    const data = {
      name: form.get('name'),
      surname: form.get('surname'),
      email: form.get('email'),
      phone: form.get('phone'),
      city: form.get('city'),
      street: form.get('street'),
      house: form.get('house'),
      apartment: form.get('apartment'),
      carrier,
      paymentMethod: payment,
      items: cart.map((i) => ({ id: i.id, quantity: i.quantity, price: i.price })),
      totalPrice: getCartTotal(cart),
    }
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error')
      if (json.paymentUrl) {
        window.location.href = json.paymentUrl
      } else {
        localStorage.setItem('cart', '[]')
        router.push(`/${lang}/account`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full bg-[#0A0A0A] border border-[#2A2A2A] focus:border-[#C9A84C]/50 text-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#333]'
  const labelClass = 'block text-xs font-semibold text-[#555] uppercase tracking-wider mb-2'

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">

        {/* Personal */}
        <div className="bg-[#111111] border border-[#1E1E1E] p-6">
          <h2 className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-6">{c.personal}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelClass}>{c.name} *</label><input name="name" type="text" required className={inputClass} /></div>
            <div><label className={labelClass}>{c.surname} *</label><input name="surname" type="text" required className={inputClass} /></div>
            <div><label className={labelClass}>{c.email} *</label><input name="email" type="email" required className={inputClass} /></div>
            <div><label className={labelClass}>{c.phone} *</label><input name="phone" type="tel" required className={inputClass} placeholder="+380" /></div>
          </div>
        </div>

        {/* Delivery */}
        <div className="bg-[#111111] border border-[#1E1E1E] p-6">
          <h2 className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-6">{c.delivery}</h2>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {(['NOVAPOSHTA', 'UKRPOSHTA'] as Carrier[]).map((c_) => (
              <button
                key={c_}
                type="button"
                onClick={() => setCarrier(c_)}
                className={`py-3 px-4 border text-sm font-medium transition-colors ${
                  carrier === c_
                    ? 'border-[#C9A84C]/50 bg-[#C9A84C]/5 text-[#C9A84C]'
                    : 'border-[#2A2A2A] text-[#555] hover:border-[#3A3A3A] hover:text-[#9CA3AF]'
                }`}
              >
                {c_ === 'NOVAPOSHTA' ? '📦 Нова Пошта' : '✉️ Укрпошта'}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><label className={labelClass}>{c.city} *</label><input name="city" type="text" required className={inputClass} /></div>
            <div className="sm:col-span-2"><label className={labelClass}>{c.street} *</label><input name="street" type="text" required className={inputClass} /></div>
            <div><label className={labelClass}>{c.house} *</label><input name="house" type="text" required className={inputClass} /></div>
            <div><label className={labelClass}>{c.apartment}</label><input name="apartment" type="text" className={inputClass} /></div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-[#111111] border border-[#1E1E1E] p-6">
          <h2 className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-6">{c.payment}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: 'LIQPAY' as Payment, label: 'LiqPay', sub: 'ПриватБанк' },
              { key: 'MONOBANK' as Payment, label: 'Monobank', sub: 'Монобанк' },
              { key: 'PORTMONE' as Payment, label: 'Portmone', sub: 'Portmone' },
            ].map(({ key, label, sub }) => (
              <button
                key={key}
                type="button"
                onClick={() => setPayment(key)}
                className={`py-3 px-4 border text-sm font-medium transition-colors flex flex-col items-center gap-1 ${
                  payment === key
                    ? 'border-[#C9A84C]/50 bg-[#C9A84C]/5 text-[#C9A84C]'
                    : 'border-[#2A2A2A] text-[#555] hover:border-[#3A3A3A] hover:text-[#9CA3AF]'
                }`}
              >
                <span className="font-bold">{label}</span>
                <span className="text-xs opacity-60">{sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div>
        <div className="bg-[#111111] border border-[#1E1E1E] p-6 sticky top-24">
          <h2 className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-6">{dict.cart.total}</h2>
          <div className="space-y-3 mb-5">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-[#555]">{item.name} × {item.quantity}</span>
                <span className="text-[#9CA3AF]">{item.price * item.quantity} {dict.products.uah}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#1E1E1E] pt-4 mb-6">
            <div className="flex justify-between items-baseline">
              <span className="text-[#9CA3AF]">{dict.cart.total}</span>
              <span className="text-[#C9A84C] font-black text-xl">{getCartTotal(cart)} {dict.products.uah}</span>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className="w-full bg-[#A52A2A] hover:bg-[#C03333] disabled:opacity-40 text-white font-heading font-bold py-4 uppercase tracking-widest text-sm transition-colors"
          >
            {loading ? '...' : c.place_order}
          </button>
          <p className="text-xs text-[#333] text-center mt-4 uppercase tracking-wider">
            🔒 {lang === 'uk' ? 'Безпечна оплата' : lang === 'ru' ? 'Безопасная оплата' : 'Secure payment'}
          </p>
        </div>
      </div>
    </form>
  )
}
