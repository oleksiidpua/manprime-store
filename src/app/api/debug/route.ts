import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL
  const hasUrl = !!dbUrl
  const urlStart = dbUrl ? dbUrl.substring(0, 30) + '...' : 'EMPTY'

  let dbConnected = false
  let userCount = -1
  let dbError = ''

  try {
    userCount = await prisma.user.count()
    dbConnected = true
  } catch (e) {
    dbError = e instanceof Error ? e.message : String(e)
  }

  return NextResponse.json({ hasUrl, urlStart, dbConnected, userCount, dbError })
}
