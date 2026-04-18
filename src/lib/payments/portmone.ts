const PORTMONE_LOGIN = process.env.PORTMONE_LOGIN ?? ''
const PORTMONE_PASSWORD = process.env.PORTMONE_PASSWORD ?? ''
const PORTMONE_PAYEE_ID = process.env.PORTMONE_PAYEE_ID ?? ''
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://manprime.vercel.app'

export async function createPortmoneUrl(orderId: string, amount: number): Promise<string> {
  const body = {
    payee_id: PORTMONE_PAYEE_ID,
    shop_order_number: orderId,
    bill_amount: String(amount),
    success_url: `${BASE_URL}/uk/account`,
    failure_url: `${BASE_URL}/uk/checkout`,
    lang: 'uk',
  }

  const params = new URLSearchParams(body as Record<string, string>)
  return `https://www.portmone.com.ua/r3/api/gateway/?${params.toString()}`
}
