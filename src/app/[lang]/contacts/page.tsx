import { getDictionary, type Locale } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'
import ContactForm from '@/components/ContactForm'
import type { Metadata } from 'next'

const CONTACTS_SEO: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Контакти ManPrime',
    description: "Звʼяжіться з нами: email, телефон, доставка по Україні. Натуральні БАДи для чоловічого здоров'я.",
  },
  ru: {
    title: 'Контакты ManPrime',
    description: 'Свяжитесь с нами: email, телефон, доставка по Украине. Натуральные БАДы для мужского здоровья.',
  },
  en: {
    title: 'Contacts — ManPrime',
    description: "Get in touch: email, phone, delivery across Ukraine. Natural men's health supplements.",
  },
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params
  const s = CONTACTS_SEO[lang]
  return pageMetadata({ lang, path: '/contacts', title: s.title, description: s.description })
}

export default async function ContactsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const c = dict.contacts
  const f = dict.footer

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="text-center mb-14">
          <p className="text-copper text-[11px] tracking-[0.35em] uppercase font-medium">ManPrime</p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mt-3 leading-tight">{c.title}</h1>
          <div className="w-12 h-px bg-copper/50 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Contact cards */}
          <div className="space-y-4">
            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-full border border-copper/40 bg-copper/5 flex items-center justify-center">
                  <MailIcon className="w-4 h-4 text-copper" />
                </span>
                <h3 className="font-serif text-foreground text-lg">{c.email}</h3>
              </div>
              <a href={`mailto:${f.email}`} className="text-copper hover:text-copper-hover transition-colors text-[15px] break-all">
                {f.email}
              </a>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-full border border-copper/40 bg-copper/5 flex items-center justify-center">
                  <PinIcon className="w-4 h-4 text-copper" />
                </span>
                <h3 className="font-serif text-foreground text-lg">{c.address}</h3>
              </div>
              <p className="text-muted text-[15px]">{f.city}</p>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-full border border-copper/40 bg-copper/5 flex items-center justify-center">
                  <TruckIcon className="w-4 h-4 text-copper" />
                </span>
                <h3 className="font-serif text-foreground text-lg">{dict.delivery_info.title}</h3>
              </div>
              <p className="text-muted text-[14px] leading-relaxed">{dict.delivery_info.text}</p>
            </div>
          </div>

          {/* Message form (client component → POST /api/contact → Telegram) */}
          <ContactForm lang={lang} />

        </div>
      </div>
    </div>
  )
}

function MailIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function PinIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-7.5 7-12a7 7 0 10-14 0c0 4.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

function TruckIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 7h11v10H2zM13 10h5l3 3v4h-8M6 20a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  )
}
