import Link from 'next/link'
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
  { id: '1', slug: 'classic', nameUk: 'ManPrime Classic', nameRu: 'ManPrime Classic', nameEn: 'ManPrime Classic', descUk: 'Базовий комплекс для підтримки потенції та чоловічого здоров\'я. Природні компоненти, перевірена формула.', descRu: 'Базовый комплекс для поддержки потенции и мужского здоровья.', descEn: 'Basic complex for potency and men\'s health support.', compUk: '', compRu: '', compEn: '', price: 890, imageUrl: null, stock: 100, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', slug: 'forte', nameUk: 'ManPrime Forte', nameRu: 'ManPrime Forte', nameEn: 'ManPrime Forte', descUk: 'Посилена формула для максимальної підтримки чоловічого здоров\'я та рівня тестостерону.', descRu: 'Усиленная формула для поддержки тестостерона.', descEn: 'Enhanced formula for testosterone support.', compUk: '', compRu: '', compEn: '', price: 1290, imageUrl: null, stock: 100, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', slug: 'longevity', nameUk: 'ManPrime Longevity', nameRu: 'ManPrime Longevity', nameEn: 'ManPrime Longevity', descUk: 'Спеціальний комплекс для чоловіків 40+ — здоров\'я, енергія та довголіття.', descRu: 'Комплекс для мужчин 40+ — здоровье и долголетие.', descEn: 'Special complex for men 40+ — health and longevity.', compUk: '', compRu: '', compEn: '', price: 1490, imageUrl: null, stock: 100, isActive: true, createdAt: new Date(), updatedAt: new Date() },
]

export default async function CatalogPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const dbProducts: Product[] = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
  }).catch(() => [] as Product[])

  const products = dbProducts.length > 0 ? dbProducts : FALLBACK_PRODUCTS as unknown as Product[]

  const nameKey = `name${lang.charAt(0).toUpperCase() + lang.slice(1)}` as 'nameUk' | 'nameRu' | 'nameEn'
  const descKey = `desc${lang.charAt(0).toUpperCase() + lang.slice(1)}` as 'descUk' | 'descRu' | 'descEn'

  return (
    <div className="min-h-screen bg-[#0b0f1a]">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <p className="text-[#8b6f47] text-xs font-semibold tracking-[0.4em] uppercase mb-3">ManPrime</p>
          <h1 className="font-heading text-4xl md:text-6xl text-[#e8eaf0] uppercase mb-4">
            {dict.products.title}
          </h1>
          <p className="text-[#8b9ab0] text-base">{dict.products.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <span className={`absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md z-10 ${
                      badge.color === 'gold'
                        ? 'bg-[#c9a84c] text-[#0b0f1a]'
                        : 'bg-[#8b6f47] text-[#e8eaf0]'
                    }`}>
                      {badge.label}
                    </span>
                  )}
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product[nameKey]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-28 h-28 rounded-full bg-[#2a3347] border border-[#3a4a66] flex items-center justify-center group-hover:border-[#c9a84c]/20 transition-colors">
                        <span className="text-5xl">💊</span>
                      </div>
                      <div className="w-20 h-px bg-linear-to-r from-transparent via-[#c9a84c]/20 to-transparent" />
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h2 className="font-montserrat font-semibold text-[#e8eaf0] text-[22px] mb-2 leading-tight">{product[nameKey]}</h2>
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
                        {product.stock > 0
                          ? (lang === 'uk' ? 'В наявності' : lang === 'ru' ? 'В наличии' : 'In stock')
                          : dict.products.out_of_stock}
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
      </div>
    </div>
  )
}
