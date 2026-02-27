'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Star, X, Heart, Search, Utensils, Moon, Bed, MapPin, Sparkles, Navigation, Clock, Plus, Minus, Share2, Download, Trash2, Send, Loader2, Wand2, Flame, Clock3, ChefHat, Map, Check, ExternalLink } from 'lucide-react'
import { Location, Category } from '@/lib/types'
import Image from 'next/image'
import { Input } from '@/components/ui/input'

// Dynamically import map
const VintageMap = dynamic(() => import('@/components/map/vintage-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-stone-100">
      <div className="animate-pulse text-amber-600 font-medium">Loading map...</div>
    </div>
  ),
})

// Toast notification type
interface Toast {
  id: string
  message: string
  type: 'success' | 'info' | 'error'
}

// Category mapping
const CATEGORY_MAP: Record<string, string[]> = {
  visit: ['landmarks', 'museums', 'nature'],
  eat: ['food', 'bars'],
  stay: ['accommodation', 'hotels'],
  nightlife: ['nightlife'],
}

// Cuisine types for badges - enhanced
const CUISINE_TYPES: Record<string, { icon: string; color: string; label: string }> = {
  serbian: { icon: '🇷🇸', color: 'bg-red-100 text-red-700 border-red-200', label: 'Serbian' },
  italian: { icon: '🇮🇹', color: 'bg-green-100 text-green-700 border-green-200', label: 'Italian' },
  asian: { icon: '🇨🇳', color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Asian' },
  mediterranean: { icon: '🫒', color: 'bg-teal-100 text-teal-700 border-teal-200', label: 'Mediterranean' },
  international: { icon: '🌍', color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'International' },
  seafood: { icon: '🐟', color: 'bg-cyan-100 text-cyan-700 border-cyan-200', label: 'Seafood' },
  grill: { icon: '🍖', color: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Grill' },
  vegetarian: { icon: '🌱', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Vegan' },
  fineDining: { icon: '⭐', color: 'bg-violet-100 text-violet-700 border-violet-200', label: 'Fine Dining' },
  craftBeer: { icon: '🍺', color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Craft Beer' },
}

// Price comparison mock data (would come from API in production)
const generatePriceComparison = (hotelName: string) => {
  const basePrice = 70 + Math.floor(Math.random() * 50)
  return [
    { source: 'Trivago', price: basePrice + Math.floor(Math.random() * 15), currency: '€' },
    { source: 'Agoda', price: basePrice - Math.floor(Math.random() * 10), currency: '€', best: true },
    { source: 'ZenHotels', price: basePrice + Math.floor(Math.random() * 10), currency: '€' },
    { source: 'TripAdvisor', price: basePrice + Math.floor(Math.random() * 8), currency: '€' },
  ]
}

// Distance calculation
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c * 1000
}

const formatDistance = (meters: number): string => {
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}

// Calculate Walk Score
const calculateWalkScore = (location: Location, allLocations: Location[]) => {
  const restaurants = allLocations.filter(l => 
    l.category?.slug?.includes('food') || l.category?.slug?.includes('bars')
  )
  const hotels = allLocations.filter(l => 
    l.category?.slug?.includes('accommodation') || l.category?.slug?.includes('hotels')
  )
  
  let nearestRestaurant = null
  let minRestaurantDist = Infinity
  for (const r of restaurants) {
    const dist = calculateDistance(location.latitude, location.longitude, r.latitude, r.longitude)
    if (dist < minRestaurantDist && dist > 10) {
      minRestaurantDist = dist
      nearestRestaurant = { name: r.name, distance: dist }
    }
  }
  
  let nearestHotel = null
  let minHotelDist = Infinity
  for (const h of hotels) {
    const dist = calculateDistance(location.latitude, location.longitude, h.latitude, h.longitude)
    if (dist < minHotelDist && dist > 10) {
      minHotelDist = dist
      nearestHotel = { name: h.name, distance: dist }
    }
  }
  
  const diningSpots = restaurants.filter(r => 
    calculateDistance(location.latitude, location.longitude, r.latitude, r.longitude) <= 1000
  ).length
  
  const hotelSpots = hotels.filter(h => 
    calculateDistance(location.latitude, location.longitude, h.latitude, h.longitude) <= 1000
  ).length
  
  return { nearestRestaurant, nearestHotel, diningSpots, hotelSpots }
}

// Calculate Lifestyle Score
const calculateLifestyleScore = (location: Location, allLocations: Location[]): {
  score: number
  diningScore: number
  hotelScore: number
  nightlifeScore: number
  priceScore: number
} => {
  const walkScore = calculateWalkScore(location, allLocations)
  const diningScore = Math.min(100, walkScore.diningSpots * 7 + (walkScore.nearestRestaurant ? Math.max(0, 30 - walkScore.nearestRestaurant.distance / 30) : 0))
  const hotelScore = Math.min(100, walkScore.hotelSpots * 10 + (walkScore.nearestHotel ? Math.max(0, 25 - walkScore.nearestHotel.distance / 40) : 0))
  const nightlife = allLocations.filter(l => l.category?.slug?.includes('nightlife'))
  const nearbyNightlife = nightlife.filter(n => 
    calculateDistance(location.latitude, location.longitude, n.latitude, n.longitude) <= 1000
  ).length
  const nightlifeScore = Math.min(100, nearbyNightlife * 12)
  const priceScore = location.priceLevel ? (5 - location.priceLevel) * 20 : 50
  const score = Math.round(diningScore * 0.35 + hotelScore * 0.25 + nightlifeScore * 0.25 + priceScore * 0.15)
  
  return { score, diningScore: Math.round(diningScore), hotelScore: Math.round(hotelScore), nightlifeScore: Math.round(nightlifeScore), priceScore }
}

// Itinerary type
interface ItineraryItem {
  location: Location
  order: number
}

// Chat message type
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// Detect cuisine from location name/description
const detectCuisine = (location: Location): string | null => {
  const text = `${location.name} ${location.description || ''} ${location.shortDesc || ''}`.toLowerCase()
  
  if (text.includes('serbian') || text.includes('balkan') || text.includes('kafana') || text.includes('roštilj')) return 'serbian'
  if (text.includes('italian') || text.includes('pizza') || text.includes('pasta')) return 'italian'
  if (text.includes('asian') || text.includes('sushi') || text.includes('chinese') || text.includes('thai')) return 'asian'
  if (text.includes('mediterranean') || text.includes('greek')) return 'mediterranean'
  if (text.includes('seafood') || text.includes('fish')) return 'seafood'
  if (text.includes('grill') || text.includes('bbq')) return 'grill'
  if (text.includes('vegetarian') || text.includes('vegan')) return 'vegetarian'
  if (text.includes('fine dining') || text.includes('gourmet') || text.includes('michelin')) return 'fineDining'
  if (text.includes('craft beer') || text.includes('brewery') || text.includes('pub')) return 'craftBeer'
  
  return null
}

// Check if venue is open now
const isOpenNow = (location: Location): boolean => {
  if (!location.openingHours) return false
  
  const now = new Date()
  const currentHour = now.getHours()
  const currentDay = now.getDay()
  
  // Simple parsing - would need more robust parsing for real use
  const hours = location.openingHours.toLowerCase()
  
  // Check if closed
  if (hours.includes('closed')) return false
  
  // Basic time check (most places open 11-23)
  if (currentHour >= 11 && currentHour <= 23) return true
  if (hours.includes('24') || hours.includes('all day')) return true
  
  return false
}

// Weather Suggestion Component
function WeatherSuggestion({ savedCount, itineraryCount }: { savedCount: number; itineraryCount: number }) {
  const suggestion = useMemo(() => {
    const hour = new Date().getHours()
    
    if (hour >= 6 && hour < 12) {
      return { icon: '🌅', text: 'Morning coffee & brunch spots', filter: 'brunch' }
    } else if (hour >= 12 && hour < 17) {
      return { icon: '☀️', text: 'Sunny day? Try riverside spots!', filter: 'outdoor' }
    } else if (hour >= 17 && hour < 21) {
      return { icon: '🌆', text: 'Dinner time! Best restaurants nearby', filter: 'dinner' }
    } else {
      return { icon: '🌙', text: 'Nightlife mode: Bars & clubs', filter: 'nightlife' }
    }
  }, [])
  
  if (!suggestion) return null
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="hidden sm:block fixed top-32 right-6 z-[9998]"
    >
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl shadow-xl p-4 max-w-[220px]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{suggestion.icon}</span>
          <span className="text-xs font-medium opacity-80">Weather Sync</span>
        </div>
        <p className="text-sm font-medium">{suggestion.text}</p>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  
  // LocalStorage persisted state - initialize empty to avoid SSR hydration mismatch
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [isHydrated, setIsHydrated] = useState(false)
  
  // Itinerary Builder State - persisted
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([])
  const [showItinerary, setShowItinerary] = useState(false)
  const [showItineraryPath, setShowItineraryPath] = useState(true)
  
  // Cuisine filter
  const [cuisineFilter, setCuisineFilter] = useState<string | null>(null)
  
  // AI Planner State
  const [showAIPlanner, setShowAIPlanner] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isAILoading, setIsAILoading] = useState(false)
  const [aiPreferences, setAIPreferences] = useState({
    budget: 'moderate' as 'budget' | 'moderate' | 'luxury',
    pace: 'moderate' as 'relaxed' | 'moderate' | 'intense',
    startTime: '10:00',
    endTime: '22:00'
  })
  const chatContainerRef = useRef<HTMLDivElement>(null)
  
  // Time filters
  const [timeFilter, setTimeFilter] = useState<'all' | 'now' | 'happy-hour' | 'brunch' | 'dinner' | 'late-night'>('all')
  
  // One-click filters - Hotels ON by default
  const [eatOn, setEatOn] = useState(false)
  const [hotelsOn, setHotelsOn] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map')

  // Mobile Swipe Deck
  const [showSwipeDeck, setShowSwipeDeck] = useState(false)
  const [swipeIndex, setSwipeIndex] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [lastSwipedVenue, setLastSwipedVenue] = useState<{venue: Location, action: 'add' | 'skip'} | null>(null)

  // Heatmap
  const [showHeatmap, setShowHeatmap] = useState(false)
  
  // Haptic feedback helper
  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      const duration = type === 'light' ? 10 : type === 'medium' ? 25 : 50
      navigator.vibrate(duration)
    }
  }

  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([])

  // Venue Spotlight
  const [spotlightVenue, setSpotlightVenue] = useState<Location | null>(null)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-30, 30])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 0.5, 1, 0.5, 0])

  // Persist to LocalStorage
  // Hydration effect - load from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const savedStr = localStorage.getItem('belgrade-saved')
      const itStr = localStorage.getItem('belgrade-itinerary')
      
      if (savedStr) {
        const parsed = JSON.parse(savedStr)
        setSaved(new Set(parsed))
      }
      if (itStr) {
        setItinerary(JSON.parse(itStr))
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e)
    }
    setIsHydrated(true)
  }, [])
  
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('belgrade-saved', JSON.stringify([...saved]))
    }
  }, [saved, isHydrated])
  
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('belgrade-itinerary', JSON.stringify(itinerary))
    }
  }, [itinerary, isHydrated])

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

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  // AI-enhanced search with loading state
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setIsSearchLoading(true)
    
    // Simulate search loading for better UX
    setTimeout(() => {
      setIsSearchLoading(false)
    }, 300)
  }

  // Handle Enter in search to send to AI
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim().length > 3) {
      // Open AI planner with the query
      setShowAIPlanner(true)
      handleAIChat(searchQuery)
    }
  }

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  // Filter locations with time-based enhancement
  const filteredLocations = useMemo(() => {
    let result = locations
    
    // Category filters
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
      const targetSlugs = CATEGORY_MAP[activeCategory] || [activeCategory]
      result = result.filter(loc => 
        targetSlugs.some(slug => loc.category?.slug?.includes(slug))
      )
    }
    
    // Time-based filters
    if (timeFilter === 'now') {
      result = result.filter(loc => isOpenNow(loc))
    } else if (timeFilter === 'happy-hour') {
      // 17-20h venues
      result = result.filter(loc => {
        const slug = loc.category?.slug || ''
        return slug.includes('bars') || slug.includes('food')
      })
    } else if (timeFilter === 'brunch') {
      // 10-14h venues
      result = result.filter(loc => loc.category?.slug?.includes('food'))
    } else if (timeFilter === 'dinner') {
      // 18-22h venues
      result = result.filter(loc => {
        const slug = loc.category?.slug || ''
        return slug.includes('food') || slug.includes('bars')
      })
    } else if (timeFilter === 'late-night') {
      // After 23h venues
      result = result.filter(loc => loc.category?.slug?.includes('nightlife'))
    }
    
    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(loc => 
        loc.name.toLowerCase().includes(query) ||
        loc.shortDesc?.toLowerCase().includes(query) ||
        loc.category?.name?.toLowerCase().includes(query)
      )
    }
    
    return result
  }, [locations, activeCategory, searchQuery, hotelsOn, eatOn, timeFilter])

  // Top venues for spotlight
  const topVenues = useMemo(() => {
    return [...filteredLocations]
      .filter(loc => loc.rating && loc.rating >= 4.5)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10)
  }, [filteredLocations])

  // Category slugs for map
  const categorySlugs = useMemo(() => {
    if (hotelsOn) return ['accommodation', 'hotels']
    if (eatOn) return ['food', 'bars']
    if (!activeCategory) return []
    return CATEGORY_MAP[activeCategory] || [activeCategory]
  }, [activeCategory, hotelsOn, eatOn])

  // Itinerary functions
  const addToItinerary = (location: Location) => {
    if (!itinerary.find(item => item.location.id === location.id)) {
      setItinerary([...itinerary, { location, order: itinerary.length + 1 }])
      showToast(`♥️ ${location.name} added to plan`, 'success')
      hapticFeedback('medium')
    } else {
      showToast('Already in your plan', 'info')
      hapticFeedback('light')
    }
  }

  const removeFromItinerary = (locationId: string) => {
    const item = itinerary.find(i => i.location.id === locationId)
    setItinerary(itinerary.filter(item => item.location.id !== locationId))
    if (item) showToast(`Removed ${item.location.name}`, 'info')
    hapticFeedback('light')
  }

  const clearItinerary = () => {
    setItinerary([])
    showToast('Plan cleared', 'info')
    hapticFeedback('heavy')
  }

  // Calculate total walking distance for itinerary
  const itineraryDistance = useMemo(() => {
    if (itinerary.length < 2) return 0
    let total = 0
    for (let i = 0; i < itinerary.length - 1; i++) {
      total += calculateDistance(
        itinerary[i].location.latitude,
        itinerary[i].location.longitude,
        itinerary[i + 1].location.latitude,
        itinerary[i + 1].location.longitude
      )
    }
    return total
  }, [itinerary])

  // Estimated time (avg 5 min per 100m + 30min per venue)
  const itineraryTime = useMemo(() => {
    const walkTime = Math.round(itineraryDistance / 100 * 5)
    const venueTime = itinerary.length * 30
    return walkTime + venueTime
  }, [itinerary, itineraryDistance])

  // Toggle saved
  const toggleSaved = (id: string) => {
    const newSaved = new Set(saved)
    const location = locations.find(l => l.id === id)
    if (newSaved.has(id)) {
      newSaved.delete(id)
      if (location) showToast(`Removed ${location.name}`, 'info')
    } else {
      newSaved.add(id)
      if (location) showToast(`♥️ ${location.name} saved`, 'success')
    }
    setSaved(newSaved)
  }

  const clearFilters = () => {
    setEatOn(false)
    setHotelsOn(false)
    setActiveCategory(null)
    setSearchQuery('')
    setTimeFilter('all')
  }

  // AI Planner functions
  const handleAIChat = async (message?: string) => {
    const userMessage = message || chatInput.trim()
    if (!userMessage) return

    setIsAILoading(true)
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setChatInput('')

    try {
      const response = await fetch('/api/ai-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          message: userMessage,
          itinerary: itinerary.map(item => ({
            id: item.location.id,
            name: item.location.name,
            category: item.location.category?.slug,
            rating: item.location.rating,
            priceLevel: item.location.priceLevel
          })),
          preferences: aiPreferences,
          locations: locations.map(l => ({
            id: l.id,
            name: l.name,
            category: l.category?.slug,
            rating: l.rating,
            priceLevel: l.priceLevel
          }))
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
      }
    } catch (error) {
      console.error('AI Chat error:', error)
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please check your network.' }])
    } finally {
      setIsAILoading(false)
    }
  }

  // Generate full itinerary with AI
  const generateAIItinerary = async () => {
    setIsAILoading(true)
    const loadingMsg = { role: 'assistant' as const, content: '✨ Generating your personalized Belgrade itinerary...' }
    setChatMessages(prev => [...prev, { role: 'user', content: `Generate a ${aiPreferences.budget} budget itinerary from ${aiPreferences.startTime} to ${aiPreferences.endTime}` }, loadingMsg])

    try {
      const response = await fetch('/api/ai-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          preferences: aiPreferences,
          locations: locations.map(l => ({
            id: l.id,
            name: l.name,
            category: l.category?.slug,
            rating: l.rating,
            priceLevel: l.priceLevel
          }))
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setChatMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: data.response }])
      }
    } catch (error) {
      console.error('Generate itinerary error:', error)
      setChatMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: 'Failed to generate itinerary. Please try again.' }])
    } finally {
      setIsAILoading(false)
    }
  }

  // Optimize current itinerary with AI
  const optimizeItinerary = async () => {
    if (itinerary.length < 2) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Add at least 2 venues to optimize your route!' }])
      return
    }

    setIsAILoading(true)
    setChatMessages(prev => [...prev, { role: 'user', content: 'Optimize my current itinerary for best walking route' }, { role: 'assistant', content: '🔄 Optimizing your route...' }])

    try {
      const response = await fetch('/api/ai-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'optimize',
          itinerary: itinerary.map(item => ({
            id: item.location.id,
            name: item.location.name,
            category: item.location.category?.slug,
            rating: item.location.rating,
            priceLevel: item.location.priceLevel
          })),
          locations: locations.map(l => ({
            id: l.id,
            name: l.name,
            category: l.category?.slug,
            rating: l.rating,
            priceLevel: l.priceLevel
          }))
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setChatMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: data.response }])
      }
    } catch (error) {
      console.error('Optimize error:', error)
      setChatMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: 'Failed to optimize. Please try again.' }])
    } finally {
      setIsAILoading(false)
    }
  }

  // Swipe deck handlers
  const handleSwipe = (direction: 'left' | 'right') => {
    const currentVenue = topVenues[swipeIndex]
    if (!currentVenue) return
    
    // Save for undo
    setLastSwipedVenue({ venue: currentVenue, action: direction === 'right' ? 'add' : 'skip' })
    
    if (direction === 'right') {
      addToItinerary(currentVenue)
    } else {
      hapticFeedback('light')
    }
    setSwipeIndex(prev => Math.min(prev + 1, topVenues.length - 1))
  }
  
  // Undo last swipe
  const undoSwipe = () => {
    if (!lastSwipedVenue || swipeIndex === 0) return
    
    hapticFeedback('medium')
    
    // Go back one card
    setSwipeIndex(prev => Math.max(0, prev - 1))
    
    // If it was added, remove from itinerary
    if (lastSwipedVenue.action === 'add') {
      setItinerary(prev => prev.filter(item => item.location.id !== lastSwipedVenue.venue.id))
      showToast(`Undone: removed ${lastSwipedVenue.venue.name}`, 'info')
    } else {
      showToast(`Undone: brought back ${lastSwipedVenue.venue.name}`, 'info')
    }
    
    setLastSwipedVenue(null)
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      handleSwipe(info.offset.x > 0 ? 'right' : 'left')
    }
    x.set(0)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4"
          >
            Belgrade <span className="text-amber-300">Decoded</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/80 mb-8"
          >
            🥇 Where locals eat, drink & stay • ✨ Hidden gems TripAdvisor missed
          </motion.p>
          
          {/* Hero Search */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Try: 'best dinner near hotels' or 'happy hour'..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-12 pr-4 py-4 bg-white/95 border-none rounded-2xl text-base focus:ring-2 focus:ring-amber-400 shadow-xl"
              />
            </div>
            <button
              onClick={() => { setShowAIPlanner(true); if (searchQuery) handleAIChat(searchQuery) }}
              className="px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              AI Plan
            </button>
          </motion.div>
          
          {/* Quick Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center gap-6 mt-8 text-white/70 text-sm"
          >
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {locations.length} Places</span>
            <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {saved.size} Saved</span>
            <span className="flex items-center gap-1"><Navigation className="w-4 h-4" /> {itinerary.length} In Plan</span>
          </motion.div>
        </div>
      </section>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-40 h-12 relative">
                <Image src="/logo.png" alt="Belgrade PRO" fill className="object-contain" priority />
              </div>
            </div>

            {/* Smart Search Bar - Connected to AI */}
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                {isSearchLoading ? (
                  <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500 animate-spin" />
                ) : (
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                )}
                <Input
                  type="text"
                  placeholder="Search venues... or press Enter to ask AI ✨"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className={`w-full pl-11 pr-20 py-2.5 border-none rounded-full text-sm focus:ring-2 focus:ring-orange-500 transition-all ${isSearchLoading ? 'bg-orange-50 ring-2 ring-orange-200' : 'bg-gray-100 focus:bg-white'}`}
                />
                <button
                  onClick={() => { setShowAIPlanner(true); if (searchQuery) handleAIChat(searchQuery) }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-orange-500 text-white text-xs font-medium rounded-full hover:bg-orange-600 transition-colors"
                >
                  Ask AI
                </button>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Itinerary Button */}
              {itinerary.length > 0 && (
                <button 
                  onClick={() => setShowItinerary(!showItinerary)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-full text-sm font-semibold transition-colors"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  {itinerary.length}
                </button>
              )}
              
              {/* Swipe Deck Toggle */}
              <button 
                onClick={() => setShowSwipeDeck(!showSwipeDeck)}
                className={`hidden sm:flex items-center gap-2 px-3 py-2 text-white rounded-full text-sm font-semibold transition-colors ${showSwipeDeck ? 'bg-pink-500' : 'bg-pink-400 hover:bg-pink-500'}`}
              >
                <Flame className="w-4 h-4" />
                Swipe
              </button>
              
              {/* AI Planner Button */}
              <button 
                onClick={() => setShowAIPlanner(!showAIPlanner)}
                className={`hidden sm:flex items-center gap-2 px-4 py-2 text-white rounded-full text-sm font-semibold transition-colors shadow-lg ${showAIPlanner ? 'bg-orange-600' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'}`}
              >
                <Sparkles className="w-4 h-4" />
                AI Planner
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
              {/* Visit */}
              <button
                onClick={() => { setActiveCategory(activeCategory === 'visit' ? null : 'visit'); setEatOn(false); setHotelsOn(false) }}
                className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === 'visit' 
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-200' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Visit</span>
              </button>

              {/* Eat */}
              <button
                onClick={() => { setEatOn(!eatOn); setHotelsOn(false); setActiveCategory(null) }}
                className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                  eatOn 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm'
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>Eat {eatOn && 'ON'}</span>
              </button>

              {/* Hotels */}
              <button
                onClick={() => { setHotelsOn(!hotelsOn); setEatOn(false); setActiveCategory(null) }}
                className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                  hotelsOn 
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-200' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm'
                }`}
              >
                <Bed className="w-4 h-4" />
                <span>Hotels {hotelsOn && 'ON'}</span>
              </button>

              {/* Nightlife */}
              <button
                onClick={() => { setActiveCategory(activeCategory === 'nightlife' ? null : 'nightlife'); setEatOn(false); setHotelsOn(false) }}
                className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === 'nightlife' 
                    ? 'bg-violet-500 text-white shadow-lg shadow-violet-200' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Nightlife</span>
              </button>

              {/* Time Filters */}
              <div className="h-6 w-px bg-gray-300 mx-1" />
              
              <button
                onClick={() => setTimeFilter(timeFilter === 'now' ? 'all' : 'now')}
                className={`shrink-0 flex items-center gap-2 px-3 py-2.5 rounded-full text-sm font-medium transition-all ${
                  timeFilter === 'now' 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Open Now</span>
              </button>

              <button
                onClick={() => setTimeFilter(timeFilter === 'dinner' ? 'all' : 'dinner')}
                className={`shrink-0 flex items-center gap-2 px-3 py-2.5 rounded-full text-sm font-medium transition-all ${
                  timeFilter === 'dinner' 
                    ? 'bg-amber-500 text-white shadow-lg' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <Clock3 className="w-4 h-4" />
                <span>Dinner</span>
              </button>

              <button
                onClick={() => setTimeFilter(timeFilter === 'late-night' ? 'all' : 'late-night')}
                className={`shrink-0 flex items-center gap-2 px-3 py-2.5 rounded-full text-sm font-medium transition-all ${
                  timeFilter === 'late-night' 
                    ? 'bg-violet-500 text-white shadow-lg' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Late Night</span>
              </button>

              {/* Heatmap Toggle */}
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`shrink-0 flex items-center gap-2 px-3 py-2.5 rounded-full text-sm font-medium transition-all ${
                  showHeatmap 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <span>🔥</span>
                <span>Heatmap</span>
              </button>

              {/* Cuisine Filters */}
              {eatOn && (
                <>
                  <div className="h-6 w-px bg-gray-300 mx-1" />
                  {Object.entries(CUISINE_TYPES).slice(0, 5).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setCuisineFilter(cuisineFilter === key ? null : key)}
                      className={`shrink-0 flex items-center gap-1 px-3 py-2.5 rounded-full text-sm font-medium transition-all ${
                        cuisineFilter === key 
                          ? 'bg-rose-500 text-white shadow-lg' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <span>{value.icon}</span>
                      <span className="hidden sm:inline">{value.label}</span>
                    </button>
                  ))}
                </>
              )}

              {/* Active filters count */}
              {(eatOn || hotelsOn || activeCategory || searchQuery || timeFilter !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all underline"
                >
                  Clear all
                </button>
              )}

              {/* View Toggle */}
              <div className="ml-auto flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'map' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                >
                  <MapPin className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results header with spotlight */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-500 text-sm mt-1">{isLoading ? 'Loading...' : `${filteredLocations.length} places found`}</p>
          </div>
        </div>

        {/* Venue Spotlight Card - Shows top-rated venue */}
        {!isLoading && topVenues.length > 0 && !showSwipeDeck && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-1"
          >
            <div className="bg-white rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🏆</span>
                <h3 className="text-lg font-bold text-gray-900">Top Pick in Belgrade</h3>
                <span className="ml-auto px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
                  ★ {topVenues[0].rating}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">{topVenues[0].name}</h4>
                  <p className="text-gray-500 text-sm mb-3">{topVenues[0].category?.name} • {topVenues[0].shortDesc || 'Highly recommended'}</p>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => addToItinerary(topVenues[0])}
                      className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-full text-sm font-semibold transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      Add to Plan
                    </button>
                    <button
                      onClick={() => setSelectedLocation(topVenues[0])}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-semibold transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
                
                {/* Quick stats */}
                <div className="flex sm:flex-col gap-4 sm:gap-2 text-center">
                  {(() => {
                    const score = calculateLifestyleScore(topVenues[0], locations)
                    return (
                      <div className="px-4 py-2 bg-amber-50 rounded-xl">
                        <div className="text-2xl font-bold text-amber-600">{score.score}</div>
                        <div className="text-xs text-amber-700">Lifestyle</div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-xl mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : viewMode === 'map' ? (
          <div className="h-[calc(100vh-250px)] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <VintageMap
              locations={locations}
              selectedLocation={selectedLocation}
              onLocationSelect={setSelectedLocation}
              selectedCategories={categorySlugs}
              hotelsOn={hotelsOn}
              eatOn={eatOn}
              timeFilter={timeFilter}
              itinerary={itinerary.map(i => i.location)}
              showItineraryPath={showItineraryPath && itinerary.length >= 2}
              showHeatmap={showHeatmap}
            />
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLocations.map((location, i) => {
              const lifestyleScore = calculateLifestyleScore(location, locations)
              const walkScore = calculateWalkScore(location, locations)
              const cuisine = detectCuisine(location)
              const open = isOpenNow(location)
              
              return (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedLocation(location)}
                >
                  {/* Card */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-200 mb-3">
                    {/* Location Image */}
                    {location.images ? (
                      <Image
                        src={JSON.parse(location.images)[0]}
                        alt={location.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-rose-500 opacity-60" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <MapPin className="w-12 h-12 text-white opacity-80" />
                        </div>
                      </>
                    )}
                    
                    {/* Lifestyle Score Badge */}
                    <div className="absolute top-3 left-3 px-2 py-1 bg-white rounded-lg text-xs font-bold shadow-sm">
                      <span className="text-amber-500">✦</span> {lifestyleScore.score}/100
                    </div>
                    
                    {/* Open Now Badge */}
                    {open && (
                      <div className="absolute top-3 right-12 px-2 py-1 bg-green-500 rounded-full text-xs font-semibold text-white animate-pulse">
                        Open
                      </div>
                    )}
                    
                    {/* Cuisine Badge */}
                    {cuisine && (
                      <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${CUISINE_TYPES[cuisine]?.color || 'bg-gray-100 text-gray-700'}`}>
                        {CUISINE_TYPES[cuisine]?.icon} {cuisine}
                      </div>
                    )}
                    
                    {/* Featured badge */}
                    {location.featured && (
                      <div className="absolute top-3 right-12 px-2 py-1 bg-amber-400 rounded-full text-xs font-semibold text-white shadow-sm">
                        Guest favorite
                      </div>
                    )}
                    
                    {/* Save button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleSaved(location.id) }}
                      className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all"
                    >
                      <Heart className={`w-4 h-4 ${saved.has(location.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}`} />
                    </button>
                    
                    {/* Add to Itinerary */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToItinerary(location) }}
                      className="absolute bottom-3 right-3 p-2 bg-violet-500 rounded-full hover:bg-violet-600 transition-all"
                      title="Add to Itinerary"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 group-hover:underline line-clamp-1">{location.name}</h3>
                      {location.rating && (
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
                          <span className="text-sm font-medium">{location.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 line-clamp-1">{location.category?.name}</p>
                    
                    {/* Walk Score Preview */}
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      {walkScore.nearestRestaurant && (
                        <span>{formatDistance(walkScore.nearestRestaurant.distance)} to restaurant</span>
                      )}
                    </div>
                    
                    {/* Price for hotels */}
                    {location.priceLevel !== null && location.priceLevel !== undefined && (
                      <p className="text-sm">
                        <span className="font-semibold text-gray-900">{['Free', '€', '€€', '€€€', '€€€€'][location.priceLevel]}</span>
                        <span className="text-gray-500"> night</span>
                      </p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Mobile Swipe Deck */}
      <AnimatePresence>
        {showSwipeDeck && topVenues.length > 0 && swipeIndex < topVenues.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-lg">🔥 Hot Venues</h2>
                <button 
                  onClick={() => setShowSwipeDeck(false)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              
              {/* Card Stack */}
              <div className="relative h-[450px]">
                {topVenues.slice(swipeIndex, swipeIndex + 3).reverse().map((venue, i, arr) => {
                  const isTop = i === arr.length - 1
                  const lifestyle = calculateLifestyleScore(venue, locations)
                  const cuisine = detectCuisine(venue)
                  
                  return (
                    <motion.div
                      key={venue.id}
                      style={{ 
                        x: isTop ? x : 0,
                        rotate: isTop ? rotate : 0,
                        opacity: isTop ? opacity : 1,
                      }}
                      drag={isTop ? 'x' : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={isTop ? handleDragEnd : undefined}
                      className={`absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden ${isTop ? 'cursor-grab active:cursor-grabbing' : ''}`}
                      initial={{ scale: 0.95, y: 20 }}
                      animate={{ 
                        scale: isTop ? 1 : 0.95 - (arr.length - 1 - i) * 0.05,
                        y: isTop ? 0 : (arr.length - 1 - i) * 10
                      }}
                    >
                      {/* Card Content - Image */}
                      <div className="h-1/2 relative overflow-hidden">
                        {venue.images ? (
                          <Image
                            src={JSON.parse(venue.images)[0]}
                            alt={venue.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                            <MapPin className="w-20 h-20 text-white/50" />
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{venue.name}</h3>
                          <div className="flex items-center gap-1 bg-amber-100 px-2 py-1 rounded-full">
                            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                            <span className="font-bold text-amber-700">{venue.rating}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-500 text-sm mb-4">{venue.category?.name}</p>
                        
                        {/* Lifestyle Score */}
                        <div className="bg-gray-50 rounded-xl p-3 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Lifestyle Score</span>
                            <span className="text-2xl font-bold text-amber-500">{lifestyle.score}/100</span>
                          </div>
                        </div>
                        
                        {/* Cuisine Badge */}
                        {cuisine && (
                          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${CUISINE_TYPES[cuisine]?.color}`}>
                            {CUISINE_TYPES[cuisine]?.icon} {cuisine}
                          </div>
                        )}
                      </div>
                      
                      {/* Swipe indicators */}
                      {isTop && (
                        <>
                          <div className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold rotate-[-20deg]">
                            ADD
                          </div>
                          <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold rotate-[20deg]">
                            SKIP
                          </div>
                        </>
                      )}
                    </motion.div>
                  )
                })}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => handleSwipe('left')}
                  className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <X className="w-7 h-7 text-red-500" />
                </button>
                {/* Undo Button */}
                <button
                  onClick={undoSwipe}
                  disabled={!lastSwipedVenue || swipeIndex === 0}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    lastSwipedVenue && swipeIndex > 0
                      ? 'bg-amber-400 hover:bg-amber-500 hover:scale-110'
                      : 'bg-gray-300 opacity-50 cursor-not-allowed'
                  }`}
                  title="Undo last swipe"
                >
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </button>
                <button
                  onClick={() => handleSwipe('right')}
                  className="w-14 h-14 bg-violet-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <Heart className="w-7 h-7 text-white fill-white" />
                </button>
              </div>
              
              <p className="text-center text-white/60 text-sm mt-4">
                {swipeIndex + 1} / {topVenues.length}
                {lastSwipedVenue && (
                  <span className="ml-2 text-amber-300">↩️ undo available</span>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Planner Panel */}
      <AnimatePresence>
        {showAIPlanner && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed top-0 right-0 bottom-0 w-[420px] bg-white shadow-2xl z-[9999] border-l border-gray-200 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-amber-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5" />
                  <h2 className="text-lg font-bold">AI Travel Planner</h2>
                </div>
                <button onClick={() => setShowAIPlanner(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <p className="text-white/80 text-sm mt-1">Your personal Belgrade guide</p>
            </div>
            
            {/* Quick Actions */}
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <div className="grid grid-cols-2 gap-2">
                {/* Budget Toggle */}
                <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-200">
                  {(['budget', 'moderate', 'luxury'] as const).map((b) => (
                    <button
                      key={b}
                      onClick={() => setAIPreferences(p => ({ ...p, budget: b }))}
                      className={`flex-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${aiPreferences.budget === b ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {b.charAt(0).toUpperCase() + b.slice(1)}
                    </button>
                  ))}
                </div>
                
                {/* Pace Toggle */}
                <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-200">
                  {(['relaxed', 'moderate', 'intense'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setAIPreferences(prev => ({ ...prev, pace: p }))}
                      className={`flex-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${aiPreferences.pace === p ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={generateAIItinerary}
                  disabled={isAILoading}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50"
                >
                  <Wand2 className="w-4 h-4" />
                  Generate Plan
                </button>
                <button
                  onClick={optimizeItinerary}
                  disabled={isAILoading || itinerary.length < 2}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-violet-500 text-white rounded-lg text-sm font-medium hover:bg-violet-600 transition-all disabled:opacity-50"
                >
                  <Navigation className="w-4 h-4" />
                  Optimize Route
                </button>
              </div>
            </div>
            
            {/* Current Itinerary Summary */}
            {itinerary.length > 0 && (
              <div className="p-3 border-b border-gray-100 bg-violet-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-violet-700">Your Plan ({itinerary.length} venues)</span>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-xs text-violet-600">
                      <input
                        type="checkbox"
                        checked={showItineraryPath}
                        onChange={(e) => setShowItineraryPath(e.target.checked)}
                        className="rounded"
                      />
                      Show path
                    </label>
                    <button 
                      onClick={() => setShowItinerary(true)}
                      className="text-xs text-violet-600 hover:text-violet-800 underline"
                    >
                      View all
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-violet-600">
                  <span className="flex items-center gap-1">
                    <Navigation className="w-3 h-3" />
                    {formatDistance(itineraryDistance)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {Math.floor(itineraryTime / 60)}h {itineraryTime % 60}m
                  </span>
                </div>
              </div>
            )}
            
            {/* Chat Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {chatMessages.length === 0 && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Welcome to AI Planner!</h3>
                  <p className="text-sm text-gray-500 mb-4">I can help you plan your perfect Belgrade experience.</p>
                  
                  {/* Plan Your Night Flows */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-violet-600 mb-2">🌙 Plan Your Night</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAIChat('Plan a romantic evening in Belgrade with dinner and a view. Start around 19:00.')}
                        className="text-left px-3 py-2 bg-rose-50 hover:bg-rose-100 rounded-lg text-xs text-rose-700 transition-colors border border-rose-200"
                      >
                        💕 Romantic Night
                      </button>
                      <button
                        onClick={() => handleAIChat('Plan a wild night out in Belgrade! Start with drinks and end at a club. Budget friendly.')}
                        className="text-left px-3 py-2 bg-violet-50 hover:bg-violet-100 rounded-lg text-xs text-violet-700 transition-colors border border-violet-200"
                      >
                        🎉 Party Night
                      </button>
                      <button
                        onClick={() => handleAIChat('Plan a relaxed evening with good food and a nice walk. Moderate budget, ending by 22:00.')}
                        className="text-left px-3 py-2 bg-teal-50 hover:bg-teal-100 rounded-lg text-xs text-teal-700 transition-colors border border-teal-200"
                      >
                        🍃 Relaxed Night
                      </button>
                      <button
                        onClick={() => handleAIChat('Plan a cultural evening in Belgrade with museums, traditional dinner and live music.')}
                        className="text-left px-3 py-2 bg-amber-50 hover:bg-amber-100 rounded-lg text-xs text-amber-700 transition-colors border border-amber-200"
                      >
                        🎭 Cultural Night
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAIChat('What are the must-see attractions in Belgrade?')}
                      className="block w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
                    >
                      🏛️ What are the must-see attractions?
                    </button>
                    <button
                      onClick={() => handleAIChat('Recommend the best restaurants for traditional Serbian food')}
                      className="block w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
                    >
                      🍽️ Best traditional Serbian restaurants?
                    </button>
                    <button
                      onClick={() => handleAIChat('Where is the best nightlife in Belgrade?')}
                      className="block w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
                    >
                      🌙 Where's the best nightlife?
                    </button>
                  </div>
                </div>
              )}
              
              {chatMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                    msg.role === 'user' 
                      ? 'bg-orange-500 text-white rounded-br-sm' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              
              {isAILoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                      <span className="text-sm text-gray-500">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Ask about Belgrade..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAIChat()}
                  disabled={isAILoading}
                  className="flex-1 bg-gray-100 border-none rounded-full py-2.5"
                />
                <button
                  onClick={() => handleAIChat()}
                  disabled={isAILoading || !chatInput.trim()}
                  className="p-2.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Itinerary Builder Sidebar */}
      <AnimatePresence>
        {showItinerary && itinerary.length > 0 && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed top-0 right-0 bottom-0 w-96 bg-white shadow-2xl z-[9999] border-l border-gray-200"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Your Plan</h2>
                  <button onClick={() => setShowItinerary(false)} className="p-1 hover:bg-gray-100 rounded">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Navigation className="w-4 h-4" />
                    {formatDistance(itineraryDistance)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {Math.floor(itineraryTime / 60)}h {itineraryTime % 60}m
                  </span>
                </div>
                
                {/* Show Path Toggle */}
                <label className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={showItineraryPath}
                    onChange={(e) => setShowItineraryPath(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  Show walking path on map
                </label>
                
                {/* AI Optimize Button */}
                <button
                  onClick={() => { setShowItinerary(false); setShowAIPlanner(true); optimizeItinerary() }}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Optimize with AI
                </button>
              </div>
              
              {/* Venues List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {itinerary.map((item, index) => (
                    <motion.div
                      key={item.location.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-6 h-6 rounded-full bg-violet-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">{item.location.name}</h4>
                        <p className="text-xs text-gray-500">{item.location.category?.name}</p>
                        {index < itinerary.length - 1 && (
                          <p className="text-xs text-violet-500 mt-1">
                            → {formatDistance(calculateDistance(
                              item.location.latitude, item.location.longitude,
                              itinerary[index + 1].location.latitude, itinerary[index + 1].location.longitude
                            ))} to next
                          </p>
                        )}
                      </div>
                      <button 
                        onClick={() => removeFromItinerary(item.location.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Minus className="w-4 h-4 text-gray-400" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Actions */}
              <div className="p-4 border-t border-gray-200 space-y-2">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-violet-500 text-white rounded-xl font-medium hover:bg-violet-600 transition-colors">
                  <Heart className="w-5 h-5" />
                  Save Itinerary
                </button>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
                <button 
                  onClick={clearItinerary}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Detail Modal */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50"
            onClick={() => setSelectedLocation(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative aspect-video bg-gray-200">
                {selectedLocation.images ? (
                  <Image
                    src={JSON.parse(selectedLocation.images)[0]}
                    alt={selectedLocation.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-rose-500 opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin className="w-16 h-16 text-white opacity-80" />
                    </div>
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <button 
                  onClick={() => setSelectedLocation(null)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {(() => {
                  const lifestyle = calculateLifestyleScore(selectedLocation, locations)
                  const walk = calculateWalkScore(selectedLocation, locations)
                  const cuisine = detectCuisine(selectedLocation)
                  
                  return (
                    <>
                      {/* Score Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{selectedLocation.name}</h2>
                          <p className="text-gray-500">{selectedLocation.category?.name}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-amber-500">{lifestyle.score}/100</div>
                          <div className="text-xs text-gray-500">Lifestyle Score</div>
                        </div>
                      </div>
                      
                      {/* Cuisine Badge */}
                      {cuisine && CUISINE_TYPES[cuisine] && (
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mb-4 border ${CUISINE_TYPES[cuisine].color}`}>
                          <span>{CUISINE_TYPES[cuisine].icon}</span>
                          <span>{CUISINE_TYPES[cuisine].label}</span>
                        </div>
                      )}
                      
                      {/* Score Breakdown */}
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        <div className="bg-emerald-50 rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-emerald-600">{lifestyle.diningScore}</div>
                          <div className="text-xs text-emerald-600">Dining</div>
                        </div>
                        <div className="bg-sky-50 rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-sky-600">{lifestyle.hotelScore}</div>
                          <div className="text-xs text-sky-600">Hotels</div>
                        </div>
                        <div className="bg-violet-50 rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-violet-600">{lifestyle.nightlifeScore}</div>
                          <div className="text-xs text-violet-600">Nightlife</div>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-amber-600">{lifestyle.priceScore}</div>
                          <div className="text-xs text-amber-600">Value</div>
                        </div>
                      </div>
                      
                      {/* Walk Score Matrix */}
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Navigation className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-semibold text-gray-700">Walk Score Matrix</span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          {walk.nearestRestaurant && (
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-500">✦</span>
                              <span>{formatDistance(walk.nearestRestaurant.distance)} to nearest restaurant</span>
                            </div>
                          )}
                          {walk.nearestHotel && (
                            <div className="flex items-center gap-2">
                              <span className="text-sky-500">✦</span>
                              <span>{formatDistance(walk.nearestHotel.distance)} to nearest hotel</span>
                            </div>
                          )}
                          <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-200">
                            <span className="flex items-center gap-1">
                              <Utensils className="w-3 h-3" /> {walk.diningSpots} dining spots
                            </span>
                            <span className="flex items-center gap-1">
                              <Bed className="w-3 h-3" /> {walk.hotelSpots} hotels
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Price Comparison Widget for Hotels */}
                      {selectedLocation.category?.slug?.includes('accommodation') || selectedLocation.category?.slug?.includes('hotels') ? (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-700">💰 Price Comparison</span>
                            <span className="text-xs text-gray-500">Best prices from 4 sites</span>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {generatePriceComparison(selectedLocation.name).map((p, i) => (
                              <div key={i} className={`text-center p-2 rounded-lg ${p.best ? 'bg-green-100 border border-green-300' : 'bg-white'} hover:shadow-md transition-shadow cursor-pointer`}>
                                <div className="text-xs text-gray-500">{p.source}</div>
                                <div className={`font-bold ${p.best ? 'text-green-600' : 'text-gray-900'}`}>{p.currency}{p.price}</div>
                                {p.best && <div className="text-xs text-green-600 font-medium">↓ Best</div>}
                              </div>
                            ))}
                          </div>
                          <button className="w-full mt-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors">
                            Book Now - Best Price
                          </button>
                        </div>
                      ) : null}
                    </>
                  )
                })()}

                {/* Price for hotels */}
                {selectedLocation.priceLevel !== null && selectedLocation.priceLevel !== undefined && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-gray-900">{['Free', '€', '€€', '€€€', '€€€€'][selectedLocation.priceLevel]}</span>
                    <span className="text-gray-500">per night</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleSaved(selectedLocation.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${saved.has(selectedLocation.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    {saved.has(selectedLocation.id) ? 'Saved' : 'Save'}
                  </button>
                  <button 
                    onClick={() => { addToItinerary(selectedLocation); setSelectedLocation(null); setShowItinerary(true) }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-violet-500 text-white rounded-xl font-medium hover:bg-violet-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Add to Plan
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile FAB - Floating Action Button */}
      {itinerary.length > 0 && !showItinerary && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowItinerary(true)}
          className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-violet-500 text-white rounded-full shadow-lg shadow-violet-300 flex items-center justify-center z-[9998]"
        >
          <Heart className="w-6 h-6 fill-current" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-xs font-bold flex items-center justify-center">{itinerary.length}</span>
        </motion.button>
      )}

      {/* Sticky Itinerary Counter - Desktop */}
      {itinerary.length > 0 && !showItinerary && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden sm:block fixed top-20 right-6 z-[9998]"
        >
          <button
            onClick={() => setShowItinerary(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
          >
            <Heart className="w-4 h-4 text-violet-500 fill-violet-500" />
            <span className="font-semibold text-gray-900">{itinerary.length}</span>
            <span className="text-sm text-gray-500">in Plan</span>
          </button>
        </motion.div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className={`px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 backdrop-blur-sm ${
                toast.type === 'success' 
                  ? 'bg-green-500/90 text-white' 
                  : toast.type === 'error'
                    ? 'bg-red-500/90 text-white'
                    : 'bg-gray-800/90 text-white'
              }`}
            >
              {toast.type === 'success' && <Check className="w-4 h-4" />}
              <span className="text-sm font-medium">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Gamification Badges */}
      {(saved.size > 0 || itinerary.length > 0) && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden sm:block fixed bottom-24 left-6 z-[9998]"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-4 max-w-[200px]">
            <h4 className="text-sm font-bold text-gray-900 mb-3">🏆 Explorer Badges</h4>
            <div className="space-y-2">
              {/* Saved Badge */}
              <div className={`flex items-center gap-2 text-xs ${saved.size >= 5 ? 'text-amber-600' : 'text-gray-400'}`}>
                <span className="text-lg">{saved.size >= 5 ? '🥇' : saved.size >= 1 ? '🥈' : '🔒'}</span>
                <span>Saver ({saved.size}/5)</span>
              </div>
              {/* Itinerary Badge */}
              <div className={`flex items-center gap-2 text-xs ${itinerary.length >= 3 ? 'text-violet-600' : 'text-gray-400'}`}>
                <span className="text-lg">{itinerary.length >= 3 ? '🗺️' : itinerary.length >= 1 ? '📍' : '🔒'}</span>
                <span>Planner ({itinerary.length}/3)</span>
              </div>
              {/* Foodie Badge */}
              <div className={`flex items-center gap-2 text-xs ${eatOn || activeCategory === 'eat' ? 'text-emerald-600' : 'text-gray-400'}`}>
                <span className="text-lg">{eatOn || activeCategory === 'eat' ? '🍽️' : '🔒'}</span>
                <span>Foodie</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Weather Suggestion */}
      {typeof window !== 'undefined' && (
        <WeatherSuggestion savedCount={saved.size} itineraryCount={itinerary.length} />
      )}
    </main>
  )
}
