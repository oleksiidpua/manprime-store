import type { Metadata } from 'next'
import { getDictionary, type Locale } from '@/lib/i18n'
import AuthClient from '@/components/AuthClient'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
  const { lang } = await params
  return pageMetadata({ lang, path: '/auth', title: 'Sign in', description: '', noIndex: true })
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <AuthClient dict={dict} lang={lang} />
    </div>
  )
}
