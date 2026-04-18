import { NextRequest, NextResponse } from 'next/server'
import { verifyLiqPaySignature } from '@/lib/payments/liqpay'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const data = formData.get('data') as string
  const signature = formData.get('signature') as string

  if (!verifyLiqPaySignature(data, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const decoded = JSON.parse(Buffer.from(data, 'base64').toString())

  if (decoded.status === 'success' || decoded.status === 'sandbox') {
    await prisma.order.update({
      where: { id: decoded.order_id },
      data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
    })
  }

  return NextResponse.json({ ok: true })
}
