import { getDictionary, type Locale } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'
import Logo from '@/components/Logo'
import type { Metadata } from 'next'

const ABOUT_SEO: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Про ManPrime — натуральні БАДи на медовій основі',
    description: "Хто ми, чому обрали мед та натуральні компоненти, і як ManPrime підтримує чоловіче здоров'я. Без хімії та консервантів.",
  },
  ru: {
    title: 'О ManPrime — натуральные БАДы на медовой основе',
    description: 'Кто мы, почему выбрали мёд и натуральные компоненты, и как ManPrime поддерживает мужское здоровье. Без химии и консервантов.',
  },
  en: {
    title: "About ManPrime — honey-based men's supplements",
    description: "Who we are, why we chose honey and natural ingredients, and how ManPrime supports men's health. No chemicals, no preservatives.",
  },
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params
  const s = ABOUT_SEO[lang]
  return pageMetadata({ lang, path: '/about', title: s.title, description: s.description })
}

export default async function AboutPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen bg-[#0b0f1a]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <p className="text-[#8b6f47] text-xs font-semibold tracking-[0.4em] uppercase mb-3">ManPrime</p>
          <h1 className="font-heading text-5xl md:text-6xl text-[#e8eaf0] uppercase mb-6">
            {dict.about.title}
          </h1>
          <div className="w-12 h-px bg-[#c9a84c]/50 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-14">
          <div>
            <p className="text-[#8b9ab0] text-base leading-relaxed mb-8">{dict.about.text}</p>
            <div className="space-y-4">
              {[
                { icon: '🌿', text: dict.features.natural.title },
                { icon: '✅', text: dict.features.certified.title },
                { icon: '🔒', text: dict.features.privacy.title },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-4 border border-[#2a3347] bg-[#1c2333] px-5 py-3 rounded-sm">
                  <span className="text-xl">{icon}</span>
                  <span className="text-[#8b9ab0] text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border p-10 text-center rounded-2xl flex flex-col items-center">
            <div className="mb-6 scale-125">
              <Logo lang={lang} variant="default" />
            </div>
            <p className="text-muted text-sm leading-relaxed mt-2">{dict.hero.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { num: '3', label: lang === 'uk' ? 'Формули' : lang === 'ru' ? 'Формулы' : 'Formulas' },
            { num: '100%', label: lang === 'uk' ? 'Натуральний склад' : lang === 'ru' ? 'Натуральный состав' : 'Natural formula' },
            { num: '1–2', label: lang === 'uk' ? 'Тижні доставки' : lang === 'ru' ? 'Недели доставки' : 'Weeks delivery' },
          ].map(({ num, label }) => (
            <div key={label} className="bg-[#1c2333] border border-[#2a3347] p-8 text-center rounded-sm">
              <div className="font-heading text-5xl text-[#c9a84c] mb-2">{num}</div>
              <div className="text-[#8b9ab0] text-sm uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
