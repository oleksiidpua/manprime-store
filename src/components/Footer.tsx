import Link from 'next/link'
import type ukDict from '@/dictionaries/uk.json'
import type { Locale } from '@/lib/i18n'
import Logo from './Logo'

type Dict = typeof ukDict

interface FooterProps {
  dict: Dict
  lang?: Locale
}

export default function Footer({ dict, lang = 'uk' }: FooterProps) {
  const f = dict.footer
  const year = new Date().getFullYear()

  const navColumns = [
    {
      title: lang === 'uk' ? 'Магазин' : lang === 'ru' ? 'Магазин' : 'Shop',
      links: [
        { href: `/${lang}/catalog`, label: dict.nav.catalog },
        { href: `/${lang}/auth`, label: dict.nav.login || 'Login' },
      ],
    },
    {
      title: lang === 'uk' ? 'Компанія' : lang === 'ru' ? 'Компания' : 'Company',
      links: [
        { href: `/${lang}/about`, label: dict.nav.about },
        { href: `/${lang}/contacts`, label: dict.nav.contacts },
      ],
    },
  ]

  return (
    <footer className="relative mt-32 border-t border-border bg-surface/40">
      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-32 bg-copper" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

          {/* Brand block */}
          <div className="md:col-span-5">
            <Logo lang={lang} variant="default" />
            <p className="text-muted text-[15px] leading-relaxed mt-6 max-w-sm">
              {lang === 'uk'
                ? 'Натуральні комплекси для чоловічого здоров\'я. Медова основа, без хімії, з турботою про твоє тіло.'
                : lang === 'ru'
                ? 'Натуральные комплексы для мужского здоровья. Медовая основа, без химии, с заботой о твоём теле.'
                : 'Natural supplements for men\'s health. Honey-based, no chemicals, made with care.'}
            </p>

            <div className="flex items-center gap-3 mt-8">
              <SocialLink href="https://instagram.com" label="Instagram">
                <InstagramIcon />
              </SocialLink>
              <SocialLink href="https://facebook.com" label="Facebook">
                <FacebookIcon />
              </SocialLink>
              <SocialLink href="https://t.me" label="Telegram">
                <TelegramIcon />
              </SocialLink>
            </div>
          </div>

          {/* Navigation columns */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6">
            {navColumns.map((col) => (
              <div key={col.title}>
                <h3 className="text-foreground font-serif text-base mb-4">{col.title}</h3>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-muted hover:text-copper text-sm transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contacts */}
          <div className="md:col-span-3">
            <h3 className="text-foreground font-serif text-base mb-4">
              {lang === 'uk' ? 'Контакти' : lang === 'ru' ? 'Контакты' : 'Contacts'}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`mailto:${f.email}`} className="text-muted hover:text-copper transition-colors">
                  {f.email}
                </a>
              </li>
              <li className="text-muted">{f.city}</li>
              <li className="text-muted-2 text-[13px] leading-relaxed pt-2">
                {dict.delivery_info?.text}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-2 text-[12px] tracking-wide">
            © {year} ManPrime. {f.rights}.
          </p>

          <div className="text-muted-2 text-[10px] uppercase tracking-[0.2em]">
            {lang === 'uk'
              ? 'Оплата при отриманні'
              : lang === 'ru'
              ? 'Оплата при получении'
              : 'Payment on delivery'}
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted hover:text-copper hover:border-copper transition-all duration-300"
    >
      {children}
    </a>
  )
}

function InstagramIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13 22v-8h2.7l.4-3.1H13V8.9c0-.9.3-1.5 1.6-1.5H16V4.6c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.4-3.8 3.9v2.5H7.4V14h2.6v8H13z" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M21.4 4.4 18 19.7c-.3 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.2-8.3c.4-.3-.1-.5-.6-.2L5.4 13l-4.9-1.5c-1-.3-1.1-1 .2-1.5L20.2 3c.9-.3 1.6.2 1.2 1.4z" />
    </svg>
  )
}
