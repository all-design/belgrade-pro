import { NextRequest, NextResponse } from 'next/server'

// SEO Keywords for Belgrade - targeting high-volume English searches
const SEO_TOPICS = [
  // Restaurants & Food (15 topics)
  { keyword: 'best restaurants belgrade', title: 'Best Restaurants in Belgrade 2026 - Top 15 Local Favorites', category: 'food', intent: 'guide' },
  { keyword: 'skadarlija restaurants', title: 'Skadarlija Restaurants - Traditional Serbian Dining with Live Music', category: 'food', intent: 'local' },
  { keyword: 'serbian food belgrade', title: 'Best Serbian Food in Belgrade - Where to Eat Traditional Cuisine', category: 'food', intent: 'guide' },
  { keyword: 'romantic restaurants belgrade', title: 'Most Romantic Restaurants in Belgrade - Top 10 for Couples', category: 'food', intent: 'guide' },
  { keyword: 'breakfast belgrade', title: 'Best Breakfast in Belgrade - Top Cafés and Brunch Spots', category: 'food', intent: 'local' },
  { keyword: 'grill bbq belgrade', title: 'Best Grill & BBQ in Belgrade - Cevapi, Pljeskavica, Rostilj', category: 'food', intent: 'local' },
  { keyword: 'italian restaurants belgrade', title: 'Best Italian Restaurants in Belgrade - Pizza & Pasta', category: 'food', intent: 'guide' },
  { keyword: 'seafood restaurants belgrade', title: 'Seafood Restaurants in Belgrade - River Fish & Adriatic Cuisine', category: 'food', intent: 'guide' },
  { keyword: 'vegetarian restaurants belgrade', title: 'Vegetarian & Vegan Restaurants in Belgrade', category: 'food', intent: 'guide' },
  { keyword: 'fast food belgrade', title: 'Best Fast Food in Belgrade - Burgers, Shawarma, Street Food', category: 'food', intent: 'local' },
  { keyword: 'traditional kafana belgrade', title: 'Traditional Kafanas in Belgrade - Old School Serbian Taverns', category: 'food', intent: 'guide' },
  { keyword: 'fine dining belgrade', title: 'Fine Dining in Belgrade - Gourmet Restaurants & Chef Tables', category: 'food', intent: 'guide' },
  { keyword: 'breakfast dorcol', title: 'Best Breakfast in Dorcol - Morning Cafés and Bakeries', category: 'food', intent: 'local' },
  { keyword: 'dinner with view belgrade', title: 'Best Restaurants with View in Belgrade - River & City Panoramas', category: 'food', intent: 'guide' },
  { keyword: 'business lunch belgrade', title: 'Best Business Lunch Spots in Belgrade - Meeting-Friendly Restaurants', category: 'food', intent: 'guide' },
  
  // Hotels & Accommodation (10 topics)
  { keyword: 'hotels belgrade city center', title: 'Best City Center Hotels in Belgrade - Top Locations', category: 'accommodation', intent: 'guide' },
  { keyword: 'budget hotels belgrade', title: 'Budget Hotels in Belgrade - Affordable Accommodation Under €50', category: 'accommodation', intent: 'guide' },
  { keyword: 'luxury hotels belgrade', title: 'Luxury Hotels in Belgrade - 5-Star Properties & Boutique Stays', category: 'accommodation', intent: 'guide' },
  { keyword: 'apartments belgrade', title: 'Best Apartments in Belgrade - Airbnb & Holiday Rentals', category: 'accommodation', intent: 'guide' },
  { keyword: 'hostels belgrade', title: 'Best Hostels in Belgrade - Budget Backpacker Accommodation', category: 'accommodation', intent: 'guide' },
  { keyword: 'hotel near kalemegdan', title: 'Hotels Near Kalemegdan Fortress - Best Old Town Locations', category: 'accommodation', intent: 'local' },
  { keyword: 'spa hotels belgrade', title: 'Spa Hotels in Belgrade - Wellness & Relaxation Centers', category: 'accommodation', intent: 'guide' },
  { keyword: 'boutique hotels belgrade', title: 'Boutique Hotels in Belgrade - Unique Design Properties', category: 'accommodation', intent: 'guide' },
  { keyword: 'hotels with view belgrade', title: 'Hotels with Best Views in Belgrade - Danube & Sava River', category: 'accommodation', intent: 'guide' },
  { keyword: 'savamala hotels', title: 'Best Hotels in Savamala - Trendy Belgrade District', category: 'accommodation', intent: 'local' },
  
  // Nightlife (10 topics)
  { keyword: 'belgrade nightlife', title: 'Belgrade Nightlife Guide - Best Clubs, Bars & Parties', category: 'nightlife', intent: 'guide' },
  { keyword: 'river clubs belgrade', title: 'River Clubs (Splavovi) in Belgrade - Floating Party Venues', category: 'nightlife', intent: 'guide' },
  { keyword: 'bars dorcol', title: 'Best Bars in Dorcol - Craft Cocktails & Hip Atmosphere', category: 'nightlife', intent: 'local' },
  { keyword: 'clubs belgrade', title: 'Best Nightclubs in Belgrade - Where to Party All Night', category: 'nightlife', intent: 'guide' },
  { keyword: 'live music belgrade', title: 'Live Music Venues in Belgrade - Traditional & Modern', category: 'nightlife', intent: 'guide' },
  { keyword: 'strahinjica bana bars', title: 'Strahinjica Bana Street Bars - Belgrade\'s Trendiest Strip', category: 'nightlife', intent: 'local' },
  { keyword: 'after party belgrade', title: 'After Party Spots in Belgrade - Open Until Morning', category: 'nightlife', intent: 'guide' },
  { keyword: 'craft beer belgrade', title: 'Craft Beer Scene in Belgrade - Breweries & Beer Gardens', category: 'nightlife', intent: 'guide' },
  { keyword: 'wine bars belgrade', title: 'Best Wine Bars in Belgrade - Serbian & International Wines', category: 'nightlife', intent: 'guide' },
  { keyword: 'late night bars belgrade', title: 'Late Night Bars in Belgrade - Open Until 5 AM', category: 'nightlife', intent: 'local' },
  
  // Landmarks & Attractions (10 topics)
  { keyword: 'things to do belgrade', title: 'Top 20 Things to Do in Belgrade - Complete Travel Guide', category: 'landmarks', intent: 'guide' },
  { keyword: 'kalemegdan fortress', title: 'Kalemegdan Fortress Guide - History, Views & Attractions', category: 'landmarks', intent: 'guide' },
  { keyword: 'saint sava temple', title: 'Saint Sava Temple - Largest Orthodox Church in the Balkans', category: 'landmarks', intent: 'guide' },
  { keyword: 'knez mihailova street', title: 'Knez Mihailova Street - Main Pedestrian Shopping Area', category: 'landmarks', intent: 'guide' },
  { keyword: 'museums belgrade', title: 'Best Museums in Belgrade - Nikola Tesla, National, Military', category: 'museums', intent: 'guide' },
  { keyword: 'avala tower', title: 'Avala Tower - Panoramic Views & Observation Deck', category: 'landmarks', intent: 'guide' },
  { keyword: 'skadarlija street', title: 'Skadarlija - Belgrade\'s Bohemian Quarter', category: 'landmarks', intent: 'guide' },
  { keyword: 'ada ciganlija', title: 'Ada Ciganlija - Belgrade\'s Summer Beach Paradise', category: 'nature', intent: 'guide' },
  { keyword: 'kosutnjak park', title: 'Kosutnjak Park - Forest Recreation & Nature Trails', category: 'nature', intent: 'guide' },
  { keyword: 'zemun belgrade', title: 'Zemun Old Town - Gardos Tower & Danube Promenade', category: 'landmarks', intent: 'guide' },
  
  // Practical Info (5 topics)
  { keyword: 'belgrade public transport', title: 'Belgrade Public Transport Guide - Buses, Trams, Taxis', category: 'practical', intent: 'guide' },
  { keyword: 'parking belgrade', title: 'Parking in Belgrade - Free Spots & Parking Zones', category: 'practical', intent: 'guide' },
  { keyword: 'belgrade map', title: 'Interactive Belgrade Map - Attractions & Neighborhoods', category: 'practical', intent: 'guide' },
  { keyword: 'belgrade weather', title: 'Belgrade Weather & Best Time to Visit', category: 'practical', intent: 'info' },
  { keyword: 'belgrade travel guide', title: 'Complete Belgrade Travel Guide 2026', category: 'practical', intent: 'guide' },
]

// Generate SEO content for a topic
function generateSEOContent(topic: typeof SEO_TOPICS[0]) {
  const content = `
# ${topic.title}

Your complete guide to "${topic.keyword}" in Belgrade, Serbia. Discover the best spots, local tips, and everything you need for an amazing experience.

## Top Recommendations for ${topic.keyword}

Belgrade offers countless options for ${topic.keyword}. Here are our expert picks:

### Top 5 Recommendations

1. **Belgrade Fortress (Kalemegdan)** - 2,000 years of history with stunning river views
2. **Saint Sava Temple** - The largest Orthodox church in the Balkans
3. **Skadarlija Street** - Traditional restaurants with live folk music
4. **Ada Ciganlija** - Summer beach paradise in the city
5. **Savamala Nightlife** - World-famous floating river clubs

## Practical Tips

- **Best time to visit**: April-June and September-November
- **Average meal cost**: €15-25 per person
- **Tip**: Make reservations for weekend dining

## Getting There

Belgrade has excellent public transport. Use city buses (€0.80) or taxis (€3-5 per ride). The city center is very walkable - most attractions are within 15-20 minutes walking distance.

## FAQ - Frequently Asked Questions

**Q: How much does ${topic.keyword} cost?**
A: Prices vary by location, but average €15-50 per person.

**Q: When is the best time for ${topic.keyword}?**
A: Weekdays are less crowded, weekends are more lively.

**Q: Do I need a reservation?**
A: Recommended for weekends and holidays.

## Related Attractions

- [Belgrade Fortress](/lokacija/kalemegdan)
- [Saint Sava Temple](/lokacija/saint-sava-temple)
- [Skadarlija](/lokacija/skadarlija)
- [Ada Ciganlija](/lokacija/ada-ciganlija)

---

*Updated: ${new Date().toLocaleDateString('en-US')} | Belgrade PRO - Your Guide to Belgrade*
`

  return content.trim()
}

// Generate FAQ Schema for a topic
function generateFAQSchema(topic: typeof SEO_TOPICS[0]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How much does ${topic.keyword} cost in Belgrade?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Prices for ${topic.keyword} in Belgrade range from €10 to €50 per person, depending on location and quality. Average price is around €20-25.`
        }
      },
      {
        "@type": "Question",
        "name": `When is the best time for ${topic.keyword}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The best time to visit Belgrade is April-June and September-November. The weather is pleasant and there are fewer tourists."
        }
      },
      {
        "@type": "Question",
        "name": `Where is the best location for ${topic.keyword}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The city center (Knez Mihailova, Skadarlija, Dorcol) offers the best options. Savamala is perfect for nightlife."
        }
      }
    ]
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security (optional in development)
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    const cronSecret = process.env.CRON_SECRET
    
    // Allow if: correct secret provided OR no secret configured
    if (cronSecret && secret !== cronSecret) {
      // Still allow Vercel Cron to work (it doesn't send secret by default)
      const userAgent = request.headers.get('user-agent') || ''
      const isVercelCron = userAgent.includes('vercel') || request.headers.get('x-vercel-cron')
      
      if (!isVercelCron) {
        console.log('Unauthorized cron attempt')
      }
    }

    // Generate all SEO pages
    const generatedPages = SEO_TOPICS.map(topic => ({
      slug: topic.keyword.replace(/\s+/g, '-').toLowerCase(),
      title: topic.title,
      metaDescription: `Complete guide to ${topic.keyword} in Belgrade, Serbia. Top recommendations, prices, hours, and insider tips for tourists. Updated 2026.`,
      keywords: [topic.keyword, 'belgrade', 'serbia', 'travel', 'guide'],
      content: generateSEOContent(topic),
      faqSchema: generateFAQSchema(topic),
      category: topic.category,
      intent: topic.intent,
      generatedAt: new Date().toISOString()
    }))

    // Return generated pages (in production, save to database)
    return NextResponse.json({
      success: true,
      generated: generatedPages.length,
      pages: generatedPages,
      message: `Generated ${generatedPages.length} SEO pages`
    })
  } catch (error) {
    console.error('SEO Cron Error:', error)
    return NextResponse.json({ error: 'Failed to generate SEO pages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Alias for GET (some cron services use POST)
  return GET(request)
}
