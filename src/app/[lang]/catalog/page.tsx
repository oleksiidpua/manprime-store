import Link from 'next/link'
import { getDictionary, type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/db'
import type { Product } from '@prisma/client'

const FALLBACK_PRODUCTS = [
  { id: '1', slug: 'classic', nameUk: 'ManPrime Classic', nameRu: 'ManPrime Classic', nameEn: 'ManPrime Classic', descUk: 'Базовий комплекс для підтримки потенції та чоловічого здоров\'я. Природні компоненти, перевірена формула.', descRu: 'Базовый комплекс для поддержки потенции и мужского здоровья. Природные компоненты, проверенная формула.', descEn: 'Basic complex for potency and men\'s health support. Natural ingredients, proven formula.', compUk: '', compRu: '', compEn: '', price: 890, imageUrl: null, stock: 100, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', slug: 'forte', nameUk: 'ManPrime Forte', nameRu: 'ManPrime Forte', nameEn: 'ManPrime Forte', descUk: 'Посилена формула для максимальної підтримки чоловічого здоров\'я та рівня тестостерону.', descRu: 'Усиленная формула для максимальной поддержки мужского здоровья и уровня тестостерона.', descEn: 'Enhanced formula for maximum support of men\'s health and testosterone levels.', compUk: '', compRu: '', compEn: '', price: 1290, imageUrl: null, stock: 100, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', slug: 'longevity', nameUk: 'ManPrime Longevity', nameRu: 'ManPrime Longevity', nameEn: 'ManPrime Longevity', descUk: 'Спеціальний комплекс для чоловіків 40+ — здоров\'я, енергія та довголіття.', descRu: 'Специальный комплекс для мужчин 40+ — здоровье, энергия и долголетие.', descEn: 'Special complex for men 40+ — health, energy and longevity.', compUk: '', compRu: '', compEn: '', price: 1490, imageUrl: null, stock: 100, isActive: true, createdAt: new Date(), updatedAt: new Date() },
]

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
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
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-heading text-3xl md:text-5xl font-bold mb-3">{dict.products.title}</h1>
        <p className="text-muted text-lg">{dict.products.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col group">
            <div className="aspect-square bg-gradient-to-br from-cream to-orange-50 flex items-center justify-center relative overflow-hidden">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product[nameKey]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="text-7xl group-hover:scale-110 transition-transform duration-300">💊</div>
              )}
              <div className="absolute top-4 right-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                {product.stock > 0 ? (lang === 'uk' ? 'В наявності' : lang === 'ru' ? 'В наличии' : 'In stock') : dict.products.out_of_stock}
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h2 className="font-heading font-bold text-xl mb-3">{product[nameKey]}</h2>
              <p className="text-muted text-sm leading-relaxed mb-5 flex-1">{product[descKey]}</p>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <span className="font-bold text-2xl text-accent">{product.price}</span>
                  <span className="text-muted text-sm ml-1">{dict.products.uah}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/${lang}/product/${product.slug}`}
                    className="border border-accent text-accent hover:bg-accent hover:text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
                  >
                    {lang === 'uk' ? 'Детальніше' : lang === 'ru' ? 'Подробнее' : 'Details'}
                  </Link>
                  <Link
                    href={`/${lang}/checkout?product=${product.slug}`}
                    className="bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
                  >
                    {dict.products.buy_now}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
