import { getDictionary, type Locale } from '@/lib/i18n'

export default async function ContactsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const c = dict.contacts
  const f = dict.footer

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">{c.title}</h1>
        <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="bg-cream rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📧</span>
              <h3 className="font-heading font-semibold text-lg">{c.email}</h3>
            </div>
            <a href={`mailto:${f.email}`} className="text-accent hover:underline">{f.email}</a>
          </div>

          <div className="bg-cream rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📍</span>
              <h3 className="font-heading font-semibold text-lg">{c.address}</h3>
            </div>
            <p className="text-muted">{f.city}</p>
          </div>

          <div className="bg-cream rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🚚</span>
              <h3 className="font-heading font-semibold text-lg">{dict.delivery_info.title}</h3>
            </div>
            <p className="text-muted text-sm">{dict.delivery_info.text}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8">
          <h2 className="font-heading text-2xl font-bold mb-6">{c.send_message}</h2>
          <form className="space-y-4" action="/api/contact" method="POST">
            <div>
              <label className="block text-sm font-medium mb-1">{c.your_name}</label>
              <input
                type="text"
                name="name"
                required
                className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors bg-cream"
                placeholder={c.your_name}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{c.your_email}</label>
              <input
                type="email"
                name="email"
                required
                className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors bg-cream"
                placeholder={c.your_email}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{c.message}</label>
              <textarea
                name="message"
                required
                rows={5}
                className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors bg-cream resize-none"
                placeholder={c.message}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-full transition-colors"
            >
              {c.send}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
