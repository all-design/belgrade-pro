'use client'

import { MapPin, Star } from 'lucide-react'
import { Location } from '@/lib/types'

interface LocationCardProps {
  location: Location
  isSelected: boolean
  onClick: () => void
}

export default function LocationCard({ location, isSelected, onClick }: LocationCardProps) {
  const priceLevelDisplay = location.priceLevel ? '€'.repeat(location.priceLevel) : 'Free'

  return (
    <div
      className="group cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-lg"
      style={{ 
        background: isSelected ? '#FFF8DC' : '#FFFFFF',
        borderColor: isSelected ? '#FF6600' : '#FFC713',
        boxShadow: isSelected ? '0 4px 16px rgba(255, 102, 0, 0.25)' : undefined
      }}
      onClick={onClick}
    >
      <div className="flex gap-3">
        <div className="w-4 h-full min-h-[60px] rounded-full shrink-0 ring-2 ring-white shadow-md" style={{ backgroundColor: location.category.color }} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold font-display group-hover:opacity-80 transition-opacity" style={{ color: '#424143' }}>
                {location.name}
              </h3>
              <p className="text-xs font-semibold font-body mt-0.5" style={{ color: '#26B9EC' }}>{location.category.name}</p>
            </div>
            
            {location.featured && (
              <span className="shrink-0 text-xs font-bold font-body px-2 py-1 rounded-full" style={{ background: '#FFC713', color: '#424143' }}>
                ★ TOP
              </span>
            )}
          </div>
          
          {location.shortDesc && (
            <p className="text-sm mt-2 line-clamp-2 font-body" style={{ color: '#666' }}>{location.shortDesc}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
            {location.rating && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: '#FFF8DC' }}>
                <Star className="w-3.5 h-3.5 fill-yellow-500" style={{ color: '#FFC713' }} />
                <span className="font-bold font-body" style={{ color: '#FF6600' }}>{location.rating}</span>
              </div>
            )}
            
            {location.priceLevel !== null && (
              <span className="font-bold font-body" style={{ color: location.priceLevel === 0 ? '#94AB3B' : '#424143' }}>
                {priceLevelDisplay}
              </span>
            )}
            
            {location.address && (
              <div className="flex items-center gap-1" style={{ color: '#666' }}>
                <MapPin className="w-3.5 h-3.5" style={{ color: '#26B9EC' }} />
                <span className="truncate max-w-[100px] font-body">{location.address.split(',')[0]}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
