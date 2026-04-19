import Link from 'next/link'
import Image from 'next/image'
import { getDictionary, type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/db'
import type { Product } from '@prisma/client'

const OLD_PRICES: Record<string, number> = { classic: 1200, forte: 1700, longevity: 2000 }
const BADGES: Record<string, { label: string; color: 'gold' | 'amber' }> = {
  classic: { label: 'TOP', color: 'gold' },
  forte: { label: 'TOP', color: 'gold' },
  longevity: { label: 'NEW', color: 'amber' },
}

const FALLBACK_PRODUCTS = [
  { id: '1', slug: 'classic', nameUk: 'ManPrime Classic', nameRu: 'ManPrime Classic', nameEn: 'ManPrime Classic', descUk: 'Базовий комплекс для підтримки потенції та чоловічого здоров\'я.', descRu: 'Базовый комплекс для поддержки потенции и мужского здоровья.', descEn: 'Basic complex for potency and men\'s health.', compUk: '', compRu: '', compEn: '', price: 890, imageUrl: null, stock: 100, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', slug: 'forte', nameUk: 'ManPrime Forte', nameRu: 'ManPrime Forte', nameEn: 'ManPrime Forte', descUk: 'Посилена формула для максимальної підтримки тестостерону.', descRu: 'Усиленная формула для максимальной поддержки тестостерона.', descEn: 'Enhanced formula for maximum testosterone support.', compUk: '', compRu: '', compEn: '', price: 1290, imageUrl: null, stock: 100, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', slug: 'longevity', nameUk: 'ManPrime Longevity', nameRu: 'ManPrime Longevity', nameEn: 'ManPrime Longevity', descUk: 'Комплекс для чоловіків 40+ — здоров\'я, енергія та довголіття.', descRu: 'Комплекс для мужчин 40+ — здоровье, энергия и долголетие.', descEn: 'Complex for men 40+ — health, energy and longevity.', compUk: '', compRu: '', compEn: '', price: 1490, imageUrl: null, stock: 100, isActive: true, createdAt: new Date(), updatedAt: new Date() },
]

export default async function HomePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const dbProducts: Product[] = await prisma.product.findMany({
    where: { isActive: true },
    take: 3,
    orderBy: { createdAt: 'asc' },
  }).catch(() => [] as Product[])

  const products = dbProducts.length > 0 ? dbProducts : FALLBACK_PRODUCTS as unknown as Product[]

  const nameKey = `name${lang.charAt(0).toUpperCase() + lang.slice(1)}` as 'nameUk' | 'nameRu' | 'nameEn'
  const descKey = `desc${lang.charAt(0).toUpperCase() + lang.slice(1)}` as 'descUk' | 'descRu' | 'descEn'

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-[#1a365d] via-[#1e3a6e]/90 to-[#f0f4f8]" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="text-center md:text-left order-2 md:order-1">
            <div className="inline-flex items-center gap-2 border border-[#c9a84c]/40 text-[#c9a84c] text-[10px] font-semibold uppercase tracking-[0.3em] px-4 py-2 mb-8">
              ManPrime Store
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-[1.05] tracking-tight mb-6">
              {dict.hero.title}
              <br />
              <span className="text-[#c9a84c]">{dict.hero.titleAccent}</span>
            </h1>
            <p className="text-[#a0c4e8] text-base md:text-lg leading-relaxed mb-10 max-w-md mx-auto md:mx-0">
              {dict.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href={`/${lang}/catalog`}
                className="bg-[#c05621] hover:bg-[#9c4221] text-white font-heading px-10 py-4 uppercase tracking-widest text-sm transition-all duration-300 hover:shadow-lg"
              >
                {dict.hero.cta}
              </Link>
              <Link
                href={`/${lang}/about`}
                className="border border-white/30 hover:border-[#c9a84c]/60 text-white hover:text-[#c9a84c] font-medium px-10 py-4 uppercase tracking-widest text-sm transition-colors"
              >
                {dict.hero.ctaSecondary}
              </Link>
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-full max-w-sm md:max-w-full">
              <Image
                src="/hero-banner.png"
                alt="ManPrime — чоловіче здоров'я"
                width={580}
                height={435}
                className="w-full h-auto object-cover rounded-sm shadow-2xl"
                priority
              />
              <div className="absolute inset-0 rounded-sm ring-1 ring-[#c9a84c]/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust block */}
      <section className="bg-white border-y border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { icon: '🌿', title: '100% НАТУРАЛЬНО', desc: 'Тільки перевірені компоненти без хімії' },
            { icon: '🔒', title: 'КОНФІДЕНЦІЙНІСТЬ', desc: 'Анонімна упаковка та доставка' },
            { icon: '⚡', title: 'ГАРАНТІЯ ЕФЕКТУ', desc: 'Клінічно підтверджений результат' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-3">
              <span className="text-3xl">{icon}</span>
              <h3 className="text-[#c9a84c] font-heading text-sm tracking-widest uppercase">{title}</h3>
              <p className="text-[#718096] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="py-20 bg-[#f0f4f8]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.4em] uppercase mb-3">Наші комплекси</p>
            <h2 className="font-heading text-3xl md:text-4xl text-[#1a365d] uppercase tracking-tight">
              {dict.products.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => {
              const oldPrice = OLD_PRICES[product.slug]
              const badge = BADGES[product.slug]
              return (
                <div
                  key={product.id}
                  className="bg-white border border-[#e2e8f0] hover:border-[#1a365d]/30 hover:-translate-y-1 transition-all duration-300 group flex flex-col shadow-sm hover:shadow-md"
                >
                  <div className="relative h-50 bg-[#edf2f7] flex items-center justify-center overflow-hidden">
                    {badge && (
                      <span className={`absolute top-3 left-3 text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md z-10 ${
                        badge.color === 'gold'
                          ? 'bg-[#c9a84c] text-[#1a365d]'
                          : 'bg-[#c05621] text-white'
                      }`}>
                        {badge.label}
                      </span>
                    )}
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product[nameKey]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-24 h-24 rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center">
                          <span className="text-4xl">💊</span>
                        </div>
                        <div className="w-16 h-px bg-linear-to-r from-transparent via-[#c9a84c]/40 to-transparent" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-heading text-[#1a365d] text-xl mb-2 tracking-wide">{product[nameKey]}</h3>
                    <p className="text-[#718096] text-sm leading-relaxed mb-4 flex-1 line-clamp-2">{product[descKey]}</p>
                    <div className="border-t border-[#e2e8f0] pt-4 mb-4">
                      <div className="flex items-end justify-between">
                        <div>
                          {oldPrice && (
                            <span className="block text-[#a0aec0] text-sm line-through mb-0.5">{oldPrice} {dict.products.uah}</span>
                          )}
                          <span className="text-[#c9a84c] font-black text-2xl">{product.price}</span>
                          <span className="text-[#718096] text-sm ml-1">{dict.products.uah}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#48bb78]" />
                          <span className="text-[10px] text-[#718096] uppercase tracking-wider">
                            {lang === 'uk' ? 'В наявності' : lang === 'ru' ? 'В наличии' : 'In stock'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/${lang}/product/${product.slug}`}
                        className="flex-1 border border-[#cbd5e0] hover:border-[#1a365d] text-[#718096] hover:text-[#1a365d] text-sm font-medium py-3 text-center transition-colors rounded-sm"
                      >
                        {lang === 'uk' ? 'Детальніше' : lang === 'ru' ? 'Подробнее' : 'Details'}
                      </Link>
                      <Link
                        href={`/${lang}/checkout?product=${product.slug}`}
                        className="flex-1 bg-[#c05621] hover:bg-[#9c4221] text-white text-sm font-bold py-3 text-center uppercase tracking-wider transition-colors rounded-sm"
                      >
                        {dict.products.buy_now}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href={`/${lang}/catalog`}
              className="inline-flex items-center gap-2 border border-[#cbd5e0] hover:border-[#1a365d] text-[#718096] hover:text-[#1a365d] font-medium px-8 py-3 text-sm uppercase tracking-widest transition-colors"
            >
              {lang === 'uk' ? 'Всі товари' : lang === 'ru' ? 'Все товары' : 'All products'} →
            </Link>
          </div>
        </div>
      </section>

      {/* Delivery */}
      <section className="bg-white border-t border-[#e2e8f0] py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl md:text-3xl text-[#1a365d] uppercase tracking-tight mb-4">
            {dict.delivery_info.title}
          </h2>
          <p className="text-[#718096] text-base max-w-xl mx-auto mb-10">{dict.delivery_info.text}</p>
          <div className="flex justify-center gap-12">
            {[
              { icon: '📦', label: 'Нова Пошта' },
              { icon: '✉️', label: 'Укрпошта' },
              { icon: '📍', label: 'По всій Україні' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <span className="text-2xl">{icon}</span>
                <span className="text-[#718096] text-xs uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
