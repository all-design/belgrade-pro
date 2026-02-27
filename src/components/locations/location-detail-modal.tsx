'use client'

import { MapPin, Star, Clock, Phone, Globe, ExternalLink, X, Bookmark, Share2, Calendar } from 'lucide-react'
import { Location } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface LocationDetailModalProps {
  location: Location | null
  open: boolean
  onClose: () => void
}

export default function LocationDetailModal({ location, open, onClose }: LocationDetailModalProps) {
  if (!location) return null

  const priceLevelDisplay = location.priceLevel ? '€'.repeat(location.priceLevel) : 'Free'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-2" style={{ background: '#FFFFFF', borderColor: '#FF6600' }}>
        <div className="relative pt-2">
          <Badge className="absolute top-0 left-0 z-10 font-body" style={{ backgroundColor: location.category.color }}>
            {location.category.name}
          </Badge>
          
          {location.featured && (
            <Badge variant="outline" className="absolute top-0 right-10 z-10 font-body" style={{ background: '#FFF8DC', color: '#FF6600', borderColor: '#FFC713' }}>
              ★ Recommended
            </Badge>
          )}
        </div>

        <DialogHeader className="mt-8">
          <DialogTitle className="text-2xl font-bold font-display" style={{ color: '#424143' }}>
            {location.name}
          </DialogTitle>
          {location.shortDesc && <p className="mt-2 font-body" style={{ color: '#666' }}>{location.shortDesc}</p>}
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Stats row */}
          <div className="flex flex-wrap gap-4">
            {location.rating && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: '#FFF8DC' }}>
                <Star className="w-5 h-5 fill-yellow-500" style={{ color: '#FFC713' }} />
                <span className="font-bold font-body" style={{ color: '#FF6600' }}>{location.rating}</span>
                <span className="text-sm font-body" style={{ color: '#666' }}>/ 5</span>
              </div>
            )}
            
            {location.priceLevel !== null && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: '#F0F7F0' }}>
                <span className="font-semibold font-body" style={{ color: '#94AB3B' }}>{priceLevelDisplay}</span>
                <span className="text-sm font-body" style={{ color: '#6B8B5A' }}>{location.priceLevel === 0 ? 'entry' : 'price level'}</span>
              </div>
            )}
            
            {location.verified && (
              <Badge variant="outline" className="font-body" style={{ background: '#E8F4F8', color: '#26B9EC', borderColor: '#26B9EC' }}>
                ✓ Verified
              </Badge>
            )}
          </div>

          {/* Description */}
          <div className="rounded-xl p-5 border-2" style={{ background: '#FFF8DC', borderColor: '#FFC713' }}>
            <h4 className="font-bold font-display mb-3" style={{ color: '#424143' }}>About</h4>
            <div className="text-sm whitespace-pre-line leading-relaxed font-body" style={{ color: '#424143' }}>
              {location.description}
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {location.address && (
              <div className="flex items-start gap-3 p-4 rounded-xl border-2" style={{ background: '#FFFFFF', borderColor: '#FFC713' }}>
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#26B9EC' }} />
                <div>
                  <p className="text-xs mb-1 font-body" style={{ color: '#666' }}>Address</p>
                  <p className="text-sm font-medium font-body" style={{ color: '#424143' }}>{location.address}</p>
                </div>
              </div>
            )}
            
            {location.openingHours && (
              <div className="flex items-start gap-3 p-4 rounded-xl border-2" style={{ background: '#FFFFFF', borderColor: '#FFC713' }}>
                <Clock className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#26B9EC' }} />
                <div>
                  <p className="text-xs mb-1 font-body" style={{ color: '#666' }}>Opening Hours</p>
                  <p className="text-sm font-medium font-body" style={{ color: '#424143' }}>{location.openingHours}</p>
                </div>
              </div>
            )}
            
            {location.phone && (
              <div className="flex items-start gap-3 p-4 rounded-xl border-2" style={{ background: '#FFFFFF', borderColor: '#FFC713' }}>
                <Phone className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#26B9EC' }} />
                <div>
                  <p className="text-xs mb-1 font-body" style={{ color: '#666' }}>Phone</p>
                  <p className="text-sm font-medium font-body" style={{ color: '#424143' }}>{location.phone}</p>
                </div>
              </div>
            )}
            
            {location.website && (
              <div className="flex items-start gap-3 p-4 rounded-xl border-2" style={{ background: '#FFFFFF', borderColor: '#FFC713' }}>
                <Globe className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#26B9EC' }} />
                <div>
                  <p className="text-xs mb-1 font-body" style={{ color: '#666' }}>Website</p>
                  <a href={location.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium underline font-body" style={{ color: '#FF6600' }}>
                    Visit Website
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t-2" style={{ borderColor: '#FFC713' }}>
            {location.bookingUrl && (
              <Button className="text-white font-body" style={{ background: '#FF6600' }} asChild>
                <a href={location.bookingUrl} target="_blank" rel="noopener noreferrer">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now
                </a>
              </Button>
            )}
            
            {location.website && (
              <Button variant="outline" className="border-2 font-body" style={{ borderColor: '#FFC713', color: '#424143' }} asChild>
                <a href={location.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Website
                </a>
              </Button>
            )}
            
            <Button variant="ghost" className="font-body" style={{ color: '#666' }}>
              <Bookmark className="w-4 h-4 mr-2" />
              Save
            </Button>
            
            <Button variant="ghost" className="font-body" style={{ color: '#666' }}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Map coordinates */}
          <div className="rounded-xl p-3 flex items-center justify-between border-2" style={{ background: '#FFF8DC', borderColor: '#FFC713' }}>
            <div className="text-xs font-body" style={{ color: '#666' }}>
              <span className="font-semibold">Coordinates:</span> {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </div>
            <Button size="sm" variant="ghost" className="text-xs font-body" style={{ color: '#FF6600' }} onClick={() => {
              window.open(`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`, '_blank')
            }}>
              <MapPin className="w-3 h-3 mr-1" />
              Open in Google Maps
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
