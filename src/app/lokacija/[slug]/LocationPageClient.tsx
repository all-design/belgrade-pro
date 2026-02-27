'use client'

import { Location, Category } from '@/lib/types'
import { MapPin, Star, Clock, Phone, Globe, Navigation, Heart, Share2, ChevronLeft, ExternalLink, Bookmark } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'

interface LocationPageClientProps {
  location: Location
  category: Category | null
  relatedLocations: Location[]
  nearbyLocations: Location[]
}

export default function LocationPageClient({ 
  location, 
  category,
  relatedLocations,
  nearbyLocations 
}: LocationPageClientProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  // Parse opening hours
  const parseHours = (hoursJson: string | null) => {
    if (!hoursJson) return null
    try {
      return JSON.parse(hoursJson)
    } catch {
      return null
    }
  }
  
  const hours = parseHours(location.openingHours)
  
  // Check if open now
  const isOpenNow = () => {
    if (!hours) return null
    const now = new Date()
    const currentHour = now.getHours()
    const open = parseInt(hours.open?.split(':')[0] || '0')
    const close = parseInt(hours.close?.split(':')[0] || '24')
    
    if (close < open) { // Opens past midnight
      return currentHour >= open || currentHour < close
    }
    return currentHour >= open && currentHour < close
  }
  
  const openNow = isOpenNow()

  // Price display
  const priceDisplay = location.priceLevel !== null && location.priceLevel !== undefined
    ? ['', '€', '€€', '€€€', '€€€€'][location.priceLevel]
    : null

  // Parse images
  const images = location.images ? JSON.parse(location.images) : []
  
  // Debug: log image URL
  console.log('Location images:', images)

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[300px] bg-gradient-to-br from-amber-400 to-orange-500">
        {images[0] ? (
          <Image 
            src={images[0]} 
            alt={location.name}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        ) : null}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-white/80 text-sm mb-3">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronLeft className="w-4 h-4 rotate-180" />
              <Link href={`/?category=${category?.slug}`} className="hover:text-white">
                {category?.name || 'Locations'}
              </Link>
            </nav>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{location.name}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              {location.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{location.rating}</span>
                  <span className="text-white/70 text-sm">/5</span>
                </div>
              )}
              {priceDisplay && (
                <span className="font-semibold">{priceDisplay}</span>
              )}
              {category && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {category.name}
                </span>
              )}
              {openNow !== null && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  openNow ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'
                }`}>
                  {openNow ? 'Open Now' : 'Closed'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Quick Info */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              {location.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <div className="font-medium">{location.address}</div>
                    <div className="text-gray-500 text-sm">Belgrade, Serbia</div>
                  </div>
                </div>
              )}
              
              {hours && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <div className="font-medium">
                      {hours.open} - {hours.close}
                      {hours.note && <span className="text-gray-500 text-sm ml-2">({hours.note})</span>}
                    </div>
                    {hours.closed && (
                      <div className="text-red-500 text-sm">Closed: {hours.closed}</div>
                    )}
                  </div>
                </div>
              )}
              
              {location.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <a href={`tel:${location.phone}`} className="text-blue-600 hover:underline">
                    {location.phone}
                  </a>
                </div>
              )}
              
              {location.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-orange-500" />
                  <a 
                    href={location.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Visit Website <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <div className={`text-gray-700 whitespace-pre-line ${!showFullDescription && 'line-clamp-12'}`}>
                {location.description}
              </div>
              {location.description && location.description.length > 300 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-orange-500 hover:text-orange-600 font-medium mt-2"
                >
                  {showFullDescription ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>

            {/* Map */}
            <div className="bg-gray-100 rounded-2xl overflow-hidden h-64 relative">
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.005}%2C${location.latitude - 0.005}%2C${location.longitude + 0.005}%2C${location.latitude + 0.005}&layer=mapnik&marker=${location.latitude}%2C${location.longitude}`}
                className="w-full h-full border-0"
                title={`Map - ${location.name}`}
              />
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 px-4 py-2 bg-white rounded-full shadow-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span className="font-medium">Get Directions</span>
              </a>
            </div>

            {/* Related Locations */}
            {relatedLocations.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Similar Places</h2>
                <div className="grid grid-cols-2 gap-4">
                  {relatedLocations.map(loc => (
                    <Link
                      key={loc.id}
                      href={`/lokacija/${loc.slug}`}
                      className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-medium">{loc.name}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        {loc.rating && (
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {loc.rating}
                          </span>
                        )}
                        <span className="truncate">{loc.shortDesc?.substring(0, 30)}...</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Locations */}
            {nearbyLocations.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Nearby</h2>
                <div className="grid grid-cols-2 gap-4">
                  {nearbyLocations.map(loc => (
                    <Link
                      key={loc.id}
                      href={`/lokacija/${loc.slug}`}
                      className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-medium">{loc.name}</div>
                      <div className="text-sm text-gray-500">{loc.category?.name}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Action Buttons */}
            <div className="bg-orange-50 rounded-2xl p-6 space-y-3">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isSaved 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-white border border-gray-200 hover:border-orange-300'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </button>
              
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium hover:border-orange-300 transition-colors">
                <Share2 className="w-5 h-5" />
                Share
              </button>
              
              {location.bookingUrl && (
                <a
                  href={location.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-colors"
                >
                  Book Now
                </a>
              )}
            </div>

            {/* Category Badge */}
            {category && (
              <Link
                href={`/?category=${category.slug}`}
                className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="text-sm text-gray-500">Category</div>
                <div className="font-medium">{category.name}</div>
              </Link>
            )}

            {/* Featured Badge */}
            {location.featured && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2 text-amber-700">
                  <Star className="w-5 h-5 fill-amber-400" />
                  <span className="font-medium">Recommended</span>
                </div>
              </div>
            )}

            {/* Verified Badge */}
            {location.verified && (
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <span className="text-lg">✓</span>
                  <span className="font-medium">Verified Location</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-12 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Plan Your Perfect Day in Belgrade
          </h2>
          <p className="text-white/90 mb-6">
            Use our AI planner to create your personalized itinerary
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
          >
            Start Planning
          </Link>
        </div>
      </div>
    </main>
  )
}
