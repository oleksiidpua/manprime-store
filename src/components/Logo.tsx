import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

type LogoProps = {
  lang?: Locale
  variant?: 'default' | 'compact' | 'mark'
  className?: string
}

/**
 * ManPrime logo — shield + leaf mark + Lora wordmark.
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
      <ShieldMark className="h-9 w-auto text-copper transition-transform duration-300 group-hover:scale-105" />
      {variant !== 'mark' && (
        <span className="flex flex-col leading-none">
          <span className="font-serif text-foreground text-[22px] font-medium tracking-tight">
            ManPrime
          </span>
          {variant === 'default' && (
            <span className="text-[9px] font-sans text-muted-2 tracking-[0.2em] uppercase mt-1">
              {taglines[lang]}
            </span>
          )}
        </span>
      )}
    </Link>
  )
}

function ShieldMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Shield outline */}
      <path
        d="M30 2 L54 10 L54 32 C54 46 44 56 30 62 C16 56 6 46 6 32 L6 10 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Inner leaf — left curve */}
      <path
        d="M22 18 C18 24 18 34 22 42 C26 46 30 47 32 46 C28 42 26 36 26 30 C26 24 28 20 32 16 C29 16 25 16 22 18 Z"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Inner leaf — right flame */}
      <path
        d="M34 14 C32 18 32 22 34 26 C36 30 40 32 42 30 C44 26 44 22 42 18 C40 14 36 12 34 14 Z"
        fill="currentColor"
        opacity="0.55"
      />
      {/* Drop highlight */}
      <circle cx="30" cy="34" r="2" fill="var(--background)" />
    </svg>
  )
}
