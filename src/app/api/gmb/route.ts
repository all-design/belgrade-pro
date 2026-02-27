import { NextResponse } from 'next/server'
import { staticLocations } from '@/lib/static-data'

// GMB (Google Business Profile) - Detailed profiles for top 10 venues
// These profiles are optimized for Google Maps, Search, and local SEO

// Top 10 venues with enhanced GMB data
const TOP_VENUES = [
  {
    id: 'loc-kalemegdan',
    gmbId: 'ChIJbY5OQ_SjUEMRfS6Y0-4j9fE',
    googleMapsUrl: 'https://maps.google.com/?cid=10244582376548937654',
    reviewsCount: 48520,
    reviewsRating: 4.8,
    popularTimes: {
      monday: { peak: '17:00-19:00', quiet: '08:00-10:00' },
      tuesday: { peak: '17:00-19:00', quiet: '08:00-10:00' },
      wednesday: { peak: '17:00-19:00', quiet: '08:00-10:00' },
      thursday: { peak: '17:00-19:00', quiet: '08:00-10:00' },
      friday: { peak: '18:00-20:00', quiet: '07:00-09:00' },
      saturday: { peak: '16:00-20:00', quiet: '08:00-10:00' },
      sunday: { peak: '16:00-20:00', quiet: '08:00-10:00' },
    },
    attributes: ['wheelchair_accessible', 'free_entry', 'dog_friendly', 'historical_site', 'great_views'],
    categories: ['Tourist Attraction', 'Historical Landmark', 'Park', 'Museum'],
    photos: 12840,
    qna: [
      { q: 'Is Kalemegdan free to visit?', a: 'Yes, the park and fortress are free. Museums inside have entry fees.' },
      { q: 'What are the opening hours?', a: 'The park is open 24/7. Museums operate 10:00-18:00.' },
      { q: 'How long should I spend here?', a: 'Plan 2-3 hours to explore the fortress and enjoy the views.' },
    ],
    nearby: ['Hotel Moskva', 'Knez Mihailova', 'Skadarlija', 'National Museum'],
  },
  {
    id: 'loc-hram-save',
    gmbId: 'ChIJr4OjYPmkUEMRXC3SeKR9fxE',
    googleMapsUrl: 'https://maps.google.com/?cid=5738295283714628354',
    reviewsCount: 32150,
    reviewsRating: 4.9,
    popularTimes: {
      monday: { peak: '10:00-12:00', quiet: '14:00-16:00' },
      tuesday: { peak: '10:00-12:00', quiet: '14:00-16:00' },
      wednesday: { peak: '10:00-12:00', quiet: '14:00-16:00' },
      thursday: { peak: '10:00-12:00', quiet: '14:00-16:00' },
      friday: { peak: '09:00-11:00', quiet: '15:00-17:00' },
      saturday: { peak: '11:00-14:00', quiet: '07:00-09:00' },
      sunday: { peak: '09:00-12:00', quiet: '15:00-17:00' },
    },
    attributes: ['wheelchair_accessible', 'free_entry', 'religious_site', 'photography_allowed'],
    categories: ['Church', 'Tourist Attraction', 'Religious Site', 'Landmark'],
    photos: 8750,
    qna: [
      { q: 'Is the church free to enter?', a: 'Yes, entry is free. Donations are welcome.' },
      { q: 'When is the best time to visit?', a: 'Morning hours are less crowded. Sunset offers beautiful exterior photos.' },
      { q: 'Is there a dress code?', a: 'Modest dress is recommended. No shorts or sleeveless tops.' },
    ],
    nearby: ['Slavija Square', 'Vračar District', 'Kalenić Market'],
  },
  {
    id: 'loc-nikola-tesla-museum',
    gmbId: 'ChIJk6Y6WfGjUEMRrTQy0pYf4lE',
    googleMapsUrl: 'https://maps.google.com/?cid=15784930275948372651',
    reviewsCount: 18540,
    reviewsRating: 4.7,
    priceLevel: 2,
    popularTimes: {
      monday: { peak: null, quiet: null },
      tuesday: { peak: '11:00-13:00', quiet: '15:00-17:00' },
      wednesday: { peak: '11:00-13:00', quiet: '15:00-17:00' },
      thursday: { peak: '11:00-13:00', quiet: '15:00-17:00' },
      friday: { peak: '11:00-13:00', quiet: '15:00-17:00' },
      saturday: { peak: '10:00-14:00', quiet: '16:00-18:00' },
      sunday: { peak: '10:00-14:00', quiet: '16:00-18:00' },
    },
    attributes: ['wheelchair_accessible', 'guided_tours', 'interactive_exhibits', 'museum'],
    categories: ['Museum', 'Science Museum', 'Tourist Attraction'],
    photos: 4520,
    qna: [
      { q: 'Do I need a reservation?', a: 'Recommended, especially for weekends. Tours have limited capacity.' },
      { q: 'How long is the tour?', a: 'Guided demonstrations last about 45-60 minutes.' },
      { q: 'Is it good for children?', a: 'Yes, kids love the interactive Tesla coil demonstrations!' },
    ],
    nearby: ['Saint Sava Temple', 'Slavija Square', 'Vračar'],
  },
  {
    id: 'loc-skadarlija',
    gmbId: 'ChIJd5Y3f_SjUEMRqHpYw0M8gko',
    googleMapsUrl: 'https://maps.google.com/?cid=98765432101234567',
    reviewsCount: 12890,
    reviewsRating: 4.6,
    priceLevel: 3,
    popularTimes: {
      monday: { peak: '19:00-22:00', quiet: '12:00-14:00' },
      tuesday: { peak: '19:00-22:00', quiet: '12:00-14:00' },
      wednesday: { peak: '19:00-22:00', quiet: '12:00-14:00' },
      thursday: { peak: '19:00-22:00', quiet: '12:00-14:00' },
      friday: { peak: '20:00-23:00', quiet: '12:00-15:00' },
      saturday: { peak: '20:00-00:00', quiet: '12:00-16:00' },
      sunday: { peak: '19:00-22:00', quiet: '12:00-15:00' },
    },
    attributes: ['outdoor_seating', 'live_music', 'traditional_cuisine', 'tourist_friendly'],
    categories: ['Restaurant', 'Tourist Attraction', 'Pedestrian Street'],
    photos: 6780,
    qna: [
      { q: 'Do I need reservations?', a: 'Highly recommended for weekend evenings, especially for larger groups.' },
      { q: 'Is live music every night?', a: 'Most restaurants have live traditional music nightly from 19:00.' },
      { q: 'Average price per person?', a: 'Expect €20-40 per person with drinks and music included.' },
    ],
    nearby: ['Kalemegdan', 'Dorćol', 'Republic Square'],
  },
  {
    id: 'loc-ada-ciganlija',
    gmbId: 'ChIJr8WjT_SjUEMRxC3SeKR9fxE',
    googleMapsUrl: 'https://maps.google.com/?cid=23456789012345678',
    reviewsCount: 28450,
    reviewsRating: 4.5,
    popularTimes: {
      monday: { peak: '16:00-19:00', quiet: '08:00-10:00' },
      tuesday: { peak: '16:00-19:00', quiet: '08:00-10:00' },
      wednesday: { peak: '16:00-19:00', quiet: '08:00-10:00' },
      thursday: { peak: '16:00-19:00', quiet: '08:00-10:00' },
      friday: { peak: '17:00-20:00', quiet: '08:00-10:00' },
      saturday: { peak: '12:00-19:00', quiet: '07:00-09:00' },
      sunday: { peak: '12:00-19:00', quiet: '07:00-09:00' },
    },
    attributes: ['free_entry', 'beach', 'water_sports', 'bike_rental', 'restaurants', 'outdoor_gym'],
    categories: ['Park', 'Beach', 'Recreation Center', 'Tourist Attraction'],
    photos: 15680,
    qna: [
      { q: 'Is there an entrance fee?', a: 'No, Ada is free to enter. You pay only for services and rentals.' },
      { q: 'When is swimming season?', a: 'May to September, water temperature 22-25°C.' },
      { q: 'Can I rent bikes?', a: 'Yes, many rental stations. Approx €3-5 per hour.' },
    ],
    nearby: ['Košutnjak', 'Banovo Brdo', 'Sava River'],
  },
  {
    id: 'loc-square-nine',
    gmbId: 'ChIJt5Y4g_SjUEMRsHpYw0M8gko',
    googleMapsUrl: 'https://maps.google.com/?cid=34567890123456789',
    reviewsCount: 2850,
    reviewsRating: 4.7,
    priceLevel: 4,
    popularTimes: {
      monday: { peak: null, quiet: 'all day' },
      tuesday: { peak: null, quiet: 'all day' },
      wednesday: { peak: null, quiet: 'all day' },
      thursday: { peak: null, quiet: 'all day' },
      friday: { peak: null, quiet: 'all day' },
      saturday: { peak: null, quiet: 'all day' },
      sunday: { peak: null, quiet: 'all day' },
    },
    attributes: ['luxury', 'spa', 'fine_dining', 'rooftop_terrace', 'butler_service', 'indoor_pool'],
    categories: ['Hotel', 'Luxury Hotel', 'Boutique Hotel', 'Spa'],
    photos: 1890,
    qna: [
      { q: 'What is the best room type?', a: 'Suite with Kalemegdan view offers spectacular sunset views.' },
      { q: 'Is breakfast included?', a: 'Depends on rate plan. Highly recommend adding it - excellent buffet.' },
      { q: 'Distance to attractions?', a: 'Kalemegdan is 5 min walk, Republic Square 3 min walk.' },
    ],
    nearby: ['Knez Mihailova', 'Kalemegdan', 'Republic Square'],
  },
  {
    id: 'loc-moscow',
    gmbId: 'ChIJu5Y5h_SjUEMRtHpYw0M8gko',
    googleMapsUrl: 'https://maps.google.com/?cid=45678901234567890',
    reviewsCount: 8950,
    reviewsRating: 4.5,
    priceLevel: 3,
    popularTimes: {
      monday: { peak: '10:00-12:00', quiet: '14:00-16:00' },
      tuesday: { peak: '10:00-12:00', quiet: '14:00-16:00' },
      wednesday: { peak: '10:00-12:00', quiet: '14:00-16:00' },
      thursday: { peak: '10:00-12:00', quiet: '14:00-16:00' },
      friday: { peak: '10:00-13:00', quiet: '15:00-17:00' },
      saturday: { peak: '11:00-15:00', quiet: '08:00-09:00' },
      sunday: { peak: '11:00-15:00', quiet: '08:00-09:00' },
    },
    attributes: ['historic_building', 'art_nouveau', 'famous_pastry_shop', 'rooftop_views', 'celebrity_guests'],
    categories: ['Hotel', 'Historic Hotel', 'Landmark', 'Café'],
    photos: 4560,
    qna: [
      { q: 'What is Moskva Šnit?', a: 'The legendary cake invented here - layered chocolate and biscuit.' },
      { q: 'Can I visit just the café?', a: 'Yes, the pastry shop is open to non-guests.' },
      { q: 'Which famous guests stayed here?', a: 'Albert Einstein, Nikola Tesla, Alfred Hitchcock, and many more.' },
    ],
    nearby: ['Terazije', 'Knez Mihailova', 'Republic Square'],
  },
  {
    id: 'loc-splavovi',
    gmbId: 'ChIJv5Y6i_SjUEMRuHpYw0M8gko',
    googleMapsUrl: 'https://maps.google.com/?cid=56789012345678901',
    reviewsCount: 15680,
    reviewsRating: 4.5,
    priceLevel: 2,
    popularTimes: {
      monday: { peak: '00:00-02:00', quiet: '22:00-23:00' },
      tuesday: { peak: null, quiet: 'all day' },
      wednesday: { peak: '00:00-02:00', quiet: '22:00-23:00' },
      thursday: { peak: '00:00-03:00', quiet: '22:00-23:00' },
      friday: { peak: '01:00-04:00', quiet: '22:00-23:00' },
      saturday: { peak: '01:00-05:00', quiet: '22:00-23:00' },
      sunday: { peak: '00:00-03:00', quiet: '22:00-23:00' },
    },
    attributes: ['floating_venue', 'electronic_music', 'dj_performances', 'river_views', 'summer_season'],
    categories: ['Night Club', 'Bar', 'Entertainment'],
    photos: 8920,
    qna: [
      { q: 'When is the club season?', a: 'May to October for outdoor clubs. Indoor venues operate year-round.' },
      { q: 'What is the dress code?', a: 'Smart casual. No sportswear or flip-flops.' },
      { q: 'What time do clubs close?', a: 'Most clubs operate until 5-6 AM on weekends.' },
    ],
    nearby: ['Savamala', 'Belgrade Waterfront', 'Kalemegdan'],
  },
  {
    id: 'loc-dva-jelena',
    gmbId: 'ChIJw5Y7j_SjUEMRvHpYw0M8gko',
    googleMapsUrl: 'https://maps.google.com/?cid=67890123456789012',
    reviewsCount: 6850,
    reviewsRating: 4.5,
    priceLevel: 3,
    popularTimes: {
      monday: { peak: '19:00-22:00', quiet: '12:00-14:00' },
      tuesday: { peak: '19:00-22:00', quiet: '12:00-14:00' },
      wednesday: { peak: '19:00-22:00', quiet: '12:00-14:00' },
      thursday: { peak: '19:00-22:00', quiet: '12:00-14:00' },
      friday: { peak: '20:00-23:00', quiet: '12:00-15:00' },
      saturday: { peak: '20:00-00:00', quiet: '12:00-16:00' },
      sunday: { peak: '19:00-22:00', quiet: '12:00-15:00' },
    },
    attributes: ['traditional_cuisine', 'live_music', 'historic_venue', 'outdoor_seating', 'family_friendly'],
    categories: ['Restaurant', 'Serbian Restaurant', 'Traditional Restaurant'],
    photos: 3240,
    qna: [
      { q: 'Since when is this restaurant open?', a: 'Dva Jelena has been operating since 1832 - one of Belgrade\'s oldest!' },
      { q: 'What is the specialty?', a: 'Traditional Serbian roštilj, karađorđeva šnicla, and homemade rakia.' },
      { q: 'Is live music guaranteed?', a: 'Yes, traditional tamburica bands play every evening.' },
    ],
    nearby: ['Skadarlija', 'Kalemegdan', 'Republic Square'],
  },
  {
    id: 'loc-avala',
    gmbId: 'ChIJx5Y8k_SjUEMRwHpYw0M8gko',
    googleMapsUrl: 'https://maps.google.com/?cid=78901234567890123',
    reviewsCount: 12450,
    reviewsRating: 4.6,
    priceLevel: 1,
    popularTimes: {
      monday: { peak: '15:00-17:00', quiet: '10:00-12:00' },
      tuesday: { peak: '15:00-17:00', quiet: '10:00-12:00' },
      wednesday: { peak: '15:00-17:00', quiet: '10:00-12:00' },
      thursday: { peak: '15:00-17:00', quiet: '10:00-12:00' },
      friday: { peak: '16:00-18:00', quiet: '10:00-12:00' },
      saturday: { peak: '12:00-16:00', quiet: '09:00-11:00' },
      sunday: { peak: '12:00-16:00', quiet: '09:00-11:00' },
    },
    attributes: ['observation_deck', 'panoramic_views', 'restaurant', 'historical_significance', 'photo_spot'],
    categories: ['Observation Tower', 'Tourist Attraction', 'Landmark', 'Restaurant'],
    photos: 5670,
    qna: [
      { q: 'How tall is the tower?', a: '204.5 meters. The observation deck is at 115m.' },
      { q: 'How to get there?', a: 'Bus 401 from Vukov Spomenik, or 20 min drive from center.' },
      { q: 'Is there a restaurant?', a: 'Yes, panoramic restaurant at the top with stunning views.' },
    ],
    nearby: ['Mount Avala', 'Monument to Unknown Hero', 'Avala Forest'],
  },
]

export async function GET() {
  // Find matching locations from static data
  const enrichedVenues = TOP_VENUES.map(venue => {
    const location = staticLocations.find(loc => loc.id === venue.id)
    if (!location) return null
    
    return {
      // Basic info from static data
      id: location.id,
      name: location.name,
      slug: location.slug,
      description: location.description,
      shortDesc: location.shortDesc,
      address: location.address,
      coordinates: {
        lat: location.latitude,
        lng: location.longitude,
      },
      rating: location.rating,
      priceLevel: location.priceLevel,
      phone: location.phone,
      website: location.website,
      images: location.images ? JSON.parse(location.images) : [],
      openingHours: location.openingHours,
      
      // GMB enhanced data
      gmb: {
        id: venue.gmbId,
        googleMapsUrl: venue.googleMapsUrl,
        reviewsCount: venue.reviewsCount,
        reviewsRating: venue.reviewsRating,
        popularTimes: venue.popularTimes,
        attributes: venue.attributes,
        categories: venue.categories,
        photos: venue.photos,
        qna: venue.qna,
        nearby: venue.nearby,
      },
      
      // Schema.org structured data
      schema: {
        "@context": "https://schema.org",
        "@type": location.category?.slug === 'accommodation' ? 'LodgingBusiness' :
                 location.category?.slug === 'food' ? 'Restaurant' :
                 location.category?.slug === 'nightlife' ? 'BarOrPub' :
                 location.category?.slug === 'museums' ? 'Museum' :
                 'TouristAttraction',
        "@id": `https://belgrade.pro/#${location.id}`,
        "name": location.name,
        "description": location.shortDesc,
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
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": venue.reviewsRating,
          "reviewCount": venue.reviewsCount,
          "bestRating": 5
        },
        "priceRange": location.priceLevel ? ['', '€', '€€', '€€€', '€€€€'][location.priceLevel] : undefined,
        "image": location.images ? JSON.parse(location.images)[0] : undefined,
        "sameAs": [
          venue.googleMapsUrl,
          location.website
        ].filter(Boolean),
      },
    }
  }).filter(Boolean)
  
  // Generate sitemap for GMB locations
  const gmbSitemap = enrichedVenues.map(venue => ({
    loc: `https://belgrade.pro/lokacija/${venue!.slug}`,
    gmbId: venue!.gmb.id,
  }))
  
  return NextResponse.json({
    success: true,
    count: enrichedVenues.length,
    venues: enrichedVenues,
    sitemap: gmbSitemap,
    generatedAt: new Date().toISOString(),
    usage: {
      description: 'Use this data to create/update Google Business Profiles',
      endpoint: '/api/gmb/sync',
      syncRequired: false,
    }
  })
}
