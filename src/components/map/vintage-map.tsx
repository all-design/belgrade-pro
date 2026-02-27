'use client'

import { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Polyline, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Location } from '@/lib/types'

// Brand colors
const COLORS = {
  rose: '#f43f5e',
  amber: '#f59e0b',
  sky: '#0ea5e9',
  emerald: '#10b981',
  violet: '#8b5cf6',
  teal: '#14b8a6',
  orange: '#f97316',
  green: '#22c55e',
}

// Priority levels for contextual clustering
const PRIORITY_ZOOM = {
  always: 0,
  high: 14,
  medium: 15,
  low: 16,
}

interface VintageMapProps {
  locations: Location[]
  selectedLocation: Location | null
  onLocationSelect: (location: Location | null) => void
  selectedCategories: string[]
  hotelsOn?: boolean
  eatOn?: boolean
  timeFilter?: 'all' | 'now' | 'happy-hour' | 'brunch' | 'dinner' | 'late-night'
  itinerary?: Location[]
  showItineraryPath?: boolean
  showHeatmap?: boolean
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

// Check if venue is open
const isOpenNow = (location: Location): boolean => {
  if (!location.openingHours) return false
  const now = new Date()
  const currentHour = now.getHours()
  const hours = location.openingHours.toLowerCase()
  if (hours.includes('closed')) return false
  if (currentHour >= 11 && currentHour <= 23) return true
  if (hours.includes('24') || hours.includes('all day')) return true
  return false
}

// Get marker color based on category
const getMarkerColor = (categorySlug: string, hotelsOn?: boolean, eatOn?: boolean): string => {
  if (hotelsOn) return COLORS.sky
  if (eatOn) return COLORS.emerald
  
  switch (categorySlug) {
    case 'food': return COLORS.emerald
    case 'accommodation': return COLORS.sky
    case 'nightlife': return COLORS.violet
    case 'landmarks': return COLORS.teal
    case 'museums': return COLORS.violet
    case 'nature': return COLORS.emerald
    case 'bars': return COLORS.amber
    default: return COLORS.rose
  }
}

// Get SVG icon path based on category
const getCategoryIconSVG = (categorySlug: string): string => {
  if (categorySlug === 'food' || categorySlug === 'bars') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`
  }
  
  if (categorySlug === 'accommodation' || categorySlug === 'hotels') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>`
  }
  
  if (categorySlug === 'nightlife') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`
  }
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`
}

// Determine marker priority for contextual clustering
const getMarkerPriority = (location: Location, currentZoom: number): number => {
  if (location.featured && location.rating && location.rating >= 4.8) {
    return PRIORITY_ZOOM.always
  }
  
  if (location.rating && location.rating >= 4.5) {
    return PRIORITY_ZOOM.high
  }
  
  switch (location.category?.slug) {
    case 'food': return PRIORITY_ZOOM.medium
    case 'accommodation': return PRIORITY_ZOOM.high
    case 'nightlife': return PRIORITY_ZOOM.low
    case 'landmarks':
    case 'museums': return PRIORITY_ZOOM.high
    default: return PRIORITY_ZOOM.medium
  }
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
const calculateLifestyleScore = (location: Location, allLocations: Location[]): number => {
  const walkScore = calculateWalkScore(location, allLocations)
  const diningScore = Math.min(100, walkScore.diningSpots * 7 + (walkScore.nearestRestaurant ? Math.max(0, 30 - walkScore.nearestRestaurant.distance / 30) : 0))
  const hotelScore = Math.min(100, walkScore.hotelSpots * 10 + (walkScore.nearestHotel ? Math.max(0, 25 - walkScore.nearestHotel.distance / 40) : 0))
  const nightlife = allLocations.filter(l => l.category?.slug?.includes('nightlife'))
  const nearbyNightlife = nightlife.filter(n => 
    calculateDistance(location.latitude, location.longitude, n.latitude, n.longitude) <= 1000
  ).length
  const nightlifeScore = Math.min(100, nearbyNightlife * 12)
  const priceScore = location.priceLevel ? (5 - location.priceLevel) * 20 : 50
  return Math.round(diningScore * 0.35 + hotelScore * 0.25 + nightlifeScore * 0.25 + priceScore * 0.15)
}

// Get zoom-based icon size
const getZoomBasedSize = (zoom: number, isSelected: boolean, isTopVenue: boolean): number => {
  if (isSelected) return 56
  
  // Zoom-based progressive disclosure
  if (zoom <= 13) {
    // Low zoom: Large icons for top venues only
    return isTopVenue ? 48 : 36
  } else if (zoom <= 15) {
    // Medium zoom: Medium icons for all
    return 40
  } else {
    // High zoom: Smaller icons, more detail
    return 32
  }
}

// Create premium marker with visual upgrades
const createIconMarker = (
  location: Location, 
  isSelected: boolean, 
  currentZoom: number, 
  shouldShow: boolean, 
  hotelsOn?: boolean, 
  eatOn?: boolean,
  allLocations?: Location[],
  timeFilter?: string,
  isInItinerary?: boolean,
  itineraryOrder?: number
) => {
  const isTopVenue = location.featured && location.rating && location.rating >= 4.7
  const iconSize = getZoomBasedSize(currentZoom, isSelected, isTopVenue)
  const markerColor = getMarkerColor(location.category?.slug || '', hotelsOn, eatOn)
  const iconSVG = getCategoryIconSVG(location.category?.slug || '')
  const opacity = shouldShow ? 1 : 0.2
  const lifestyleScore = allLocations ? calculateLifestyleScore(location, allLocations) : null
  
  const priceText = location.priceLevel !== null && location.priceLevel !== undefined 
    ? ['Free', '€', '€€', '€€€', '€€€€'][location.priceLevel] 
    : null
  const isHotel = location.category?.slug?.includes('accommodation') || location.category?.slug?.includes('hotels')
  
  const venueIsOpen = timeFilter === 'now' || isOpenNow(location)
  
  // Premium shadow based on zoom level
  const shadowSize = currentZoom <= 13 ? '0 8px 32px' : currentZoom <= 15 ? '0 6px 24px' : '0 4px 16px'
  const shadowOpacity = isSelected ? 0.4 : 0.25
  
  return L.divIcon({
    className: 'icon-marker premium-marker',
    html: `
      <div class="map-icon-container" style="
        position: relative; 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        opacity: ${opacity}; 
        transition: opacity 0.4s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      ">
        ${isSelected ? `
          <div class="marker-label" style="
            background: white;
            color: #1f2937;
            padding: 8px 14px;
            border-radius: 24px;
            font-size: 13px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            margin-bottom: 10px;
            border: 2px solid ${markerColor};
            font-family: 'Inter', sans-serif;
            letter-spacing: 0.02em;
          ">${location.name}</div>
        ` : ''}
        
        ${isInItinerary ? `
          <div class="itinerary-badge" style="
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, ${COLORS.violet} 0%, #7c3aed 100%);
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            z-index: 10;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.5);
          ">${itineraryOrder}</div>
        ` : ''}
        
        <div class="map-icon ${venueIsOpen ? 'open-now-pulse' : ''} ${isSelected ? 'selected' : ''} ${isTopVenue ? 'top-venue' : ''}" style="
          width: ${iconSize}px;
          height: ${iconSize}px;
          background: linear-gradient(145deg, ${markerColor} 0%, ${markerColor}dd 100%);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            ${shadowSize} rgba(0,0,0,${shadowOpacity}),
            inset 0 2px 4px rgba(255,255,255,0.4),
            inset 0 -2px 4px rgba(0,0,0,0.1);
          border: 3px solid rgba(255,255,255,0.95);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          ${isSelected ? 'transform: rotate(-45deg) scale(1.25);' : ''}
          ${isInItinerary ? 'box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.3), 0 8px 24px rgba(139, 92, 246, 0.4);' : ''}
        ">
          <div style="
            color: white; 
            width: ${iconSize * 0.4}px; 
            height: ${iconSize * 0.4}px;
            transform: rotate(45deg);
            filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
          ">
            ${iconSVG}
          </div>
        </div>
        
        ${isTopVenue && !isInItinerary ? `
          <div class="top-badge" style="
            position: absolute;
            top: -4px;
            right: -4px;
            width: 22px;
            height: 22px;
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
            border-radius: 50%;
            border: 2px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: white;
            font-weight: bold;
            box-shadow: 0 3px 10px rgba(255, 165, 0, 0.5);
            z-index: 5;
          ">★</div>
        ` : ''}
        
        ${venueIsOpen ? `
          <div class="open-badge" style="
            position: absolute;
            bottom: 8px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, ${COLORS.green} 0%, #059669 100%);
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: 700;
            color: white;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(34, 197, 94, 0.4);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          ">Open</div>
        ` : ''}
        
        ${isHotel && priceText ? `
          <div class="price-badge" style="
            margin-top: 12px;
            background: white;
            padding: 4px 10px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 800;
            color: ${COLORS.sky};
            box-shadow: 0 2px 10px rgba(0,0,0,0.12);
            white-space: nowrap;
            font-family: 'Inter', sans-serif;
          ">${priceText}</div>
        ` : ''}
        
        ${lifestyleScore !== null && isSelected ? `
          <div class="lifestyle-badge" style="
            margin-top: 6px;
            background: linear-gradient(135deg, ${COLORS.amber} 0%, #F59E0B 100%);
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 700;
            color: white;
            box-shadow: 0 2px 10px rgba(245, 158, 11, 0.3);
            font-family: 'Inter', sans-serif;
          ">✦ ${lifestyleScore}</div>
        ` : ''}
      </div>
    `,
    iconSize: [iconSize + 60, iconSize + (isHotel && priceText ? 90 : 60)],
    iconAnchor: [(iconSize + 60) / 2, iconSize + 30],
    popupAnchor: [0, -(iconSize + 40)],
  })
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.flyTo(center, zoom, { duration: 0.5 })
  }, [center, zoom, map])
  return null
}

function MapClickHandler({ onDeselect }: { onDeselect: () => void }) {
  useMapEvents({ click: () => onDeselect() })
  return null
}

function ZoomDisplay({ onZoomChange }: { onZoomChange: (z: number) => void }) {
  const map = useMap()
  useEffect(() => {
    const handleZoom = () => onZoomChange(map.getZoom())
    map.on('zoomend', handleZoom)
    return () => { map.off('zoomend', handleZoom) }
  }, [map, onZoomChange])
  return null
}

// Animated path component
function AnimatedPath({ 
  points, 
  isVisible 
}: { 
  points: [number, number][]
  isVisible: boolean 
}) {
  const [pathProgress, setPathProgress] = useState(0)
  
  useEffect(() => {
    if (!isVisible || points.length < 2) return
    
    let progress = 0
    const interval = setInterval(() => {
      progress += 0.02
      if (progress >= 1) {
        progress = 1
        clearInterval(interval)
      }
      setPathProgress(progress)
    }, 30)
    return () => clearInterval(interval)
  }, [isVisible, points])
  
  if (points.length < 2 || !isVisible) return null
  
  const totalSegments = points.length - 1
  const visibleSegments = Math.ceil(totalSegments * pathProgress)
  
  const visiblePoints = points.slice(0, visibleSegments + 1)
  
  return (
    <>
      <Polyline
        positions={visiblePoints}
        pathOptions={{
          color: COLORS.violet,
          weight: 4,
          opacity: 0.8,
        }}
      />
      <Polyline
        positions={points}
        pathOptions={{
          color: COLORS.violet,
          weight: 4,
          opacity: pathProgress * 0.3,
          dashArray: '10, 10',
        }}
      />
    </>
  )
}

// Walking man animation along path
function WalkingAnimation({ 
  points, 
  isVisible 
}: { 
  points: [number, number][]
  isVisible: boolean 
}) {
  const [position, setPosition] = useState<[number, number] | null>(null)
  const [rotation, setRotation] = useState(0)
  
  useEffect(() => {
    if (isVisible && points.length >= 2) {
      let progress = 0
      const totalDistance = points.length - 1
      
      const interval = setInterval(() => {
        progress += 0.01
        if (progress >= 1) {
          progress = 0
        }
        
        const segmentIndex = Math.min(
          Math.floor(progress * totalDistance),
          totalDistance - 1
        )
        const segmentProgress = (progress * totalDistance) - segmentIndex
        
        const start = points[segmentIndex]
        const end = points[segmentIndex + 1]
        
        if (start && end) {
          const lat = start[0] + (end[0] - start[0]) * segmentProgress
          const lng = start[1] + (end[1] - start[1]) * segmentProgress
          
          const angle = Math.atan2(end[0] - start[0], end[1] - start[1]) * 180 / Math.PI
          
          setPosition([lat, lng])
          setRotation(angle)
        }
      }, 50)
      
      return () => clearInterval(interval)
    }
  }, [isVisible, points])
  
  if (!position || !isVisible) return null
  
  return (
    <Marker
      position={position}
      icon={L.divIcon({
        className: 'walking-icon',
        html: `
          <div style="
            font-size: 24px;
            transform: rotate(${rotation}deg);
            animation: walk 0.5s steps(2) infinite;
          ">🚶</div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })}
    />
  )
}

// Open Now Heatmap Component
function OpenNowHeatmap({ 
  locations, 
  isVisible 
}: { 
  locations: Location[]
  isVisible: boolean 
}) {
  const [pulseOpacity, setPulseOpacity] = useState(0.15)
  
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setPulseOpacity(prev => prev === 0.15 ? 0.25 : 0.15)
      }, 1500)
      return () => clearInterval(interval)
    }
  }, [isVisible])
  
  const openLocations = useMemo(() => {
    return locations.filter(loc => isOpenNow(loc))
  }, [locations])
  
  if (!isVisible || openLocations.length === 0) return null
  
  // Group nearby open venues into clusters
  const clusters: { center: [number, number]; count: number }[] = []
  const used = new Set<string>()
  
  for (const loc of openLocations) {
    if (used.has(loc.id)) continue
    
    const nearby = openLocations.filter(l => 
      !used.has(l.id) && 
      calculateDistance(loc.latitude, loc.longitude, l.latitude, l.longitude) < 500
    )
    
    const allInCluster = [loc, ...nearby]
    const centerLat = allInCluster.reduce((sum, l) => sum + l.latitude, 0) / allInCluster.length
    const centerLng = allInCluster.reduce((sum, l) => sum + l.longitude, 0) / allInCluster.length
    
    clusters.push({
      center: [centerLat, centerLng],
      count: allInCluster.length
    })
    
    allInCluster.forEach(l => used.add(l.id))
  }
  
  return (
    <>
      {clusters.map((cluster, i) => (
        <Circle
          key={i}
          center={cluster.center}
          radius={200 + cluster.count * 50}
          pathOptions={{
            fillColor: COLORS.green,
            fillOpacity: pulseOpacity,
            color: COLORS.green,
            opacity: 0.3,
            weight: 2,
          }}
        />
      ))}
    </>
  )
}

// Venue Cluster Component - Groups venues at low zoom levels
function VenueClusters({ 
  locations, 
  currentZoom,
  onClusterClick
}: { 
  locations: Location[]
  currentZoom: number
  onClusterClick: (center: [number, number], zoom: number) => void
}) {
  // Only show clusters at zoom <= 14
  if (currentZoom > 14) return null
  
  const clusterRadius = currentZoom <= 12 ? 800 : 400 // meters
  
  // Group nearby venues into clusters
  const clusters: { 
    center: [number, number]
    count: number
    topVenue: Location | null
    avgRating: number
  }[] = []
  const used = new Set<string>()
  
  for (const loc of locations) {
    if (used.has(loc.id)) continue
    
    const nearby = locations.filter(l => 
      !used.has(l.id) && 
      calculateDistance(loc.latitude, loc.longitude, l.latitude, l.longitude) < clusterRadius
    )
    
    const allInCluster = [loc, ...nearby]
    
    // Find top venue in cluster
    const topVenue = allInCluster.reduce((best, current) => 
      (current.rating && (!best.rating || current.rating > best.rating)) ? current : best
    , allInCluster[0])
    
    // Calculate average rating
    const avgRating = allInCluster.reduce((sum, l) => sum + (l.rating || 0), 0) / allInCluster.length
    
    const centerLat = allInCluster.reduce((sum, l) => sum + l.latitude, 0) / allInCluster.length
    const centerLng = allInCluster.reduce((sum, l) => sum + l.longitude, 0) / allInCluster.length
    
    clusters.push({
      center: [centerLat, centerLng],
      count: allInCluster.length,
      topVenue,
      avgRating
    })
    
    allInCluster.forEach(l => used.add(l.id))
  }
  
  // Don't show individual markers if there are clusters
  if (clusters.length === 0 || clusters.every(c => c.count === 1)) return null
  
  return (
    <>
      {clusters.filter(c => c.count > 1).map((cluster, i) => {
        // Determine cluster color based on average rating
        const clusterColor = cluster.avgRating >= 4.5 
          ? '#FFD700' // Gold for high-rated
          : cluster.avgRating >= 4.0 
            ? COLORS.amber 
            : COLORS.sky
        
        return (
          <Marker
            key={`cluster-${i}`}
            position={cluster.center}
            icon={L.divIcon({
              className: 'venue-cluster-marker',
              html: `
                <div class="venue-cluster" style="
                  width: ${Math.min(50 + cluster.count * 3, 70)}px;
                  height: ${Math.min(50 + cluster.count * 3, 70)}px;
                  background: linear-gradient(145deg, ${clusterColor} 0%, ${clusterColor}dd 100%);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: 800;
                  font-size: 16px;
                  color: white;
                  border: 3px solid white;
                  box-shadow: 
                    0 4px 20px rgba(0,0,0,0.3),
                    inset 0 2px 4px rgba(255,255,255,0.4);
                  cursor: pointer;
                  transition: transform 0.2s ease;
                  font-family: 'Inter', sans-serif;
                  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                ">
                  ${cluster.count}
                </div>
              `,
              iconSize: [Math.min(50 + cluster.count * 3, 70), Math.min(50 + cluster.count * 3, 70)],
              iconAnchor: [(Math.min(50 + cluster.count * 3, 70)) / 2, (Math.min(50 + cluster.count * 3, 70)) / 2],
            })}
            eventHandlers={{
              click: () => onClusterClick(cluster.center, currentZoom + 2)
            }}
          />
        )
      })}
    </>
  )
}

// Top Venue Badge Component - Enhanced with glow effect
function TopVenueBadge({ rating }: { rating: number }) {
  const badgeColor = rating >= 4.8 
    ? 'from-yellow-400 to-amber-500' 
    : rating >= 4.5 
      ? 'from-amber-400 to-orange-500'
      : 'from-orange-400 to-red-500'
  
  return (
    <div className={`
      absolute -top-2 -right-2 z-20
      w-7 h-7 rounded-full
      bg-gradient-to-br ${badgeColor}
      border-2 border-white
      flex items-center justify-center
      shadow-lg
      animate-pulse
    `}>
      <span className="text-white text-xs font-bold drop-shadow">★</span>
    </div>
  )
}

export default function VintageMap({ 
  locations, 
  selectedLocation, 
  onLocationSelect,
  selectedCategories,
  hotelsOn,
  eatOn,
  timeFilter,
  itinerary = [],
  showItineraryPath = false,
  showHeatmap = false
}: VintageMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([44.8175, 20.4617])
  const [mapZoom, setMapZoom] = useState(13)
  const [currentZoom, setCurrentZoom] = useState(13)
  
  const filteredLocations = useMemo(() => {
    return selectedCategories.length === 0
      ? locations
      : locations.filter(loc => selectedCategories.includes(loc.category?.slug || ''))
  }, [locations, selectedCategories])
  
  const visibleLocations = useMemo(() => {
    return [...filteredLocations]
      .sort((a, b) => {
        const priorityA = getMarkerPriority(a, currentZoom)
        const priorityB = getMarkerPriority(b, currentZoom)
        if (priorityA !== priorityB) return priorityA - priorityB
        return (b.rating || 0) - (a.rating || 0)
      })
  }, [filteredLocations, currentZoom])
  
  const shouldShowMarker = (location: Location) => {
    const priority = getMarkerPriority(location, currentZoom)
    return currentZoom >= priority
  }

  const itineraryPathPoints: [number, number][] = useMemo(() => {
    return itinerary.map(loc => [loc.latitude, loc.longitude])
  }, [itinerary])

  const handleLocationClick = (location: Location) => {
    onLocationSelect(location)
    setMapCenter([location.latitude, location.longitude])
    setMapZoom(16)
  }

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setMapCenter([pos.coords.latitude, pos.coords.longitude])
        setMapZoom(15)
      })
    }
  }

  // Handle cluster click - zoom in
  const handleClusterClick = (center: [number, number], zoom: number) => {
    setMapCenter(center)
    setMapZoom(Math.min(zoom, 18))
  }

  const zoomIn = () => setMapZoom(Math.min(mapZoom + 1, 19))
  const zoomOut = () => setMapZoom(Math.max(mapZoom - 1, 10))

  const itineraryCenter = useMemo(() => {
    if (itinerary.length >= 2 && showItineraryPath) {
      const lats = itinerary.map(l => l.latitude)
      const lngs = itinerary.map(l => l.longitude)
      const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
      const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2
      return [centerLat, centerLng] as [number, number]
    }
    return null
  }, [itinerary, showItineraryPath])
  
  const effectiveCenter = itineraryCenter || mapCenter
  const effectiveZoom = itineraryCenter ? 14 : mapZoom

  return (
    <div className="relative w-full h-full">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <button 
            onClick={zoomIn}
            className="w-10 h-10 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            +
          </button>
          <div className="h-px bg-gray-200" />
          <button 
            onClick={zoomOut}
            className="w-10 h-10 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            −
          </button>
        </div>
        
        <button 
          onClick={handleMyLocation}
          className="w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="My Location"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
          </svg>
        </button>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-xl shadow-lg px-3 py-2 border border-gray-200">
        <div className="text-xs text-gray-500">
          {showHeatmap ? (
            <span className="text-green-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Open Now Heatmap Active
            </span>
          ) : currentZoom < 14 ? (
            <span className="text-amber-600 font-medium">Showing top venues only • Zoom in for more</span>
          ) : currentZoom < 16 ? (
            <span className="text-gray-600">Showing popular venues • Zoom in for all</span>
          ) : (
            <span className="text-green-600">All venues visible</span>
          )}
        </div>
      </div>

      {/* Itinerary Path Info */}
      {showItineraryPath && itinerary.length >= 2 && (
        <div className="absolute top-4 left-4 z-[1000] bg-violet-500 text-white rounded-xl shadow-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">📍 Walking Route</span>
            <span className="text-xs opacity-80">{itinerary.length} stops</span>
          </div>
        </div>
      )}

      <MapContainer center={effectiveCenter} zoom={effectiveZoom} className="w-full h-full" zoomControl={false} attributionControl={false}>
        <TileLayer 
          url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
          attribution='© OpenStreetMap contributors © CARTO'
          maxZoom={19}
        />
        <MapController center={effectiveCenter} zoom={effectiveZoom} />
        <MapClickHandler onDeselect={() => onLocationSelect(null)} />
        <ZoomDisplay onZoomChange={setCurrentZoom} />
        
        {/* Open Now Heatmap */}
        <OpenNowHeatmap locations={locations} isVisible={showHeatmap} />
        
        {/* Venue Clusters at low zoom */}
        <VenueClusters 
          locations={filteredLocations} 
          currentZoom={currentZoom}
          onClusterClick={handleClusterClick}
        />
        
        {/* Animated walking path between itinerary venues */}
        <AnimatedPath points={itineraryPathPoints} isVisible={showItineraryPath && itinerary.length >= 2} />
        <WalkingAnimation points={itineraryPathPoints} isVisible={showItineraryPath && itinerary.length >= 2} />
        
        {visibleLocations.map((location) => {
          const isSelected = selectedLocation?.id === location.id
          const shouldShow = shouldShowMarker(location)
          const itineraryIndex = itinerary.findIndex(l => l.id === location.id)
          const isInItinerary = itineraryIndex !== -1
          const marker = createIconMarker(
            location, 
            isSelected, 
            currentZoom, 
            shouldShow, 
            hotelsOn, 
            eatOn, 
            locations, 
            timeFilter,
            isInItinerary,
            itineraryIndex !== -1 ? itineraryIndex + 1 : undefined
          )
          
          return (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={marker}
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.stopPropagation()
                  handleLocationClick(location)
                },
              }}
            >
              <Popup closeButton={false}>
                <div className="min-w-[220px] p-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-base text-gray-900">{location.name}</h4>
                    {(() => {
                      const score = calculateLifestyleScore(location, locations)
                      return <span className="text-amber-500 font-bold text-sm">✦ {score}</span>
                    })()}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{location.category?.name}</p>
                  
                  {(() => {
                    const walk = calculateWalkScore(location, locations)
                    return (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500 space-y-1">
                          {walk.nearestRestaurant && (
                            <div className="flex items-center gap-1">
                              <span className="text-emerald-500">•</span>
                              <span>{formatDistance(walk.nearestRestaurant.distance)} to restaurant</span>
                            </div>
                          )}
                          {walk.nearestHotel && (
                            <div className="flex items-center gap-1">
                              <span className="text-sky-500">•</span>
                              <span>{formatDistance(walk.nearestHotel.distance)} to hotel</span>
                            </div>
                          )}
                          <div className="flex gap-3 mt-1">
                            <span>{walk.diningSpots} dining</span>
                            <span>{walk.hotelSpots} hotels</span>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                  
                  <div className="flex items-center gap-3 mt-3">
                    {location.rating && (
                      <div className="flex items-center gap-1">
                        <span className="text-amber-500">★</span>
                        <span className="font-semibold">{location.rating}</span>
                      </div>
                    )}
                    {location.priceLevel !== null && location.priceLevel !== undefined && (
                      <span className="text-sm font-medium text-sky-600">
                        {['Free', '€', '€€', '€€€', '€€€€'][location.priceLevel]}
                      </span>
                    )}
                    {isOpenNow(location) && (
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        Open Now
                      </span>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          box-shadow: 0 8px 40px rgba(0,0,0,0.2) !important;
          padding: 0 !important;
          border: 1px solid rgba(0,0,0,0.05) !important;
        }
        
        .leaflet-popup-content {
          margin: 0 !important;
        }
        
        .leaflet-popup-tip {
          box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
        }
        
        .leaflet-popup-close-button {
          display: none !important;
        }
        
        .leaflet-control-attribution {
          display: none !important;
        }
        
        /* Premium Marker Hover Effects */
        .premium-marker {
          cursor: pointer !important;
        }
        
        .premium-marker:hover .map-icon {
          transform: rotate(-45deg) scale(1.15) !important;
          box-shadow: 
            0 12px 40px rgba(0,0,0,0.35),
            inset 0 2px 4px rgba(255,255,255,0.4) !important;
        }
        
        .premium-marker:hover .top-badge {
          transform: scale(1.2) !important;
        }
        
        /* Open Now Pulsing Animation */
        @keyframes open-now-pulse {
          0%, 100% { 
            box-shadow: 
              0 0 0 0 rgba(34, 197, 94, 0.4),
              0 8px 32px rgba(0,0,0,0.25),
              inset 0 2px 4px rgba(255,255,255,0.4);
          }
          50% { 
            box-shadow: 
              0 0 0 12px rgba(34, 197, 94, 0),
              0 12px 40px rgba(34, 197, 94, 0.3),
              inset 0 2px 4px rgba(255,255,255,0.4);
          }
        }
        
        .open-now-pulse {
          animation: open-now-pulse 2s ease-in-out infinite !important;
        }
        
        /* Top Venue Glow */
        .top-venue {
          box-shadow: 
            0 0 0 3px rgba(255, 215, 0, 0.3),
            0 8px 32px rgba(0,0,0,0.25),
            inset 0 2px 4px rgba(255,255,255,0.4) !important;
        }
        
        /* Selected Marker Glow */
        .selected {
          animation: selected-glow 1.5s ease-in-out infinite !important;
        }
        
        @keyframes selected-glow {
          0%, 100% { 
            filter: brightness(1);
          }
          50% { 
            filter: brightness(1.1);
          }
        }
        
        /* Legacy pulse animation for heatmap */
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 3px 14px rgba(0,0,0,0.25);
          }
          50% { 
            transform: scale(1.1);
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.6);
          }
        }
        
        /* Walking animation */
        @keyframes walk {
          0% { transform: rotate(var(--rotation, 0deg)) translateX(0); }
          50% { transform: rotate(var(--rotation, 0deg)) translateX(-2px); }
          100% { transform: rotate(var(--rotation, 0deg)) translateX(0); }
        }
        
        /* Floating label animation */
        @keyframes float-label {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        
        .marker-label {
          animation: float-label 2s ease-in-out infinite;
        }
        
        /* Itinerary badge bounce */
        @keyframes badge-bounce {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.1); }
        }
        
        .itinerary-badge {
          animation: badge-bounce 1.5s ease-in-out infinite;
        }
        
        /* Venue Cluster Styles */
        .venue-cluster-marker {
          cursor: pointer !important;
        }
        
        .venue-cluster-marker:hover .venue-cluster {
          transform: scale(1.15) !important;
          box-shadow: 
            0 8px 30px rgba(0,0,0,0.4),
            inset 0 2px 4px rgba(255,255,255,0.4) !important;
        }
        
        /* Cluster pulse animation */
        @keyframes cluster-pulse {
          0%, 100% { 
            box-shadow: 
              0 0 0 0 rgba(255, 215, 0, 0.4),
              0 4px 20px rgba(0,0,0,0.3);
          }
          50% { 
            box-shadow: 
              0 0 0 10px rgba(255, 215, 0, 0),
              0 6px 25px rgba(0,0,0,0.35);
          }
        }
        
        .venue-cluster {
          animation: cluster-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
