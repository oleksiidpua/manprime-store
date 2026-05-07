import { locales, type Locale, getDictionary } from '@/lib/i18n'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingCallButton from '@/components/FloatingCallButton'

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  const locale = (locales.includes(lang as Locale) ? lang : 'uk') as Locale
  const dict = await getDictionary(locale)

  return (
    <>
      <Header dict={dict} lang={locale} />
      <main className="flex-1">{children}</main>
      <Footer dict={dict} lang={locale} />
      <FloatingCallButton lang={locale} />
    </>
  )
}
