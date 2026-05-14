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

const VALID_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const
type Status = (typeof VALID_STATUSES)[number]

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  const { status } = (await req.json()) as { status?: Status }
  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'invalid_status' }, { status: 400 })
  }
  const review = await prisma.review.update({ where: { id }, data: { status } })
  return NextResponse.json(review)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  await prisma.review.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
