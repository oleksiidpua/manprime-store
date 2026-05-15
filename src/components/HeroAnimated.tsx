'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Locale } from '@/lib/i18n'

interface HeroAnimatedProps {
  lang: Locale
  ctaPrimary: string
  ctaSecondary: string
}

const slogans: Record<Locale, {
  eyebrow: string
  line1: string
  italic: string
  line3: string
  desc: string
}> = {
  uk: {
    eyebrow: "Натуральні БАДи для потенції",
    line1: 'Сила, яку ти',
    italic: 'відчуєш',
    line3: 'щодня',
    desc: "Royal Honey VIP — природний бустер тестостерону на медовій основі. Покращує ерекцію, продовжує секс, повертає чоловічу впевненість. Без хімії, без побічних ефектів. З турботою про твоє тіло, енергію та впевненість.",
  },
  ru: {
    eyebrow: 'Натуральные БАДы для потенции',
    line1: 'Сила, которую',
    italic: 'чувствуешь',
    line3: 'каждый день',
    desc: 'Royal Honey VIP — природный бустер тестостерона на медовой основе. Улучшает эрекцию, продлевает секс, возвращает мужскую уверенность. Без химии, без побочных эффектов. С заботой о твоём теле, энергии и уверенности.',
  },
  en: {
    eyebrow: "Natural supplements for potency",
    line1: 'The strength you',
    italic: 'feel',
    line3: 'every day',
    desc: 'Royal Honey VIP — a natural testosterone booster on a honey base. Improves erection, helps you last longer in bed, restores male confidence. No chemicals, no side effects. Made with care for your body, energy, and confidence.',
  },
}

export default function HeroAnimated({ lang, ctaPrimary, ctaSecondary }: HeroAnimatedProps) {
  const s = slogans[lang]

  return (
    <section
      className="relative overflow-hidden min-h-[88vh] md:min-h-[92vh] flex items-center bg-cover bg-no-repeat md:bg-fixed"
      style={{
        backgroundImage: 'url(/hero-couple.jpg)',
        backgroundPosition: 'center 28%',
      }}
    >
      {/* Dark overlay for legibility — radial vignette + bottom fade */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,20,40,0.45)_0%,rgba(14,20,40,0.85)_70%,rgba(14,20,40,0.96)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-b from-background/50 via-transparent to-background pointer-events-none" />

      {/* Subtle gold accent glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 rounded-full bg-copper/8 blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block text-copper text-[11px] font-medium tracking-[0.3em] uppercase mb-8"
        >
          {s.eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[92px] text-foreground leading-[1.05] tracking-tight max-w-4xl mx-auto drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
        >
          {s.line1}<br />
          <em className="italic text-copper font-normal">{s.italic}</em> {s.line3}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-foreground/85 text-base md:text-lg leading-relaxed mt-8 max-w-xl mx-auto"
        >
          {s.desc}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mt-12"
        >
          <Link
            href={`/${lang}/product/forte`}
            className="inline-flex items-center justify-center gap-2 bg-copper hover:bg-copper-hover text-background font-medium px-9 py-4 text-sm tracking-wide transition-colors rounded-full shadow-[0_8px_30px_rgba(212,165,98,0.35)]"
          >
            {ctaPrimary}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href={`/${lang}/about`}
            className="inline-flex items-center justify-center gap-2 border border-foreground/30 text-foreground hover:border-copper hover:text-copper font-medium px-9 py-4 text-sm tracking-wide transition-colors rounded-full backdrop-blur-sm bg-background/20"
          >
            {ctaSecondary}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-20 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-foreground/70 text-[11px] tracking-[0.2em] uppercase"
        >
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-copper" />
            {lang === 'uk' ? '100% Натурально' : lang === 'ru' ? '100% Натурально' : '100% Natural'}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-copper" />
            {lang === 'uk' ? 'Українська якість' : lang === 'ru' ? 'Украинское качество' : 'Made in Ukraine'}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-copper" />
            {lang === 'uk' ? 'Без хімії' : lang === 'ru' ? 'Без химии' : 'No chemicals'}
          </span>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-foreground/60"
        aria-hidden
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">
          {lang === 'uk' ? 'Гортай' : lang === 'ru' ? 'Листай' : 'Scroll'}
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-linear-to-b from-foreground/60 to-transparent"
        />
      </motion.div>
    </section>
  )
}
