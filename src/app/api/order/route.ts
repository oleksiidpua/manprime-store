import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendTelegramMessage, escapeHtml } from '@/lib/telegram'

export const runtime = 'nodejs'

type OrderBody = {
  productId?: string
  productSlug?: string
  productName?: string
  quantity?: number
  unitPrice?: number
  name?: string
  phone?: string
  city?: string
  note?: string
}

export async function POST(req: Request) {
  let body: OrderBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const productId = body.productId?.trim() ?? ''
  const productSlug = body.productSlug?.trim() ?? ''
  const productName = body.productName?.trim() ?? ''
  const quantity = Math.max(1, Math.min(99, Number(body.quantity) || 1))
  const unitPrice = Math.max(0, Number(body.unitPrice) || 0)
  const name = body.name?.trim() ?? ''
  const phone = body.phone?.trim() ?? ''
  const city = body.city?.trim() || null
  const note = body.note?.trim() || null

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ ok: false, error: 'invalid_name' }, { status: 400 })
  }
  const phoneDigits = phone.replace(/\D/g, '')
  if (phoneDigits.length < 9 || phoneDigits.length > 15) {
    return NextResponse.json({ ok: false, error: 'invalid_phone' }, { status: 400 })
  }
  if (!productSlug) {
    return NextResponse.json({ ok: false, error: 'missing_product' }, { status: 400 })
  }

  const totalPrice = unitPrice * quantity

  // Only attach OrderItem if the product actually exists in DB (fallback
  // catalog products have non-DB ids and would trip the FK constraint)
  let productExists = false
  if (productId) {
    productExists = !!(await prisma.product
      .findUnique({ where: { id: productId }, select: { id: true } })
      .catch(() => null))
  }

  const order = await prisma.order.create({
    data: {
      guestName: name,
      guestPhone: phone,
      status: 'PENDING',
      totalPrice,
      paymentMethod: 'CALL',
      paymentStatus: 'UNPAID',
      deliveryCity: city,
      items: productExists
        ? {
            create: [
              {
                productId,
                quantity,
                price: unitPrice,
              },
            ],
          }
        : undefined,
    },
  })

  const lines = [
    '<b>🛒 Нове замовлення з ManPrime</b>',
    '',
    `<b>Товар:</b> ${escapeHtml(productName || productSlug)} × ${quantity}`,
    `<b>Сума:</b> ${totalPrice} грн`,
    '',
    `<b>Імʼя:</b> ${escapeHtml(name)}`,
    `<b>Телефон:</b> ${escapeHtml(phone)}`,
  ]
  if (city) lines.push(`<b>Місто:</b> ${escapeHtml(city)}`)
  if (note) lines.push(`<b>Коментар:</b> ${escapeHtml(note)}`)
  lines.push('', `<i>Order ID:</i> <code>${order.id}</code>`)

  try {
    await sendTelegramMessage({ text: lines.join('\n') })
  } catch (err) {
    console.error('[order] telegram send failed', err)
  }

  return NextResponse.json({ ok: true, id: order.id })
}
