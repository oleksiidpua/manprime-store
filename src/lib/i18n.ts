export const locales = ['uk', 'ru', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'uk'

export async function getDictionary(locale: Locale) {
  const dict = await import(`@/dictionaries/${locale}.json`)
  return dict.default as typeof import('@/dictionaries/uk.json')
}
