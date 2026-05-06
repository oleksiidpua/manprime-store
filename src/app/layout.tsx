import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";

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
  metadataBase: new URL("https://manprime-store.vercel.app"),
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
    "ManPrime",
  ],
  authors: [{ name: "ManPrime" }],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "https://manprime-store.vercel.app",
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
      </body>
    </html>
  );
}
