import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

async function isAdmin() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (!userId) return false
  const user = await prisma.user.findUnique({ where: { id: userId } }).catch(() => null)
  return user?.role === 'ADMIN'
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  const data = await req.json()
  const order = await prisma.order.update({ where: { id }, data })
  return NextResponse.json(order)
}
