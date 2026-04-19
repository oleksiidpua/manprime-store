import Link from 'next/link'
import { getDictionary, type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/db'
import type { Product } from '@prisma/client'

const OLD_PRICES: Record<string, number> = { classic: 1200, forte: 1700, longevity: 2000 }
const BADGES: Record<string, string> = { classic: 'TOP', forte: 'TOP', longevity: 'NEW' }

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
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.4em] uppercase mb-3">ManPrime</p>
          <h1 className="font-heading font-black text-3xl md:text-5xl text-white uppercase tracking-tight mb-4">
            {dict.products.title}
          </h1>
          <p className="text-[#555] text-base">{dict.products.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const oldPrice = OLD_PRICES[product.slug]
            const badge = BADGES[product.slug]
            return (
              <div key={product.id} className="bg-[#111111] border border-[#1E1E1E] hover:border-[#C9A84C]/30 transition-all duration-300 group flex flex-col">
                <div className="relative aspect-square bg-linear-to-b from-[#1A1A1A] to-[#0F0F0F] flex items-center justify-center overflow-hidden">
                  {badge && (
                    <span className="absolute top-3 left-3 bg-[#C9A84C] text-black text-[10px] font-black tracking-widest uppercase px-2.5 py-1 z-10">
                      {badge}
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
                      <div className="w-28 h-28 rounded-full bg-[#1E1E1E] border border-[#2A2A2A] flex items-center justify-center group-hover:border-[#C9A84C]/20 transition-colors">
                        <span className="text-5xl">💊</span>
                      </div>
                      <div className="w-20 h-px bg-linear-to-r from-transparent via-[#C9A84C]/20 to-transparent" />
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h2 className="font-heading font-bold text-white text-lg mb-2 tracking-wide">{product[nameKey]}</h2>
                  <p className="text-[#555] text-sm leading-relaxed mb-5 flex-1">{product[descKey]}</p>

                  <div className="flex items-end justify-between mb-5">
                    <div>
                      {oldPrice && (
                        <span className="block text-[#3A3A3A] text-sm line-through mb-0.5">{oldPrice} {dict.products.uah}</span>
                      )}
                      <span className="text-[#C9A84C] font-black text-2xl">{product.price}</span>
                      <span className="text-[#555] text-sm ml-1">{dict.products.uah}</span>
                    </div>
                    <span className="text-[10px] text-[#3A7A3A] font-medium uppercase tracking-wider">
                      {product.stock > 0
                        ? (lang === 'uk' ? 'В наявності' : lang === 'ru' ? 'В наличии' : 'In stock')
                        : dict.products.out_of_stock}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/${lang}/product/${product.slug}`}
                      className="flex-1 border border-[#2A2A2A] hover:border-[#C9A84C]/40 text-[#9CA3AF] hover:text-[#C9A84C] text-sm font-medium py-3 text-center transition-colors"
                    >
                      {lang === 'uk' ? 'Детальніше' : lang === 'ru' ? 'Подробнее' : 'Details'}
                    </Link>
                    <Link
                      href={`/${lang}/checkout?product=${product.slug}`}
                      className="flex-1 bg-[#A52A2A] hover:bg-[#C03333] text-white text-sm font-bold py-3 text-center uppercase tracking-wider transition-colors"
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
