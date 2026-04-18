import { getDictionary, type Locale } from '@/lib/i18n'
import CheckoutClient from '@/components/CheckoutClient'

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-10">{dict.checkout.title}</h1>
      <CheckoutClient dict={dict} lang={lang} />
    </div>
  )
}
