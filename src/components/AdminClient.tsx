'use client'

import { useState } from 'react'
import type { Product, Order, OrderItem, Shipment } from '@prisma/client'

type OrderWithRelations = Order & {
  items: (OrderItem & { product: Product })[]
  shipment: Shipment | null
}

export default function AdminClient({
  products,
  orders,
}: {
  products: Product[]
  orders: OrderWithRelations[]
}) {
  const [tab, setTab] = useState<'orders' | 'products'>('orders')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    const form = new FormData(e.currentTarget)
    const data = {
      id: editingProduct?.id,
      slug: form.get('slug'),
      nameUk: form.get('nameUk'),
      nameRu: form.get('nameRu'),
      nameEn: form.get('nameEn'),
      descUk: form.get('descUk'),
      descRu: form.get('descRu'),
      descEn: form.get('descEn'),
      compUk: form.get('compUk'),
      compRu: form.get('compRu'),
      compEn: form.get('compEn'),
      price: Number(form.get('price')),
      stock: Number(form.get('stock')),
      imageUrl: form.get('imageUrl') || null,
      isActive: form.get('isActive') === 'on',
    }
    await fetch('/api/admin/products', {
      method: editingProduct?.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSaving(false)
    setEditingProduct(null)
    window.location.reload()
  }

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400'
  const labelClass = 'block text-xs font-medium text-gray-500 mb-1'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-orange-500 font-bold text-xl">Man</span>
          <span className="font-bold text-xl">Prime</span>
          <span className="text-gray-400 text-sm ml-3">Admin</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab('orders')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tab === 'orders' ? 'bg-orange-500 text-white' : 'hover:bg-gray-100'}`}
          >
            Замовлення ({orders.length})
          </button>
          <button
            onClick={() => setTab('products')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tab === 'products' ? 'bg-orange-500 text-white' : 'hover:bg-gray-100'}`}
          >
            Товари ({products.length})
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {tab === 'orders' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Замовлення</h2>
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex flex-wrap gap-4 items-start justify-between">
                  <div>
                    <p className="font-semibold">#{order.id.slice(0, 8).toUpperCase()} — {order.guestName}</p>
                    <p className="text-sm text-gray-500">{order.guestEmail} | {order.guestPhone}</p>
                    <p className="text-sm text-gray-500">{order.deliveryCity}, {order.deliveryStreet} {order.deliveryHouse}</p>
                    <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleString('uk-UA')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-500">{order.totalPrice} грн</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {order.paymentStatus}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{order.paymentMethod}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 text-sm space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-gray-600">{item.product.nameUk} × {item.quantity}</span>
                      <span>{item.price * item.quantity} грн</span>
                    </div>
                  ))}
                </div>
                {order.shipment && (
                  <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
                    {order.shipment.carrier} | TTN: {order.shipment.ttn ?? '—'} | {order.shipment.status}
                  </div>
                )}
                <div className="mt-3 flex gap-2">
                  <select
                    defaultValue={order.status}
                    onChange={async (e) => {
                      await fetch(`/api/admin/orders/${order.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: e.target.value }),
                      })
                    }}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1"
                  >
                    {['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Товари</h2>
              <button
                onClick={() => setEditingProduct({} as Product)}
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
              >
                + Додати товар
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{p.nameUk}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.isActive ? 'Активний' : 'Прихований'}
                    </span>
                  </div>
                  <p className="text-orange-500 font-bold mb-3">{p.price} грн</p>
                  <p className="text-sm text-gray-500 mb-3">На складі: {p.stock}</p>
                  <button
                    onClick={() => setEditingProduct(p)}
                    className="w-full border border-orange-300 text-orange-500 hover:bg-orange-50 text-sm py-2 rounded-lg transition-colors"
                  >
                    Редагувати
                  </button>
                </div>
              ))}
            </div>

            {editingProduct !== null && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between mb-6">
                    <h3 className="font-bold text-lg">{editingProduct.id ? 'Редагувати товар' : 'Новий товар'}</h3>
                    <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Slug (URL)</label>
                        <input name="slug" defaultValue={editingProduct.slug} required className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Ціна (грн)</label>
                        <input name="price" type="number" defaultValue={editingProduct.price} required className={inputClass} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div><label className={labelClass}>Назва UA</label><input name="nameUk" defaultValue={editingProduct.nameUk} required className={inputClass} /></div>
                      <div><label className={labelClass}>Назва RU</label><input name="nameRu" defaultValue={editingProduct.nameRu} required className={inputClass} /></div>
                      <div><label className={labelClass}>Назва EN</label><input name="nameEn" defaultValue={editingProduct.nameEn} required className={inputClass} /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div><label className={labelClass}>Опис UA</label><textarea name="descUk" defaultValue={editingProduct.descUk} rows={3} className={inputClass} /></div>
                      <div><label className={labelClass}>Опис RU</label><textarea name="descRu" defaultValue={editingProduct.descRu} rows={3} className={inputClass} /></div>
                      <div><label className={labelClass}>Опис EN</label><textarea name="descEn" defaultValue={editingProduct.descEn} rows={3} className={inputClass} /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div><label className={labelClass}>Склад UA</label><textarea name="compUk" defaultValue={editingProduct.compUk} rows={2} className={inputClass} /></div>
                      <div><label className={labelClass}>Склад RU</label><textarea name="compRu" defaultValue={editingProduct.compRu} rows={2} className={inputClass} /></div>
                      <div><label className={labelClass}>Склад EN</label><textarea name="compEn" defaultValue={editingProduct.compEn} rows={2} className={inputClass} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={labelClass}>Залишок на складі</label><input name="stock" type="number" defaultValue={editingProduct.stock} className={inputClass} /></div>
                      <div><label className={labelClass}>URL фото</label><input name="imageUrl" defaultValue={editingProduct.imageUrl ?? ''} className={inputClass} /></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" name="isActive" defaultChecked={editingProduct.isActive ?? true} id="isActive" className="w-4 h-4 accent-orange-500" />
                      <label htmlFor="isActive" className="text-sm">Активний (показувати на сайті)</label>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button type="submit" disabled={saving} className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium py-3 rounded-full transition-colors">
                        {saving ? '...' : 'Зберегти'}
                      </button>
                      <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 border border-gray-200 hover:bg-gray-50 py-3 rounded-full transition-colors text-sm">
                        Скасувати
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
