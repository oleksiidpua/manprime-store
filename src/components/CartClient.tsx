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

  useEffect(() => {
    setCart(getCart())
  }, [])

  const handleRemove = (id: string) => setCart(removeFromCart(id))
  const handleQty = (id: string, qty: number) => setCart(updateQuantity(id, qty))

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-muted text-xl mb-8">{c.empty}</p>
        <Link
          href={`/${lang}/catalog`}
          className="bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-3 rounded-full transition-colors"
        >
          {c.continue}
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-5 flex gap-4 items-center shadow-sm">
            <div className="w-20 h-20 bg-cream rounded-xl flex items-center justify-center shrink-0">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="text-3xl">💊</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-lg">{item.name}</h3>
              <p className="text-accent font-bold">{item.price} {dict.products.uah}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQty(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full border border-border hover:border-accent hover:text-accent transition-colors flex items-center justify-center"
              >−</button>
              <span className="w-6 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => handleQty(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full border border-border hover:border-accent hover:text-accent transition-colors flex items-center justify-center"
              >+</button>
            </div>
            <button
              onClick={() => handleRemove(item.id)}
              className="ml-2 text-muted hover:text-red-500 transition-colors"
              aria-label={c.remove}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm h-fit sticky top-24">
        <h2 className="font-heading font-bold text-xl mb-6">{c.total}</h2>
        <div className="space-y-3 mb-6">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-muted">{item.name} × {item.quantity}</span>
              <span className="font-medium">{item.price * item.quantity} {dict.products.uah}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-4 mb-6">
          <div className="flex justify-between font-bold text-lg">
            <span>{c.total}</span>
            <span className="text-accent">{getCartTotal(cart)} {dict.products.uah}</span>
          </div>
        </div>
        <Link
          href={`/${lang}/checkout`}
          className="block w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-full text-center transition-colors"
        >
          {c.checkout}
        </Link>
        <Link
          href={`/${lang}/catalog`}
          className="block w-full text-center text-muted hover:text-foreground text-sm mt-4 transition-colors"
        >
          ← {c.continue}
        </Link>
      </div>
    </div>
  )
}
