'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Search, MapPin, Utensils, Wine, Moon, Bed, Landmark, Grid, Map } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const categories = [
  { id: 'eat', label: 'Eat', icon: Utensils, color: '#FF6B35' },
  { id: 'drink', label: 'Drink', icon: Wine, color: '#8B5CF6' },
  { id: 'nightlife', label: 'Nightlife', icon: Moon, color: '#7C3AED' },
  { id: 'stay', label: 'Stay', icon: Bed, color: '#0EA5E9' },
  { id: 'visit', label: 'Visit', icon: Landmark, color: '#10B981' },
]

interface NavbarProps {
  viewMode: 'map' | 'grid'
  onViewModeChange: (mode: 'map' | 'grid') => void
  activeCategory: string | null
  onCategoryChange: (cat: string | null) => void
}

export default function Navbar({ viewMode, onViewModeChange, activeCategory, onCategoryChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeMega, setActiveMega] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <>
      {/* Main Navigation Bar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="bg-white shadow-lg border-b-4" style={{ borderColor: '#FF6600' }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3 cursor-pointer shrink-0"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-20 h-12 relative">
                <Image 
                  src="/logo.png" 
                  alt="Belgrade" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold font-body transition-all"
                  style={{ 
                    background: activeCategory === cat.id ? cat.color : 'transparent',
                    color: activeCategory === cat.id ? '#FFFFFF' : '#424143'
                  }}
                  onHoverStart={() => setActiveMega(cat.id)}
                  onHoverEnd={() => setActiveMega(null)}
                  onClick={() => onCategoryChange(activeCategory === cat.id ? null : cat.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <cat.icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* View Toggle - Desktop */}
              <div className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => onViewModeChange('map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'map' 
                      ? 'bg-white shadow text-gray-900' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  <span>Map</span>
                </button>
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow text-gray-900' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span>Grid</span>
                </button>
              </div>

              {/* Search */}
              <motion.div 
                className="hidden lg:flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl border-2"
                style={{ borderColor: '#FFC713' }}
                whileHover={{ scale: 1.02 }}
              >
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm w-40 placeholder:text-gray-400"
                />
              </motion.div>

              {/* CTA Button */}
              <motion.button
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm"
                style={{ background: '#FF6600' }}
                whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(255,102,0,0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                <MapPin className="w-4 h-4" />
                <span>Plan Trip</span>
              </motion.button>

              {/* Mobile Menu Toggle */}
              <motion.button
                className="lg:hidden p-2.5 rounded-xl"
                style={{ background: '#FFF8DC', border: '2px solid #FFC713' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" style={{ color: '#FF6600' }} />
                ) : (
                  <Menu className="w-5 h-5" style={{ color: '#FF6600' }} />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mega Menu */}
        <AnimatePresence>
          {activeMega && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="hidden lg:block absolute left-1/2 -translate-x-1/2 mt-1"
              onHoverStart={() => {}}
              onHoverEnd={() => setActiveMega(null)}
            >
              <div className="bg-white rounded-xl shadow-xl p-6 w-[450px] border-2" style={{ borderColor: '#FFC713' }}>
                {(() => {
                  const cat = categories.find(c => c.id === activeMega)
                  if (!cat) return null
                  return (
                    <div className="flex gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ background: `${cat.color}15` }}
                          >
                            <cat.icon className="w-6 h-6" style={{ color: cat.color }} />
                          </div>
                          <div>
                            <h3 className="font-bold font-display" style={{ color: '#424143' }}>{cat.label}</h3>
                            <p className="text-xs text-gray-500">Explore top spots</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600 hover:text-[#FF6600] cursor-pointer transition-colors font-body">
                            → Top rated spots
                          </div>
                          <div className="text-sm text-gray-600 hover:text-[#FF6600] cursor-pointer transition-colors font-body">
                            → Near me
                          </div>
                          <div className="text-sm text-gray-600 hover:text-[#FF6600] cursor-pointer transition-colors font-body">
                            → Open now
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl"
            >
              <div className="p-6 pt-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold font-display text-lg" style={{ color: '#424143' }}>Menu</h3>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                    <X className="w-5 h-5" style={{ color: '#424143' }} />
                  </button>
                </div>

                {/* Mobile Search */}
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl mb-6 border-2" style={{ borderColor: '#FFC713' }}>
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent outline-none flex-1 text-sm"
                  />
                </div>

                {/* View Toggle - Mobile */}
                <div className="flex items-center gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                  <button
                    onClick={() => { onViewModeChange('map'); setMobileMenuOpen(false) }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      viewMode === 'map' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    <Map className="w-4 h-4" />
                    Map
                  </button>
                  <button
                    onClick={() => { onViewModeChange('grid'); setMobileMenuOpen(false) }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      viewMode === 'grid' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    Grid
                  </button>
                </div>

                {/* Mobile Categories */}
                <div className="space-y-2">
                  {categories.map((cat, i) => (
                    <motion.button
                      key={cat.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => { onCategoryChange(activeCategory === cat.id ? null : cat.id); setMobileMenuOpen(false) }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl transition-all font-body font-semibold"
                      style={{ 
                        background: activeCategory === cat.id ? cat.color : '#FFF8DC',
                        color: activeCategory === cat.id ? '#FFFFFF' : '#424143',
                        border: `2px solid ${activeCategory === cat.id ? cat.color : '#FFC713'}`
                      }}
                    >
                      <cat.icon className="w-5 h-5" />
                      <span>{cat.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Mobile CTA */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-full mt-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                  style={{ background: '#FF6600' }}
                >
                  <MapPin className="w-5 h-5" />
                  <span>Plan My Trip</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
