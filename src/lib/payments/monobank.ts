const MONO_TOKEN = process.env.MONOBANK_TOKEN ?? ''
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://manprime.vercel.app'

export async function createMonobankUrl(orderId: string, amount: number): Promise<string> {
  const res = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
    method: 'POST',
    headers: {
      'X-Token': MONO_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amount * 100,
      ccy: 980,
      merchantPaymInfo: {
        reference: orderId,
        destination: `ManPrime Order #${orderId}`,
      },
      redirectUrl: `${BASE_URL}/uk/account`,
      webHookUrl: `${BASE_URL}/api/payments/monobank/callback`,
      validity: 3600,
    }),
  })

  if (!res.ok) throw new Error('Monobank invoice creation failed')
  const json = await res.json()
  return json.pageUrl
}
