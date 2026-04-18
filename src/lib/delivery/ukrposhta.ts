const UP_TOKEN = process.env.UKRPOSHTA_TOKEN ?? ''
const UP_COUNTERPART_UUID = process.env.UKRPOSHTA_COUNTERPART_UUID ?? ''
const UP_ADDRESS_ID = process.env.UKRPOSHTA_ADDRESS_ID ?? ''

import { prisma } from '@/lib/db'

export async function createUkrPoshtaShipment(
  orderId: string,
  recipient: { name: string; phone: string; city: string; street: string; house: string; apartment?: string }
) {
  if (!UP_TOKEN) return

  const [firstName, ...rest] = recipient.name.split(' ')
  const lastName = rest.join(' ') || firstName

  const res = await fetch('https://www.ukrposhta.ua/ecom/0.0.1/shipments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { uuid: UP_COUNTERPART_UUID, addressId: UP_ADDRESS_ID },
      recipient: {
        firstName,
        lastName,
        phoneNumber: recipient.phone,
        country: 'UA',
        postcode: '',
        city: recipient.city,
        street: recipient.street,
        houseNumber: recipient.house,
        apartmentNumber: recipient.apartment ?? '',
        addressId: null,
      },
      type: 'EXPRESS',
      deliveryType: 'D2D',
      weight: 500,
      length: 20,
      description: `ManPrime Order #${orderId}`,
      postPay: 0,
    }),
  })

  if (!res.ok) return
  const json = await res.json()
  const ttn = json?.barcode ?? json?.uuid

  if (ttn) {
    await prisma.shipment.update({
      where: { orderId },
      data: { ttn: String(ttn), status: 'created' },
    })
  }
}

export async function trackUkrPoshtaShipment(barcode: string) {
  const res = await fetch(`https://www.ukrposhta.ua/status-tracking/0.0.1/statuses/last?barCode=${barcode}`, {
    headers: { Authorization: `Bearer ${UP_TOKEN}` },
  })
  return res.json()
}
