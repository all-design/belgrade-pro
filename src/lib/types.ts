// Type definitions for Belgrade Tourist Guide

export interface Location {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string | null;
  address?: string | null;
  latitude: number;
  longitude: number;
  images?: string | null;
  rating?: number | null;
  priceLevel?: number | null;
  phone?: string | null;
  website?: string | null;
  bookingUrl?: string | null;
  openingHours?: string | null;
  featured: boolean;
  verified: boolean;
  categoryId: string;
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description?: string | null;
  locations?: Location[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  tags?: string | null;
  published: boolean;
  publishedAt?: Date | null;
  locationId?: string | null;
  location?: Location | null;
  createdAt: Date;
  updatedAt: Date;
}

// Map marker interface
export interface MapMarker {
  id: string;
  position: [number, number];
  name: string;
  category: string;
  color: string;
  icon: string;
  featured?: boolean;
}

// Filter state
export interface FilterState {
  categories: string[];
  search: string;
  featured: boolean;
  rating?: number;
}

// API response types
export interface LocationsResponse {
  locations: Location[];
  total: number;
}

export interface CategoriesResponse {
  categories: Category[];
}

// Location detail with related locations
export interface LocationDetail extends Location {
  nearbyLocations?: Location[];
  relatedPosts?: BlogPost[];
}

// Price level display
export const PRICE_LEVELS: Record<number, { label: string; symbol: string }> = {
  1: { label: "Budget-friendly", symbol: "$" },
  2: { label: "Moderate", symbol: "$$" },
  3: { label: "Upscale", symbol: "$$$" },
  4: { label: "Fine dining", symbol: "$$$$" },
};

// Booking.com affiliate params
export interface BookingParams {
  location: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

// Geocoding result
export interface GeocodingResult {
  lat: number;
  lng: number;
  display_name: string;
  type: string;
}
