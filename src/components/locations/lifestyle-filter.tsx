'use client'

import { useState } from 'react'
import { Utensils, Wine, Moon, Bed, Landmark, Sparkles, Users, Music, X } from 'lucide-react'

interface LifestyleFilterProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  onClose?: () => void
  isMobile?: boolean
}

// Lifestyle categories with icons and colors
const LIFESTYLE_FILTERS = [
  { id: 'all', label: 'All', icon: null, color: '#424143', description: 'Show everything' },
  { id: 'food', label: 'Top Eats', icon: <Utensils className="w-4 h-4" />, color: '#FF6600', description: 'Restaurants & Cafes' },
  { id: 'bars', label: 'Bars', icon: <Wine className="w-4 h-4" />, color: '#8B5CF6', description: 'Cocktail & Wine bars' },
  { id: 'nightlife', label: 'Nightlife', icon: <Moon className="w-4 h-4" />, color: '#7C3AED', description: 'Clubs & Late night' },
  { id: 'hotels', label: 'Stay', icon: <Bed className="w-4 h-4" />, color: '#0EA5E9', description: 'Hotels & Apartments' },
  { id: 'landmarks', label: 'See & Do', icon: <Landmark className="w-4 h-4" />, color: '#10B981', description: 'Attractions & Museums' },
]

// Smart groupings
const SMART_FILTERS = [
  { id: 'weekend', label: 'Weekend', icon: <Sparkles className="w-3.5 h-3.5" />, color: '#F59E0B', categories: ['bars', 'nightlife'] },
  { id: 'family', label: 'Family', icon: <Users className="w-3.5 h-3.5" />, color: '#06B6D4', categories: ['food', 'landmarks', 'hotels'] },
  { id: 'music', label: 'Live Music', icon: <Music className="w-3.5 h-3.5" />, color: '#EC4899', categories: ['bars', 'nightlife'] },
]

export default function LifestyleFilter({ activeFilter, onFilterChange, onClose, isMobile }: LifestyleFilterProps) {
  const [showSmart, setShowSmart] = useState(false)

  return (
    <div className={`${isMobile ? 'p-4' : ''}`}>
      {/* Mobile close button */}
      {isMobile && onClose && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#FF6600' }}>
            Filter by Category
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" style={{ color: '#424143' }} />
          </button>
        </div>
      )}

      {/* Main filters */}
      <div className={`${isMobile ? 'flex-wrap gap-2' : 'flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide'}`}>
        {LIFESTYLE_FILTERS.map((filter) => {
          const isActive = activeFilter === filter.id
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                isMobile ? 'flex-1 justify-center min-w-[calc(50%-4px)]' : ''
              }`}
              style={{
                background: isActive ? filter.color : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#424143',
                border: `2px solid ${isActive ? filter.color : '#E5E7EB'}`,
                boxShadow: isActive ? `0 2px 8px ${filter.color}40` : '0 1px 3px rgba(0,0,0,0.1)',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {filter.icon}
              <span>{filter.label}</span>
            </button>
          )
        })}
      </div>

      {/* Smart filters toggle */}
      <div className="mt-3">
        <button
          onClick={() => setShowSmart(!showSmart)}
          className="text-xs font-semibold flex items-center gap-1"
          style={{ color: '#FF6600' }}
        >
          <Sparkles className="w-3 h-3" />
          {showSmart ? 'Hide Smart Filters' : 'Smart Filters'}
        </button>

        {showSmart && (
          <div className={`mt-2 flex ${isMobile ? 'flex-wrap gap-2' : 'gap-2'}`}>
            {SMART_FILTERS.map((filter) => {
              const isActive = activeFilter === filter.id
              return (
                <button
                  key={filter.id}
                  onClick={() => onFilterChange(filter.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isMobile ? 'flex-1 justify-center' : ''
                  }`}
                  style={{
                    background: isActive ? filter.color : `${filter.color}15`,
                    color: isActive ? '#FFFFFF' : filter.color,
                    border: `1.5px solid ${filter.color}`,
                  }}
                >
                  {filter.icon}
                  <span>{filter.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Active filter description */}
      {activeFilter !== 'all' && (
        <div className="mt-3 px-3 py-2 rounded-lg text-xs" style={{ background: '#FFF8DC', color: '#666' }}>
          {LIFESTYLE_FILTERS.find(f => f.id === activeFilter)?.description || 
           SMART_FILTERS.find(f => f.id === activeFilter)?.categories.join(' + ') + ' combined'}
        </div>
      )}
    </div>
  )
}

export { LIFESTYLE_FILTERS, SMART_FILTERS }
