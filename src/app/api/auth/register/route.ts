import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { name, surname, email, phone, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } }).catch(() => null)
  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 })
  }

  const hash = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: { name, surname, email, phone, passwordHash: hash },
  })

  return NextResponse.json({ success: true })
}
