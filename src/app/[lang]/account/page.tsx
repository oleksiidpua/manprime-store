import type { Metadata } from 'next'
import { getDictionary, type Locale } from '@/lib/i18n'
import AccountClient from '@/components/AccountClient'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
  const { lang } = await params
  return pageMetadata({ lang, path: '/account', title: 'Account', description: '', noIndex: true })
}

export default async function AccountPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <AccountClient dict={dict} lang={lang} />
    </div>
  )
}
