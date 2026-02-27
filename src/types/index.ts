// Types for Belgrade Tourist Guide

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description?: string | null;
  locations?: Location[];
  createdAt?: Date;
  updatedAt?: Date;
}

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
  featured?: boolean;
  verified?: boolean;
  categoryId: string;
  category?: Category;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  tags?: string | null;
  published?: boolean;
  publishedAt?: Date | null;
  locationId?: string | null;
  location?: Location | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MapStyle {
  featureType?: string;
  elementType?: string;
  stylers: Array<{
    color?: string;
    visibility?: string;
    weight?: number;
    lightness?: number;
    saturation?: number;
    hue?: string;
    gamma?: number;
    invert_lightness?: boolean;
  }>;
}

export interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  name: string;
  category: string;
  color: string;
  featured: boolean;
}

export interface FilterState {
  categories: string[];
  searchTerm: string;
  featured: boolean;
  priceRange: [number, number];
}
