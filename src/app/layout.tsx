import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Beograd 2026 🗺️ | belgrade.pro - Interactive Tourist Guide",
  description: "Discover Belgrade's best attractions, restaurants, hotels & nightlife. AI-powered itineraries, live maps & local secrets. #1 Belgrade travel guide 2026.",
  keywords: ["Belgrade", "Beograd", "Serbia", "tourist guide", "interactive map", "travel", "landmarks", "restaurants", "hotels", "nightlife", "Skadarlija", "Savamala", "Kalemegdan"],
  authors: [{ name: "Allinclusive.llc", url: "https://allinclusive.llc" }],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Beograd 2026 🗺️ | belgrade.pro",
    description: "Discover Belgrade's best attractions, restaurants & nightlife. AI-powered itineraries & live maps.",
    type: "website",
    images: ["/belgradePROf.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Belgrade PRO",
  },
};

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// JSON-LD Structured Data for SEO/AEO
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TravelAgency",
      "@id": "https://belgrade.pro/#organization",
      "name": "belgrade.pro",
      "url": "https://belgrade.pro",
      "logo": "https://belgrade.pro/favicon.png",
      "description": "Belgrade's #1 interactive tourist guide with AI-powered itineraries",
      "touristInfo": "https://belgrade.pro",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "247",
        "bestRating": "5"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Belgrade",
        "addressCountry": "RS"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://belgrade.pro/#website",
      "url": "https://belgrade.pro",
      "name": "belgrade.pro",
      "publisher": {
        "@id": "https://belgrade.pro/#organization"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://belgrade.pro/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Najbolji restorani Skadarlija Beograd?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Top restorani na Skadarliji: Tri Šešira (tradicionalna kuhinja od 1864), Dva Jelena (4.7★), Šerdar (roštilj), Ima dana (živa muzika). Prosečna cena €15-25 po osobi."
          }
        },
        {
          "@type": "Question",
          "name": "Gde je najbolji noćni život u Beogradu?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Najbolji noćni život: Splavovi na Savami (Freestyler, Lasta, 20/44), Dorćol barovi, Strahinjića Bana ulica. Radno vreme: 22:00-04:00, ulaz besplatan do 00:00."
          }
        },
        {
          "@type": "Question", 
          "name": "Koliko košta hotelska soba u Beogradu?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cene hotela Beograd 2026: Budget €25-45/noć, Mid-range €50-90, Luxury €100-200+. Najbolje lokacije: Terazije, Knez Mihailova, Savamala. Preporučujemo rezervaciju 2-3 nedelje unapred."
          }
        },
        {
          "@type": "Question",
          "name": "Šta obavezno videti u Beogradu za 1 dan?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Jednodnevni tur Beograd: 1) Kalemegdan tvrđava (jutro), 2) Knez Mihailova šetnja, 3) Skadarlija ručak, 4) Sveti Sava hram, 5) Savamala sunset, 6) Splavovi veče. Ukupno ~8km pešačenja."
          }
        },
        {
          "@type": "Question",
          "name": "Koji je najbolji način da se krećem po Beogradu?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Prevoz Beograd: Pešačenje najbolje za centar, GSP autobusi €0.80, taksi €2-5 po vožnji. Preporučujemo YandexGo ili Pink Taxi aplikacije. Parking u centru €1-2/h."
          }
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://belgrade.pro/#breadcrumbs",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Početna",
          "item": "https://belgrade.pro"
        },
        {
          "@type": "ListItem", 
          "position": 2,
          "name": "Restorani",
          "item": "https://belgrade.pro/?category=eat"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Hoteli",
          "item": "https://belgrade.pro/?category=stay"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Noćni život",
          "item": "https://belgrade.pro/?category=nightlife"
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Belgrade PRO" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
