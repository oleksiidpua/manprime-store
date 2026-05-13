import { NextResponse } from 'next/server'
import { sendTelegramMessage } from '@/lib/telegram'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// TEMPORARY diagnostic endpoint — confirms Telegram path on production.
// Remove after Telegram is confirmed working.
export async function GET() {
  const tokenPresent = !!process.env.TELEGRAM_BOT_TOKEN
  const chatIdPresent = !!process.env.TELEGRAM_CHAT_ID
  const tokenPreview = process.env.TELEGRAM_BOT_TOKEN
    ? `${process.env.TELEGRAM_BOT_TOKEN.slice(0, 4)}…${process.env.TELEGRAM_BOT_TOKEN.slice(-4)} (len=${process.env.TELEGRAM_BOT_TOKEN.length})`
    : null
  const chatIdPreview = process.env.TELEGRAM_CHAT_ID
    ? `${process.env.TELEGRAM_CHAT_ID.slice(0, 3)}…${process.env.TELEGRAM_CHAT_ID.slice(-3)}`
    : null

  let sendResult: { ok: boolean; error?: string } = { ok: false }
  try {
    await sendTelegramMessage({
      text: '🛠 <b>Diag</b> from prod /api/diag/telegram — if you see this, env + bot + chat are all correct.',
    })
    sendResult = { ok: true }
  } catch (err) {
    sendResult = { ok: false, error: err instanceof Error ? err.message : String(err) }
  }

  return NextResponse.json({
    env: {
      TELEGRAM_BOT_TOKEN: { present: tokenPresent, preview: tokenPreview },
      TELEGRAM_CHAT_ID: { present: chatIdPresent, preview: chatIdPreview },
    },
    send: sendResult,
  })
}
