import Link from 'next/link'
import Image from 'next/image'
import { getDictionary, type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/db'
import type { Product } from '@prisma/client'

const OLD_PRICES: Record<string, number> = { classic: 1200, forte: 1700, longevity: 2000 }
const BADGES: Record<string, { label: string; color: 'gold' | 'brown' }> = {
  classic: { label: 'TOP', color: 'gold' },
  forte: { label: 'TOP', color: 'gold' },
  longevity: { label: 'NEW', color: 'brown' },
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
      <section className="relative overflow-hidden bg-[#0b0f1a]">
        <div className="absolute inset-0 bg-linear-to-br from-[#0f1525] via-[#0b0f1a] to-[#070a12]" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)', backgroundSize: '30px 30px' }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="text-center md:text-left order-2 md:order-1">
            <div className="inline-flex items-center gap-2 border border-[#c9a84c]/30 text-[#c9a84c] text-[10px] font-semibold uppercase tracking-[0.3em] px-4 py-2 mb-8">
              ManPrime Store
            </div>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-[#e8eaf0] uppercase leading-[1.05] mb-6">
              {dict.hero.title}
              <br />
              <span className="text-[#c9a84c]">{dict.hero.titleAccent}</span>
            </h1>
            <p className="text-[#8b9ab0] text-base md:text-lg leading-relaxed mb-10 max-w-md mx-auto md:mx-0">
              {dict.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href={`/${lang}/catalog`}
                className="bg-[#b5622a] hover:bg-[#cc7033] text-[#e8eaf0] font-montserrat font-semibold px-10 py-4 uppercase tracking-widest text-sm transition-all duration-300 hover:shadow-[0_0_24px_rgba(181,98,42,0.4)]"
              >
                {dict.hero.cta}
              </Link>
              <Link
                href={`/${lang}/about`}
                className="border border-[#2a3347] hover:border-[#c9a84c]/50 text-[#8b9ab0] hover:text-[#c9a84c] font-medium px-10 py-4 uppercase tracking-widest text-sm transition-colors"
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
                className="w-full h-auto object-cover rounded-sm shadow-2xl shadow-black/60"
                priority
              />
              <div className="absolute inset-0 rounded-sm ring-1 ring-[#c9a84c]/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust block */}
      <section className="bg-[#111827] border-y border-[#1e2a3a]">
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { icon: '🌿', title: '100% НАТУРАЛЬНО', desc: 'Тільки перевірені компоненти без хімії' },
            { icon: '🔒', title: 'КОНФІДЕНЦІЙНІСТЬ', desc: 'Анонімна упаковка та доставка' },
            { icon: '⚡', title: 'ГАРАНТІЯ ЕФЕКТУ', desc: 'Клінічно підтверджений результат' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-3">
              <span className="text-3xl">{icon}</span>
              <h3 className="text-[#c9a84c] font-heading text-sm tracking-widest uppercase">{title}</h3>
              <p className="text-[#8b9ab0] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="py-20 bg-linear-to-b from-[#0d1120] to-[#0b0f1a]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#8b6f47] text-xs font-semibold tracking-[0.4em] uppercase mb-3">Наші комплекси</p>
            <h2 className="font-heading text-4xl md:text-5xl text-[#e8eaf0] uppercase">
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
                  className="bg-[#1c2333] border border-[#2a3347] hover:border-[#c9a84c]/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(201,168,76,0.08)] transition-all duration-300 group flex flex-col rounded-sm"
                >
                  <div className="relative h-50 bg-linear-to-b from-[#232d42] to-[#1a2133] flex items-center justify-center overflow-hidden rounded-t-sm">
                    {badge && (
                      <span className={`absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md ${
                        badge.color === 'gold'
                          ? 'bg-[#c9a84c] text-[#0b0f1a]'
                          : 'bg-[#8b6f47] text-[#e8eaf0]'
                      }`}>
                        {badge.label}
                      </span>
                    )}
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product[nameKey]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-24 h-24 rounded-full bg-[#2a3347] border border-[#3a4a66] flex items-center justify-center">
                          <span className="text-4xl">💊</span>
                        </div>
                        <div className="w-16 h-px bg-linear-to-r from-transparent via-[#c9a84c]/30 to-transparent" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-montserrat font-semibold text-[#e8eaf0] text-[22px] mb-2 leading-tight">{product[nameKey]}</h3>
                    <p className="text-[#8b9ab0] text-sm leading-relaxed mb-4 flex-1 line-clamp-2">{product[descKey]}</p>

                    <div className="border-t border-[#2a3347] pt-4 mb-4">
                      <div className="flex items-end justify-between">
                        <div>
                          {oldPrice && (
                            <span className="block text-[#8b9ab0] text-sm line-through mb-0.5">{oldPrice} {dict.products.uah}</span>
                          )}
                          <span className="text-[#c9a84c] font-bold text-[28px] leading-none">{product.price}</span>
                          <span className="text-[#8b9ab0] text-sm ml-1">{dict.products.uah}</span>
                        </div>
                        <span className="text-[10px] text-[#4ade80] font-medium uppercase tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] inline-block" />
                          {lang === 'uk' ? 'В наявності' : lang === 'ru' ? 'В наличии' : 'In stock'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/${lang}/product/${product.slug}`}
                        className="flex-1 border border-[#8b9ab0] hover:border-[#c9a84c] text-[#8b9ab0] hover:text-[#c9a84c] text-sm font-semibold py-2.75 text-center uppercase tracking-wider transition-colors rounded-sm"
                      >
                        {lang === 'uk' ? 'Детальніше' : lang === 'ru' ? 'Подробнее' : 'Details'}
                      </Link>
                      <Link
                        href={`/${lang}/checkout?product=${product.slug}`}
                        className="flex-1 bg-[#b5622a] hover:bg-[#cc7033] text-[#e8eaf0] text-sm font-semibold py-2.75 text-center uppercase tracking-wider transition-colors rounded-sm"
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
              className="inline-flex items-center gap-2 border border-[#2a3347] hover:border-[#c9a84c]/40 text-[#8b9ab0] hover:text-[#c9a84c] font-medium px-8 py-3 text-sm uppercase tracking-widest transition-colors rounded-sm"
            >
              {lang === 'uk' ? 'Всі товари' : lang === 'ru' ? 'Все товары' : 'All products'} →
            </Link>
          </div>
        </div>
      </section>

      {/* Delivery */}
      <section className="bg-[#111827] border-t border-[#1e2a3a] py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl text-[#e8eaf0] uppercase mb-4">
            {dict.delivery_info.title}
          </h2>
          <p className="text-[#8b9ab0] text-base max-w-xl mx-auto mb-10">{dict.delivery_info.text}</p>
          <div className="flex justify-center gap-12">
            {[
              { icon: '📦', label: 'Нова Пошта' },
              { icon: '✉️', label: 'Укрпошта' },
              { icon: '📍', label: 'По всій Україні' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <span className="text-2xl">{icon}</span>
                <span className="text-[#8b6f47] text-xs uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
