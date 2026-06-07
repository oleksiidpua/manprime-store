import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Keep-alive ping endpoint for UptimeRobot to prevent Supabase auto-pause.
// Touches the database on every request so the connection counts as activity.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const startedAt = Date.now()
  let dbOk = false
  let productCount = 0

  try {
    productCount = await prisma.product.count()
    dbOk = true
  } catch (err) {
    console.error('[health] db query failed', err)
  }

  const tookMs = Date.now() - startedAt

  return NextResponse.json(
    {
      ok: dbOk,
      db: dbOk ? 'up' : 'down',
      productCount,
      tookMs,
      ts: new Date().toISOString(),
    },
    {
      status: dbOk ? 200 : 503,
      headers: {
        'cache-control': 'no-store, no-cache, must-revalidate',
        'pragma': 'no-cache',
      },
    }
  )
}
