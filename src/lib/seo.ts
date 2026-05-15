import type { Metadata } from 'next'
import type { Locale } from './i18n'

export const SITE_URL = 'https://manprime-store.vercel.app'

const LOCALES: Locale[] = ['uk', 'ru', 'en']

const OG_LOCALE: Record<Locale, string> = {
  uk: 'uk_UA',
  ru: 'ru_RU',
  en: 'en_US',
}

const HREFLANG: Record<Locale, string> = {
  uk: 'uk-UA',
  ru: 'ru-UA',
  en: 'en',
}

interface PageMetadataInput {
  lang: Locale
  path: string
  title: string
  description: string
  ogImage?: string
  noIndex?: boolean
}

export function pageMetadata({
  lang,
  path,
  title,
  description,
  ogImage,
  noIndex,
}: PageMetadataInput): Metadata {
  const canonical = `${SITE_URL}/${lang}${path}`
  const languages: Record<string, string> = {}
  for (const l of LOCALES) {
    languages[HREFLANG[l]] = `${SITE_URL}/${l}${path}`
  }
  languages['x-default'] = `${SITE_URL}/uk${path}`

  return {
    title,
    description,
    alternates: { canonical, languages },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      locale: OG_LOCALE[lang],
      siteName: 'ManPrime',
      type: 'website',
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  }
}
