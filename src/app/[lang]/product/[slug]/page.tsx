import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/db'
import AddToCartButton from '@/components/AddToCartButton'
import type { Product } from '@prisma/client'

const FALLBACK_PRODUCTS: Product[] = [
  { id: '1', slug: 'classic', nameUk: 'ManPrime Classic', nameRu: 'ManPrime Classic', nameEn: 'ManPrime Classic', descUk: 'Базовий комплекс для підтримки потенції та чоловічого здоров\'я. Природні компоненти, перевірена формула.', descRu: 'Базовый комплекс для поддержки потенции и мужского здоровья.', descEn: 'Basic complex for potency and men\'s health support.', compUk: 'L-аргінін, Цинк, Вітамін D3, Екстракт кореня імбиру', compRu: 'L-аргинин, Цинк, Витамин D3, Экстракт корня имбиря', compEn: 'L-arginine, Zinc, Vitamin D3, Ginger root extract', price: 890, imageUrl: null, stock: 100, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', slug: 'forte', nameUk: 'ManPrime Forte', nameRu: 'ManPrime Forte', nameEn: 'ManPrime Forte', descUk: 'Посилена формула для максимальної підтримки чоловічого здоров\'я та рівня тестостерону.', descRu: 'Усиленная формула для максимальной поддержки мужского здоровья.', descEn: 'Enhanced formula for maximum men\'s health support.', compUk: 'Трибулус, Женьшень, Цинк, Магній, Вітаміни групи B', compRu: 'Трибулус, Женьшень, Цинк, Магний, Витамины группы B', compEn: 'Tribulus, Ginseng, Zinc, Magnesium, B vitamins', price: 1290, imageUrl: null, stock: 100, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', slug: 'longevity', nameUk: 'ManPrime Longevity', nameRu: 'ManPrime Longevity', nameEn: 'ManPrime Longevity', descUk: 'Спеціальний комплекс для чоловіків 40+ — здоров\'я, енергія та довголіття.', descRu: 'Специальный комплекс для мужчин 40+ — здоровье, энергия и долголетие.', descEn: 'Special complex for men 40+ — health, energy and longevity.', compUk: 'Коензим Q10, Омега-3, Вітамін E, Ресвератрол, Цинк', compRu: 'Коэнзим Q10, Омега-3, Витамин E, Ресвератрол, Цинк', compEn: 'Coenzyme Q10, Omega-3, Vitamin E, Resveratrol, Zinc', price: 1490, imageUrl: null, stock: 100, isActive: true, createdAt: new Date(), updatedAt: new Date() },
]

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>
}) {
  const { lang, slug } = await params
  const dict = await getDictionary(lang)

  const dbProduct = await prisma.product.findUnique({ where: { slug } }).catch(() => null)
  const product = dbProduct ?? FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null

  if (!product) notFound()

  const nameKey = `name${lang.charAt(0).toUpperCase() + lang.slice(1)}` as 'nameUk' | 'nameRu' | 'nameEn'
  const descKey = `desc${lang.charAt(0).toUpperCase() + lang.slice(1)}` as 'descUk' | 'descRu' | 'descEn'
  const compKey = `comp${lang.charAt(0).toUpperCase() + lang.slice(1)}` as 'compUk' | 'compRu' | 'compEn'

  const compLabel = lang === 'uk' ? 'Склад' : lang === 'ru' ? 'Состав' : 'Composition'
  const benefitsLabel = lang === 'uk' ? 'Переваги' : lang === 'ru' ? 'Преимущества' : 'Benefits'

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-sm text-muted mb-8">
        <Link href={`/${lang}`} className="hover:text-accent">{dict.nav.home}</Link>
        <span className="mx-2">›</span>
        <Link href={`/${lang}/catalog`} className="hover:text-accent">{dict.nav.catalog}</Link>
        <span className="mx-2">›</span>
        <span>{product[nameKey]}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square bg-gradient-to-br from-cream to-orange-50 rounded-3xl flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product[nameKey]} className="w-full h-full object-cover rounded-3xl" />
          ) : (
            <div className="text-9xl">💊</div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">{product[nameKey]}</h1>
          <p className="text-muted leading-relaxed mb-6">{product[descKey]}</p>

          {product[compKey] && (
            <div className="bg-cream rounded-2xl p-5 mb-6">
              <h3 className="font-semibold mb-2">{compLabel}:</h3>
              <p className="text-sm text-muted">{product[compKey]}</p>
            </div>
          )}

          <div className="bg-white border border-border rounded-2xl p-5 mb-8">
            <h3 className="font-semibold mb-3">{benefitsLabel}:</h3>
            <ul className="space-y-2 text-sm">
              {[dict.features.natural.title, dict.features.certified.title, dict.features.privacy.title].map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="font-bold text-4xl text-accent">{product.price}</span>
              <span className="text-muted ml-2">{dict.products.uah}</span>
            </div>
            <div className="text-sm text-green-600 font-medium">
              ✓ {lang === 'uk' ? 'В наявності' : lang === 'ru' ? 'В наличии' : 'In stock'}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <AddToCartButton product={product} nameKey={nameKey} dict={dict} lang={lang} />
            <Link
              href={`/${lang}/checkout?product=${product.slug}`}
              className="flex-1 bg-accent hover:bg-accent-hover text-white font-semibold py-4 rounded-full text-center transition-colors shadow-lg shadow-accent/25"
            >
              {dict.products.buy_now}
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-border text-sm text-muted">
            🚚 {dict.delivery_info.text}
          </div>
        </div>
      </div>
    </div>
  )
}
