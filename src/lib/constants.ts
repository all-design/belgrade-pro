// Map Custom Styles - Vintage/Retro Tourist Map Theme
// Inspired by printed tourist maps with pastel colors

export const MAP_STYLES = {
  // Vintage color palette extracted from typical tourist maps
  colors: {
    water: '#9CD2D8',        // Pastel blue for rivers/lakes
    waterHover: '#7BC4CC',
    land: '#F3EFE0',         // Cream/beige for land (paper-like)
    landHover: '#EDE9D8',
    park: '#C5E0B4',         // Light green for parks
    parkHover: '#B8D6A6',
    road: '#FFFFFF',         // White roads
    roadOutline: '#E0DCD0',  // Subtle road borders
    highway: '#FEFEFE',
    text: '#5C5C5C',         // Dark gray for text
    textHighlight: '#333333',
    border: '#D1D1D1',       // Light gray borders
    accent: '#D4A574',       // Warm accent (bronze/copper)
    accentHover: '#C9956A',
  },
  
  // Custom marker icons (SVG paths)
  markers: {
    landmark: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
    restaurant: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>`,
    hotel: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg>`,
    nightlife: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>`,
    attraction: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`,
    transport: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-6H6V6h5v5zm2 0V6h5v5h-5zm3.5 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>`,
    nature: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h2L12 2 5.05 12H7l-3.9 6h9.9v4h2v-4h9.9L17 12z"/></svg>`,
    shopping: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z"/></svg>`,
  }
};

// Category colors for markers
export const CATEGORY_COLORS: Record<string, string> = {
  landmarks: '#D4A574',     // Bronze/copper for landmarks
  restaurants: '#E07B54',   // Warm orange for food
  hotels: '#6B8E7B',        // Sage green for accommodation
  nightlife: '#7B6B9E',     // Purple for nightlife
  attractions: '#4A90A4',   // Teal for attractions
  transport: '#8B7355',     // Brown for transport
  nature: '#6B9E6B',        // Green for nature/parks
  shopping: '#A4856B',      // Tan for shopping
};

// Belgrade center coordinates
export const BELGRADE_CENTER: [number, number] = [44.787197, 20.457273];

// Default map zoom levels
export const MAP_ZOOM = {
  default: 13,
  min: 11,
  max: 18,
  city: 12,
  neighborhood: 15,
  street: 17,
};

// Price level labels
export const PRICE_LEVELS = {
  1: 'Budget-friendly',
  2: 'Moderate',
  3: 'Upscale',
  4: 'Luxury',
};

// Rating thresholds
export const RATING_THRESHOLDS = {
  excellent: 4.5,
  veryGood: 4.0,
  good: 3.5,
  average: 3.0,
};
