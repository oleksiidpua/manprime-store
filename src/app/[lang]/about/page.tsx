import { getDictionary, type Locale } from '@/lib/i18n'

export default async function AboutPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.4em] uppercase mb-3">ManPrime</p>
          <h1 className="font-heading text-5xl md:text-6xl text-[#1a365d] uppercase mb-6">
            {dict.about.title}
          </h1>
          <div className="w-12 h-px bg-[#c9a84c]/50 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-14">
          <div>
            <p className="text-[#718096] text-base leading-relaxed mb-8">{dict.about.text}</p>
            <div className="space-y-4">
              {[
                { icon: '🌿', text: dict.features.natural.title },
                { icon: '✅', text: dict.features.certified.title },
                { icon: '🔒', text: dict.features.privacy.title },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-4 border border-[#e2e8f0] bg-white px-5 py-3 rounded-sm shadow-sm">
                  <span className="text-xl">{icon}</span>
                  <span className="text-[#2d3748] text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#e2e8f0] p-10 text-center rounded-sm shadow-sm">
            <div className="w-20 h-20 border border-[#1a365d]/20 bg-[#edf2f7] flex items-center justify-center mx-auto mb-6 rounded-sm">
              <span className="font-heading text-4xl text-[#1a365d]">M</span>
            </div>
            <h2 className="font-heading text-3xl text-[#1a365d] uppercase tracking-widest mb-2">ManPrime</h2>
            <p className="text-[#718096] text-sm leading-relaxed">{dict.hero.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { num: '3', label: lang === 'uk' ? 'Формули' : lang === 'ru' ? 'Формулы' : 'Formulas' },
            { num: '100%', label: lang === 'uk' ? 'Натуральний склад' : lang === 'ru' ? 'Натуральный состав' : 'Natural formula' },
            { num: '1–2', label: lang === 'uk' ? 'Тижні доставки' : lang === 'ru' ? 'Недели доставки' : 'Weeks delivery' },
          ].map(({ num, label }) => (
            <div key={label} className="bg-white border border-[#e2e8f0] p-8 text-center rounded-sm shadow-sm">
              <div className="font-heading text-5xl text-[#c9a84c] mb-2">{num}</div>
              <div className="text-[#718096] text-sm uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
