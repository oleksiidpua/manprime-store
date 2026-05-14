import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendTelegramMessage, escapeHtml } from '@/lib/telegram'

export const runtime = 'nodejs'

type ReviewBody = {
  authorName?: string
  rating?: number
  text?: string
  city?: string
}

export async function GET() {
  const reviews = await prisma.review
    .findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      take: 30,
      select: {
        id: true,
        authorName: true,
        rating: true,
        text: true,
        city: true,
        createdAt: true,
      },
    })
    .catch(() => [])

  const total = reviews.length
  const avg =
    total === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / total

  return NextResponse.json(
    {
      ok: true,
      total,
      averageRating: Number(avg.toFixed(2)),
      reviews,
    },
    {
      headers: {
        'cache-control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  )
}

export async function POST(req: Request) {
  let body: ReviewBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const authorName = body.authorName?.trim() ?? ''
  const rating = Number(body.rating)
  const text = body.text?.trim() ?? ''
  const city = body.city?.trim() || null

  if (authorName.length < 2 || authorName.length > 80) {
    return NextResponse.json({ ok: false, error: 'invalid_name' }, { status: 400 })
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ ok: false, error: 'invalid_rating' }, { status: 400 })
  }
  if (text.length < 20 || text.length > 2000) {
    return NextResponse.json({ ok: false, error: 'invalid_text' }, { status: 400 })
  }

  const saved = await prisma.review.create({
    data: { authorName, rating, text, city },
  })

  const lines = [
    '<b>⭐ Новий відгук на ManPrime</b>',
    '',
    `<b>Імʼя:</b> ${escapeHtml(authorName)}`,
    `<b>Оцінка:</b> ${'⭐'.repeat(rating)} (${rating}/5)`,
  ]
  if (city) lines.push(`<b>Місто:</b> ${escapeHtml(city)}`)
  lines.push('', `<b>Текст:</b>`, escapeHtml(text))
  lines.push('', '<i>Очікує модерації в /admin/reviews</i>', `<code>${saved.id}</code>`)

  try {
    await sendTelegramMessage({ text: lines.join('\n') })
  } catch (err) {
    console.error('[reviews] telegram send failed', err)
  }

  return NextResponse.json({ ok: true, id: saved.id })
}
