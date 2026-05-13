import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const SITE_URL = "https://manprime-store.vercel.app";
const GA_ID = "G-0SWCELS6C7";
const FB_VERIFICATION = "qv5sl2g0gi6zzf20gcfe6i9fonvz96";

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
        <Script
          id="ld-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
      </body>
    </html>
  );
}
