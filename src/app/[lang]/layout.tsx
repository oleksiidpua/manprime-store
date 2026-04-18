import { locales, type Locale, getDictionary } from '@/lib/i18n'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TawkToWidget from '@/components/TawkToWidget'

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
    <html lang={locale}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header dict={dict} lang={locale} />
        <main className="flex-1">{children}</main>
        <Footer dict={dict} />
        <TawkToWidget />
      </body>
    </html>
  )
}
