import { getDictionary, type Locale } from '@/lib/i18n'

export default async function AboutPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">{dict.about.title}</h1>
        <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <p className="text-lg leading-relaxed text-muted mb-6">{dict.about.text}</p>
          <div className="space-y-4">
            {[
              { icon: '🌿', text: dict.features.natural.title },
              { icon: '✅', text: dict.features.certified.title },
              { icon: '🔒', text: dict.features.privacy.title },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <span className="font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-cream rounded-3xl p-8 text-center">
          <div className="w-32 h-32 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl font-heading font-bold text-accent">M</span>
          </div>
          <h2 className="font-heading text-2xl font-bold mb-2">ManPrime</h2>
          <p className="text-muted text-sm">{dict.hero.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { num: '3', label: lang === 'uk' ? 'Формули' : lang === 'ru' ? 'Формулы' : 'Formulas' },
          { num: '100%', label: lang === 'uk' ? 'Натуральний склад' : lang === 'ru' ? 'Натуральный состав' : 'Natural formula' },
          { num: '1–2', label: lang === 'uk' ? 'Тижні доставки' : lang === 'ru' ? 'Недели доставки' : 'Weeks delivery' },
        ].map(({ num, label }) => (
          <div key={label} className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="font-heading text-4xl font-bold text-accent mb-2">{num}</div>
            <div className="text-muted text-sm">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
