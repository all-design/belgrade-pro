'use client'

import { MapPin, Utensils, Wine, Moon, Bed, Landmark, Users, Calendar, Music } from 'lucide-react'
import { Category } from '@/lib/types'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
}

// Lifestyle-focused icons
const iconMap: Record<string, React.ReactNode> = {
  landmark: <Landmark className="w-4 h-4" />,
  food: <Utensils className="w-4 h-4" />,
  accommodation: <Bed className="w-4 h-4" />,
  nightlife: <Moon className="w-4 h-4" />,
  nature: <MapPin className="w-4 h-4" />,
  museums: <Landmark className="w-4 h-4" />,
  bars: <Wine className="w-4 h-4" />,
}

// Smart filter groups
const SMART_FILTERS = [
  { id: 'weekend', label: 'Weekend', icon: <Calendar className="w-4 h-4" />, categories: ['nightlife', 'food'] },
  { id: 'family', label: 'Family', icon: <Users className="w-4 h-4" />, categories: ['landmark', 'nature', 'museums'] },
  { id: 'livemusic', label: 'Live Music', icon: <Music className="w-4 h-4" />, categories: ['nightlife'] },
]

export default function CategoryFilter({ categories, selectedCategories, onCategoryChange }: CategoryFilterProps) {
  const toggleCategory = (slug: string) => {
    if (selectedCategories.includes(slug)) {
      onCategoryChange(selectedCategories.filter(c => c !== slug))
    } else {
      onCategoryChange([...selectedCategories, slug])
    }
  }

  const selectAll = () => onCategoryChange([])
  const allSelected = selectedCategories.length === 0

  // Order categories for lifestyle guide: Food, Bars, Nightlife, Hotels, Attractions
  const orderedCategories = [...categories].sort((a, b) => {
    const order = ['food', 'nightlife', 'accommodation', 'landmark', 'museums', 'nature']
    return order.indexOf(a.slug) - order.indexOf(b.slug)
  })

  return (
    <div className="space-y-3">
      {/* One-Click Lifestyle Filters - Desktop */}
      <div className="hidden md:flex items-center gap-2 flex-wrap">
        <button
          onClick={selectAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-body transition-all"
          style={{ 
            background: allSelected ? '#424143' : '#FFF8DC',
            color: allSelected ? '#FFFFFF' : '#424143',
            border: `2px solid ${allSelected ? '#424143' : '#FFC713'}`,
          }}
        >
          All
        </button>

        {orderedCategories.map((category) => {
          const isSelected = selectedCategories.includes(category.slug)
          const count = category._count?.locations || 0
          
          // Lifestyle label mapping
          const labels: Record<string, string> = {
            food: 'Eats',
            nightlife: 'Night',
            accommodation: 'Stay',
            landmark: 'See',
            museums: 'Museums',
            nature: 'Nature'
          }
          
          return (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.slug)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-body transition-all hover:scale-105"
              style={{ 
                background: isSelected ? category.color : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#424143',
                border: `2px solid ${isSelected ? category.color : '#E5E5E5'}`,
                boxShadow: isSelected ? `0 2px 8px ${category.color}40` : undefined
              }}
            >
              {iconMap[category.icon] || <MapPin className="w-4 h-4" />}
              <span>{labels[category.slug] || category.name}</span>
              <span className="text-[10px] px-1 py-0.5 rounded-full" style={{ background: isSelected ? 'rgba(255,255,255,0.3)' : '#F5F5F5' }}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Mobile: Compact icon-only filters */}
      <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          onClick={selectAll}
          className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold transition-all"
          style={{ 
            background: allSelected ? '#424143' : '#FFF8DC',
            color: allSelected ? '#FFFFFF' : '#424143',
            border: `2px solid ${allSelected ? '#424143' : '#FFC713'}`,
          }}
        >
          All
        </button>

        {orderedCategories.map((category) => {
          const isSelected = selectedCategories.includes(category.slug)
          
          return (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.slug)}
              className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold transition-all"
              style={{ 
                background: isSelected ? category.color : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#424143',
                border: `2px solid ${isSelected ? category.color : '#E5E5E5'}`,
              }}
              title={category.name}
            >
              {iconMap[category.icon] || <MapPin className="w-4 h-4" />}
            </button>
          )
        })}
      </div>

      {/* Smart Filters Row */}
      <div className="flex items-center gap-2 flex-wrap">
        {SMART_FILTERS.map((filter) => {
          const isActive = filter.categories.every(c => selectedCategories.includes(c))
          
          return (
            <button
              key={filter.id}
              onClick={() => onCategoryChange(isActive ? [] : filter.categories)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all"
              style={{ 
                background: isActive ? '#FF6600' : '#FFF8DC',
                color: isActive ? '#FFFFFF' : '#666',
                border: `1.5px solid ${isActive ? '#FF6600' : '#FFC713'}`,
              }}
            >
              {filter.icon}
              <span>{filter.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
