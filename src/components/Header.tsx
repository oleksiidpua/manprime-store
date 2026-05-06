'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Locale } from '@/lib/i18n'
import type ukDict from '@/dictionaries/uk.json'
import Logo from './Logo'

type Dict = typeof ukDict

interface HeaderProps {
  dict: Dict
  lang: Locale
}

const langLabels = { uk: 'УКР', ru: 'РУС', en: 'ENG' }
const langs = ['uk', 'ru', 'en'] as const

export default function Header({ dict, lang }: HeaderProps) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const n = dict.nav

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { href: `/${lang}/catalog`, label: n.catalog },
    { href: `/${lang}/about`, label: n.about },
    { href: `/${lang}/contacts`, label: n.contacts },
  ]

  // Strip locale prefix to switch language while preserving the current path
  const pathWithoutLocale = pathname.replace(/^\/(uk|ru|en)/, '') || '/'
  const switchLangHref = (l: typeof langs[number]) =>
    `/${l}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/85 backdrop-blur-xl border-b border-border'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-18 md:h-20 flex items-center justify-between">

        <Logo lang={lang} variant="compact" />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`relative text-[13px] font-medium tracking-wide transition-colors group ${
                  active ? 'text-foreground' : 'text-muted hover:text-foreground'
                }`}
              >
                {label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-copper transition-all duration-300 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            )
          })}
        </nav>

        {/* Right section */}
        <div className="hidden md:flex items-center gap-6">
          {/* Language switcher */}
          <div className="flex items-center gap-1 text-[10px] font-medium tracking-[0.15em]">
            {langs.map((l, i) => (
              <span key={l} className="flex items-center gap-1">
                <Link
                  href={switchLangHref(l)}
                  className={`px-1.5 py-0.5 rounded-sm transition-colors ${
                    l === lang ? 'text-copper' : 'text-muted-2 hover:text-foreground'
                  }`}
                >
                  {langLabels[l]}
                </Link>
                {i < langs.length - 1 && <span className="text-border">·</span>}
              </span>
            ))}
          </div>

          <Link
            href={`/${lang}/auth`}
            aria-label={n.login || 'Account'}
            className="text-muted hover:text-copper transition-colors"
          >
            <UserIcon className="w-4.5 h-4.5" />
          </Link>

          <Link
            href={`/${lang}/cart`}
            aria-label={n.cart}
            className="relative text-muted hover:text-copper transition-colors"
          >
            <CartIcon className="w-4.5 h-4.5" />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 -mr-2 text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border px-5 py-8 flex flex-col gap-1 animate-in slide-in-from-top-4 duration-200">
          {[{ href: `/${lang}`, label: n.home }, ...navLinks].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-foreground text-2xl font-serif font-medium py-3 border-b border-border/40"
            >
              {label}
            </Link>
          ))}

          <div className="flex items-center justify-between mt-8 pt-6">
            <div className="flex items-center gap-4">
              <Link href={`/${lang}/auth`} className="flex items-center gap-2 text-muted hover:text-copper transition-colors">
                <UserIcon className="w-5 h-5" />
                <span className="text-sm">{n.login || 'Account'}</span>
              </Link>
              <Link href={`/${lang}/cart`} className="flex items-center gap-2 text-muted hover:text-copper transition-colors">
                <CartIcon className="w-5 h-5" />
                <span className="text-sm">{n.cart}</span>
              </Link>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-medium tracking-[0.15em]">
              {langs.map((l, i) => (
                <span key={l} className="flex items-center gap-1">
                  <Link
                    href={switchLangHref(l)}
                    className={`px-1.5 py-0.5 ${l === lang ? 'text-copper' : 'text-muted-2'}`}
                  >
                    {langLabels[l]}
                  </Link>
                  {i < langs.length - 1 && <span className="text-border">·</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function UserIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function CartIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4}
        d="M6 2L3 7v13a2 2 0 002 2h14a2 2 0 002-2V7l-3-5M3 7h18M16 11a4 4 0 01-8 0" />
    </svg>
  )
}
