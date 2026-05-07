const TG_API = 'https://api.telegram.org'

type SendMessageOptions = {
  text: string
  parseMode?: 'HTML' | 'MarkdownV2'
  disablePreview?: boolean
}

/**
 * Send a message to the configured Telegram chat via the ManPrime bot.
 * Reads TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID from env.
 * Throws if env vars missing or Telegram API rejects the request.
 */
export async function sendTelegramMessage({
  text,
  parseMode = 'HTML',
  disablePreview = true,
}: SendMessageOptions): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    throw new Error('Telegram env vars not configured (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)')
  }

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
    throw new Error(`Telegram sendMessage failed (${res.status}): ${body}`)
  }
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
