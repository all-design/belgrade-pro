import { NextRequest, NextResponse } from 'next/server'
import { staticLocations } from '@/lib/static-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    // Use static data directly (SQLite doesn't work on Vercel serverless)
    let locations = [...staticLocations]

    // Apply filters
    if (categorySlug) {
      locations = locations.filter(loc => loc.category?.slug === categorySlug)
    }

    if (featured === 'true') {
      locations = locations.filter(loc => loc.featured)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      locations = locations.filter(loc => 
        loc.name.toLowerCase().includes(searchLower) ||
        loc.description?.toLowerCase().includes(searchLower) ||
        loc.shortDesc?.toLowerCase().includes(searchLower)
      )
    }

    // Sort: featured first, then by rating, then by name
    locations.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      if ((b.rating || 0) !== (a.rating || 0)) return (b.rating || 0) - (a.rating || 0)
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json(locations)
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json(staticLocations) // Fallback to static data
  }
}
