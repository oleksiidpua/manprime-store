import Link from 'next/link'
import { getDictionary, type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/db'
import type { Product } from '@prisma/client'
import HeroAnimated from '@/components/HeroAnimated'

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: '1', slug: 'classic',
    nameUk: 'ManPrime Classic', nameRu: 'ManPrime Classic', nameEn: 'ManPrime Classic',
    descUk: 'Базовий комплекс для підтримки потенції та чоловічого здоров\'я.',
    descRu: 'Базовый комплекс для поддержки потенции и мужского здоровья.',
    descEn: 'Basic complex for potency and men\'s health.',
    compUk: '', compRu: '', compEn: '',
    price: 890, imageUrl: null, stock: 100, isActive: true,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '2', slug: 'forte',
    nameUk: 'ManPrime Forte', nameRu: 'ManPrime Forte', nameEn: 'ManPrime Forte',
    descUk: 'Посилена формула для максимальної підтримки тестостерону.',
    descRu: 'Усиленная формула для максимальной поддержки тестостерона.',
    descEn: 'Enhanced formula for maximum testosterone support.',
    compUk: '', compRu: '', compEn: '',
    price: 1290, imageUrl: null, stock: 100, isActive: true,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '3', slug: 'longevity',
    nameUk: 'ManPrime Longevity', nameRu: 'ManPrime Longevity', nameEn: 'ManPrime Longevity',
    descUk: 'Комплекс для чоловіків 40+ — здоров\'я, енергія та довголіття.',
    descRu: 'Комплекс для мужчин 40+ — здоровье, энергия и долголетие.',
    descEn: 'Complex for men 40+ — health, energy and longevity.',
    compUk: '', compRu: '', compEn: '',
    price: 1490, imageUrl: null, stock: 100, isActive: true,
    createdAt: new Date(), updatedAt: new Date(),
  },
]

export default async function HomePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const dbProducts = await prisma.product.findMany({
    where: { isActive: true },
    take: 3,
    orderBy: { createdAt: 'asc' },
  }).catch(() => [] as Product[])

  const products = dbProducts.length > 0 ? dbProducts : FALLBACK_PRODUCTS

  const nameKey = `name${cap(lang)}` as 'nameUk' | 'nameRu' | 'nameEn'
  const descKey = `desc${cap(lang)}` as 'descUk' | 'descRu' | 'descEn'

  return (
    <>
      <HeroAnimated lang={lang} ctaPrimary={dict.hero.cta} ctaSecondary={dict.hero.ctaSecondary} />

      {/* TRUST FEATURES */}
      <section className="border-y border-border bg-surface/30">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {[
            { icon: <LeafIcon />, title: dict.features.natural.title, desc: dict.features.natural.desc },
            { icon: <ShieldIcon />, title: dict.features.certified.title, desc: dict.features.certified.desc },
            { icon: <TruckIcon />, title: dict.features.delivery.title, desc: dict.features.delivery.desc },
          ].map((f) => (
            <div key={f.title} className="flex flex-col items-start gap-4">
              <div className="text-copper">{f.icon}</div>
              <h3 className="font-serif text-xl text-foreground">{f.title}</h3>
              <p className="text-muted text-[15px] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HONEY INGREDIENT STORY — full-width video background */}
      <section className="relative overflow-hidden border-y border-border min-h-[80vh] md:min-h-[85vh] flex items-center">
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden
        >
          <source src="/honey.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay for legibility */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,20,40,0.55)_0%,rgba(14,20,40,0.85)_75%,rgba(14,20,40,0.95)_100%)] pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-b from-background/30 via-transparent to-background/40 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-3xl mx-auto px-5 md:px-8 py-20 md:py-28 text-center">
          <span className="text-copper text-[11px] font-medium tracking-[0.3em] uppercase">
            {lang === 'uk' ? 'Натуральна основа' : lang === 'ru' ? 'Натуральная основа' : 'Natural base'}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            {lang === 'uk'
              ? <>Чому ми обрали <em className="italic text-copper font-normal">мед</em></>
              : lang === 'ru'
              ? <>Почему мы выбрали <em className="italic text-copper font-normal">мёд</em></>
              : <>Why we chose <em className="italic text-copper font-normal">honey</em></>}
          </h2>
          <p className="text-foreground/85 text-[16px] md:text-lg leading-relaxed mt-6 max-w-xl mx-auto">
            {lang === 'uk'
              ? 'Мед — найдавніший природний носій активних компонентів. Він допомагає організму швидко і безпечно засвоювати корисні речовини, без хімії та консервантів.'
              : lang === 'ru'
              ? 'Мёд — древнейший природный носитель активных компонентов. Он помогает организму быстро и безопасно усваивать полезные вещества, без химии и консервантов.'
              : 'Honey is the oldest natural carrier of active compounds. It helps your body absorb nutrients quickly and safely — no chemicals, no preservatives.'}
          </p>
          <ul className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-3 text-foreground/80 text-[13px] tracking-wide">
            {[
              lang === 'uk' ? '100% натуральна основа' : lang === 'ru' ? '100% натуральная основа' : '100% natural base',
              lang === 'uk' ? 'Швидке засвоєння' : lang === 'ru' ? 'Быстрое усвоение' : 'Fast absorption',
              lang === 'uk' ? 'Без штучних добавок' : lang === 'ru' ? 'Без искусственных добавок' : 'No artificial additives',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-copper shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <span className="text-copper text-[11px] font-medium tracking-[0.3em] uppercase">
                {lang === 'uk' ? 'Колекція' : lang === 'ru' ? 'Коллекция' : 'Collection'}
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-3 max-w-xl leading-tight">
                {dict.products.title}
              </h2>
            </div>
            <Link
              href={`/${lang}/catalog`}
              className="inline-flex items-center gap-2 text-foreground hover:text-copper text-sm tracking-wide transition-colors group"
            >
              {lang === 'uk' ? 'Усі препарати' : lang === 'ru' ? 'Все препараты' : 'All products'}
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {products.map((product) => (
              <article
                key={product.id}
                className="group bg-surface border border-border hover:border-copper/50 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
              >
                <div className="relative aspect-square bg-linear-to-br from-surface-2 to-surface flex items-center justify-center overflow-hidden">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.imageUrl} alt={product[nameKey]} className="w-full h-full object-cover" />
                  ) : (
                    <div className="relative w-32 h-44 rounded-md bg-linear-to-b from-[#0c1a16] to-[#1c352c] border border-copper/20 shadow-2xl flex flex-col items-center justify-between py-6 transition-transform duration-700 group-hover:scale-110">
                      <div className="text-copper text-[8px] tracking-[0.3em] font-bold">MANPRIME</div>
                      <div className="w-8 h-8 rounded-full border border-copper/40 flex items-center justify-center">
                        <span className="text-copper text-lg">♂</span>
                      </div>
                      <div className="text-muted-2 text-[7px] tracking-[0.25em] uppercase">{product.slug}</div>
                    </div>
                  )}
                </div>

                <div className="p-6 md:p-7">
                  <h3 className="font-serif text-2xl text-foreground mb-2">{product[nameKey]}</h3>
                  <p className="text-muted text-[14px] leading-relaxed mb-6 line-clamp-2 min-h-10.5">
                    {product[descKey]}
                  </p>
                  <div className="flex items-end justify-between pt-5 border-t border-border/40">
                    <div>
                      <span className="text-copper font-serif text-3xl">{product.price}</span>
                      <span className="text-muted text-sm ml-1.5">{dict.products.uah}</span>
                    </div>
                    <Link
                      href={`/${lang}/product/${product.slug}`}
                      className="text-foreground hover:text-copper text-[13px] tracking-wide font-medium underline-offset-4 hover:underline transition-colors"
                    >
                      {lang === 'uk' ? 'Детальніше' : lang === 'ru' ? 'Подробнее' : 'Details'} →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* DELIVERY */}
      <section className="border-t border-border bg-surface/30">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-copper text-[11px] font-medium tracking-[0.3em] uppercase">
              {lang === 'uk' ? 'Логістика' : lang === 'ru' ? 'Логистика' : 'Logistics'}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-3 leading-tight">
              {dict.delivery_info.title}
            </h2>
            <p className="text-muted text-[16px] leading-relaxed mt-6 max-w-md">
              {dict.delivery_info.text}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Нова Пошта', icon: '📦' },
              { name: 'Укрпошта', icon: '✉️' },
            ].map((s) => (
              <div key={s.name} className="aspect-square bg-surface border border-border rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-copper/40 transition-colors">
                <span className="text-3xl">{s.icon}</span>
                <span className="text-muted text-[13px] tracking-wide">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function LeafIcon() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 4c-9 0-15 6-15 14v2h2c8 0 14-6 14-14V4z" />
      <path strokeLinecap="round" d="M3 21c2-6 6-10 12-12" />
    </svg>
  )
}
function ShieldIcon() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 3v7c0 4.5-3.5 7.5-8 8-4.5-.5-8-3.5-8-8V6l8-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  )
}
function TruckIcon() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 7h11v10H2zM13 10h5l3 3v4h-8M6 20a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  )
}
