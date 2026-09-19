import type { Metadata } from "next"
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google"
import "./globals.css"
import { site } from "@/content/site"
import { ChromeGate, MotionRoot, SiteHeader } from "@/components/chrome"
import { ContactDock } from "@/components/contact-dock"
import { JsonLd, SiteFooter } from "@/components/ui"

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" })
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-sans",
  display: "swap",
})
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-plex-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s — ${site.name}` },
  description: site.description,
  alternates: { canonical: site.url },
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.url,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body>
        <a
          href="#main"
          className="focus:border-accent focus:bg-surface sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:border focus:px-4 focus:py-2 focus:text-base"
        >
          Skip to content
        </a>
        <MotionRoot />
        <ChromeGate>
          <SiteHeader />
        </ChromeGate>
        <main id="main">{children}</main>
        <ChromeGate>
          <SiteFooter />
          <ContactDock />
        </ChromeGate>
        {/* Contact point omitted while the mailbox is a placeholder — publishing an
            address that bounces is worse than publishing none. */}
        <JsonLd
          schema={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.legalName,
            url: site.url,
            description: site.description,
            numberOfEmployees: { "@type": "QuantitativeValue", value: site.teamSize },
            ...(site.emailIsLive ? { email: site.email } : {}),
          }}
        />
      </body>
    </html>
  )
}
