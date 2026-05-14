import { NextResponse } from 'next/server'
import { sendTelegramMessage, escapeHtml } from '@/lib/telegram'

export const runtime = 'nodejs'

type ContactBody = {
  name?: string
  email?: string
  message?: string
}

export async function POST(req: Request) {
  let body: ContactBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const name = body.name?.trim() ?? ''
  const email = body.email?.trim() ?? ''
  const message = body.message?.trim() ?? ''

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ ok: false, error: 'invalid_name' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 })
  }
  if (message.length < 5 || message.length > 2000) {
    return NextResponse.json({ ok: false, error: 'invalid_message' }, { status: 400 })
  }

  const lines = [
    '<b>✉️ Нове повідомлення з форми контактів</b>',
    '',
    `<b>Імʼя:</b> ${escapeHtml(name)}`,
    `<b>Email:</b> ${escapeHtml(email)}`,
    '',
    `<b>Повідомлення:</b>`,
    escapeHtml(message),
  ]

  try {
    await sendTelegramMessage({ text: lines.join('\n') })
  } catch (err) {
    console.error('[contact] telegram send failed', err)
    return NextResponse.json({ ok: false, error: 'delivery_failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
