import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { staticLocations, staticCategories } from '@/lib/static-data'
import LocationPageClient from './LocationPageClient'

// Generate static params for all locations
export async function generateStaticParams() {
  return staticLocations.map(loc => ({
    slug: loc.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params
  const location = staticLocations.find(l => l.slug === slug)
  
  if (!location) {
    return { title: 'Lokacija nije pronađena' }
  }

  const categoryName = location.category?.name || 'Znamenitost'
  
  return {
    title: `${location.name} - ${categoryName} Beograd | belgrade.pro`,
    description: location.shortDesc || location.description?.substring(0, 160),
    keywords: [location.name, 'beograd', 'srbija', location.category?.slug || '', 'turizam', 'vodič'],
    openGraph: {
      title: `${location.name} - ${categoryName} Beograd`,
      description: location.shortDesc || location.description?.substring(0, 160),
      type: 'article',
      url: `https://belgrade.pro/lokacija/${location.slug}`,
      images: location.images ? JSON.parse(location.images) : ['/favicon.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${location.name} - Beograd`,
      description: location.shortDesc || location.description?.substring(0, 160),
    },
    alternates: {
      canonical: `https://belgrade.pro/lokacija/${location.slug}`,
    },
  }
}

// JSON-LD Structured Data for SEO
function generateLocationSchema(location: typeof staticLocations[0]) {
  const schemaType = location.category?.slug === 'accommodation' ? 'LodgingBusiness' :
                     location.category?.slug === 'food' ? 'Restaurant' :
                     location.category?.slug === 'nightlife' ? 'BarOrPub' :
                     location.category?.slug === 'museums' ? 'Museum' :
                     'TouristAttraction'

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    "@id": `https://belgrade.pro/#${location.id}`,
    "name": location.name,
    "description": location.description,
    "url": `https://belgrade.pro/lokacija/${location.slug}`,
    "telephone": location.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": location.address,
      "addressLocality": "Belgrade",
      "postalCode": "11000",
      "addressCountry": "RS"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": location.latitude,
      "longitude": location.longitude
    },
    ...(location.rating ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": location.rating,
        "bestRating": 5,
        "worstRating": 1,
        "ratingCount": Math.floor(location.rating * 100)
      }
    } : {}),
    ...(location.priceLevel !== null && location.priceLevel !== undefined ? {
      "priceRange": ['', '€', '€€', '€€€', '€€€€'][location.priceLevel]
    } : {}),
    "image": location.images ? JSON.parse(location.images)[0] : undefined,
    "sameAs": location.website ? [location.website] : undefined,
  }
}

// Generate BreadcrumbList schema
function generateBreadcrumbSchema(location: typeof staticLocations[0]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
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
        "name": location.category?.name || "Lokacije",
        "item": `https://belgrade.pro/?category=${location.category?.slug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": location.name,
        "item": `https://belgrade.pro/lokacija/${location.slug}`
      }
    ]
  }
}

export default async function LocationPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const location = staticLocations.find(l => l.slug === slug)
  
  if (!location) {
    notFound()
  }

  // Find related locations (same category, excluding current)
  const relatedLocations = staticLocations
    .filter(l => l.categoryId === location.categoryId && l.id !== location.id)
    .slice(0, 4)

  // Find nearby locations
  const nearbyLocations = staticLocations
    .filter(l => {
      if (l.id === location.id) return false
      const dist = Math.sqrt(
        Math.pow(l.latitude - location.latitude, 2) + 
        Math.pow(l.longitude - location.longitude, 2)
      )
      return dist < 0.02 // ~2km radius
    })
    .slice(0, 4)

  const category = staticCategories.find(c => c.id === location.categoryId)

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify([
            generateLocationSchema(location),
            generateBreadcrumbSchema(location)
          ])
        }}
      />
      
      <LocationPageClient 
        location={location} 
        category={category || null}
        relatedLocations={relatedLocations}
        nearbyLocations={nearbyLocations}
      />
    </>
  )
}
