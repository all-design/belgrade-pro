import { NextRequest, NextResponse } from 'next/server'

// Booking.com API Integration for belgrade.pro
// Monetization through affiliate commissions

// Booking.com Affiliate API Configuration
const BOOKING_CONFIG = {
  affiliateId: process.env.BOOKING_AFFILIATE_ID || 'belgrade-pro',
  apiKey: process.env.BOOKING_API_KEY || '',
  baseUrl: 'https://distribution-xml.booking.com/2.0',
  // Fallback to RapidAPI if direct API unavailable
  rapidApiHost: 'booking-com.p.rapidapi.com'
}

interface HotelData {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  rating: number
  price: number
  currency: string
  image: string
  url: string // Affiliate link
  amenities: string[]
  reviewScore: number
  reviewCount: number
}

interface RestaurantData {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  rating: number
  priceLevel: number
  cuisine: string[]
  bookingUrl?: string
}

// Generate affiliate link with tracking
function generateAffiliateLink(hotelId: string, checkIn?: string, checkOut?: string): string {
  const baseUrl = 'https://www.booking.com/hotel/rs/'
  const affiliateParams = `aid=${BOOKING_CONFIG.affiliateId}&label=belgrade-pro`
  const dateParams = checkIn && checkOut ? `&checkin=${checkIn}&checkout=${checkOut}` : ''
  return `${baseUrl}${hotelId}.html?${affiliateParams}${dateParams}`
}

// Track click for monetization analytics
async function trackClick(data: {
  type: 'hotel' | 'restaurant' | 'venue'
  id: string
  name: string
  userId?: string
  sessionId: string
}) {
  // In production, save to analytics database
  console.log('[MONETIZATION] Click tracked:', data)
  
  // Store in database for revenue tracking
  // await db.monetizationClick.create({ data })
  
  return { tracked: true }
}

// Search hotels via Booking.com API
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action') || 'search'
  const location = searchParams.get('location') || 'Belgrade'
  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')
  const guests = searchParams.get('guests') || '2'
  
  try {
    if (action === 'search') {
      // Mock data for development - replace with real API in production
      const mockHotels: HotelData[] = [
        {
          id: 'square-nine',
          name: 'Square Nine Hotel',
          address: 'Studentski Trg 9, Belgrade',
          latitude: 44.8155,
          longitude: 20.4589,
          rating: 4.8,
          price: 120,
          currency: 'EUR',
          image: '/hotels/square-nine.jpg',
          url: generateAffiliateLink('square-nine', checkIn, checkOut),
          amenities: ['WiFi', 'Spa', 'Restaurant', 'Gym', 'Parking'],
          reviewScore: 9.2,
          reviewCount: 1247
        },
        {
          id: 'metropol-palace',
          name: 'Metropol Palace Hotel',
          address: 'Bulevar Kralja Aleksandra 69, Belgrade',
          latitude: 44.8065,
          longitude: 20.4658,
          rating: 4.7,
          price: 95,
          currency: 'EUR',
          image: '/hotels/metropol.jpg',
          url: generateAffiliateLink('metropol-palace', checkIn, checkOut),
          amenities: ['WiFi', 'Pool', 'Restaurant', 'Casino', 'Spa'],
          reviewScore: 8.9,
          reviewCount: 892
        },
        {
          id: 'moskva',
          name: 'Hotel Moskva',
          address: 'Terazije 1, Belgrade',
          latitude: 44.8125,
          longitude: 20.4617,
          rating: 4.6,
          price: 85,
          currency: 'EUR',
          image: '/hotels/moskva.jpg',
          url: generateAffiliateLink('moskva', checkIn, checkOut),
          amenities: ['WiFi', 'Restaurant', 'Bar', 'Historic Building'],
          reviewScore: 8.7,
          reviewCount: 2103
        },
        {
          id: 'envoy',
          name: 'Envoy Hotel',
          address: 'Kralja Petra 35, Belgrade',
          latitude: 44.8178,
          longitude: 20.4545,
          rating: 4.7,
          price: 75,
          currency: 'EUR',
          image: '/hotels/envoy.jpg',
          url: generateAffiliateLink('envoy', checkIn, checkOut),
          amenities: ['WiFi', 'Breakfast', 'Central Location', 'Modern Design'],
          reviewScore: 9.0,
          reviewCount: 567
        },
        {
          id: 'mark-hotel',
          name: 'Mark Hotel',
          address: 'Knez Mihailova 38, Belgrade',
          latitude: 44.8145,
          longitude: 20.4589,
          rating: 4.5,
          price: 55,
          currency: 'EUR',
          image: '/hotels/mark.jpg',
          url: generateAffiliateLink('mark-hotel', checkIn, checkOut),
          amenities: ['WiFi', 'Breakfast', 'Shopping District'],
          reviewScore: 8.5,
          reviewCount: 421
        }
      ]
      
      return NextResponse.json({
        success: true,
        location,
        hotels: mockHotels,
        currency: 'EUR',
        checkIn: checkIn || 'Flexible',
        checkOut: checkOut || 'Flexible',
        guests: parseInt(guests),
        affiliateInfo: {
          program: 'Booking.com Affiliate',
          commission: '4-5% per booking',
          trackingEnabled: true
        }
      })
    }
    
    if (action === 'track') {
      // Track click for monetization
      const hotelId = searchParams.get('hotelId') || ''
      const name = searchParams.get('name') || ''
      const sessionId = searchParams.get('sessionId') || 'anonymous'
      
      await trackClick({
        type: 'hotel',
        id: hotelId,
        name,
        sessionId
      })
      
      return NextResponse.json({ tracked: true, hotelId })
    }
    
    if (action === 'compare') {
      // Price comparison across platforms
      const hotelName = searchParams.get('hotel') || ''
      
      // Mock comparison data
      const comparisons = [
        { platform: 'Booking.com', price: 120, currency: 'EUR', best: true, url: generateAffiliateLink(hotelName.toLowerCase().replace(/\s+/g, '-'), checkIn, checkOut) },
        { platform: 'Agoda', price: 125, currency: 'EUR', best: false, url: `https://www.agoda.com/search?city=8212&hotel=${hotelName}` },
        { platform: 'Trivago', price: 122, currency: 'EUR', best: false, url: `https://www.trivago.com/hotels/search?query=${encodeURIComponent(hotelName + ' Belgrade')}` },
        { platform: 'Hotels.com', price: 128, currency: 'EUR', best: false, url: `https://www.hotels.com/search?destination=Belgrade` }
      ]
      
      return NextResponse.json({
        hotel: hotelName,
        comparisons,
        bestPrice: comparisons.find(c => c.best)?.price || comparisons[0].price,
        savings: Math.max(...comparisons.map(c => c.price)) - (comparisons.find(c => c.best)?.price || comparisons[0].price)
      })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    
  } catch (error) {
    console.error('Booking API Error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch booking data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Create booking redirect
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { hotelId, checkIn, checkOut, guests, userId, sessionId } = body
    
    // Track the booking intent
    await trackClick({
      type: 'hotel',
      id: hotelId,
      name: hotelId,
      userId,
      sessionId: sessionId || 'anonymous'
    })
    
    // Generate affiliate link
    const affiliateUrl = generateAffiliateLink(hotelId, checkIn, checkOut)
    
    return NextResponse.json({
      success: true,
      bookingUrl: affiliateUrl,
      message: 'Redirecting to Booking.com...',
      tracking: {
        affiliateId: BOOKING_CONFIG.affiliateId,
        commission: '4-5% on completed booking'
      }
    })
    
  } catch (error) {
    console.error('Booking Redirect Error:', error)
    return NextResponse.json({ 
      error: 'Failed to create booking link'
    }, { status: 500 })
  }
}
