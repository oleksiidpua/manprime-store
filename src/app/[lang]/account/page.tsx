import { getDictionary, type Locale } from '@/lib/i18n'
import AccountClient from '@/components/AccountClient'

export default async function AccountPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <AccountClient dict={dict} lang={lang} />
    </div>
  )
}
