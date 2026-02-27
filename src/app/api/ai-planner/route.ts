import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface ItineraryItem {
  id: string
  name: string
  category: string
  rating?: number
  priceLevel?: number
}

interface PlanningRequest {
  action: 'generate' | 'optimize' | 'suggest' | 'chat'
  itinerary?: ItineraryItem[]
  preferences?: {
    budget?: 'budget' | 'moderate' | 'luxury'
    pace?: 'relaxed' | 'moderate' | 'intense'
    interests?: string[]
    startTime?: string
    endTime?: string
  }
  message?: string
  locations?: Array<{
    id: string
    name: string
    category: string
    rating?: number
    priceLevel?: number
  }>
}

const SYSTEM_PROMPT = `You are an expert Belgrade travel guide AI assistant. You help visitors plan their perfect day in Belgrade, Serbia.

KNOWLEDGE BASE:
- Belgrade is known for: Skadarlija bohemian quarter, Kalemegdan Fortress, Ada Ciganlija lake, vibrant nightlife at Savamala, rakija culture
- Best restaurants: Zavičaj, Dva Bela Goluba, Šaran (Skadarlija), Lorenzo & Kakalamba
- Best hotels: Hotel Moskva (historic), Metropol Palace (luxury), Mint Hotel (boutique), Envoy Hotel (central)
- Best nightlife: Freestyler, Lasta, Hype, Mr. Stefan Braun (rooftop), Savamala district clubs
- Average walking time: 15-20 min between city center attractions
- Currency: Serbian Dinar (RSD), ~117 RSD = 1 EUR
- Peak hours: Restaurants 19-21h, Clubs after 23h

YOUR CAPABILITIES:
1. Generate complete day itineraries based on preferences
2. Optimize existing itineraries for walking efficiency
3. Suggest venues that match user interests
4. Answer questions about Belgrade

RESPONSE FORMAT:
- Be concise but helpful
- Use bullet points for lists
- Include walking times between venues
- Consider opening hours (restaurants 11-23h, museums 10-18h, clubs 23-4h)
- Price levels: € = budget (500-1000 RSD), €€ = moderate (1000-2000 RSD), €€€ = upscale (2000+ RSD)
- Always respond in the same language the user used (Serbian or English)

WEATHER CONTEXT:
- Summer (Jun-Aug): Hot 25-35°C, perfect for Ada Ciganlija, outdoor dining
- Fall (Sep-Nov): Mild 10-20°C, great for walking tours, kafanas
- Winter (Dec-Feb): Cold -5-10°C, indoor activities, cozy restaurants
- Spring (Mar-May): Pleasant 15-25°C, Kalemegdan, river walks`

export async function POST(request: NextRequest) {
  try {
    const data: PlanningRequest = await request.json()
    const zai = await ZAI.create()

    let userMessage = ''
    
    switch (data.action) {
      case 'generate':
        userMessage = `Generate a complete day itinerary for Belgrade with these preferences:
Budget: ${data.preferences?.budget || 'moderate'}
Pace: ${data.preferences?.pace || 'moderate'}
Interests: ${data.preferences?.interests?.join(', ') || 'general sightseeing'}
Start time: ${data.preferences?.startTime || '10:00'}
End time: ${data.preferences?.endTime || '22:00'}

Available venues:
${data.locations?.map(l => `- ${l.name} (${l.category}, ${l.rating ? l.rating + ' stars' : 'no rating'}, ${l.priceLevel ? '€'.repeat(l.priceLevel) : 'free'})`).join('\n') || 'No venues provided'}

Provide a detailed itinerary with times, walking distances, and tips.`
        break

      case 'optimize':
        userMessage = `Optimize this itinerary for minimum walking and best experience:

Current plan:
${data.itinerary?.map((item, i) => `${i + 1}. ${item.name} (${item.category})`).join('\n') || 'No items'}

Available venues with details:
${data.locations?.map(l => `- ${l.name} (${l.category}, lat/lng available)`).join('\n') || ''}

Reorder for optimal walking route. Consider:
1. Proximity between venues
2. Logical flow (morning activities → lunch → afternoon → dinner → nightlife)
3. Opening hours (museums close at 18h, restaurants open at 11h, clubs after 23h)

Provide the reordered list with walking times between each venue.`
        break

      case 'suggest':
        userMessage = `Suggest venues for a visitor interested in: ${data.preferences?.interests?.join(', ') || 'general experience'}

Budget preference: ${data.preferences?.budget || 'moderate'}

Available venues:
${data.locations?.map(l => `- ${l.name} (${l.category}, ${l.rating || 'N/A'} stars, ${l.priceLevel ? '€'.repeat(l.priceLevel) : 'free'})`).join('\n') || 'No venues provided'}

Recommend top 5 venues with reasons why they fit the interests.`
        break

      case 'chat':
        userMessage = data.message || 'Hello! How can you help me plan my Belgrade visit?'
        break

      default:
        userMessage = 'How can you help me plan my Belgrade visit?'
    }

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      thinking: { type: 'disabled' }
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('Empty response from AI')
    }

    // Extract suggested venues from response (if any mentioned)
    const suggestedVenueNames: string[] = []
    if (data.locations) {
      for (const loc of data.locations) {
        if (response.toLowerCase().includes(loc.name.toLowerCase())) {
          suggestedVenueNames.push(loc.id)
        }
      }
    }

    return NextResponse.json({
      success: true,
      response,
      suggestedVenueIds: suggestedVenueNames
    })

  } catch (error) {
    console.error('AI Planner error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process request' 
      },
      { status: 500 }
    )
  }
}
