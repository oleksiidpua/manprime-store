import Image from 'next/image'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { getDictionary, type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/db'
import BuyBox, { type BuyVariant } from '@/components/BuyBox'
import ReviewsSection from '@/components/ReviewsSection'
import { loadApprovedReviews } from '@/lib/reviews'
import { pageMetadata, SITE_URL } from '@/lib/seo'
import type { Product } from '@prisma/client'
import type { Metadata } from 'next'

const PACK_PRICE = 1290
const PACK_OLD = 1700
const SINGLE_PRICE = 159
const SINGLE_OLD = 180

const ROYAL_HONEY_FALLBACK: Product = {
  id: 'forte-fallback',
  slug: 'forte',
  nameUk: 'Royal Honey VIP',
  nameRu: 'Royal Honey VIP',
  nameEn: 'Royal Honey VIP',
  descUk: 'Натуральний концентрат на медовій основі з 5 потужними інгредієнтами для чоловічої сили, енергії та витривалості.',
  descRu: 'Натуральный концентрат на медовой основе с 5 мощными ингредиентами для мужской силы, энергии и выносливости.',
  descEn: 'Natural honey-based concentrate with 5 powerful ingredients for male strength, energy and stamina.',
  compUk: 'Мед натуральний, Tribulus Terrestris, Мака перуанська (Maca), Тонгкат Алі, Женьшень (Panax Ginseng).',
  compRu: 'Мёд натуральный, Tribulus Terrestris, Мака перуанская (Maca), Тонгкат Али, Женьшень (Panax Ginseng).',
  compEn: 'Honey, Tribulus Terrestris, Lepidium Peruvianum (Maca), Eurycoma Longifolia (Tongkat Ali), Panax Ginseng.',
  price: 1290,
  imageUrl: '/products/royal-honey-front.png',
  stock: 100,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

async function loadProduct(slug: string): Promise<Product | null> {
  if (slug !== 'forte') return null
  const dbProduct = await prisma.product
    .findUnique({ where: { slug } })
    .catch(() => null)
  return dbProduct ?? ROYAL_HONEY_FALLBACK
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const product = await loadProduct(slug)
  if (!product) {
    return pageMetadata({ lang, path: `/product/${slug}`, title: 'Товар не знайдено', description: '' })
  }
  const nameKey = `name${cap(lang)}` as 'nameUk' | 'nameRu' | 'nameEn'
  const descKey = `desc${cap(lang)}` as 'descUk' | 'descRu' | 'descEn'
  return pageMetadata({
    lang,
    path: `/product/${slug}`,
    title: product[nameKey],
    description: product[descKey] || product[nameKey],
    ogImage: product.imageUrl || undefined,
  })
}

type Lang = Locale

interface Persona {
  age: string
  title: string
  desc: string
}

interface Ingredient {
  num: string
  name: string
  latin: string
  desc: string
}

interface FaqItem {
  q: string
  a: string
}

interface Content {
  tagline: string
  subtitle: string
  heroBullets: string[]
  inStock: string
  reassurance: string[]
  trustItems: { title: string; desc: string }[]
  ingredientsTitle: string
  ingredientsSub: string
  ingredients: Ingredient[]
  realLabel: string
  realLabelSub: string
  packagingTitle: string
  packagingSub: string
  packagingStats: { value: string; label: string }[]
  howTitle: string
  howSub: string
  howSteps: { num: string; title: string; desc: string }[]
  warningTitle: string
  warning: string
  whoTitle: string
  whoSub: string
  personas: Persona[]
  faqTitle: string
  faq: FaqItem[]
  finalTitle: string
  finalSub: string
  deliveryNote: string
  oldPriceLabel: string
  uah: string
  singleLabel: string
  singleSub: string
  singleBadge: string
  packLabel: string
  packSub: string
  packBadge: string
}

const CONTENT: Record<Lang, Content> = {
  uk: {
    tagline: 'The Ultimate Power Source',
    subtitle:
      'Натуральний концентрат на медовій основі з 5 потужними інгредієнтами малазійської традиції — для чоловічої сили, енергії та витривалості.',
    heroBullets: [
      'Підвищує рівень тестостерону природно',
      'Заряджає енергією на 24-48 годин',
      'Без побічних ефектів та звикання',
    ],
    inStock: 'В наявності',
    reassurance: ['Оплата при отриманні', 'Доставка 1-2 тижні', 'Знеособлена упаковка'],
    trustItems: [
      { title: '100% натуральний', desc: 'Без хімії, барвників та консервантів' },
      { title: 'Сертифікат HACCP', desc: 'Виробник Kingdom Honey, Малайзія' },
      { title: 'Швидкий ефект', desc: 'Відчутний результат вже після першого пакетика' },
      { title: 'Конфіденційно', desc: 'Доставка у непомітній упаковці без позначок' },
    ],
    ingredientsTitle: 'Що всередині — і чому це працює',
    ingredientsSub:
      '5 інгредієнтів, кожен з тисячолітньою історією. Жодної хімії, жодного синтетичного компоненту.',
    ingredients: [
      {
        num: '01',
        name: 'Натуральний мед',
        latin: 'Honey',
        desc: 'Древня основа: швидке засвоєння, природна енергія, носій усіх інших активних компонентів.',
      },
      {
        num: '02',
        name: 'Якірці сланкі',
        latin: 'Tribulus Terrestris',
        desc: 'Природний бустер тестостерону. Використовується у спортивній фармакології як легальна альтернатива гормонам.',
      },
      {
        num: '03',
        name: 'Мака перуанська',
        latin: 'Lepidium Peruvianum',
        desc: 'Адаптоген з андських гір. Підвищує лібідо, витривалість і стійкість до стресу. Працює без стимуляції нервової системи.',
      },
      {
        num: '04',
        name: 'Тонгкат Алі',
        latin: 'Eurycoma Longifolia',
        desc: '«Малазійський женьшень». Знижує рівень стресового кортизолу, тим самим звільняє вільний тестостерон. Прямий вплив на потенцію.',
      },
      {
        num: '05',
        name: 'Женьшень справжній',
        latin: 'Panax Ginseng',
        desc: 'Класичний адаптоген. Покращує кровообіг (включно з малим тазом), підвищує загальний тонус і концентрацію.',
      },
    ],
    realLabel: 'Реальний склад на упаковці',
    realLabelSub: 'Прозоро. Ми показуємо те, що написано на коробці виробника.',
    packagingTitle: '12 саше — повний курс',
    packagingSub:
      'Одна коробка — на ~3-4 тижні застосування. Кожне саше містить готову одноразову дозу 20 г, не потрібно відмірювати.',
    packagingStats: [
      { value: '12', label: 'саше у коробці' },
      { value: '20 г', label: 'кожне саше' },
      { value: '240 г', label: 'загальна вага' },
      { value: '5 років', label: 'термін придатності' },
    ],
    howTitle: 'Як приймати',
    howSub: 'Простіше не буває. Згідно з інструкцією виробника.',
    howSteps: [
      {
        num: '01',
        title: 'Прийми 1 саше',
        desc: 'Розкрий пакетик і прийми вміст (20 г) безпосередньо — найкраще натщесерце або за 30-60 хв до прийому їжі.',
      },
      {
        num: '02',
        title: 'Перерва 2 дні',
        desc: 'Ефект триває до 48 годин. Наступне саше — за потребою, не раніше ніж через 2 дні.',
      },
      {
        num: '03',
        title: 'Повний курс — 12 саше',
        desc: 'Однієї коробки вистачає на 3-4 тижні. Після закінчення можна повторити курс за бажанням.',
      },
    ],
    warningTitle: 'Важливо',
    warning:
      'Не рекомендується дітям та вагітним жінкам. Особам із серцево-судинними захворюваннями перед застосуванням проконсультуватися з лікарем. Зберігати у прохолодному сухому місці.',
    whoTitle: 'Кому підходить',
    whoSub: 'Royal Honey VIP створено для чоловіків, які цінують натуральне і не бояться сильної формули.',
    personas: [
      {
        age: '25 – 40 років',
        title: 'Активним чоловікам',
        desc: 'Тим, хто помітив зниження потенції, енергії чи бажання. Хоче відновити форму, але не довіряє хімії.',
      },
      {
        age: 'Спортсмени',
        title: 'Атлетам та воїнам',
        desc: 'Природна підтримка тестостерону без заборонених субстанцій. Швидке відновлення після навантажень.',
      },
      {
        age: '40+ років',
        title: 'Чоловікам зрілого віку',
        desc: 'Підтримка чоловічого здоров\'я, енергії та довголіття на природній основі. Без побічних ефектів.',
      },
    ],
    faqTitle: 'Часті питання',
    faq: [
      {
        q: 'Коли буде помітний ефект?',
        a: 'У більшості випадків — вже після першого пакетика, протягом 1-2 годин. Тривалість ефекту до 48 годин.',
      },
      {
        q: 'Чи є побічні ефекти або звикання?',
        a: 'Формула повністю натуральна, без синтетичних стимуляторів. Звикання немає. У окремих випадках можливе легке відчуття тепла — це норма (мед і прянощі).',
      },
      {
        q: 'Чи можна поєднувати з ліками?',
        a: 'При прийомі серцево-судинних або гормональних препаратів — обов\'язково проконсультуйтеся з лікарем перед застосуванням.',
      },
      {
        q: 'Як упакована посилка?',
        a: 'Знеособлений нейтральний пакет — без логотипів і написів. Кур\'єр не знає, що всередині. Конфіденційність гарантована.',
      },
      {
        q: 'Що якщо не підійде?',
        a: 'Зателефонуйте нам — ми завжди готові обговорити. Якщо пачка не розкрита — повертаємо кошти.',
      },
    ],
    finalTitle: 'Готовий спробувати?',
    finalSub: 'Замов зараз — менеджер передзвонить протягом 15 хвилин для підтвердження.',
    deliveryNote: 'Оплата при отриманні · Нова Пошта або Укрпошта',
    oldPriceLabel: 'Стара ціна',
    uah: 'грн',
    singleLabel: '1 стик',
    singleSub: 'Спробувати',
    singleBadge: 'Проба',
    packLabel: '12 стиків',
    packSub: 'Повний курс',
    packBadge: 'Вигідно',
  },
  ru: {
    tagline: 'The Ultimate Power Source',
    subtitle:
      'Натуральный концентрат на медовой основе с 5 мощными ингредиентами малайзийской традиции — для мужской силы, энергии и выносливости.',
    heroBullets: [
      'Повышает уровень тестостерона естественно',
      'Заряжает энергией на 24-48 часов',
      'Без побочных эффектов и привыкания',
    ],
    inStock: 'В наличии',
    reassurance: ['Оплата при получении', 'Доставка 1-2 недели', 'Анонимная упаковка'],
    trustItems: [
      { title: '100% натуральный', desc: 'Без химии, красителей и консервантов' },
      { title: 'Сертификат HACCP', desc: 'Производитель Kingdom Honey, Малайзия' },
      { title: 'Быстрый эффект', desc: 'Заметный результат уже после первого пакетика' },
      { title: 'Конфиденциально', desc: 'Доставка в нейтральной упаковке без надписей' },
    ],
    ingredientsTitle: 'Что внутри — и почему это работает',
    ingredientsSub:
      '5 ингредиентов, каждый с тысячелетней историей. Никакой химии, никаких синтетических компонентов.',
    ingredients: [
      {
        num: '01',
        name: 'Натуральный мёд',
        latin: 'Honey',
        desc: 'Древняя основа: быстрое усвоение, природная энергия, носитель всех остальных активных компонентов.',
      },
      {
        num: '02',
        name: 'Якорцы стелющиеся',
        latin: 'Tribulus Terrestris',
        desc: 'Природный бустер тестостерона. Используется в спортивной фармакологии как легальная альтернатива гормонам.',
      },
      {
        num: '03',
        name: 'Мака перуанская',
        latin: 'Lepidium Peruvianum',
        desc: 'Адаптоген из андских гор. Повышает либидо, выносливость и устойчивость к стрессу. Работает без стимуляции нервной системы.',
      },
      {
        num: '04',
        name: 'Тонгкат Али',
        latin: 'Eurycoma Longifolia',
        desc: '«Малайзийский женьшень». Снижает уровень стрессового кортизола и тем самым освобождает свободный тестостерон. Прямое влияние на потенцию.',
      },
      {
        num: '05',
        name: 'Женьшень настоящий',
        latin: 'Panax Ginseng',
        desc: 'Классический адаптоген. Улучшает кровообращение (включая малый таз), повышает общий тонус и концентрацию.',
      },
    ],
    realLabel: 'Реальный состав на упаковке',
    realLabelSub: 'Прозрачно. Мы показываем то, что написано на коробке производителя.',
    packagingTitle: '12 саше — полный курс',
    packagingSub:
      'Одна коробка — на ~3-4 недели применения. Каждое саше содержит готовую одноразовую дозу 20 г, ничего не нужно отмерять.',
    packagingStats: [
      { value: '12', label: 'саше в коробке' },
      { value: '20 г', label: 'каждое саше' },
      { value: '240 г', label: 'общий вес' },
      { value: '5 лет', label: 'срок годности' },
    ],
    howTitle: 'Как принимать',
    howSub: 'Проще не бывает. Согласно инструкции производителя.',
    howSteps: [
      {
        num: '01',
        title: 'Прими 1 саше',
        desc: 'Раскрой пакетик и прими содержимое (20 г) — лучше всего натощак или за 30-60 минут до еды.',
      },
      {
        num: '02',
        title: 'Перерыв 2 дня',
        desc: 'Эффект длится до 48 часов. Следующее саше — по необходимости, не раньше чем через 2 дня.',
      },
      {
        num: '03',
        title: 'Полный курс — 12 саше',
        desc: 'Одной коробки хватит на 3-4 недели. После окончания можно повторить курс по желанию.',
      },
    ],
    warningTitle: 'Важно',
    warning:
      'Не рекомендуется детям и беременным женщинам. Лицам с сердечно-сосудистыми заболеваниями перед применением проконсультироваться с врачом. Хранить в прохладном сухом месте.',
    whoTitle: 'Кому подходит',
    whoSub: 'Royal Honey VIP создан для мужчин, которые ценят натуральное и не боятся сильной формулы.',
    personas: [
      {
        age: '25 – 40 лет',
        title: 'Активным мужчинам',
        desc: 'Тем, кто заметил снижение потенции, энергии или желания. Хочет вернуть форму, но не доверяет химии.',
      },
      {
        age: 'Спортсменам',
        title: 'Атлетам и воинам',
        desc: 'Природная поддержка тестостерона без запрещённых субстанций. Быстрое восстановление после нагрузок.',
      },
      {
        age: '40+ лет',
        title: 'Мужчинам зрелого возраста',
        desc: 'Поддержка мужского здоровья, энергии и долголетия на природной основе. Без побочных эффектов.',
      },
    ],
    faqTitle: 'Частые вопросы',
    faq: [
      {
        q: 'Когда будет заметен эффект?',
        a: 'В большинстве случаев — уже после первого пакетика, в течение 1-2 часов. Длительность эффекта до 48 часов.',
      },
      {
        q: 'Есть ли побочные эффекты или привыкание?',
        a: 'Формула полностью натуральная, без синтетических стимуляторов. Привыкания нет. В отдельных случаях возможно лёгкое ощущение тепла — это норма (мёд и пряности).',
      },
      {
        q: 'Можно ли совмещать с лекарствами?',
        a: 'При приёме сердечно-сосудистых или гормональных препаратов — обязательно проконсультируйтесь с врачом перед применением.',
      },
      {
        q: 'Как упакована посылка?',
        a: 'Нейтральный пакет — без логотипов и надписей. Курьер не знает, что внутри. Конфиденциальность гарантирована.',
      },
      {
        q: 'Что если не подойдёт?',
        a: 'Позвоните нам — мы всегда готовы обсудить. Если упаковка не вскрыта — возвращаем деньги.',
      },
    ],
    finalTitle: 'Готов попробовать?',
    finalSub: 'Закажи сейчас — менеджер перезвонит в течение 15 минут для подтверждения.',
    deliveryNote: 'Оплата при получении · Нова Пошта или Укрпошта',
    oldPriceLabel: 'Старая цена',
    uah: 'грн',
    singleLabel: '1 стик',
    singleSub: 'Попробовать',
    singleBadge: 'Проба',
    packLabel: '12 стиков',
    packSub: 'Полный курс',
    packBadge: 'Выгодно',
  },
  en: {
    tagline: 'The Ultimate Power Source',
    subtitle:
      'Natural honey-based concentrate with 5 powerful Malaysian-tradition ingredients — for male strength, energy and stamina.',
    heroBullets: [
      'Naturally boosts testosterone levels',
      'Energises you for 24-48 hours',
      'No side effects, no dependency',
    ],
    inStock: 'In stock',
    reassurance: ['Pay on delivery', 'Delivery 1-2 weeks', 'Discreet packaging'],
    trustItems: [
      { title: '100% natural', desc: 'No chemistry, no dyes, no preservatives' },
      { title: 'HACCP certified', desc: 'Manufactured by Kingdom Honey, Malaysia' },
      { title: 'Fast effect', desc: 'Noticeable result after the very first sachet' },
      { title: 'Confidential', desc: 'Shipped in unbranded packaging' },
    ],
    ingredientsTitle: "What's inside — and why it works",
    ingredientsSub:
      '5 ingredients, each with a thousand-year history. No chemistry, no synthetic components.',
    ingredients: [
      {
        num: '01',
        name: 'Natural honey',
        latin: 'Honey',
        desc: 'Ancient base: fast absorption, natural energy, carrier of all the other active compounds.',
      },
      {
        num: '02',
        name: 'Puncture vine',
        latin: 'Tribulus Terrestris',
        desc: 'Natural testosterone booster. Used in sports nutrition as a legal alternative to hormones.',
      },
      {
        num: '03',
        name: 'Peruvian maca',
        latin: 'Lepidium Peruvianum',
        desc: 'Andean adaptogen. Increases libido, stamina and stress resilience — without stimulating the nervous system.',
      },
      {
        num: '04',
        name: 'Tongkat Ali',
        latin: 'Eurycoma Longifolia',
        desc: '"Malaysian ginseng." Lowers stress cortisol, which frees up bound testosterone. Direct impact on potency.',
      },
      {
        num: '05',
        name: 'True ginseng',
        latin: 'Panax Ginseng',
        desc: 'Classic adaptogen. Improves circulation (including the pelvic area), raises overall tone and focus.',
      },
    ],
    realLabel: 'Real composition on the box',
    realLabelSub: 'Transparent. We show exactly what the manufacturer writes on the packaging.',
    packagingTitle: '12 sachets — full course',
    packagingSub:
      'One box covers ~3-4 weeks of use. Each sachet contains a ready-to-use 20 g dose — no measuring required.',
    packagingStats: [
      { value: '12', label: 'sachets per box' },
      { value: '20 g', label: 'each sachet' },
      { value: '240 g', label: 'total weight' },
      { value: '5 years', label: 'shelf life' },
    ],
    howTitle: 'How to take',
    howSub: "Couldn't be simpler. As per the manufacturer's instructions.",
    howSteps: [
      {
        num: '01',
        title: 'Take 1 sachet',
        desc: 'Open the sachet and consume the contents (20 g) directly — best on an empty stomach or 30-60 minutes before a meal.',
      },
      {
        num: '02',
        title: 'Wait 2 days',
        desc: 'The effect lasts up to 48 hours. The next sachet — as needed, no earlier than 2 days later.',
      },
      {
        num: '03',
        title: 'Full course — 12 sachets',
        desc: 'One box lasts 3-4 weeks. You may repeat the course afterwards if you wish.',
      },
    ],
    warningTitle: 'Important',
    warning:
      'Not recommended for children or pregnant women. People with cardiovascular conditions should consult a doctor before use. Store in a cool dry place.',
    whoTitle: "Who it's for",
    whoSub: 'Royal Honey VIP is built for men who value natural and respect a strong formula.',
    personas: [
      {
        age: 'Ages 25 – 40',
        title: 'Active men',
        desc: 'For those noticing a dip in potency, energy or desire. Wants to bounce back, but does not trust chemistry.',
      },
      {
        age: 'Athletes',
        title: 'Athletes & warriors',
        desc: 'Natural testosterone support without banned substances. Fast recovery after heavy loads.',
      },
      {
        age: 'Age 40+',
        title: 'Mature men',
        desc: 'Natural support for male health, energy and longevity. Without side effects.',
      },
    ],
    faqTitle: 'Frequently asked',
    faq: [
      {
        q: 'How fast is the effect?',
        a: 'In most cases — after the very first sachet, within 1-2 hours. The effect lasts up to 48 hours.',
      },
      {
        q: 'Any side effects or dependency?',
        a: 'The formula is fully natural, no synthetic stimulants. No dependency. A mild warming sensation is normal — that is the honey and the spices.',
      },
      {
        q: 'Can I combine it with medication?',
        a: "If you're on cardiovascular or hormonal medication — please consult your doctor before use.",
      },
      {
        q: 'How is the parcel packaged?',
        a: 'Plain unmarked envelope — no logos, no labels. The courier does not know what is inside. Confidentiality guaranteed.',
      },
      {
        q: "What if it doesn't suit me?",
        a: "Call us — we're always open to talk. If the pack is unopened — we refund.",
      },
    ],
    finalTitle: 'Ready to try?',
    finalSub: 'Order now — our manager will call you within 15 minutes to confirm.',
    deliveryNote: 'Pay on delivery · Nova Poshta or Ukrposhta',
    oldPriceLabel: 'Old price',
    uah: 'UAH',
    singleLabel: '1 sachet',
    singleSub: 'Try first',
    singleBadge: 'Sample',
    packLabel: '12 sachets',
    packSub: 'Full course',
    packBadge: 'Best value',
  },
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default async function ProductPage({ params }: { params: Promise<{ lang: Locale; slug: string }> }) {
  const { lang, slug } = await params
  // dict reserved for future shared strings; currently page uses CONTENT for all copy
  await getDictionary(lang)

  const product = await loadProduct(slug)
  if (!product) notFound()

  const c = CONTENT[lang]
  const nameKey = `name${cap(lang)}` as 'nameUk' | 'nameRu' | 'nameEn'

  const reviewStats = await loadApprovedReviews(0).catch(() => ({ total: 0, averageRating: 0, reviews: [] }))

  const variants: BuyVariant[] = [
    {
      id: 'forte-1stik',
      slug: 'forte-1stik',
      productName: product[nameKey],
      variantLabel: c.singleLabel,
      variantSub: c.singleSub,
      badge: c.singleBadge,
      price: SINGLE_PRICE,
      oldPrice: SINGLE_OLD,
      image: '/products/royal-honey-1stik.png',
    },
    {
      id: 'forte',
      slug: product.slug,
      productName: product[nameKey],
      variantLabel: c.packLabel,
      variantSub: c.packSub,
      badge: c.packBadge,
      price: PACK_PRICE,
      oldPrice: PACK_OLD,
      image: product.imageUrl ?? '/products/royal-honey-front.png',
    },
  ]

  const productLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product[nameKey],
    description: c.subtitle,
    sku: product.slug,
    brand: { '@type': 'Brand', name: 'Royal Honey by Kingdom Honey' },
    image: [`${SITE_URL}${product.imageUrl ?? '/products/royal-honey-front.png'}`],
    offers: {
      '@type': 'AggregateOffer',
      url: `${SITE_URL}/${lang}/product/${product.slug}`,
      priceCurrency: 'UAH',
      lowPrice: SINGLE_PRICE,
      highPrice: PACK_PRICE,
      offerCount: 2,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }

  if (reviewStats.total > 0) {
    productLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: reviewStats.averageRating,
      reviewCount: reviewStats.total,
      bestRating: 5,
      worstRating: 1,
    }
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ManPrime',
        item: `${SITE_URL}/${lang}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: product[nameKey],
        item: `${SITE_URL}/${lang}/product/${product.slug}`,
      },
    ],
  }

  return (
    <div className="bg-background">
      <Script
        id="ld-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <Script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <Script
        id="ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* HERO */}
      <section className="relative pt-12 md:pt-20 pb-16 md:pb-24 overflow-hidden">
        {/* honeycomb backdrop */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 100'%3E%3Cpath d='M28 0L56 16.6v33.4L28 66.7L0 50V16.6z' fill='none' stroke='%23D4A562' stroke-width='1'/%3E%3C/svg%3E\")",
            backgroundSize: '60px 100px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Photo */}
          <div className="relative aspect-square flex items-center justify-center order-2 lg:order-1">
            {/* radial gold glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,165,98,0.28)_0%,transparent_60%)] pointer-events-none" />
            <Image
              src={product.imageUrl ?? '/products/royal-honey-front.png'}
              alt={`${product[nameKey]} — front of pack`}
              width={720}
              height={560}
              priority
              className="relative max-w-[85%] h-auto object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)]"
            />
            <span className="absolute top-4 right-4 md:top-8 md:right-8 text-[10px] font-bold tracking-[0.25em] uppercase px-3 py-1.5 rounded-full bg-copper text-background shadow-[0_6px_20px_rgba(212,165,98,0.4)]">
              TOP
            </span>
          </div>

          {/* Info */}
          <div className="order-1 lg:order-2">
            <p className="text-copper text-[11px] tracking-[0.35em] uppercase font-medium">{c.tagline}</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mt-3 leading-[1.05]">
              {product[nameKey]}
            </h1>
            <p className="text-muted text-base md:text-lg leading-relaxed mt-6 max-w-xl">{c.subtitle}</p>

            <ul className="mt-8 space-y-3.5">
              {c.heroBullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-foreground/90 text-[15px]">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-copper/20 border border-copper/50 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <BuyBox
                lang={lang}
                variants={variants}
                oldPriceLabel={c.oldPriceLabel}
                uahLabel={c.uah}
                inStockLabel={c.inStock}
                variant="full"
              />
            </div>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-muted-2 text-[12px] tracking-wide">
              {c.reassurance.map((r) => (
                <li key={r} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-copper" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-border bg-surface/40">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {c.trustItems.map((t) => (
            <div key={t.title}>
              <div className="w-9 h-9 rounded-full border border-copper/40 bg-copper/5 flex items-center justify-center mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-copper" />
              </div>
              <h3 className="font-serif text-foreground text-lg md:text-xl leading-tight">{t.title}</h3>
              <p className="text-muted text-[13px] leading-relaxed mt-2">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INGREDIENTS */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
            <p className="text-copper text-[11px] tracking-[0.35em] uppercase font-medium">Composition</p>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mt-3 leading-tight">
              {c.ingredientsTitle}
            </h2>
            <p className="text-muted text-base leading-relaxed mt-5">{c.ingredientsSub}</p>
          </div>

          <div className="space-y-4 md:space-y-6">
            {c.ingredients.map((ing) => (
              <div
                key={ing.num}
                className="group bg-surface border border-border hover:border-copper/40 rounded-2xl p-6 md:p-8 transition-colors duration-300 grid grid-cols-[auto_1fr] md:grid-cols-[120px_1fr] gap-5 md:gap-8 items-start"
              >
                <div className="font-serif text-copper text-3xl md:text-5xl leading-none">{ing.num}</div>
                <div>
                  <h3 className="font-serif text-foreground text-xl md:text-2xl leading-tight">{ing.name}</h3>
                  <p className="text-muted-2 text-[12px] tracking-[0.15em] uppercase mt-1">{ing.latin}</p>
                  <p className="text-muted text-[14px] md:text-[15px] leading-relaxed mt-3 max-w-2xl">{ing.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Real label photo as proof */}
          <div className="mt-16 md:mt-20 bg-surface/60 border border-border rounded-3xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <p className="text-copper text-[11px] tracking-[0.35em] uppercase font-medium">Proof</p>
              <h3 className="font-serif text-foreground text-2xl md:text-3xl mt-2 leading-tight">{c.realLabel}</h3>
              <p className="text-muted text-[14px] md:text-[15px] leading-relaxed mt-3 max-w-md">{c.realLabelSub}</p>
            </div>
            <Image
              src="/products/royal-honey-back.png"
              alt="Royal Honey VIP — back of pack with ingredients list"
              width={460}
              height={300}
              className="w-full md:w-105 h-auto object-contain rounded-xl drop-shadow-[0_18px_36px_rgba(0,0,0,0.4)]"
            />
          </div>
        </div>
      </section>

      {/* PACKAGING */}
      <section className="border-y border-border bg-surface/30 py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="relative aspect-square flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,165,98,0.2)_0%,transparent_60%)] pointer-events-none" />
            <Image
              src="/products/royal-honey-pair.png"
              alt="Royal Honey VIP — pair of boxes showing 12 sachets per pack"
              width={620}
              height={500}
              className="relative max-w-[90%] h-auto object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)]"
            />
          </div>
          <div>
            <p className="text-copper text-[11px] tracking-[0.35em] uppercase font-medium">Inside the box</p>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mt-3 leading-tight">{c.packagingTitle}</h2>
            <p className="text-muted text-base leading-relaxed mt-6 max-w-md">{c.packagingSub}</p>

            <div className="mt-10 grid grid-cols-2 gap-5">
              {c.packagingStats.map((s) => (
                <div key={s.label} className="bg-surface border border-border rounded-2xl p-5">
                  <div className="font-serif text-copper text-3xl md:text-4xl leading-none">{s.value}</div>
                  <div className="text-muted-2 text-[12px] tracking-wide mt-2">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO USE */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-copper text-[11px] tracking-[0.35em] uppercase font-medium">Directions</p>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mt-3 leading-tight">{c.howTitle}</h2>
            <p className="text-muted text-base leading-relaxed mt-5">{c.howSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
            {c.howSteps.map((s) => (
              <div key={s.num} className="bg-surface border border-border rounded-2xl p-7 md:p-8">
                <div className="font-serif text-copper text-4xl md:text-5xl leading-none mb-5">{s.num}</div>
                <h3 className="font-serif text-foreground text-xl md:text-2xl leading-tight">{s.title}</h3>
                <p className="text-muted text-[14px] leading-relaxed mt-3">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-amber-500/5 border border-amber-500/30 rounded-2xl p-6 md:p-7 flex items-start gap-4">
            <svg className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-amber-300 font-semibold text-sm tracking-wide">{c.warningTitle}</p>
              <p className="text-muted text-[13px] md:text-[14px] leading-relaxed mt-1">{c.warning}</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="border-y border-border bg-surface/30 py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-copper text-[11px] tracking-[0.35em] uppercase font-medium">Audience</p>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mt-3 leading-tight">{c.whoTitle}</h2>
            <p className="text-muted text-base leading-relaxed mt-5">{c.whoSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {c.personas.map((p) => (
              <div key={p.title} className="bg-surface border border-border hover:border-copper/40 transition-colors rounded-2xl p-7 md:p-8">
                <p className="text-copper text-[11px] tracking-[0.3em] uppercase font-medium">{p.age}</p>
                <h3 className="font-serif text-foreground text-2xl md:text-[28px] leading-tight mt-3">{p.title}</h3>
                <p className="text-muted text-[14px] leading-relaxed mt-4">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <ReviewsSection lang={lang} />

      {/* FAQ */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <div className="text-center mb-14">
            <p className="text-copper text-[11px] tracking-[0.35em] uppercase font-medium">FAQ</p>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mt-3 leading-tight">{c.faqTitle}</h2>
          </div>

          <div className="space-y-3">
            {c.faq.map((item, i) => (
              <details
                key={i}
                className="group bg-surface border border-border hover:border-copper/30 rounded-2xl px-6 md:px-8 py-5 transition-colors"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-foreground font-serif text-lg md:text-xl">
                  <span>{item.q}</span>
                  <svg className="w-5 h-5 text-copper shrink-0 transition-transform duration-300 group-open:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </summary>
                <p className="text-muted text-[14px] md:text-[15px] leading-relaxed mt-4 pr-8">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-24 md:py-32 overflow-hidden border-t border-border">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,165,98,0.18)_0%,transparent_60%)] pointer-events-none"
        />
        <div className="relative max-w-3xl mx-auto px-5 md:px-8 text-center">
          <p className="text-copper text-[11px] tracking-[0.35em] uppercase font-medium">Get yours</p>
          <h2 className="font-serif text-4xl md:text-6xl text-foreground mt-4 leading-tight">{c.finalTitle}</h2>
          <p className="text-muted text-base md:text-lg leading-relaxed mt-6 max-w-xl mx-auto">{c.finalSub}</p>

          <div className="mt-10 flex flex-col items-center gap-6">
            <div className="w-full max-w-lg">
              <BuyBox
                lang={lang}
                variants={variants}
                oldPriceLabel={c.oldPriceLabel}
                uahLabel={c.uah}
                variant="compact"
              />
            </div>
            <p className="text-muted-2 text-[12px] tracking-wide">{c.deliveryNote}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
