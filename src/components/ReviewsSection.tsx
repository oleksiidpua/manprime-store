import type { Locale } from '@/lib/i18n'
import { loadApprovedReviews } from '@/lib/reviews'
import ReviewForm from '@/components/ReviewForm'

interface ReviewsSectionProps {
  lang: Locale
}

const dict: Record<Locale, {
  eyebrow: string
  title: string
  titleAccent: string
  titleTail: string
  sub: string
  rating: string
  basedOn: string
  reviews: string
  noReviews: string
  monthAgo: (n: number) => string
  dayAgo: (n: number) => string
  hourAgo: (n: number) => string
  justNow: string
}> = {
  uk: {
    eyebrow: 'Відгуки',
    title: 'Що кажуть',
    titleAccent: 'наші клієнти',
    titleTail: '',
    sub: 'Реальні відгуки чоловіків, які вже спробували Royal Honey VIP. Кожен відгук проходить модерацію перед публікацією.',
    rating: 'із 5',
    basedOn: 'на основі',
    reviews: 'відгуків',
    noReviews: 'Поки що немає відгуків — будьте першим!',
    monthAgo: (n) => (n === 1 ? 'місяць тому' : `${n} міс. тому`),
    dayAgo: (n) => (n === 1 ? 'вчора' : `${n} дн. тому`),
    hourAgo: (n) => (n === 1 ? 'годину тому' : `${n} год. тому`),
    justNow: 'щойно',
  },
  ru: {
    eyebrow: 'Отзывы',
    title: 'Что говорят',
    titleAccent: 'наши клиенты',
    titleTail: '',
    sub: 'Реальные отзывы мужчин, которые уже попробовали Royal Honey VIP. Каждый отзыв проходит модерацию перед публикацией.',
    rating: 'из 5',
    basedOn: 'на основе',
    reviews: 'отзывов',
    noReviews: 'Пока нет отзывов — будьте первым!',
    monthAgo: (n) => (n === 1 ? 'месяц назад' : `${n} мес. назад`),
    dayAgo: (n) => (n === 1 ? 'вчера' : `${n} дн. назад`),
    hourAgo: (n) => (n === 1 ? 'час назад' : `${n} ч. назад`),
    justNow: 'только что',
  },
  en: {
    eyebrow: 'Reviews',
    title: 'What our',
    titleAccent: 'customers say',
    titleTail: '',
    sub: 'Real reviews from men who have already tried Royal Honey VIP. Every review is moderated before being published.',
    rating: 'out of 5',
    basedOn: 'based on',
    reviews: 'reviews',
    noReviews: 'No reviews yet — be the first!',
    monthAgo: (n) => (n === 1 ? '1 month ago' : `${n} months ago`),
    dayAgo: (n) => (n === 1 ? 'yesterday' : `${n} days ago`),
    hourAgo: (n) => (n === 1 ? '1 hour ago' : `${n} hours ago`),
    justNow: 'just now',
  },
}

function timeAgo(date: Date, t: (typeof dict)['uk']): string {
  const ms = Date.now() - new Date(date).getTime()
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return t.justNow
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return t.hourAgo(1)
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return t.hourAgo(hours)
  const days = Math.floor(hours / 24)
  if (days < 30) return t.dayAgo(days)
  const months = Math.floor(days / 30)
  return t.monthAgo(Math.max(1, months))
}

function initials(name: string): string {
  return name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('') || '·'
}

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const px = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          className={`${px} ${n <= rating ? 'text-copper' : 'text-border-2'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  )
}

export default async function ReviewsSection({ lang }: ReviewsSectionProps) {
  const t = dict[lang]
  const { reviews, total, averageRating } = await loadApprovedReviews(9)

  return (
    <section id="reviews" className="py-24 md:py-32 border-y border-border">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-copper text-[11px] tracking-[0.35em] uppercase font-medium">{t.eyebrow}</p>
          <h2 className="font-serif text-3xl md:text-5xl text-foreground mt-3 leading-tight">
            {t.title} <em className="italic text-copper font-normal not-italic md:italic">{t.titleAccent}</em>{t.titleTail}
          </h2>
          <p className="text-muted text-base leading-relaxed mt-5">{t.sub}</p>

          {total > 0 && (
            <div className="mt-8 inline-flex items-center gap-3 bg-surface border border-border rounded-full px-5 py-2.5">
              <Stars rating={Math.round(averageRating)} size="md" />
              <span className="font-serif text-copper text-xl leading-none">{averageRating.toFixed(1)}</span>
              <span className="text-muted-2 text-[12px] tracking-wide">
                {t.rating} · {t.basedOn} {total} {t.reviews}
              </span>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="text-center text-muted text-base">{t.noReviews}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {reviews.map((r) => (
              <article
                key={r.id}
                className="bg-surface border border-border hover:border-copper/40 rounded-2xl p-6 md:p-7 transition-colors flex flex-col"
              >
                <Stars rating={r.rating} />
                <p className="text-foreground/90 text-[14px] md:text-[15px] leading-relaxed mt-4 flex-1">
                  {r.text}
                </p>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border/60">
                  <div className="w-10 h-10 rounded-full bg-copper/15 border border-copper/30 flex items-center justify-center shrink-0">
                    <span className="text-copper font-serif text-sm">{initials(r.authorName)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif text-foreground text-[15px] leading-tight truncate">{r.authorName}</p>
                    <p className="text-muted-2 text-[11px] tracking-wide mt-0.5">
                      {r.city ? `${r.city} · ` : ''}{timeAgo(r.createdAt, t)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <ReviewForm lang={lang} />
        </div>
      </div>
    </section>
  )
}
