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

  const navLinks = [
    { href: `/${lang}/catalog`, label: n.catalog },
    { href: `/${lang}/about`, label: n.about },
    { href: `/${lang}/contacts`, label: n.contacts },
  ]

  return (
    <header className="sticky top-0 z-50 bg-[#090d18] border-b border-[#1e2a3a]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href={`/${lang}`} className="flex flex-col items-start shrink-0 group">
          <span className="text-[#c9a84c] font-heading text-xl tracking-[0.15em] leading-none group-hover:text-[#e0bb5f] transition-colors">
            MANPRIME
          </span>
          <span className="text-[#8b6f47] text-[8px] font-medium tracking-[0.35em] leading-none mt-0.5">
            STORE
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative text-[#8b9ab0] hover:text-[#e8eaf0] text-sm font-medium tracking-wide transition-colors group"
            >
              {label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#c9a84c] group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* Right section */}
        <div className="hidden md:flex items-center gap-5">
          <div className="flex gap-1.5">
            {langs.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                className={`text-[10px] font-semibold tracking-widest px-2 py-0.5 rounded transition-colors ${
                  l === lang
                    ? 'text-[#c9a84c] border border-[#c9a84c]/40'
                    : 'text-[#8b9ab0] hover:text-[#e8eaf0]'
                }`}
              >
                {langLabels[l]}
              </Link>
            ))}
          </div>

          <Link
            href={`/${lang}/auth`}
            aria-label="Account"
            className="text-[#c9a84c] hover:text-[#e0bb5f] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>

          <Link
            href={`/${lang}/cart`}
            aria-label={n.cart}
            className="text-[#c9a84c] hover:text-[#e0bb5f] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-[#8b9ab0] hover:text-[#e8eaf0] transition-colors"
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d1120] border-t border-[#1e2a3a] px-5 py-6 flex flex-col gap-5">
          <Link href={`/${lang}`} onClick={() => setMenuOpen(false)} className="text-[#8b9ab0] hover:text-[#e8eaf0] text-sm font-medium tracking-wide transition-colors">
            {n.home}
          </Link>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-[#8b9ab0] hover:text-[#e8eaf0] text-sm font-medium tracking-wide transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-3 items-center pt-2 border-t border-[#1e2a3a]">
            <Link href={`/${lang}/cart`} onClick={() => setMenuOpen(false)} className="text-[#c9a84c] hover:text-[#e0bb5f] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>
            <Link href={`/${lang}/auth`} onClick={() => setMenuOpen(false)} className="text-[#c9a84c] hover:text-[#e0bb5f] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            <div className="flex gap-1.5 ml-auto">
              {langs.map((l) => (
                <Link
                  key={l}
                  href={`/${l}`}
                  className={`text-[10px] font-semibold tracking-widest px-2 py-0.5 rounded transition-colors ${
                    l === lang ? 'text-[#c9a84c] border border-[#c9a84c]/40' : 'text-[#8b9ab0] hover:text-[#e8eaf0]'
                  }`}
                >
                  {langLabels[l]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
