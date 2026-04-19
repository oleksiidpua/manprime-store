'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCart, removeFromCart, updateQuantity, getCartTotal, type CartItem } from '@/lib/cart'
import type ukDict from '@/dictionaries/uk.json'
import type { Locale } from '@/lib/i18n'

type Dict = typeof ukDict

export default function CartClient({ dict, lang }: { dict: Dict; lang: Locale }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const c = dict.cart

  useEffect(() => { setCart(getCart()) }, [])

  const handleRemove = (id: string) => setCart(removeFromCart(id))
  const handleQty = (id: string, qty: number) => setCart(updateQuantity(id, qty))

  if (cart.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-5xl mb-6">🛒</div>
        <p className="text-[#8b9ab0] text-xl mb-8">{c.empty}</p>
        <Link
          href={`/${lang}/catalog`}
          className="inline-block bg-[#b5622a] hover:bg-[#cc7033] text-[#e8eaf0] font-semibold px-10 py-4 uppercase tracking-widest text-sm transition-colors rounded-sm"
        >
          {c.continue}
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-3">
        {cart.map((item) => (
          <div key={item.id} className="bg-[#1c2333] border border-[#2a3347] p-5 flex gap-4 items-center rounded-sm">
            <div className="w-16 h-16 bg-[#232d42] border border-[#2a3347] flex items-center justify-center shrink-0 rounded-sm">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-sm" />
              ) : (
                <span className="text-2xl">💊</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#e8eaf0] truncate">{item.name}</h3>
              <p className="text-[#c9a84c] font-bold text-sm mt-0.5">{item.price} {dict.products.uah}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQty(item.id, item.quantity - 1)}
                className="w-8 h-8 border border-[#2a3347] hover:border-[#c9a84c] hover:text-[#c9a84c] text-[#8b9ab0] flex items-center justify-center transition-colors rounded-sm"
              >−</button>
              <span className="w-5 text-center text-[#e8eaf0] font-medium">{item.quantity}</span>
              <button
                onClick={() => handleQty(item.id, item.quantity + 1)}
                className="w-8 h-8 border border-[#2a3347] hover:border-[#c9a84c] hover:text-[#c9a84c] text-[#8b9ab0] flex items-center justify-center transition-colors rounded-sm"
              >+</button>
            </div>
            <button
              onClick={() => handleRemove(item.id)}
              className="ml-2 text-[#8b9ab0] hover:text-red-500 transition-colors"
              aria-label={c.remove}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-[#1c2333] border border-[#2a3347] p-6 h-fit sticky top-24 rounded-sm">
        <h2 className="font-heading text-2xl text-[#e8eaf0] uppercase mb-6">{c.total}</h2>
        <div className="space-y-3 mb-6">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-[#8b9ab0]">{item.name} × {item.quantity}</span>
              <span className="text-[#8b9ab0]">{item.price * item.quantity} {dict.products.uah}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#2a3347] pt-4 mb-6">
          <div className="flex justify-between items-baseline">
            <span className="text-[#8b9ab0] font-medium">{c.total}</span>
            <span className="text-[#c9a84c] font-bold text-2xl">{getCartTotal(cart)} {dict.products.uah}</span>
          </div>
        </div>
        <Link
          href={`/${lang}/checkout`}
          className="block w-full bg-[#b5622a] hover:bg-[#cc7033] text-[#e8eaf0] font-semibold py-4 text-center uppercase tracking-widest text-sm transition-colors rounded-sm"
        >
          {c.checkout}
        </Link>
        <Link
          href={`/${lang}/catalog`}
          className="block w-full text-center text-[#8b9ab0] hover:text-[#e8eaf0] text-sm mt-4 transition-colors"
        >
          ← {c.continue}
        </Link>
      </div>
    </div>
  )
}
