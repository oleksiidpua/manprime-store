import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/db'
import AddToCartButton from '@/components/AddToCartButton'
import type { Product } from '@prisma/client'

const OLD_PRICES: Record<string, number> = { classic: 1200, forte: 1700, longevity: 2000 }

const FALLBACK_PRODUCTS: Product[] = [
  { id: '1', slug: 'classic', nameUk: 'ManPrime Classic', nameRu: 'ManPrime Classic', nameEn: 'ManPrime Classic', descUk: 'Базовий комплекс для підтримки потенції та чоловічого здоров\'я. Природні компоненти, перевірена формула.', descRu: 'Базовый комплекс для поддержки потенции и мужского здоровья.', descEn: 'Basic complex for potency and men\'s health support.', compUk: 'L-аргінін, Цинк, Вітамін D3, Екстракт кореня імбиру', compRu: 'L-аргинин, Цинк, Витамин D3, Экстракт корня имбиря', compEn: 'L-arginine, Zinc, Vitamin D3, Ginger root extract', price: 890, imageUrl: null, stock: 100, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', slug: 'forte', nameUk: 'ManPrime Forte', nameRu: 'ManPrime Forte', nameEn: 'ManPrime Forte', descUk: 'Посилена формула для максимальної підтримки чоловічого здоров\'я та рівня тестостерону.', descRu: 'Усиленная формула для максимальной поддержки мужского здоровья.', descEn: 'Enhanced formula for maximum men\'s health support.', compUk: 'Трибулус, Женьшень, Цинк, Магній, Вітаміни групи B', compRu: 'Трибулус, Женьшень, Цинк, Магний, Витамины группы B', compEn: 'Tribulus, Ginseng, Zinc, Magnesium, B vitamins', price: 1290, imageUrl: null, stock: 100, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', slug: 'longevity', nameUk: 'ManPrime Longevity', nameRu: 'ManPrime Longevity', nameEn: 'ManPrime Longevity', descUk: 'Спеціальний комплекс для чоловіків 40+ — здоров\'я, енергія та довголіття.', descRu: 'Специальный комплекс для мужчин 40+.', descEn: 'Special complex for men 40+.', compUk: 'Коензим Q10, Омега-3, Вітамін E, Ресвератрол, Цинк', compRu: 'Коэнзим Q10, Омега-3, Витамин E, Ресвератрол, Цинк', compEn: 'Coenzyme Q10, Omega-3, Vitamin E, Resveratrol, Zinc', price: 1490, imageUrl: null, stock: 100, isActive: true, createdAt: new Date(), updatedAt: new Date() },
]

export default async function ProductPage({ params }: { params: Promise<{ lang: Locale; slug: string }> }) {
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
  const oldPrice = OLD_PRICES[product.slug]

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <nav className="text-sm text-[#a0aec0] mb-10 flex items-center gap-2">
          <Link href={`/${lang}`} className="hover:text-[#1a365d] transition-colors">{dict.nav.home}</Link>
          <span className="text-[#cbd5e0]">›</span>
          <Link href={`/${lang}/catalog`} className="hover:text-[#1a365d] transition-colors">{dict.nav.catalog}</Link>
          <span className="text-[#cbd5e0]">›</span>
          <span className="text-[#718096]">{product[nameKey]}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square bg-[#edf2f7] border border-[#e2e8f0] flex items-center justify-center rounded-sm">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product[nameKey]} className="w-full h-full object-cover rounded-sm" />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center">
                  <span className="text-6xl">💊</span>
                </div>
                <div className="w-20 h-px bg-linear-to-r from-transparent via-[#c9a84c]/30 to-transparent" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h1 className="font-heading text-3xl md:text-4xl text-[#1a365d] uppercase tracking-tight mb-4">
              {product[nameKey]}
            </h1>
            <p className="text-[#718096] leading-relaxed mb-6">{product[descKey]}</p>

            {product[compKey] && (
              <div className="border border-[#e2e8f0] bg-white p-5 mb-5 rounded-sm">
                <h3 className="text-[#c9a84c] font-heading text-xs tracking-widest uppercase mb-3">{compLabel}</h3>
                <p className="text-[#718096] text-sm leading-relaxed">{product[compKey]}</p>
              </div>
            )}

            <div className="border border-[#e2e8f0] bg-white p-5 mb-8 rounded-sm">
              <h3 className="text-[#c9a84c] font-heading text-xs tracking-widest uppercase mb-4">{benefitsLabel}</h3>
              <ul className="space-y-2">
                {[dict.features.natural.title, dict.features.certified.title, dict.features.privacy.title].map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm text-[#2d3748]">
                    <span className="text-[#c9a84c] text-xs">◆</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-end justify-between mb-8">
              <div>
                {oldPrice && (
                  <span className="block text-[#a0aec0] text-sm line-through mb-1">{oldPrice} {dict.products.uah}</span>
                )}
                <span className="text-[#c9a84c] font-black text-5xl">{product.price}</span>
                <span className="text-[#718096] text-base ml-2">{dict.products.uah}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#48bb78]" />
                <span className="text-[#718096] text-sm font-medium uppercase tracking-wider">
                  {lang === 'uk' ? 'В наявності' : lang === 'ru' ? 'В наличии' : 'In stock'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <AddToCartButton product={product} nameKey={nameKey} dict={dict} lang={lang} />
              <Link
                href={`/${lang}/checkout?product=${product.slug}`}
                className="flex-1 bg-[#c05621] hover:bg-[#9c4221] text-white font-heading py-4 text-center uppercase tracking-widest text-sm transition-all hover:shadow-md"
              >
                {dict.products.buy_now}
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-[#e2e8f0] text-sm text-[#a0aec0] flex items-center gap-2">
              <span>📦</span>
              <span>{dict.delivery_info.text}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
