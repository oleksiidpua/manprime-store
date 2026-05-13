import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

const SITE_URL = 'https://manprime-store.vercel.app'
const LOCALES = ['uk', 'ru', 'en'] as const
const STATIC_ROUTES = ['', '/about', '/contacts', '/product/forte'] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = []
  for (const route of STATIC_ROUTES) {
    for (const locale of LOCALES) {
      staticEntries.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: now,
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${SITE_URL}/${l}${route}`])
          ),
        },
      })
    }
  }

  const products = await prisma.product
    .findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } })
    .catch(() => [] as { slug: string; updatedAt: Date }[])

  const productEntries: MetadataRoute.Sitemap = products.flatMap((p) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}/product/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${SITE_URL}/${l}/product/${p.slug}`])
        ),
      },
    }))
  )

  return [...staticEntries, ...productEntries]
}
