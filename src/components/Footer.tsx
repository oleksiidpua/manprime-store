import Link from 'next/link'
import type ukDict from '@/dictionaries/uk.json'

type Dict = typeof ukDict

export default function Footer({ dict }: { dict: Dict }) {
  const f = dict.footer
  const year = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-accent font-heading font-bold text-2xl">Man</span>
            <span className="font-heading font-bold text-2xl">Prime</span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            {dict.about.text.slice(0, 120)}...
          </p>
        </div>

        <div>
          <h3 className="font-heading font-semibold text-lg mb-4">Контакти</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <a href={`mailto:${f.email}`} className="hover:text-accent transition-colors">
                {f.email}
              </a>
            </li>
            <li>{f.city}</li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading font-semibold text-lg mb-4">Доставка</h3>
          <p className="text-sm text-white/70">{dict.delivery_info.text}</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center text-xs text-white/40">
          © {year} ManPrime. {f.rights}.
        </div>
      </div>
    </footer>
  )
}
