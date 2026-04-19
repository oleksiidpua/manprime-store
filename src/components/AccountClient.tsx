'use client'

import { useState, useEffect } from 'react'
import type ukDict from '@/dictionaries/uk.json'
import type { Locale } from '@/lib/i18n'

type Dict = typeof ukDict

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  product: { nameUk: string; nameRu: string; nameEn: string }
}

interface Shipment {
  carrier: string
  ttn: string | null
  status: string
}

interface Order {
  id: string
  status: string
  totalPrice: number
  paymentStatus: string
  createdAt: string
  items: OrderItem[]
  shipment: Shipment | null
}

const STATUS_COLORS: Record<string, string> = {
  DELIVERED: 'text-[#3A7A3A] border-[#3A7A3A]/30 bg-[#3A7A3A]/10',
  SHIPPED: 'text-[#C9A84C] border-[#C9A84C]/30 bg-[#C9A84C]/10',
  CANCELLED: 'text-red-600 border-red-600/30 bg-red-600/10',
  PENDING: 'text-[#9CA3AF] border-[#9CA3AF]/30 bg-[#9CA3AF]/10',
  CONFIRMED: 'text-[#C9A84C] border-[#C9A84C]/30 bg-[#C9A84C]/10',
}

export default function AccountClient({ dict, lang }: { dict: Dict; lang: Locale }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const a = dict.account

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setOrders(data) })
      .finally(() => setLoading(false))
  }, [])

  const nameKey = `name${lang.charAt(0).toUpperCase() + lang.slice(1)}` as 'nameUk' | 'nameRu' | 'nameEn'
  const statusLabel = dict.order_status

  const carrierLink = (shipment: Shipment) => {
    if (!shipment.ttn) return null
    return shipment.carrier === 'NOVAPOSHTA'
      ? `https://novaposhta.ua/tracking/?cargo_number=${shipment.ttn}`
      : `https://track.ukrposhta.ua/tracking_UA.html?barcode=${shipment.ttn}`
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-heading font-black text-3xl md:text-4xl text-white uppercase tracking-tight mb-10">{a.title}</h1>

        {loading ? (
          <div className="text-center py-20 text-[#333]">...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-6">📦</div>
            <p className="text-[#555] text-xl">{a.no_orders}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-[#111111] border border-[#1E1E1E] p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                  <div>
                    <h3 className="font-heading font-bold text-white">
                      {a.order_num}{order.id.slice(0, 8).toUpperCase()}
                    </h3>
                    <p className="text-[#444] text-sm mt-0.5">
                      {a.date}: {new Date(order.createdAt).toLocaleDateString(lang === 'en' ? 'en-GB' : `${lang}-UA`)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold px-3 py-1 border uppercase tracking-widest ${STATUS_COLORS[order.status] ?? STATUS_COLORS.PENDING}`}>
                      {statusLabel[order.status as keyof typeof statusLabel] ?? order.status}
                    </span>
                    <span className="text-[#C9A84C] font-black text-lg">{order.totalPrice} {dict.products.uah}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-[#555]">{item.product[nameKey]} × {item.quantity}</span>
                      <span className="text-[#9CA3AF]">{item.price * item.quantity} {dict.products.uah}</span>
                    </div>
                  ))}
                </div>

                {order.shipment?.ttn && (
                  <div className="border-t border-[#1E1E1E] pt-4 mt-4">
                    <p className="text-[#555] text-xs uppercase tracking-widest mb-2">{a.tracking}:</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-sm bg-[#0A0A0A] border border-[#2A2A2A] text-[#9CA3AF] px-3 py-1">
                        {order.shipment.ttn}
                      </span>
                      <a
                        href={carrierLink(order.shipment) ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#C9A84C] text-sm hover:text-[#E0BB5F] transition-colors"
                      >
                        {lang === 'uk' ? 'Відстежити →' : lang === 'ru' ? 'Отследить →' : 'Track →'}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
