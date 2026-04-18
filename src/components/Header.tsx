'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Locale } from '@/lib/i18n'
import type ukDict from '@/dictionaries/uk.json'

type Dict = typeof ukDict

interface HeaderProps {
  dict: Dict
  lang: Locale
}

const langLabels = { uk: 'УКР', ru: 'РУС', en: 'ENG' }
const langs = ['uk', 'ru', 'en'] as const

export default function Header({ dict, lang }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const n = dict.nav

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center gap-2 shrink-0">
          <span className="text-accent font-heading font-bold text-2xl tracking-tight">Man</span>
          <span className="text-foreground font-heading font-bold text-2xl tracking-tight">Prime</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href={`/${lang}`} className="hover:text-accent transition-colors">{n.home}</Link>
          <Link href={`/${lang}/catalog`} className="hover:text-accent transition-colors">{n.catalog}</Link>
          <Link href={`/${lang}/about`} className="hover:text-accent transition-colors">{n.about}</Link>
          <Link href={`/${lang}/contacts`} className="hover:text-accent transition-colors">{n.contacts}</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex gap-1 text-xs">
            {langs.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                className={`px-2 py-1 rounded transition-colors ${l === lang ? 'bg-accent text-white' : 'hover:text-accent'}`}
              >
                {langLabels[l]}
              </Link>
            ))}
          </div>
          <Link
            href={`/${lang}/cart`}
            className="relative p-2 hover:text-accent transition-colors"
            aria-label={n.cart}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </Link>
          <Link
            href={`/${lang}/auth`}
            className="bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
          >
            {n.login}
          </Link>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border px-4 py-4 flex flex-col gap-4">
          <Link href={`/${lang}`} onClick={() => setMenuOpen(false)} className="hover:text-accent">{n.home}</Link>
          <Link href={`/${lang}/catalog`} onClick={() => setMenuOpen(false)} className="hover:text-accent">{n.catalog}</Link>
          <Link href={`/${lang}/about`} onClick={() => setMenuOpen(false)} className="hover:text-accent">{n.about}</Link>
          <Link href={`/${lang}/contacts`} onClick={() => setMenuOpen(false)} className="hover:text-accent">{n.contacts}</Link>
          <Link href={`/${lang}/cart`} onClick={() => setMenuOpen(false)} className="hover:text-accent">{n.cart}</Link>
          <Link href={`/${lang}/auth`} onClick={() => setMenuOpen(false)} className="bg-accent text-white px-4 py-2 rounded-full text-center">{n.login}</Link>
          <div className="flex gap-2 text-sm pt-2 border-t border-border">
            {langs.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                className={`px-3 py-1 rounded ${l === lang ? 'bg-accent text-white' : 'border border-border hover:text-accent'}`}
              >
                {langLabels[l]}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
