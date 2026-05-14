const TG_API = 'https://api.telegram.org'

type SendMessageOptions = {
  text: string
  parseMode?: 'HTML' | 'MarkdownV2'
  disablePreview?: boolean
}

/**
 * Send a message to one or more Telegram chats via the ManPrime bot.
 * TELEGRAM_CHAT_ID may be a single id or comma-separated list.
 * Each chat is delivered in parallel; one failing recipient does not block others.
 * Throws only if env is missing or every recipient fails.
 */
export async function sendTelegramMessage({
  text,
  parseMode = 'HTML',
  disablePreview = true,
}: SendMessageOptions): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatIdsRaw = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatIdsRaw) {
    throw new Error('Telegram env vars not configured (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)')
  }

  const chatIds = chatIdsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if (chatIds.length === 0) {
    throw new Error('TELEGRAM_CHAT_ID parsed to empty list')
  }

  const results = await Promise.allSettled(
    chatIds.map((chatId) => sendToOne(token, chatId, text, parseMode, disablePreview))
  )

  const failures = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected')
  for (const f of failures) {
    console.error('[telegram] recipient failed:', f.reason)
  }
  if (failures.length === chatIds.length) {
    throw new Error(`Telegram delivery failed for all ${chatIds.length} recipient(s)`)
  }
}

async function sendToOne(
  token: string,
  chatId: string,
  text: string,
  parseMode: 'HTML' | 'MarkdownV2',
  disablePreview: boolean
): Promise<void> {
  const res = await fetch(`${TG_API}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: parseMode,
      disable_web_page_preview: disablePreview,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`chat_id=${chatId} status=${res.status}: ${body}`)
  }
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
