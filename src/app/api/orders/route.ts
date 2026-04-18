import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { createLiqPayUrl } from '@/lib/payments/liqpay'
import { createMonobankUrl } from '@/lib/payments/monobank'
import { createPortmoneUrl } from '@/lib/payments/portmone'
import { createNovaPoshtaShipment } from '@/lib/delivery/novaposhta'
import { createUkrPoshtaShipment } from '@/lib/delivery/ukrposhta'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, surname, email, phone, city, street, house, apartment, carrier, paymentMethod, items, totalPrice } = body

  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value ?? null

  const order = await prisma.order.create({
    data: {
      userId,
      guestName: `${name} ${surname}`,
      guestEmail: email,
      guestPhone: phone,
      deliveryCity: city,
      deliveryStreet: street,
      deliveryHouse: house,
      deliveryApt: apartment,
      totalPrice,
      paymentMethod,
      shipment: {
        create: { carrier },
      },
      items: {
        create: items.map((i: { id: string; quantity: number; price: number }) => ({
          productId: i.id,
          quantity: i.quantity,
          price: i.price,
        })),
      },
    },
  })

  let paymentUrl: string | null = null
  try {
    if (paymentMethod === 'LIQPAY') {
      paymentUrl = await createLiqPayUrl(order.id, totalPrice, email)
    } else if (paymentMethod === 'MONOBANK') {
      paymentUrl = await createMonobankUrl(order.id, totalPrice)
    } else if (paymentMethod === 'PORTMONE') {
      paymentUrl = await createPortmoneUrl(order.id, totalPrice)
    }
  } catch {
    // payment URL creation failed — order still saved
  }

  try {
    if (carrier === 'NOVAPOSHTA') {
      await createNovaPoshtaShipment(order.id, { name: `${name} ${surname}`, phone, city })
    } else {
      await createUkrPoshtaShipment(order.id, { name: `${name} ${surname}`, phone, city, street, house, apartment })
    }
  } catch {
    // shipment creation failed — order still saved
  }

  return NextResponse.json({ orderId: order.id, paymentUrl })
}

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: true } }, shipment: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(orders)
}
