import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const SITE_URL = "https://manprime-store.vercel.app";
const GA_ID = "G-0SWCELS6C7";
const FB_VERIFICATION = "qv5sl2g0gi6zzf20gcfe6i9fonvz96";
const META_PIXEL_ID = "26483128744702559";

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
    "ManPrime — натуральні добавки для потенції, енергії та чоловічого здоров'я. Медова основа, без хімії. Доставка по всій Україні.",
  keywords: [
    "БАДи для чоловіків",
    "потенція",
    "чоловіче здоров'я",
    "тестостерон",
    "натуральні добавки",
    "медовий стик",
    "БАД для потенції",
    "ManPrime",
  ],
  authors: [{ name: "ManPrime" }],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: SITE_URL,
    siteName: "ManPrime",
    title: "ManPrime — Натуральні БАДи для чоловічого здоров'я",
    description:
      "Медова основа, без хімії. Підтримка потенції, енергії та впевненості щодня.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ManPrime — Натуральні БАДи для чоловічого здоров'я",
    description: "Медова основа, без хімії. Доставка по всій Україні.",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: {
    canonical: SITE_URL,
    languages: {
      uk: `${SITE_URL}/uk`,
      ru: `${SITE_URL}/ru`,
      en: `${SITE_URL}/en`,
      "x-default": `${SITE_URL}/uk`,
    },
  },
  other: {
    "facebook-domain-verification": FB_VERIFICATION,
  },
};

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ManPrime",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-original.png`,
  description: "Натуральні БАДи для чоловічого здоров'я на медовій основі.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Дніпро",
    addressCountry: "UA",
  },
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
        <Script
          id="ld-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
      </body>
    </html>
  );
}
