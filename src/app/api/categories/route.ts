import { NextResponse } from 'next/server'
import { staticCategories } from '@/lib/static-data'

export async function GET() {
  try {
    // Use static data directly (SQLite doesn't work on Vercel serverless)
    return NextResponse.json(staticCategories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(staticCategories) // Fallback to static data
  }
}
