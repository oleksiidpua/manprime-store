import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/lib/i18n'

type LogoProps = {
  lang?: Locale
  variant?: 'default' | 'compact' | 'mark'
  className?: string
}

/**
 * ManPrime original logo (Variant 2) — shield + leaf mark + wordmark.
 * Uses original PNG. Sits on a soft cream-colored badge so the navy/orange
 * remains legible on the dark forest background.
 */
export default function Logo({ lang = 'uk', variant = 'compact', className = '' }: LogoProps) {
  const sizes = {
    default: { w: 180, h: 90, padding: 'px-4 py-2' },
    compact: { w: 120, h: 50, padding: 'px-3 py-2' },
    mark: { w: 50, h: 50, padding: 'p-2' },
  }
  const s = sizes[variant]

  return (
    <Link
      href={`/${lang}`}
      className={`inline-flex items-center group ${className}`}
      aria-label="ManPrime — головна"
    >
      <span
        className={`relative bg-foreground/95 rounded-lg ${s.padding} transition-all duration-300 group-hover:bg-foreground`}
      >
        <Image
          src="/logo-original.png"
          alt="ManPrime"
          width={s.w}
          height={s.h}
          priority
          className="h-auto w-auto"
          style={{ maxHeight: variant === 'mark' ? 36 : variant === 'compact' ? 38 : 70 }}
        />
      </span>
    </Link>
  )
}
