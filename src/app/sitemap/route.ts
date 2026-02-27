import { NextResponse } from 'next/server'
import { staticLocations, staticCategories } from '@/lib/static-data'

// Generate sitemap.xml for SEO - includes all 136+ locations
export async function GET() {
  const baseUrl = 'https://belgrade.pro'
  
  // Static pages
  const staticPages = [
    { loc: baseUrl, changefreq: 'daily', priority: 1.0 },
    { loc: `${baseUrl}/restorani`, changefreq: 'weekly', priority: 0.9 },
    { loc: `${baseUrl}/hoteli`, changefreq: 'weekly', priority: 0.9 },
    { loc: `${baseUrl}/nocni-zivot`, changefreq: 'weekly', priority: 0.9 },
    { loc: `${baseUrl}/znamenitosti`, changefreq: 'weekly', priority: 0.8 },
    { loc: `${baseUrl}/parkovi`, changefreq: 'weekly', priority: 0.7 },
    { loc: `${baseUrl}/muzeji`, changefreq: 'weekly', priority: 0.7 },
  ]
  
  // Category pages
  const categoryPages = staticCategories.map(cat => ({
    loc: `${baseUrl}/kategorija/${cat.slug}`,
    changefreq: 'weekly' as const,
    priority: 0.8,
  }))
  
  // Location pages (all 136+ locations)
  const locationPages = staticLocations.map(loc => {
    const images = loc.images ? JSON.parse(loc.images) : []
    return {
      loc: `${baseUrl}/lokacija/${loc.slug}`,
      changefreq: 'weekly' as const,
      priority: loc.featured ? 0.9 : 0.7,
      lastmod: loc.updatedAt,
      images: images.map((img: string) => `${baseUrl}${img}`),
    }
  })
  
  // SEO topic pages (high-value keywords)
  const seoKeywords = [
    // Restaurants
    'best-restaurants-belgrade',
    'skadarlija-restaurants',
    'serbian-food-belgrade',
    'romantic-restaurants-belgrade',
    'breakfast-belgrade',
    'fine-dining-belgrade',
    'traditional-kafana-belgrade',
    'italian-restaurants-belgrade',
    'seafood-restaurants-belgrade',
    
    // Hotels
    'hotels-belgrade-city-center',
    'budget-hotels-belgrade',
    'luxury-hotels-belgrade',
    'boutique-hotels-belgrade',
    'hotels-near-kalemegdan',
    
    // Nightlife
    'belgrade-nightlife',
    'river-clubs-splavovi',
    'bars-dorcol',
    'clubs-belgrade',
    'strahinjica-bana-bars',
    'craft-beer-belgrade',
    
    // Attractions
    'things-to-do-belgrade',
    'kalemegdan-fortress',
    'saint-sava-temple',
    'knez-mihailova-street',
    'museums-belgrade',
    'avala-tower',
    'ada-ciganlija',
    'kosutnjak-park',
    
    // Practical
    'belgrade-travel-guide',
    'belgrade-public-transport',
    'parking-belgrade',
  ]
  
  const seoPages = seoKeywords.map(slug => ({
    loc: `${baseUrl}/seo/${slug}`,
    changefreq: 'monthly' as const,
    priority: 0.6,
  }))
  
  const allPages = [...staticPages, ...categoryPages, ...locationPages, ...seoPages]
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages.map(page => `  <url>
    <loc>${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${page.lastmod ? `<lastmod>${page.lastmod.split('T')[0]}</lastmod>` : ''}
    ${page.images?.length ? page.images.map((img: string) => `    <image:image>
      <image:loc>${img}</image:loc>
    </image:image>`).join('\n') : ''}
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
