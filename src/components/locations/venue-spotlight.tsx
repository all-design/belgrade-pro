'use client'

import { useState, useEffect } from 'react'
import { MapPin, Star, X, Clock, Users, ExternalLink, Navigation, Heart, Bookmark } from 'lucide-react'
import { Location } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

interface VenueSpotlightProps {
  location: Location | null
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
  userLocation?: { lat: number; lng: number } | null
}

// Calculate walking time (approx 5 min per km)
const calculateWalkTime = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 6371 // km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c
  return Math.round(distance * 5) // 5 min per km
}

// Check if venue is open
const isOpenNow = (openingHours?: string | null): { isOpen: boolean; until?: string } => {
  if (!openingHours) return { isOpen: false }
  
  // Simple parsing - in production would be more robust
  const now = new Date()
  const hour = now.getHours()
  
  // Most places in Belgrade: 8-23 or 10-24
  if (hour >= 8 && hour < 23) return { isOpen: true, until: '23:00' }
  if (hour >= 23 || hour < 2) return { isOpen: true, until: '02:00' }
  
  return { isOpen: false }
}

export default function VenueSpotlight({ 
  location, 
  onClose, 
  onNext, 
  onPrevious,
  userLocation 
}: VenueSpotlightProps) {
  const [saved, setSaved] = useState(false)
  const [compared, setCompared] = useState(false)

  useEffect(() => {
    // Reset states when location changes
    setSaved(false)
    setCompared(false)
  }, [location?.id])

  if (!location) return null

  const walkTime = userLocation 
    ? calculateWalkTime(userLocation.lat, userLocation.lng, location.latitude, location.longitude)
    : null

  const { isOpen, until } = isOpenNow(location.openingHours)
  
  // Generate mock review count
  const reviewCount = Math.floor(Math.random() * 300) + 50

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="absolute bottom-20 left-4 right-4 z-[1000] max-w-md mx-auto lg:mx-0 lg:left-auto lg:right-6 lg:bottom-6"
      >
        <div 
          className="rounded-xl shadow-2xl overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF8F0 100%)',
            border: '3px solid #FF6600',
          }}
        >
          {/* Header row */}
          <div className="flex items-start gap-3 p-3 pb-2">
            {/* Color indicator */}
            <div 
              className="w-3 h-16 rounded-full shrink-0 shadow-md"
              style={{ backgroundColor: location.category?.color || '#FF6600' }}
            />
            
            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base font-display truncate" style={{ color: '#424143' }}>
                    {location.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-semibold" style={{ color: location.category?.color || '#26B9EC' }}>
                      {location.category?.name}
                    </span>
                    {location.featured && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: '#FFC713', color: '#424143' }}>
                        ★ TOP
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Close button */}
                <button 
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" style={{ color: '#666' }} />
                </button>
              </div>
              
              {/* Rating row */}
              <div className="flex items-center gap-3 mt-2">
                {location.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500" style={{ color: '#FFC713' }} />
                    <span className="text-sm font-bold" style={{ color: '#FF6600' }}>{location.rating}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs" style={{ color: '#666' }}>
                  <Users className="w-3 h-3" />
                  <span>{reviewCount} reviews</span>
                </div>
                {isOpen && (
                  <div className="flex items-center gap-1 text-xs" style={{ color: '#10B981' }}>
                    <Clock className="w-3 h-3" />
                    <span>Open till {until}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Walk time */}
          {walkTime !== null && (
            <div className="px-3 pb-2">
              <div className="flex items-center gap-2 text-xs px-2 py-1 rounded-md" style={{ background: '#FFF8DC', color: '#424143' }}>
                <Navigation className="w-3 h-3" style={{ color: '#FF6600' }} />
                <span className="font-semibold">{walkTime} min walk from you</span>
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex items-center gap-1 px-3 pb-3">
            <button 
              onClick={() => setSaved(!saved)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ 
                background: saved ? '#FFE4E6' : '#F3F4F6',
                color: saved ? '#E11D48' : '#424143',
              }}
            >
              <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>
            
            <button 
              onClick={() => setCompared(!compared)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ 
                background: compared ? '#DBEAFE' : '#F3F4F6',
                color: compared ? '#2563EB' : '#424143',
              }}
            >
              <Bookmark className={`w-3.5 h-3.5 ${compared ? 'fill-current' : ''}`} />
              <span>{compared ? 'Added' : 'Compare'}</span>
            </button>
            
            <div className="flex-1" />
            
            {location.website && (
              <a 
                href={location.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{ background: '#FF6600', color: '#FFFFFF' }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Website</span>
              </a>
            )}
          </div>
        </div>
        
        {/* Swipe indicators (mobile) */}
        <div className="hidden sm:flex justify-center gap-2 mt-2">
          {onPrevious && (
            <button 
              onClick={onPrevious}
              className="p-2 rounded-full bg-white/80 shadow-md hover:bg-white transition-colors"
            >
              <span className="text-xs font-bold" style={{ color: '#FF6600' }}>← Prev</span>
            </button>
          )}
          {onNext && (
            <button 
              onClick={onNext}
              className="p-2 rounded-full bg-white/80 shadow-md hover:bg-white transition-colors"
            >
              <span className="text-xs font-bold" style={{ color: '#FF6600' }}>Next →</span>
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
