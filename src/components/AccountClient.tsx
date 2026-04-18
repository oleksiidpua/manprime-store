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

export default function AccountClient({ dict, lang }: { dict: Dict; lang: Locale }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const a = dict.account

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data)
      })
      .finally(() => setLoading(false))
  }, [])

  const nameKey = `name${lang.charAt(0).toUpperCase() + lang.slice(1)}` as 'nameUk' | 'nameRu' | 'nameEn'
  const statusLabel = dict.order_status

  const carrierLink = (shipment: Shipment) => {
    if (!shipment.ttn) return null
    if (shipment.carrier === 'NOVAPOSHTA') {
      return `https://novaposhta.ua/tracking/?cargo_number=${shipment.ttn}`
    }
    return `https://track.ukrposhta.ua/tracking_UA.html?barcode=${shipment.ttn}`
  }

  return (
    <div>
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8">{a.title}</h1>

      {loading ? (
        <div className="text-center py-20 text-muted">...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-muted text-xl">{a.no_orders}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="font-heading text-xl font-semibold">{a.orders}</h2>
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-semibold">
                    {a.order_num}{order.id.slice(0, 8).toUpperCase()}
                  </h3>
                  <p className="text-sm text-muted">
                    {a.date}: {new Date(order.createdAt).toLocaleDateString(lang === 'en' ? 'en-GB' : `${lang}-UA`)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {statusLabel[order.status as keyof typeof statusLabel] ?? order.status}
                  </span>
                  <span className="font-bold text-accent">{order.totalPrice} {dict.products.uah}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted">{item.product[nameKey]} × {item.quantity}</span>
                    <span>{item.price * item.quantity} {dict.products.uah}</span>
                  </div>
                ))}
              </div>

              {order.shipment?.ttn && (
                <div className="border-t border-border pt-4 mt-4">
                  <p className="text-sm font-medium mb-1">{a.tracking}:</p>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm bg-cream px-3 py-1 rounded-lg">{order.shipment.ttn}</span>
                    <a
                      href={carrierLink(order.shipment) ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent text-sm hover:underline"
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
  )
}
