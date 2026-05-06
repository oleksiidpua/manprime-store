import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

type LogoProps = {
  lang?: Locale
  variant?: 'default' | 'compact' | 'mark'
  className?: string
}

/**
 * ManPrime logo — shield silhouette with intertwined leaf/flame motif inside,
 * recreated as SVG in cream + copper to match the Deep Forest palette.
 * Works on the dark background without any backing.
 *
 * variant=default: shield + MANPRIME + tagline
 * variant=compact: shield + MANPRIME (no tagline)
 * variant=mark:    shield only
 */
export default function Logo({ lang = 'uk', variant = 'compact', className = '' }: LogoProps) {
  const taglines: Record<Locale, string> = {
    uk: "ЧОЛОВІЧЕ ЗДОРОВ'Я",
    ru: 'МУЖСКОЕ ЗДОРОВЬЕ',
    en: "NATURAL MEN'S HEALTH",
  }

  return (
    <Link
      href={`/${lang}`}
      className={`inline-flex items-center gap-3 group ${className}`}
      aria-label="ManPrime — головна"
    >
      <ShieldMark className="h-11 w-auto transition-transform duration-300 group-hover:scale-105" />
      {variant !== 'mark' && (
        <span className="flex flex-col leading-none">
          <span className="font-serif text-foreground text-[22px] font-medium tracking-tight">
            ManPrime
          </span>
          {variant === 'default' && (
            <span className="text-[9px] font-sans text-muted-2 tracking-[0.22em] uppercase mt-1.5">
              {taglines[lang]}
            </span>
          )}
        </span>
      )}
    </Link>
  )
}

/**
 * Shield + intertwined leaves mark.
 * Based on the original ManPrime Variant 2 design — yin-yang style leaves
 * inside a shield silhouette with a flame on top, rendered in cream + copper.
 */
function ShieldMark({ className = '' }: { className?: string }) {
  const cream = '#F5F0E6'
  const copper = '#B87333'

  return (
    <svg
      viewBox="0 0 80 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Shield outline — rounded pentagon */}
      <path
        d="M40 3 L72 12 C73 12 74 13 74 14 L74 42 C74 60 60 76 40 84 C20 76 6 60 6 42 L6 14 C6 13 7 12 8 12 Z"
        stroke={cream}
        strokeWidth="2.4"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Inner ring — subtle */}
      <path
        d="M40 9 L67 16 C68 16 69 17 69 18 L69 42 C69 56 57 70 40 77 C23 70 11 56 11 42 L11 18 C11 17 12 16 13 16 Z"
        stroke={cream}
        strokeWidth="0.8"
        strokeOpacity="0.25"
        fill="none"
      />

      {/* Flame on top */}
      <path
        d="M40 18 C42 22 44 24 44 28 C44 31 42 33 40 33 C38 33 36 31 36 28 C36 24 38 22 40 18 Z"
        fill={copper}
      />

      {/* Left leaf — cream stroke with copper inner accent */}
      <path
        d="M28 30 C24 36 24 48 28 56 C32 60 38 62 42 60 C36 56 32 50 32 44 C32 38 35 33 40 30 C36 28 31 28 28 30 Z"
        stroke={cream}
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M30 34 C27 38 27 48 30 54 C32 56 35 57 37 56 C33 53 30 49 30 44 C30 39 32 35 35 33 C33 32 31 33 30 34 Z"
        fill={copper}
        opacity="0.85"
      />

      {/* Right leaf — mirror */}
      <path
        d="M52 30 C56 36 56 48 52 56 C48 60 42 62 38 60 C44 56 48 50 48 44 C48 38 45 33 40 30 C44 28 49 28 52 30 Z"
        stroke={cream}
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Center dot */}
      <circle cx="40" cy="46" r="2" fill={cream} />
    </svg>
  )
}
