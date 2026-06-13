import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const SITE_URL = "https://manprime-store.netlify.app";
const GA_ID = "G-0SWCELS6C7";
const FB_VERIFICATION = "qv5sl2g0gi6zzf20gcfe6i9fonvz96";
const META_PIXEL_ID = "26483128744702559";
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ManPrime — Натуральні БАДи для чоловічого здоров'я",
    template: "%s · ManPrime",
  },
  description:
    "ManPrime — натуральні таблетки для потенції на медовій основі. Royal Honey VIP покращує ерекцію, продовжує секс, природно підвищує тестостерон. Без хімії. Доставка по всій Україні.",
  keywords: [
    // brand
    "ManPrime", "манпрайм", "Royal Honey VIP", "роял хоні",
    // category
    "БАД для потенції", "БАД для чоловіків", "таблетки для потенції", "природна віагра",
    "натуральний афродизіак", "природний бустер тестостерону", "медовий стик",
    "сашет для потенції", "БАД на медовій основі",
    // problem / intent
    "як підвищити потенцію", "як підвищити тестостерон природно",
    "покращити ерекцію", "продовжити секс", "затримати еякуляцію",
    "довше не кінчати", "засіб для чоловічої сили",
    // ingredients
    "тонгкат алі", "Eurycoma Longifolia", "мака перуанська", "tribulus terrestris",
    "якірці сланкі", "Panax Ginseng", "малазійський мед",
    // local
    "купити БАД Україна", "БАД чоловічий Дніпро", "доставка Нова Пошта БАД",
    "Royal Honey купити Україна", "оплата при отриманні чоловічий БАД",
    "таблетки для потенції Україна", "купити таблетки потенція Україна",
    // RU
    "БАД для потенции", "таблетки для потенции", "натуральная виагра",
    "улучшить эрекцию", "продлить секс", "задержать эякуляцию",
    "природный бустер тестостерона", "купить БАД Украина",
    "таблетки для потенции Украина", "купить таблетки потенция Украина",
    // EN
    "male enhancement pills", "natural testosterone booster",
    "last longer in bed", "improve erection", "premature ejaculation pills",
    "honey-based supplement Malaysia",
  ],
  authors: [{ name: "ManPrime" }],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: SITE_URL,
    siteName: "ManPrime",
    title: "ManPrime — Натуральні таблетки для потенції | Royal Honey VIP",
    description:
      "Royal Honey VIP — природний бустер тестостерону на медовій основі. Покращує ерекцію, продовжує секс. Без хімії. Доставка по Україні.",
    images: [
      { url: `${SITE_URL}/opengraph-image.png`, width: 1200, height: 630, alt: "ManPrime — Royal Honey VIP" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ManPrime — Натуральні таблетки для потенції",
    description: "Royal Honey VIP — покращити ерекцію, продовжити секс, природно підвищити тестостерон. Доставка по Україні.",
    images: [`${SITE_URL}/opengraph-image.png`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  other: {
    "facebook-domain-verification": FB_VERIFICATION,
  },
};

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": ["Organization", "OnlineStore", "LocalBusiness"],
  name: "ManPrime",
  alternateName: ["ManPrime Store", "Royal Honey VIP Україна"],
  url: SITE_URL,
  logo: `${SITE_URL}/logo-original.png`,
  image: `${SITE_URL}/opengraph-image.png`,
  description:
    "ManPrime — натуральні БАДи для чоловічого здоров'я на медовій основі. Royal Honey VIP для потенції, тестостерону та витривалості. Доставка Новою Поштою по всій Україні.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Дніпро",
    addressRegion: "Дніпропетровська область",
    addressCountry: "UA",
  },
  areaServed: {
    "@type": "Country",
    name: "Ukraine",
  },
  currenciesAccepted: "UAH",
  paymentAccepted: ["Cash on delivery", "LiqPay", "Monobank"],
  priceRange: "₴₴",
  knowsLanguage: ["uk", "ru", "en"],
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${lora.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            alt=""
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
        {CLARITY_ID && (
          <Script id="ms-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_ID}");
            `}
          </Script>
        )}
        <Script
          id="ld-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
      </body>
    </html>
  );
}
