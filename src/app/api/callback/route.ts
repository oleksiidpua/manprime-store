import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendTelegramMessage, escapeHtml } from '@/lib/telegram'

export const runtime = 'nodejs'

type CallbackBody = {
  name?: string
  phone?: string
  preferred?: string
  note?: string
}

export async function POST(req: Request) {
  let body: CallbackBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const name = body.name?.trim() ?? ''
  const phone = body.phone?.trim() ?? ''
  const preferred = body.preferred?.trim() || null
  const note = body.note?.trim() || null

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ ok: false, error: 'invalid_name' }, { status: 400 })
  }

  const phoneDigits = phone.replace(/\D/g, '')
  if (phoneDigits.length < 9 || phoneDigits.length > 15) {
    return NextResponse.json({ ok: false, error: 'invalid_phone' }, { status: 400 })
  }

  const saved = await prisma.callbackRequest.create({
    data: { name, phone, preferred, note },
  })

  const lines = [
    '<b>📞 Нова заявка з ManPrime</b>',
    '',
    `<b>Імʼя:</b> ${escapeHtml(name)}`,
    `<b>Телефон:</b> ${escapeHtml(phone)}`,
  ]
  if (preferred) lines.push(`<b>Коли зручно:</b> ${escapeHtml(preferred)}`)
  if (note) lines.push(`<b>Коментар:</b> ${escapeHtml(note)}`)
  lines.push('', `<i>ID:</i> <code>${saved.id}</code>`)

  try {
    await sendTelegramMessage({ text: lines.join('\n') })
  } catch (err) {
    console.error('[callback] telegram send failed', err)
  }

  return NextResponse.json({ ok: true, id: saved.id })
}
