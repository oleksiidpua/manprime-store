import { getDictionary, type Locale } from '@/lib/i18n'

export default async function AboutPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.4em] uppercase mb-3">ManPrime</p>
          <h1 className="font-heading font-black text-4xl md:text-5xl text-white uppercase tracking-tight mb-6">
            {dict.about.title}
          </h1>
          <div className="w-12 h-px bg-[#C9A84C]/50 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-14">
          <div>
            <p className="text-[#9CA3AF] text-base leading-relaxed mb-8">{dict.about.text}</p>
            <div className="space-y-4">
              {[
                { icon: '🌿', text: dict.features.natural.title },
                { icon: '✅', text: dict.features.certified.title },
                { icon: '🔒', text: dict.features.privacy.title },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-4 border border-[#1E1E1E] bg-[#111111] px-5 py-3">
                  <span className="text-xl">{icon}</span>
                  <span className="text-[#9CA3AF] text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111111] border border-[#1E1E1E] p-10 text-center">
            <div className="w-20 h-20 border border-[#C9A84C]/30 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl font-heading font-black text-[#C9A84C]">M</span>
            </div>
            <h2 className="font-heading font-black text-2xl text-white uppercase tracking-widest mb-2">ManPrime</h2>
            <p className="text-[#555] text-sm leading-relaxed">{dict.hero.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { num: '3', label: lang === 'uk' ? 'Формули' : lang === 'ru' ? 'Формулы' : 'Formulas' },
            { num: '100%', label: lang === 'uk' ? 'Натуральний склад' : lang === 'ru' ? 'Натуральный состав' : 'Natural formula' },
            { num: '1–2', label: lang === 'uk' ? 'Тижні доставки' : lang === 'ru' ? 'Недели доставки' : 'Weeks delivery' },
          ].map(({ num, label }) => (
            <div key={label} className="bg-[#111111] border border-[#1E1E1E] p-8 text-center">
              <div className="font-heading font-black text-4xl text-[#C9A84C] mb-2">{num}</div>
              <div className="text-[#555] text-sm uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
