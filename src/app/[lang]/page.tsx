import { getDictionary, type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/db'
import type { Product } from '@prisma/client'
import HeroAnimated from '@/components/HeroAnimated'
import OrderButton from '@/components/OrderButton'

const FORTE_FALLBACK: Product = {
  id: 'forte-fallback',
  slug: 'forte',
  nameUk: 'ManPrime Forte',
  nameRu: 'ManPrime Forte',
  nameEn: 'ManPrime Forte',
  descUk: 'Посилена формула на медовій основі для підтримки тестостерону, потенції та чоловічої енергії. Без хімії, без побічних ефектів.',
  descRu: 'Усиленная формула на медовой основе для поддержки тестостерона, потенции и мужской энергии. Без химии, без побочных эффектов.',
  descEn: 'Enhanced honey-based formula supporting testosterone, potency and male energy. No chemicals, no side effects.',
  compUk: 'Мед натуральний, екстракт женьшеню, маточне молочко, цинк, селен, L-аргінін, екстракт елеутерококу.',
  compRu: 'Мёд натуральный, экстракт женьшеня, маточное молочко, цинк, селен, L-аргинин, экстракт элеутерококка.',
  compEn: 'Natural honey, ginseng extract, royal jelly, zinc, selenium, L-arginine, eleuthero extract.',
  price: 1290,
  imageUrl: null,
  stock: 100,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const FEATURES_BY_LANG: Record<Locale, string[]> = {
  uk: [
    'Медова основа — швидке засвоєння',
    'Підтримує рівень тестостерону',
    'Натуральні компоненти, без хімії',
    'Без побічних ефектів та звикання',
  ],
  ru: [
    'Медовая основа — быстрое усвоение',
    'Поддерживает уровень тестостерона',
    'Натуральные компоненты, без химии',
    'Без побочных эффектов и привыкания',
  ],
  en: [
    'Honey base — fast absorption',
    'Supports testosterone levels',
    'Natural ingredients, no chemicals',
    'No side effects or dependency',
  ],
}

export default async function HomePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const dbForte = await prisma.product
    .findFirst({ where: { slug: 'forte', isActive: true } })
    .catch(() => null)

  const product: Product = dbForte ?? FORTE_FALLBACK
  const features = FEATURES_BY_LANG[lang]

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

      {/* THE PRODUCT — single focal block */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="text-center mb-16">
            <span className="text-copper text-[11px] font-medium tracking-[0.3em] uppercase">
              {lang === 'uk' ? 'Наш продукт' : lang === 'ru' ? 'Наш продукт' : 'Our product'}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mt-3 leading-tight">
              {lang === 'uk' ? <>Один продукт — <em className="italic text-copper font-normal">одна сила</em></>
                : lang === 'ru' ? <>Один продукт — <em className="italic text-copper font-normal">одна сила</em></>
                : <>One product — <em className="italic text-copper font-normal">one strength</em></>}
            </h2>
            <p className="text-muted text-base md:text-lg leading-relaxed mt-6 max-w-2xl mx-auto">
              {lang === 'uk' ? 'Ми не розпорошуємо увагу. Одна формула, доведена результатом — для чоловіків, які знають що хочуть.'
                : lang === 'ru' ? 'Мы не распыляем внимание. Одна формула, доказанная результатом — для мужчин, которые знают чего хотят.'
                : "We don't spread thin. One formula, proven by results — for men who know what they want."}
            </p>
          </div>

          <article className="bg-surface border border-border rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
            {/* Product visual */}
            <div className="relative aspect-square md:aspect-auto bg-linear-to-br from-surface-2 to-surface flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-border">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.imageUrl} alt={product[nameKey]} className="w-full h-full object-cover" />
              ) : (
                <div className="relative w-48 h-64 md:w-56 md:h-72 rounded-md bg-linear-to-b from-[#0c1a16] to-[#1c352c] border border-copper/30 shadow-[0_25px_60px_rgba(0,0,0,0.5)] flex flex-col items-center justify-between py-10">
                  <div className="text-copper text-[10px] tracking-[0.3em] font-bold">MANPRIME</div>
                  <div className="w-12 h-12 rounded-full border border-copper/50 flex items-center justify-center">
                    <span className="text-copper text-2xl">♂</span>
                  </div>
                  <div className="text-muted-2 text-[9px] tracking-[0.25em] uppercase">FORTE</div>
                </div>
              )}
              <span className="absolute top-5 left-5 text-[10px] font-bold tracking-[0.25em] uppercase px-3 py-1.5 rounded-full bg-copper text-background">
                TOP
              </span>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 flex flex-col">
              <h3 className="font-serif text-3xl md:text-4xl text-foreground leading-tight">{product[nameKey]}</h3>
              <p className="text-copper text-[12px] tracking-[0.25em] uppercase mt-2">
                {lang === 'uk' ? 'Посилена формула' : lang === 'ru' ? 'Усиленная формула' : 'Enhanced formula'}
              </p>

              <p className="text-muted text-[15px] leading-relaxed mt-6">{product[descKey]}</p>

              <ul className="mt-8 space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-foreground/90 text-[14px]">
                    <svg className="w-4 h-4 text-copper shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-end justify-between mt-10 pt-6 border-t border-border/60">
                <div>
                  <div className="text-muted-2 text-[10px] tracking-[0.25em] uppercase mb-1">
                    {lang === 'uk' ? 'Ціна' : lang === 'ru' ? 'Цена' : 'Price'}
                  </div>
                  <div>
                    <span className="text-copper font-serif text-4xl md:text-5xl">{product.price}</span>
                    <span className="text-muted text-base ml-2">{dict.products.uah}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[#4ade80] text-[11px] tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                  {lang === 'uk' ? 'В наявності' : lang === 'ru' ? 'В наличии' : 'In stock'}
                </div>
              </div>

              <div className="mt-6">
                <OrderButton
                  lang={lang}
                  product={{
                    id: product.id,
                    slug: product.slug,
                    name: product[nameKey],
                    price: product.price,
                  }}
                />
              </div>
            </div>
          </article>
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
