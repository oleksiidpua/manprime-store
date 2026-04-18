import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (body.status === 'success') {
    const orderId = body.reference
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
    })
  }

  return NextResponse.json({ ok: true })
}
