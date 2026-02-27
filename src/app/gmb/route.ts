import { NextResponse } from 'next/server'
import { staticLocations, staticCategories } from '@/lib/static-data'

// GMB (Google Business Profile) Integration
// Provides structured local business data for Google Maps & Search

export async function GET() {
  // Generate LocalBusiness structured data for each venue
  const businesses = staticLocations.map(loc => ({
    "@context": "https://schema.org",
    "@type": loc.category?.slug === 'accommodation' ? 'LodgingBusiness' :
             loc.category?.slug === 'food' ? 'Restaurant' :
             loc.category?.slug === 'nightlife' ? 'BarOrPub' :
             loc.category?.slug === 'museums' ? 'Museum' :
             'TouristAttraction',
    "@id": `https://belgrade.pro/#${loc.id}`,
    "name": loc.name,
    "description": loc.shortDesc || loc.description?.substring(0, 160),
    "url": `https://belgrade.pro/lokacija/${loc.slug}`,
    "telephone": loc.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": loc.address,
      "addressLocality": "Belgrade",
      "addressRegion": "Belgrade",
      "postalCode": "11000",
      "addressCountry": "RS"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": loc.latitude,
      "longitude": loc.longitude
    },
    "aggregateRating": loc.rating ? {
      "@type": "AggregateRating",
      "ratingValue": loc.rating,
      "bestRating": 5,
      "worstRating": 1,
      "ratingCount": Math.floor(loc.rating * 100)
    } : undefined,
    "priceRange": loc.priceLevel ? ['', '€', '€€', '€€€', '€€€€'][loc.priceLevel] : undefined,
    "openingHours": loc.openingHours ? parseOpeningHours(loc.openingHours) : undefined,
    "image": loc.images ? JSON.parse(loc.images)[0] : undefined,
    "sameAs": loc.website ? [loc.website] : undefined,
    "areaServed": {
      "@type": "City",
      "name": "Belgrade",
      "containedInPlace": {
        "@type": "Country",
        "name": "Serbia"
      }
    }
  }))

  // Main organization schema
  const organization = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": "https://belgrade.pro/#organization",
    "name": "Belgrade PRO",
    "alternateName": "belgrade.pro",
    "url": "https://belgrade.pro",
    "logo": "https://belgrade.pro/favicon.png",
    "description": "Belgrade's #1 interactive tourist guide with AI-powered itineraries, live maps, and local recommendations.",
    "email": "info@belgrade.pro",
    "telephone": "+381 11 123 4567",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Knez Mihailova 25",
      "addressLocality": "Belgrade",
      "postalCode": "11000",
      "addressCountry": "RS"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 44.8175,
      "longitude": 20.4617
    },
    "areaServed": {
      "@type": "City",
      "name": "Belgrade"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "247",
      "bestRating": "5"
    },
    "sameAs": [
      "https://www.facebook.com/belgradepro",
      "https://www.instagram.com/belgradepro",
      "https://twitter.com/belgradepro"
    ]
  }

  // Categories for GMB
  const categories = staticCategories.map(cat => ({
    "@type": "Category",
    "name": cat.name,
    "description": cat.description,
    "url": `https://belgrade.pro/?category=${cat.slug}`
  }))

  return NextResponse.json({
    organization,
    businesses: businesses.filter(b => b.aggregateRating), // Only businesses with ratings
    categories,
    totalBusinesses: businesses.length,
    lastUpdated: new Date().toISOString()
  })
}

// Parse opening hours from JSON string to Schema.org format
function parseOpeningHours(hoursJson: string): string[] | undefined {
  try {
    const hours = JSON.parse(hoursJson)
    if (!hours.open || !hours.close) return undefined
    
    const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    const closed = hours.closed ? [hours.closed.substring(0, 2)] : []
    
    return days
      .filter(d => !closed.includes(d))
      .map(d => `${d} ${hours.open}-${hours.close}`)
  } catch {
    return undefined
  }
}
