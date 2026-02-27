'use client'

import { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Location } from '@/lib/types'

// EXACT BRAND COLORS FROM BRIEF
const COLORS = {
  road: '#FFC713',
  water: '#26B9EC',
  land: '#FFD99C',
  park: '#94AB3B',
  label: '#424143',
  accent: '#FF6600',
}

// Priority levels for zoom-based visibility
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
}

// Get icon image based on category
const getCategoryIcon = (categorySlug: string, locationId: string): string => {
  if (locationId.includes('kalemegdan') || locationId.includes('fortress')) {
    return '/icons/landmark-fortress.png'
  }
  if (locationId.includes('hram') || locationId.includes('sava') || locationId.includes('temple')) {
    return '/icons/landmark-church.png'
  }
  if (locationId.includes('avala') || locationId.includes('tower')) {
    return '/icons/landmark-tower.png'
  }
  
  switch (categorySlug) {
    case 'landmarks': return '/icons/landmark-church.png'
    case 'food': return '/icons/food-restaurant.png'
    case 'accommodation': return '/icons/hotel-building.png'
    case 'nightlife': return '/icons/nightlife-bar.png'
    case 'nature': return '/icons/landmark-fortress.png'
    case 'museums': return '/icons/landmark-church.png'
    case 'bars': return '/icons/nightlife-bar.png'
    default: return '/icons/landmark-church.png'
  }
}

// Determine marker priority for zoom-based visibility
const getMarkerPriority = (location: Location): number => {
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

// Create marker with illustrated icon and label
const createIllustratedMarker = (location: Location, isSelected: boolean, currentZoom: number, shouldShow: boolean) => {
  const iconSize = isSelected ? 60 : 50
  const iconUrl = getCategoryIcon(location.category?.slug || '', location.id)
  const opacity = shouldShow ? 1 : 0.15
  const isPulsing = location.featured && location.rating && location.rating >= 4.7
  
  return L.divIcon({
    className: 'illustrated-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; opacity: ${opacity}; transition: opacity 0.3s ease;">
        <div style="
          background: white;
          padding: 3px 8px;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          margin-bottom: 4px;
          white-space: nowrap;
          font-family: 'Supersonic Rocketship', cursive;
          font-size: ${isSelected ? '13px' : '11px'};
          color: ${COLORS.label};
          font-weight: 600;
          border: 2px solid ${location.category?.color || COLORS.accent};
          letter-spacing: 0.3px;
        ">
          ${location.name}
        </div>
        
        <div style="
          width: ${iconSize}px;
          height: ${iconSize}px;
          position: relative;
          ${isSelected ? 'transform: scale(1.15);' : ''}
          ${isPulsing ? 'animation: pulse 2s infinite;' : ''}
        ">
          ${location.featured ? `
            <div style="
              position: absolute;
              top: -6px;
              right: -6px;
              width: 22px;
              height: 22px;
              background: ${COLORS.road};
              border-radius: 50%;
              border: 2px solid white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              color: white;
              font-weight: bold;
              z-index: 10;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            ">★</div>
          ` : ''}
          <img 
            src="${iconUrl}" 
            alt="${location.name}"
            style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.25));"
          />
        </div>
      </div>
    `,
    iconSize: [iconSize + 80, iconSize + 40],
    iconAnchor: [(iconSize + 80) / 2, iconSize + 35],
    popupAnchor: [0, -(iconSize + 45)],
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

export default function VintageMap({ 
  locations, 
  selectedLocation, 
  onLocationSelect,
  selectedCategories,
  hotelsOn,
  eatOn
}: VintageMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([44.8175, 20.4617])
  const [mapZoom, setMapZoom] = useState(13)
  const [currentZoom, setCurrentZoom] = useState(13)
  
  // Filter locations by categories
  const filteredLocations = useMemo(() => {
    return selectedCategories.length === 0
      ? locations
      : locations.filter(loc => selectedCategories.includes(loc.category?.slug || ''))
  }, [locations, selectedCategories])
  
  // Sort by priority
  const sortedLocations = useMemo(() => {
    return [...filteredLocations].sort((a, b) => {
      const priorityA = getMarkerPriority(a)
      const priorityB = getMarkerPriority(b)
      return priorityA - priorityB
    })
  }, [filteredLocations])
  
  const shouldShowMarker = (location: Location) => {
    const priority = getMarkerPriority(location)
    return currentZoom >= priority
  }

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

  const zoomIn = () => setMapZoom(Math.min(mapZoom + 1, 19))
  const zoomOut = () => setMapZoom(Math.max(mapZoom - 1, 10))

  return (
    <div className="relative w-full h-full">
      {/* Logo */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="bg-white rounded-xl shadow-xl border-2 p-2" style={{ borderColor: COLORS.accent }}>
          <img 
            src="/logo.png" 
            alt="Belgrade" 
            className="h-10 object-contain"
          />
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-20 right-4 z-[1000] flex flex-col gap-2">
        <div className="bg-white rounded-xl shadow-lg border-2 overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
          <button 
            onClick={zoomIn}
            className="w-10 h-10 flex items-center justify-center text-lg font-bold hover:bg-gray-50 transition-colors"
            style={{ color: COLORS.accent }}
          >
            +
          </button>
          <div className="h-px bg-gray-200" />
          <button 
            onClick={zoomOut}
            className="w-10 h-10 flex items-center justify-center text-lg font-bold hover:bg-gray-50 transition-colors"
            style={{ color: COLORS.accent }}
          >
            −
          </button>
        </div>
        
        <button 
          onClick={handleMyLocation}
          className="w-10 h-10 bg-white rounded-xl shadow-lg border-2 flex items-center justify-center hover:bg-gray-50 transition-colors"
          style={{ borderColor: '#E5E5E5' }}
          title="My Location"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={COLORS.accent} strokeWidth={2}>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
          </svg>
        </button>
      </div>

      {/* Compass */}
      <div className="absolute bottom-28 right-5 z-[1000]">
        <div className="w-14 h-14 rounded-full shadow-lg border-3 flex items-center justify-center" style={{ background: 'white', borderColor: COLORS.accent }}>
          <div className="text-center">
            <span className="text-base font-bold font-display" style={{ color: COLORS.label }}>N</span>
            <div className="w-0.5 h-1.5 mx-auto mt-0.5" style={{ background: COLORS.accent }} />
          </div>
        </div>
      </div>

      {/* Scale */}
      <div className="absolute bottom-28 left-5 z-[1000]">
        <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg border-2" style={{ borderColor: COLORS.road }}>
          <div className="flex items-center gap-2 text-xs font-semibold font-body" style={{ color: COLORS.label }}>
            <div className="flex">
              <div className="w-3 h-0.5" style={{ background: COLORS.label }} />
              <div className="w-3 h-0.5" style={{ background: 'white', border: `0.5px solid ${COLORS.label}` }} />
              <div className="w-3 h-0.5" style={{ background: COLORS.label }} />
            </div>
            <span>500m</span>
          </div>
        </div>
      </div>

      <MapContainer center={mapCenter} zoom={mapZoom} className="w-full h-full" style={{ background: COLORS.land }} zoomControl={false} attributionControl={false}>
        {/* CartoDB Positron tiles - English labels, clean style */}
        <TileLayer 
          url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
          attribution='© OpenStreetMap contributors © CARTO'
          maxZoom={19}
        />
        <MapController center={mapCenter} zoom={mapZoom} />
        <MapClickHandler onDeselect={() => onLocationSelect(null)} />
        <ZoomDisplay onZoomChange={setCurrentZoom} />
        
        {sortedLocations.map((location) => {
          const isSelected = selectedLocation?.id === location.id
          const shouldShow = shouldShowMarker(location)
          const marker = createIllustratedMarker(location, isSelected, currentZoom, shouldShow)
          
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
                <div className="min-w-[180px] p-1">
                  <h4 className="font-bold text-sm font-display" style={{ color: COLORS.label }}>
                    {location.name}
                  </h4>
                  <p className="text-xs mt-1 font-body font-medium" style={{ color: location.category?.color || COLORS.accent }}>
                    {location.category?.name}
                  </p>
                  {location.shortDesc && (
                    <p className="text-xs mt-2 font-body" style={{ color: '#666' }}>{location.shortDesc}</p>
                  )}
                  {location.rating && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-base" style={{ color: COLORS.road }}>★</span>
                      <span className="font-bold text-sm font-body" style={{ color: COLORS.accent }}>{location.rating}</span>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      <style jsx global>{`
        .leaflet-tile {
          filter: 
            brightness(1.05)
            contrast(0.95);
        }
        
        .leaflet-container {
          background: #FFD99C !important;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          border: 2px solid #FF6600 !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2) !important;
        }
        
        .leaflet-popup-tip {
          border: 2px solid #FF6600 !important;
        }
        
        .leaflet-popup-close-button {
          display: none !important;
        }
        
        .leaflet-control-attribution {
          display: none !important;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>
    </div>
  )
}
