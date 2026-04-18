const NP_API_KEY = process.env.NOVAPOSHTA_API_KEY ?? ''
const NP_SENDER_REF = process.env.NOVAPOSHTA_SENDER_REF ?? ''
const NP_CONTACT_SENDER = process.env.NOVAPOSHTA_CONTACT_SENDER ?? ''
const NP_SENDER_PHONE = process.env.NOVAPOSHTA_SENDER_PHONE ?? ''

import { prisma } from '@/lib/db'

async function npRequest(model: string, method: string, properties: Record<string, unknown>) {
  const res = await fetch('https://api.novaposhta.ua/v2.0/json/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: NP_API_KEY, modelName: model, calledMethod: method, methodProperties: properties }),
  })
  return res.json()
}

export async function createNovaPoshtaShipment(
  orderId: string,
  recipient: { name: string; phone: string; city: string }
) {
  if (!NP_API_KEY) return

  const cityData = await npRequest('Address', 'getCities', { FindByString: recipient.city })
  const cityRef = cityData?.data?.[0]?.Ref
  if (!cityRef) return

  const warehouseData = await npRequest('AddressGeneral', 'getWarehouses', { CityRef: cityRef })
  const warehouseRef = warehouseData?.data?.[0]?.Ref
  if (!warehouseRef) return

  const [firstName, ...rest] = recipient.name.split(' ')
  const lastName = rest.join(' ') || firstName

  const result = await npRequest('InternetDocument', 'save', {
    PayerType: 'Recipient',
    PaymentMethod: 'Cash',
    DateTime: new Date().toLocaleDateString('uk-UA'),
    CargoType: 'Parcel',
    Weight: '0.5',
    ServiceType: 'WarehouseWarehouse',
    SeatsAmount: '1',
    Description: `ManPrime Order #${orderId}`,
    Cost: '1',
    CitySender: process.env.NOVAPOSHTA_CITY_SENDER ?? '',
    Sender: NP_SENDER_REF,
    SenderAddress: process.env.NOVAPOSHTA_SENDER_ADDRESS ?? '',
    ContactSender: NP_CONTACT_SENDER,
    SendersPhone: NP_SENDER_PHONE,
    CityRecipient: cityRef,
    RecipientAddress: warehouseRef,
    RecipientsPhone: recipient.phone,
    FirstName: firstName,
    LastName: lastName,
    MiddleName: '',
  })

  const ttn = result?.data?.[0]?.IntDocNumber
  if (ttn) {
    await prisma.shipment.update({
      where: { orderId },
      data: { ttn, status: 'created' },
    })
  }
}

export async function trackNovaPoshtaShipment(ttn: string) {
  const result = await npRequest('TrackingDocument', 'getStatusDocuments', {
    Documents: [{ DocumentNumber: ttn, Phone: '' }],
  })
  return result?.data?.[0]
}
