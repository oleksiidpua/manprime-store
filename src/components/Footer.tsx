import Link from 'next/link'
import type ukDict from '@/dictionaries/uk.json'

type Dict = typeof ukDict

export default function Footer({ dict }: { dict: Dict }) {
  const f = dict.footer
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#070a12] border-t border-[#1e2a3a] mt-16">
      <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <div className="mb-4">
            <span className="text-[#c9a84c] font-heading text-xl tracking-[0.15em]">MANPRIME</span>
            <span className="block text-[#8b6f47] text-[9px] font-medium tracking-[0.35em] mt-0.5">STORE</span>
          </div>
          <p className="text-[#8b9ab0] text-sm leading-relaxed mb-5">
            Натуральні комплекси для чоловічого здоров&apos;я, потенції та довголіття.
          </p>
          <div className="flex gap-3">
            {['facebook', 'instagram'].map((soc) => (
              <a
                key={soc}
                href="#"
                className="w-8 h-8 border border-[#2a3347] rounded flex items-center justify-center text-[#8b9ab0] hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors text-xs font-bold"
              >
                {soc === 'facebook' ? 'f' : 'ig'}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-[#e8eaf0] font-semibold text-sm tracking-widest uppercase mb-5">Навігація</h3>
          <ul className="space-y-3">
            {[
              { href: '/uk/catalog', label: dict.nav.catalog },
              { href: '/uk/about', label: dict.nav.about },
              { href: '/uk/contacts', label: dict.nav.contacts },
              { href: '/uk/auth', label: dict.nav.login },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-[#8b9ab0] hover:text-[#c9a84c] text-sm transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacts + Payment */}
        <div>
          <h3 className="text-[#e8eaf0] font-semibold text-sm tracking-widest uppercase mb-5">Контакти</h3>
          <ul className="space-y-3 text-sm text-[#8b9ab0] mb-8">
            <li>
              <a href={`mailto:${f.email}`} className="hover:text-[#c9a84c] transition-colors">
                {f.email}
              </a>
            </li>
            <li>{f.city}</li>
            <li className="text-[#8b6f47]">{dict.delivery_info.text}</li>
          </ul>

          <p className="text-[#8b6f47] text-xs mb-3 uppercase tracking-widest">Безпечна оплата</p>
          <div className="flex gap-2 flex-wrap">
            {['VISA', 'MC', 'LiqPay', 'Mono'].map((pay) => (
              <span
                key={pay}
                className="px-2 py-1 border border-[#2a3347] rounded text-[#8b9ab0] text-[10px] font-medium"
              >
                {pay}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#1e2a3a] px-4 py-4 text-center text-[11px] text-[#8b9ab0]/50">
        © {year} ManPrime. {f.rights}.
      </div>
    </footer>
  )
}
