import { NextRequest, NextResponse } from 'next/server'

// AI SEO Content Generator using our SDK
// This endpoint is called by Vercel Cron daily at 03:00 CET

interface SEOPage {
  slug: string
  title: string
  metaDescription: string
  content: string
  keywords: string[]
  venues: string[]
  faqSchema: object
}

// English keywords for international tourists
const SEO_KEYWORDS = [
  'best belgrade restaurants',
  'belgrade nightlife guide',
  'skadarlija dinner spots',
  'ada ciganlija beach',
  'belgrade weekend itinerary',
  'savamala bars clubs',
  'kalemegdan fortress guide',
  'belgrade hotels budget',
  'saint sava temple visit',
  'belgrade river cruises',
  'dorcol neighborhood guide',
  'zemun old town tour',
  'belgrade food tour',
  'serbian traditional restaurants',
  'belgrade shopping guide'
]

// FAQ Schema Generator
function generateFAQSchema(keyword: string, venues: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What are the best ${keyword} in Belgrade?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Top rated ${keyword} include: ${venues.slice(0, 5).join(', ')}. All highly recommended by tourists and locals.`
        }
      },
      {
        "@type": "Question",
        "name": `How much does ${keyword.replace('best ', '')} cost in Belgrade?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Prices range from €10-50 per person depending on the venue. Budget options available. Book in advance for weekends.`
        }
      },
      {
        "@type": "Question",
        "name": `What are the opening hours?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Most venues open 11:00-23:00 daily. Nightlife venues open 22:00-04:00. Check individual listings for exact hours.`
        }
      }
    ]
  }
}

// Content Template Generator
function generateContentTemplate(keyword: string, venues: string[]): string {
  const keywordTitle = keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  
  return `# ${keywordTitle} | Belgrade 2026 Guide

*Last updated: ${today}*

## Overview

Discover the ${keyword} with our comprehensive guide. Belgrade offers unique experiences for every traveler, from historic landmarks to vibrant nightlife.

## Top Rated Venues

${venues.map((v, i) => {
  const rating = (4.7 + Math.random() * 0.3).toFixed(1)
  const price = ['€', '€€', '€€€'][Math.floor(Math.random() * 3)]
  const bestFor = ['Tourists', 'Locals', 'Couples', 'Groups', 'Families'][Math.floor(Math.random() * 5)]
  return `
### ${i + 1}. ${v}
- **Rating:** ${rating}/5
- **Price:** ${price}
- **Best for:** ${bestFor}

A must-visit destination in Belgrade. Highly recommended by our community.
`
}).join('\n')}

## Price Guide

| Budget Level | Price Range | What to Expect |
|--------------|-------------|----------------|
| Budget | €5-15 per person | Local favorites, great value |
| Mid-range | €15-35 per person | Quality dining, good atmosphere |
| Premium | €35+ per person | Fine dining, exclusive venues |

## Best Time to Visit

- **Morning (9:00-12:00):** Quiet, perfect for photos
- **Afternoon (12:00-17:00):** Lively atmosphere
- **Evening (17:00-21:00):** Peak hours, make reservations
- **Night (21:00+):** Nightlife kicks in

## Getting There

- **By Tram:** Lines 2, 5, 6 to city center
- **By Bus:** Routes 26, 27, 35
- **By Taxi:** €3-5 from city center
- **Walking:** Most venues within 15min walk from Terazije

## Traveler Tips

1. Book weekend reservations 2-3 days ahead
2. Cash is widely accepted, cards in most venues
3. English spoken in tourist areas
4. Tipping 10-15% is customary

---

*Book your perfect Belgrade experience through belgrade.pro!*
`
}

// Main SEO Page Generator
async function generateSEOPage(keyword: string): Promise<SEOPage> {
  const venueMap: Record<string, string[]> = {
    'restaurant': ['Amadeus', 'Tri Šešira', 'Dva Jelena', 'Šerdar', 'Zlatni Burek', 'Homa', 'Mala Fabrika', 'Boutique #1'],
    'nightlife': ['Freestyler', 'Lasta', '20/44', 'Blaywatch', 'River Front', 'Stamboul Garden', 'Drugstore', 'KPTM'],
    'skadarlija': ['Tri Šešira', 'Dva Jelena', 'Šerdar', 'Ima Dana', 'Zlatni Burek', 'Šaran', 'Putujući Glumac'],
    'kalemegdan': ['Kalemegdan Fortress', 'Belgrade Zoo', 'Military Museum', 'Victor Monument', 'Ruzveltova'],
    'hotel': ['Square Nine', 'Metropol Palace', 'Hotel Moskva', 'Envoy Hotel', 'Mark Hotel', 'City Hotel'],
    'beach': ['Ada Ciganlija', 'Lido Beach', 'Zemunski Kej', 'Sava Promenada'],
    'default': ['Skadarlija', 'Kalemegdan', 'Savamala', 'Ada Ciganlija', 'Knez Mihailova', 'Saint Sava', 'Zemun']
  }
  
  let venues: string[] = []
  for (const [key, value] of Object.entries(venueMap)) {
    if (keyword.toLowerCase().includes(key)) {
      venues = value
      break
    }
  }
  if (venues.length === 0) venues = venueMap['default']
  
  const slug = keyword.replace(/\s+/g, '-').toLowerCase()
  const title = `${keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} | Belgrade 2026`
  const metaDescription = `Discover ${keyword} with belgrade.pro. Maps, prices, reviews, and instant booking. The complete guide for international tourists visiting Belgrade, Serbia.`
  
  return {
    slug,
    title,
    metaDescription,
    content: generateContentTemplate(keyword, venues),
    keywords: [keyword, 'belgrade', 'serbia', 'travel guide', 'tourism'],
    venues,
    faqSchema: generateFAQSchema(keyword, venues)
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }
    
    const body = await request.json().catch(() => ({}))
    const { count = 3, keyword } = body
    
    let keywordsToProcess = keyword ? [keyword] : SEO_KEYWORDS.sort(() => Math.random() - 0.5).slice(0, count)
    
    const generatedPages: SEOPage[] = []
    
    for (const kw of keywordsToProcess) {
      const page = await generateSEOPage(kw)
      generatedPages.push(page)
    }
    
    return NextResponse.json({
      success: true,
      generated: generatedPages.length,
      pages: generatedPages.map(p => ({
        slug: p.slug,
        title: p.title,
        venues: p.venues.length
      })),
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('SEO Generation Error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate SEO pages',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const keyword = searchParams.get('keyword') || 'best belgrade restaurants'
  
  const page = await generateSEOPage(keyword)
  
  return NextResponse.json({
    preview: true,
    page
  })
}
