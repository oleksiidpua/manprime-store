import Link from 'next/link'
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
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.4em] uppercase mb-3">ManPrime</p>
          <h1 className="font-heading text-3xl md:text-5xl text-[#1a365d] uppercase tracking-tight mb-4">
            {dict.products.title}
          </h1>
          <p className="text-[#718096] text-base">{dict.products.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <img
                      src={product.imageUrl}
                      alt={product[nameKey]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-28 h-28 rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center group-hover:border-[#1a365d]/20 transition-colors">
                        <span className="text-5xl">💊</span>
                      </div>
                      <div className="w-20 h-px bg-linear-to-r from-transparent via-[#c9a84c]/30 to-transparent" />
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h2 className="font-heading text-[#1a365d] text-xl mb-2 tracking-wide">{product[nameKey]}</h2>
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
                          {product.stock > 0
                            ? (lang === 'uk' ? 'В наявності' : lang === 'ru' ? 'В наличии' : 'In stock')
                            : dict.products.out_of_stock}
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
      </div>
    </div>
  )
}
