'use client'

import { Search, MapPin, X, Star } from 'lucide-react'
import { useState, useMemo } from 'react'
import LocationCard from './location-card'
import CategoryFilter from './category-filter'
import { Location, Category } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import Image from 'next/image'

interface LocationSidebarProps {
  locations: Location[]
  categories: Category[]
  selectedLocation: Location | null
  onLocationSelect: (location: Location | null) => void
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
}

export default function LocationSidebar({
  locations,
  categories,
  selectedLocation,
  onLocationSelect,
  selectedCategories,
  onCategoryChange,
}: LocationSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLocations = useMemo(() => {
    let result = locations
    if (selectedCategories.length > 0) {
      result = result.filter(loc => selectedCategories.includes(loc.category.slug))
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(loc => 
        loc.name.toLowerCase().includes(query) ||
        loc.shortDesc?.toLowerCase().includes(query) ||
        loc.address?.toLowerCase().includes(query)
      )
    }
    return result
  }, [locations, selectedCategories, searchQuery])

  const featuredLocations = filteredLocations.filter(loc => loc.featured)
  const regularLocations = filteredLocations.filter(loc => !loc.featured)

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with Logo */}
      <div className="p-5 border-b-4" style={{ borderColor: '#FF6600' }}>
        <div className="flex items-center gap-4 mb-5">
          {/* Logo replacing text */}
          <div className="w-24 h-14 relative shrink-0">
            <Image 
              src="/logo.png" 
              alt="Belgrade Tourist Map" 
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Search */}
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
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70" style={{ color: '#FF6600' }}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="mt-4">
          <CategoryFilter categories={categories} selectedCategories={selectedCategories} onCategoryChange={onCategoryChange} />
        </div>
      </div>

      {/* Locations list */}
      <ScrollArea className="flex-1 p-4 vivid-scroll">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold font-body" style={{ color: '#424143' }}>
            <span className="text-base font-bold" style={{ color: '#FF6600' }}>{filteredLocations.length}</span> locations
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Featured locations */}
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
                <LocationCard key={location.id} location={location} isSelected={selectedLocation?.id === location.id} onClick={() => onLocationSelect(location)} />
              ))}
            </div>
          </div>
        )}

        {/* Regular locations */}
        {regularLocations.length > 0 && (
          <div>
            {featuredLocations.length > 0 && (
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3 font-body" style={{ color: '#26B9EC' }}>All Locations</h3>
            )}
            <div className="space-y-3">
              {regularLocations.map((location) => (
                <LocationCard key={location.id} location={location} isSelected={selectedLocation?.id === location.id} onClick={() => onLocationSelect(location)} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#FFF8DC' }}>
              <Search className="w-8 h-8" style={{ color: '#FFC713' }} />
            </div>
            <h3 className="font-bold text-lg mb-1 font-body" style={{ color: '#424143' }}>No Results</h3>
            <p className="text-sm font-body" style={{ color: '#666' }}>Try different search criteria</p>
            <Button size="sm" className="mt-4 font-semibold text-white font-body" style={{ background: '#FF6600' }} onClick={() => { setSearchQuery(''); onCategoryChange([]) }}>
              Clear Filters
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
