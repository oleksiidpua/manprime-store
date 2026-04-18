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

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const data = await req.json()
  const product = await prisma.product.create({ data })
  return NextResponse.json(product)
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id, ...data } = await req.json()
  const product = await prisma.product.update({ where: { id }, data })
  return NextResponse.json(product)
}
