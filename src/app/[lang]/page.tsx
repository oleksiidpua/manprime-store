import Link from 'next/link'
import { getDictionary, type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/db'
import type { Product } from '@prisma/client'

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const products: Product[] = await prisma.product.findMany({
    where: { isActive: true },
    take: 3,
    orderBy: { createdAt: 'asc' },
  }).catch(() => [] as Product[])

  const nameKey = `name${lang.charAt(0).toUpperCase() + lang.slice(1)}` as 'nameUk' | 'nameRu' | 'nameEn'
  const descKey = `desc${lang.charAt(0).toUpperCase() + lang.slice(1)}` as 'descUk' | 'descRu' | 'descEn'

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-white to-orange-50 opacity-80" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block bg-accent/10 text-accent text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
              ManPrime
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground leading-tight mb-4">
              {dict.hero.title}
              <br />
              <span className="text-accent">{dict.hero.titleAccent}</span>
            </h1>
            <p className="text-muted text-lg md:text-xl max-w-lg mb-8 leading-relaxed">
              {dict.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href={`/${lang}/catalog`}
                className="bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-full transition-colors text-center shadow-lg shadow-accent/25"
              >
                {dict.hero.cta}
              </Link>
              <Link
                href={`/${lang}/about`}
                className="border-2 border-foreground/20 hover:border-accent text-foreground hover:text-accent font-semibold px-8 py-4 rounded-full transition-colors text-center"
              >
                {dict.hero.ctaSecondary}
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-accent/20 to-orange-200 flex items-center justify-center">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-accent/30 to-orange-300 flex items-center justify-center">
                <svg className="w-24 h-24 md:w-32 md:h-32 text-accent" fill="currentColor" viewBox="0 0 100 100">
                  <path d="M50 10 L60 35 L87 35 L65 55 L73 80 L50 65 L27 80 L35 55 L13 35 L40 35 Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">
            {dict.features.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { key: 'natural', icon: '🌿' },
              { key: 'certified', icon: '✅' },
              { key: 'delivery', icon: '🚚' },
              { key: 'privacy', icon: '🔒' },
            ].map(({ key, icon }) => {
              const f = dict.features[key as keyof typeof dict.features] as { title: string; desc: string }
              return (
                <div key={key} className="bg-cream rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-4">{icon}</div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">{dict.products.title}</h2>
            <p className="text-muted text-lg">{dict.products.subtitle}</p>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                  <div className="aspect-square bg-gradient-to-br from-cream to-orange-50 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product[nameKey]} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-6xl">💊</div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-heading font-bold text-xl mb-2">{product[nameKey]}</h3>
                    <p className="text-muted text-sm mb-4 flex-1 line-clamp-3">{product[descKey]}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-2xl text-accent">
                        {product.price} {dict.products.uah}
                      </span>
                      <Link
                        href={`/${lang}/product/${product.slug}`}
                        className="bg-accent hover:bg-accent-hover text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
                      >
                        {dict.products.buy_now}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'ManPrime Classic', desc: 'Базовий комплекс для підтримки потенції та чоловічого здоров\'я', price: 890 },
                { name: 'ManPrime Forte', desc: 'Посилена формула + підтримка рівня тестостерону', price: 1290 },
                { name: 'ManPrime Longevity', desc: 'Комплекс для здоров\'я та довголіття 40+', price: 1490 },
              ].map((p) => (
                <div key={p.name} className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                  <div className="aspect-square bg-gradient-to-br from-cream to-orange-50 flex items-center justify-center">
                    <div className="text-6xl">💊</div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-heading font-bold text-xl mb-2">{p.name}</h3>
                    <p className="text-muted text-sm mb-4 flex-1">{p.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-2xl text-accent">{p.price} {dict.products.uah}</span>
                      <Link
                        href={`/${lang}/catalog`}
                        className="bg-accent hover:bg-accent-hover text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
                      >
                        {dict.products.buy_now}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link
              href={`/${lang}/catalog`}
              className="border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              {dict.products.title} →
            </Link>
          </div>
        </div>
      </section>

      {/* Delivery Banner */}
      <section className="bg-foreground text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">{dict.delivery_info.title}</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">{dict.delivery_info.text}</p>
          <div className="flex justify-center gap-8 mt-8">
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">📦</span>
              <span className="text-sm text-white/60">Нова Пошта</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">✉️</span>
              <span className="text-sm text-white/60">Укрпошта</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">📍</span>
              <span className="text-sm text-white/60">По всій Україні</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
