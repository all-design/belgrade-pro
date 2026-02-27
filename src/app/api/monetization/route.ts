import { NextRequest, NextResponse } from 'next/server'

// Monetization Tracking API for belgrade.pro
// Tracks clicks, bookings, and revenue

interface MonetizationEvent {
  type: 'click' | 'booking_intent' | 'booking_complete' | 'share'
  source: 'booking' | 'tripadvisor' | 'google' | 'whatsapp' | 'instagram' | 'pdf'
  venueId: string
  venueName: string
  venueCategory: string
  price?: number
  currency?: string
  userId?: string
  sessionId: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

// Revenue tracking - mock implementation
const revenueTracker = {
  booking: { commission: 0.05, avgBooking: 120 }, // 5% commission
  tripadvisor: { commission: 0.03, avgBooking: 80 }, // 3% commission
  google: { commission: 0.02, avgBooking: 50 } // 2% from ads
}

// In-memory store for development (replace with database in production)
const eventsStore: MonetizationEvent[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, source, venueId, venueName, venueCategory, price, currency, userId, sessionId, metadata } = body as MonetizationEvent
    
    const event: MonetizationEvent = {
      type,
      source,
      venueId,
      venueName,
      venueCategory,
      price,
      currency,
      userId,
      sessionId,
      timestamp: new Date(),
      metadata
    }
    
    // Store event
    eventsStore.push(event)
    
    // Calculate estimated revenue
    let estimatedRevenue = 0
    if (type === 'booking_intent' && source === 'booking') {
      estimatedRevenue = (price || revenueTracker.booking.avgBooking) * revenueTracker.booking.commission
    }
    
    // In production, save to database:
    // await db.monetizationEvent.create({ data: event })
    
    return NextResponse.json({
      success: true,
      tracked: true,
      eventId: `${Date.now()}-${venueId}`,
      estimatedRevenue,
      message: type === 'booking_intent' 
        ? `Potential commission: €${estimatedRevenue.toFixed(2)}` 
        : 'Event tracked'
    })
    
  } catch (error) {
    console.error('Monetization Tracking Error:', error)
    return NextResponse.json({ 
      error: 'Failed to track event'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action') || 'stats'
  
  if (action === 'stats') {
    // Get monetization statistics
    const clicks = eventsStore.filter(e => e.type === 'click').length
    const bookingIntents = eventsStore.filter(e => e.type === 'booking_intent').length
    const shares = eventsStore.filter(e => e.type === 'share').length
    
    // Calculate estimated revenue
    const bookingEvents = eventsStore.filter(e => e.type === 'booking_intent' && e.source === 'booking')
    const estimatedRevenue = bookingEvents.reduce((sum, e) => {
      return sum + (e.price || 120) * 0.05
    }, 0)
    
    // Top performing venues
    const venueClicks: Record<string, number> = {}
    eventsStore.forEach(e => {
      if (e.venueName) {
        venueClicks[e.venueName] = (venueClicks[e.venueName] || 0) + 1
      }
    })
    const topVenues = Object.entries(venueClicks)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, clicks]) => ({ name, clicks }))
    
    // Revenue by source
    const revenueBySource: Record<string, number> = {}
    eventsStore.filter(e => e.type === 'booking_intent').forEach(e => {
      const source = e.source
      const config = revenueTracker[source as keyof typeof revenueTracker]
      if (config) {
        revenueBySource[source] = (revenueBySource[source] || 0) + (e.price || config.avgBooking) * config.commission
      }
    })
    
    return NextResponse.json({
      period: 'all_time',
      metrics: {
        totalClicks: clicks,
        bookingIntents,
        shares,
        estimatedRevenue: Math.round(estimatedRevenue * 100) / 100,
        conversionRate: clicks > 0 ? ((bookingIntents / clicks) * 100).toFixed(1) + '%' : '0%'
      },
      topVenues,
      revenueBySource,
      events: eventsStore.slice(-50) // Last 50 events
    })
  }
  
  if (action === 'dashboard') {
    // Dashboard data for admin
    const today = new Date()
    const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const recentEvents = eventsStore.filter(e => new Date(e.timestamp) >= last7Days)
    
    return NextResponse.json({
      overview: {
        totalEvents: eventsStore.length,
        last7Days: recentEvents.length,
        estimatedMonthlyRevenue: '€' + (eventsStore.filter(e => e.type === 'booking_intent').length * 6).toFixed(0)
      },
      breakdown: {
        byType: {
          clicks: eventsStore.filter(e => e.type === 'click').length,
          bookings: eventsStore.filter(e => e.type === 'booking_intent').length,
          shares: eventsStore.filter(e => e.type === 'share').length
        },
        bySource: {
          booking: eventsStore.filter(e => e.source === 'booking').length,
          tripadvisor: eventsStore.filter(e => e.source === 'tripadvisor').length,
          social: eventsStore.filter(e => ['whatsapp', 'instagram'].includes(e.source)).length
        }
      },
      recommendations: [
        'Add more hotels to increase booking revenue',
        'Optimize Skadarlija page for higher conversion',
        'Add price comparison widget to hotel cards'
      ]
    })
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
