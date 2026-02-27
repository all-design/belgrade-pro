'use client'

import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Star, X, Clock, Navigation, ExternalLink, Heart, Bookmark, Compass, Search, Utensils, Wine, Moon, Bed, Landmark, Coffee } from 'lucide-react'
import { Location, Category } from '@/lib/types'
import Image from 'next/image'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// Dynamically import map
const VintageMap = dynamic(() => import('@/components/map/vintage-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" style={{ background: '#FFD99C' }}>
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-4 animate-pulse" style={{ borderColor: '#FF6600' }} />
          <div className="absolute inset-3 rounded-full border-2" style={{ borderColor: '#FFC713' }} />
          <div className="absolute inset-6 rounded-full bg-white flex items-center justify-center shadow-lg">
            <Compass className="w-8 h-8 animate-spin" style={{ color: '#FF6600', animationDuration: '2s' }} />
          </div>
        </div>
        <p className="text-sm font-medium font-body animate-pulse" style={{ color: '#FF6600' }}>Loading map...</p>
      </div>
    </div>
  ),
})

// Category mapping for filters - UPDATED
const CATEGORY_MAP: Record<string, string[]> = {
  eat: ['food', 'bars'], // Eat now includes restaurants + bars
  stay: ['accommodation', 'hotels'],
  visit: ['landmarks', 'museums', 'nature'],
}

// Calculate walking time
const calculateWalkTime = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return Math.round(R * c * 5)
}

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map')
  const [searchQuery, setSearchQuery] = useState('')
  const [saved, setSaved] = useState<Set<string>>(new Set())
  
  // One-click filter states
  const [hotelsOn, setHotelsOn] = useState(false)
  const [eatOn, setEatOn] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsRes, categoriesRes] = await Promise.all([
          fetch('/api/locations'),
          fetch('/api/categories'),
        ])
        setLocations(await locationsRes.json())
        setCategories(await categoriesRes.json())
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filter locations - UPDATED LOGIC
  const filteredLocations = useMemo(() => {
    let result = locations
    
    // Apply one-click filters
    if (hotelsOn) {
      result = result.filter(loc => 
        loc.category?.slug?.includes('accommodation') || 
        loc.category?.slug?.includes('hotels')
      )
    } else if (eatOn) {
      result = result.filter(loc => 
        loc.category?.slug?.includes('food') || 
        loc.category?.slug?.includes('bars')
      )
    } else if (activeCategory) {
      // Only apply category filter if one-click filters are off
      const targetSlugs = CATEGORY_MAP[activeCategory] || [activeCategory]
      result = result.filter(loc => 
        targetSlugs.some(slug => loc.category?.slug?.includes(slug))
      )
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(loc => 
        loc.name.toLowerCase().includes(query) ||
        loc.shortDesc?.toLowerCase().includes(query)
      )
    }
    
    return result
  }, [locations, activeCategory, searchQuery, hotelsOn, eatOn])

  // Get category slugs for map
  const categorySlugs = useMemo(() => {
    if (hotelsOn) return ['accommodation', 'hotels']
    if (eatOn) return ['food', 'bars']
    if (!activeCategory) return []
    return CATEGORY_MAP[activeCategory] || [activeCategory]
  }, [activeCategory, hotelsOn, eatOn])

  // Featured and regular locations
  const featuredLocations = filteredLocations.filter(loc => loc.featured)
  const regularLocations = filteredLocations.filter(loc => !loc.featured)

  // Toggle saved
  const toggleSaved = (id: string) => {
    const newSaved = new Set(saved)
    if (newSaved.has(id)) {
      newSaved.delete(id)
    } else {
      newSaved.add(id)
    }
    setSaved(newSaved)
  }

  // Handle one-click filter toggles
  const toggleHotels = () => {
    setHotelsOn(!hotelsOn)
    setEatOn(false)
    setActiveCategory(null)
  }

  const toggleEat = () => {
    setEatOn(!eatOn)
    setHotelsOn(false)
    setActiveCategory(null)
  }

  const clearAllFilters = () => {
    setHotelsOn(false)
    setEatOn(false)
    setActiveCategory(null)
    setSearchQuery('')
  }

  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col" style={{ background: '#FFD99C' }}>
      {/* Top Navigation Bar */}
      <div className="shrink-0">
        {/* Main Nav */}
        <div className="bg-white shadow-lg border-b-4" style={{ borderColor: '#FF6600' }}>
          <div className="flex items-center justify-between px-4 py-3">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-20 h-10 relative">
                <Image src="/logo.png" alt="Belgrade" fill className="object-contain" priority />
              </div>
            </div>

            {/* Desktop Category Buttons - UPDATED */}
            <div className="hidden md:flex items-center gap-2">
              {/* Eat ON/OFF - One-click filter for restaurants + bars */}
              <button
                onClick={toggleEat}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold font-body transition-all"
                style={{ 
                  background: eatOn ? '#10B981' : '#FFF8DC',
                  color: eatOn ? '#FFFFFF' : '#424143',
                  border: `2px solid ${eatOn ? '#10B981' : '#FFC713'}`
                }}
              >
                {eatOn ? (
                  <img src="/icons/fine-dining.webp" alt="Eat" className="w-5 h-5" />
                ) : (
                  <Utensils className="w-4 h-4" />
                )}
                <span>Eat {eatOn ? 'ON' : 'OFF'}</span>
              </button>

              {/* Hotels ON/OFF - One-click filter */}
              <button
                onClick={toggleHotels}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold font-body transition-all"
                style={{ 
                  background: hotelsOn ? '#0EA5E9' : '#FFF8DC',
                  color: hotelsOn ? '#FFFFFF' : '#424143',
                  border: `2px solid ${hotelsOn ? '#0EA5E9' : '#FFC713'}`
                }}
              >
                <Bed className="w-4 h-4" />
                <span>Hotels {hotelsOn ? 'ON' : 'OFF'}</span>
              </button>

              {/* Visit - Regular category filter */}
              <button
                onClick={() => {
                  setActiveCategory(activeCategory === 'visit' ? null : 'visit')
                  setHotelsOn(false)
                  setEatOn(false)
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold font-body transition-all"
                style={{ 
                  background: activeCategory === 'visit' ? '#10B981' : '#FFF8DC',
                  color: activeCategory === 'visit' ? '#FFFFFF' : '#424143',
                  border: `2px solid ${activeCategory === 'visit' ? '#10B981' : '#FFC713'}`
                }}
              >
                <Landmark className="w-4 h-4" />
                <span>Visit</span>
              </button>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === 'map' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                  }`}
                >
                  🗺️ Map
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === 'grid' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                  }`}
                >
                  📱 Grid
                </button>
              </div>

              <button
                className="px-4 py-2 rounded-xl font-semibold text-white text-sm hidden sm:block"
                style={{ background: '#FF6600' }}
              >
                Plan Trip
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Category Scroll - UPDATED */}
        <div className="md:hidden bg-white border-b-2 px-2 py-2 flex gap-2 overflow-x-auto" style={{ borderColor: '#FFC713' }}>
          {/* Eat ON/OFF */}
          <button
            onClick={toggleEat}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold font-body transition-all"
            style={{ 
              background: eatOn ? '#10B981' : '#FFF8DC',
              color: eatOn ? '#FFFFFF' : '#424143',
              border: `2px solid ${eatOn ? '#10B981' : '#FFC713'}`
            }}
          >
            {eatOn ? (
              <img src="/icons/fine-dining.webp" alt="Eat" className="w-4 h-4" />
            ) : (
              <Utensils className="w-3.5 h-3.5" />
            )}
            <span>Eat {eatOn ? 'ON' : ''}</span>
          </button>

          {/* Hotels ON/OFF */}
          <button
            onClick={toggleHotels}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold font-body transition-all"
            style={{ 
              background: hotelsOn ? '#0EA5E9' : '#FFF8DC',
              color: hotelsOn ? '#FFFFFF' : '#424143',
              border: `2px solid ${hotelsOn ? '#0EA5E9' : '#FFC713'}`
            }}
          >
            <Bed className="w-3.5 h-3.5" />
            <span>Hotels {hotelsOn ? 'ON' : ''}</span>
          </button>

          {/* Visit */}
          <button
            onClick={() => {
              setActiveCategory(activeCategory === 'visit' ? null : 'visit')
              setHotelsOn(false)
              setEatOn(false)
            }}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold font-body transition-all"
            style={{ 
              background: activeCategory === 'visit' ? '#10B981' : '#FFF8DC',
              color: activeCategory === 'visit' ? '#FFFFFF' : '#424143',
              border: `2px solid ${activeCategory === 'visit' ? '#10B981' : '#FFC713'}`
            }}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Visit</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-[320px] shrink-0 border-r-4 shadow-xl bg-white" style={{ borderColor: '#FF6600' }}>
          <div className="h-full flex flex-col">
            {/* Search */}
            <div className="p-4 border-b-2" style={{ borderColor: '#FFC713' }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#26B9EC' }} />
                <Input
                  type="text"
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-9 border-2 rounded-xl font-body"
                  style={{ background: '#FFF8DC', borderColor: '#FFC713', color: '#424143' }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4" style={{ color: '#FF6600' }} />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs font-medium font-body" style={{ color: '#666' }}>
                  <span className="font-bold" style={{ color: '#FF6600' }}>{filteredLocations.length}</span> locations found
                </p>
                {(hotelsOn || eatOn || activeCategory) && (
                  <button 
                    onClick={clearAllFilters}
                    className="text-xs font-semibold px-2 py-1 rounded-lg"
                    style={{ color: '#FF6600', background: '#FFF8DC' }}
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Locations List */}
            <ScrollArea className="flex-1 p-4">
              {/* Featured */}
              {featuredLocations.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#FFC713' }}>
                      <Star className="w-3 h-3 text-white fill-white" />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-wider font-body" style={{ color: '#FF6600' }}>Top Picks</h3>
                  </div>
                  <div className="space-y-3">
                    {featuredLocations.map((location) => (
                      <LocationCard 
                        key={location.id} 
                        location={location} 
                        isSelected={selectedLocation?.id === location.id}
                        isSaved={saved.has(location.id)}
                        onToggleSaved={() => toggleSaved(location.id)}
                        onClick={() => setSelectedLocation(location)} 
                        showPrice={hotelsOn}
                        isEatOn={eatOn}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular */}
              {regularLocations.length > 0 && (
                <div>
                  {featuredLocations.length > 0 && (
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-3 font-body" style={{ color: '#26B9EC' }}>All Locations</h3>
                  )}
                  <div className="space-y-3">
                    {regularLocations.map((location) => (
                      <LocationCard 
                        key={location.id} 
                        location={location} 
                        isSelected={selectedLocation?.id === location.id}
                        isSaved={saved.has(location.id)}
                        onToggleSaved={() => toggleSaved(location.id)}
                        onClick={() => setSelectedLocation(location)} 
                        showPrice={hotelsOn}
                        isEatOn={eatOn}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty */}
              {filteredLocations.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#FFF8DC' }}>
                    <Search className="w-8 h-8" style={{ color: '#FFC713' }} />
                  </div>
                  <h3 className="font-bold text-lg mb-1 font-body" style={{ color: '#424143' }}>No Results</h3>
                  <p className="text-sm font-body" style={{ color: '#666' }}>Try different search criteria</p>
                  <Button size="sm" className="mt-4 font-semibold text-white font-body" style={{ background: '#FF6600' }} onClick={clearAllFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        {/* Map or Grid */}
        <div className="flex-1 relative overflow-hidden">
          {viewMode === 'map' ? (
            isLoading ? (
              <div className="w-full h-full flex items-center justify-center" style={{ background: '#FFD99C' }}>
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-4 animate-pulse" style={{ borderColor: '#FF6600' }} />
                    <div className="absolute inset-3 rounded-full border-2" style={{ borderColor: '#FFC713' }} />
                    <div className="absolute inset-6 rounded-full bg-white flex items-center justify-center shadow-lg">
                      <Compass className="w-8 h-8 animate-spin" style={{ color: '#FF6600', animationDuration: '2s' }} />
                    </div>
                  </div>
                  <p className="text-sm font-medium font-body animate-pulse" style={{ color: '#FF6600' }}>Loading map...</p>
                </div>
              </div>
            ) : (
              <VintageMap
                locations={locations}
                selectedLocation={selectedLocation}
                onLocationSelect={setSelectedLocation}
                selectedCategories={categorySlugs}
                hotelsOn={hotelsOn}
                eatOn={eatOn}
              />
            )
          ) : (
            /* Grid View */
            <div className="w-full h-full overflow-y-auto p-4" style={{ background: '#FFD99C' }}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {filteredLocations.map((location, i) => (
                  <motion.div
                    key={location.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-xl border-2 p-4 shadow-lg cursor-pointer hover:shadow-xl transition-all"
                    style={{ borderColor: selectedLocation?.id === location.id ? '#FF6600' : '#FFC713' }}
                    onClick={() => setSelectedLocation(location)}
                  >
                    <div className="flex gap-3">
                      <div 
                        className="w-4 h-16 rounded-full shrink-0 ring-2 ring-white shadow-md"
                        style={{ backgroundColor: location.category?.color || '#FF6600' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold font-display text-sm" style={{ color: '#424143' }}>{location.name}</h3>
                          {location.featured && (
                            <span className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#FFC713', color: '#424143' }}>★ TOP</span>
                          )}
                        </div>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: location.category?.color || '#26B9EC' }}>{location.category?.name}</p>
                        {location.shortDesc && (
                          <p className="text-xs mt-2 line-clamp-2 font-body" style={{ color: '#666' }}>{location.shortDesc}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          {location.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-500" style={{ color: '#FFC713' }} />
                              <span className="text-xs font-bold" style={{ color: '#FF6600' }}>{location.rating}</span>
                            </div>
                          )}
                          {location.priceLevel !== null && location.priceLevel !== undefined && (
                            <span className="text-xs font-bold" style={{ color: '#424143' }}>
                              {['Free', '€', '€€', '€€€', '€€€€'][location.priceLevel]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Location Card */}
          <AnimatePresence>
            {selectedLocation && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute bottom-20 left-4 right-4 z-[1000] max-w-md mx-auto lg:mx-0 lg:left-auto lg:right-6 lg:bottom-6"
              >
                <div 
                  className="rounded-xl shadow-2xl overflow-hidden bg-white"
                  style={{ border: '3px solid #FF6600' }}
                >
                  <div className="flex gap-3 p-4">
                    <div 
                      className="w-3 h-20 rounded-full shrink-0 shadow-md"
                      style={{ backgroundColor: selectedLocation.category?.color || '#FF6600' }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-lg font-display" style={{ color: '#424143' }}>{selectedLocation.name}</h3>
                          <p className="text-xs font-semibold font-body" style={{ color: selectedLocation.category?.color || '#26B9EC' }}>{selectedLocation.category?.name}</p>
                        </div>
                        <button onClick={() => setSelectedLocation(null)} className="p-1 rounded-lg hover:bg-gray-100">
                          <X className="w-4 h-4" style={{ color: '#666' }} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-3">
                        {selectedLocation.rating && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: '#FFF8DC' }}>
                            <Star className="w-4 h-4 fill-yellow-500" style={{ color: '#FFC713' }} />
                            <span className="font-bold text-sm font-body" style={{ color: '#FF6600' }}>{selectedLocation.rating}</span>
                          </div>
                        )}
                        {selectedLocation.priceLevel !== null && selectedLocation.priceLevel !== undefined && (
                          <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: '#FFF8DC', color: '#424143' }}>
                            {['Free', '€', '€€', '€€€', '€€€€'][selectedLocation.priceLevel]}
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-xs" style={{ color: '#10B981' }}>
                          <Clock className="w-3 h-3" />
                          <span className="font-medium">Open now</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-3">
                        <button 
                          onClick={() => toggleSaved(selectedLocation.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                          style={{ 
                            background: saved.has(selectedLocation.id) ? '#FFE4E6' : '#F3F4F6',
                            color: saved.has(selectedLocation.id) ? '#E11D48' : '#424143',
                          }}
                        >
                          <Heart className={`w-3 h-3 ${saved.has(selectedLocation.id) ? 'fill-current' : ''}`} />
                          {saved.has(selectedLocation.id) ? 'Saved' : 'Save'}
                        </button>
                        {selectedLocation.website && (
                          <a 
                            href={selectedLocation.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                            style={{ background: '#FF6600' }}
                          >
                            <ExternalLink className="w-3 h-3" />
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-10 shrink-0 flex items-center justify-center border-t-3" style={{ background: 'linear-gradient(to right, #FF6600, #FFC713, #FF6600)', borderColor: '#424143' }}>
        <p className="text-sm font-semibold text-white font-body">
          © 2026 Belgrade Interactive Tourist Map •{' '}
          <a href="https://allinclusive.llc" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">
            Allinclusive.llc
          </a>
        </p>
      </footer>
    </main>
  )
}

// Location Card Component
function LocationCard({ 
  location, 
  isSelected, 
  isSaved,
  onToggleSaved,
  onClick,
  showPrice,
  isEatOn
}: { 
  location: Location
  isSelected: boolean
  isSaved: boolean
  onToggleSaved: () => void
  onClick: () => void
  showPrice?: boolean
  isEatOn?: boolean
}) {
  return (
    <div
      className="group cursor-pointer rounded-xl border-2 p-3 transition-all duration-200 hover:shadow-lg"
      style={{ 
        background: isSelected ? '#FFF8DC' : '#FFFFFF',
        borderColor: isSelected ? '#FF6600' : '#FFC713',
        boxShadow: isSelected ? '0 4px 16px rgba(255, 102, 0, 0.25)' : undefined
      }}
      onClick={onClick}
    >
      <div className="flex gap-2">
        {/* Show fine dining icon for Eat ON */}
        {isEatOn && location.category?.slug?.includes('food') ? (
          <img 
            src="/icons/fine-dining.webp" 
            alt="Fine Dining" 
            className="w-8 h-8 rounded-full shrink-0 ring-2 ring-white shadow-md"
          />
        ) : (
          <div 
            className="w-3 h-14 rounded-full shrink-0 ring-2 ring-white shadow-md"
            style={{ backgroundColor: location.category?.color || '#FF6600' }}
          />
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-bold text-sm font-display group-hover:opacity-80 transition-opacity" style={{ color: '#424143' }}>
              {location.name}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              {location.featured && (
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#FFC713', color: '#424143' }}>★</span>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleSaved() }}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Heart className={`w-3 h-3 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} />
              </button>
            </div>
          </div>
          
          <p className="text-xs font-semibold font-body mt-0.5" style={{ color: location.category?.color || '#26B9EC' }}>
            {location.category?.name}
          </p>
          
          <div className="flex items-center gap-2 mt-2">
            {location.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-500" style={{ color: '#FFC713' }} />
                <span className="text-xs font-bold font-body" style={{ color: '#FF6600' }}>{location.rating}</span>
              </div>
            )}
            {/* Show prices for hotels */}
            {(showPrice || location.category?.slug?.includes('accommodation') || location.category?.slug?.includes('hotels')) && 
             location.priceLevel !== null && location.priceLevel !== undefined && (
              <span className="text-xs font-bold font-body" style={{ color: '#10B981' }}>
                {['Free', '€', '€€', '€€€', '€€€€'][location.priceLevel]}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
