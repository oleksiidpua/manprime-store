import Link from 'next/link'
import { getDictionary, type Locale } from '@/lib/i18n'
import CartClient from '@/components/CartClient'

export default async function CartPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8">{dict.cart.title}</h1>
      <CartClient dict={dict} lang={lang} />
    </div>
  )
}
