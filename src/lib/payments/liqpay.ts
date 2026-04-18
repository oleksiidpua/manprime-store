import crypto from 'crypto'

const PUBLIC_KEY = process.env.LIQPAY_PUBLIC_KEY ?? ''
const PRIVATE_KEY = process.env.LIQPAY_PRIVATE_KEY ?? ''
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://manprime.vercel.app'

export async function createLiqPayUrl(orderId: string, amount: number, email: string): Promise<string> {
  const params = {
    version: '3',
    public_key: PUBLIC_KEY,
    action: 'pay',
    amount: String(amount),
    currency: 'UAH',
    description: `ManPrime Order #${orderId}`,
    order_id: orderId,
    result_url: `${BASE_URL}/uk/account`,
    server_url: `${BASE_URL}/api/payments/liqpay/callback`,
    language: 'uk',
    sender_email: email,
  }

  const data = Buffer.from(JSON.stringify(params)).toString('base64')
  const signature = crypto
    .createHash('sha1')
    .update(PRIVATE_KEY + data + PRIVATE_KEY)
    .digest('base64')

  return `https://www.liqpay.ua/api/3/checkout?data=${data}&signature=${signature}`
}

export function verifyLiqPaySignature(data: string, signature: string): boolean {
  const expected = crypto
    .createHash('sha1')
    .update(PRIVATE_KEY + data + PRIVATE_KEY)
    .digest('base64')
  return expected === signature
}
