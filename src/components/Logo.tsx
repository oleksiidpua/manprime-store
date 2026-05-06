import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

type LogoProps = {
  lang?: Locale
  variant?: 'default' | 'compact' | 'mark'
  className?: string
}

/**
 * ManPrime logo — shield + leaf/flame mark + Lora wordmark.
 * variant=default: shield + MANPRIME + tagline
 * variant=compact: shield + MANPRIME (no tagline)
 * variant=mark:    shield only
 */
export default function Logo({ lang = 'uk', variant = 'compact', className = '' }: LogoProps) {
  const taglines: Record<Locale, string> = {
    uk: "ЧОЛОВІЧЕ ЗДОРОВ'Я",
    ru: 'МУЖСКОЕ ЗДОРОВЬЕ',
    en: "MEN'S HEALTH",
  }

  return (
    <Link
      href={`/${lang}`}
      className={`inline-flex items-center gap-3 group ${className}`}
      aria-label="ManPrime — головна"
    >
      <ShieldMark className="h-10 w-auto text-copper transition-transform duration-300 group-hover:scale-105" />
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
 * Refined shield: smoother curves, balanced leaf + flame, subtle highlight.
 */
function ShieldMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Shield outline — refined with smoother bottom curve */}
      <path
        d="M30 2 L54 9 C55 9 55.5 9.5 55.5 10.5 L55.5 32 C55.5 47 44.5 58 30 64 C15.5 58 4.5 47 4.5 32 L4.5 10.5 C4.5 9.5 5 9 6 9 Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Inner shield ring — subtle */}
      <path
        d="M30 7 L50 13 L50 32 C50 44 41 53 30 58 C19 53 10 44 10 32 L10 13 Z"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeOpacity="0.3"
        fill="none"
      />

      {/* Left leaf — solid */}
      <path
        d="M22 20 C18 26 18 36 22 43 C25 47 29 48 31 47 C27 43 25 37 25 31 C25 25 27 21 31 17 C28 17 24 18 22 20 Z"
        fill="currentColor"
        opacity="0.92"
      />

      {/* Right flame — lighter, paired */}
      <path
        d="M35 15 C33 19 33 23 35 27 C37 31 41 32 43 30 C45 26 45 21 43 17 C41 14 37 13 35 15 Z"
        fill="currentColor"
        opacity="0.5"
      />

      {/* Center drop highlight */}
      <circle cx="30" cy="36" r="1.8" fill="var(--background)" />
    </svg>
  )
}
