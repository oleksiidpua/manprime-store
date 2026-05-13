import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// TEMPORARY diagnostic endpoint — confirms Telegram chat routing on production.
// Remove after Telegram is confirmed working.
export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    return NextResponse.json({
      ok: false,
      reason: 'env_missing',
      env: { tokenPresent: !!token, chatIdPresent: !!chatId },
    })
  }

  // 1) getMe — confirm token
  const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`)
  const me = await meRes.json()

  // 2) getChat — confirm chat_id resolves to something
  const chatRes = await fetch(
    `https://api.telegram.org/bot${token}/getChat?chat_id=${encodeURIComponent(chatId)}`
  )
  const chat = await chatRes.json()

  // 3) sendMessage — and dump full Telegram response
  const sendRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: '🛠 Diag v2 — full chat dump in response.',
    }),
  })
  const send = await sendRes.json()

  // 4) getUpdates — see if there are any pending messages we can route to
  const updatesRes = await fetch(`https://api.telegram.org/bot${token}/getUpdates?limit=5`)
  const updates = await updatesRes.json()

  return NextResponse.json({
    chatIdConfigured: chatId,
    botInfo: me,
    getChat: chat,
    sendMessage: { httpStatus: sendRes.status, body: send },
    getUpdates: updates,
  })
}
