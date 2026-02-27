/**
 * Vintage/Retro Map Styles for Belgrade Tourist Guide
 * 
 * This configuration creates a "printed map" aesthetic with:
 * - Pastel water colors (light blue)
 * - Cream/beige land background
 * - Soft green parks
 * - White/clean roads
 * - Minimal visual noise
 */

export const vintageMapStyle: Array<{
  featureType?: string;
  elementType?: string;
  stylers: Record<string, unknown>[];
}> = [
  // Water - Pastel light blue
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      { color: "#9CD2D8" },
      { lightness: 10 }
    ]
  },
  // Water labels - hidden
  {
    featureType: "water",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  },
  // Landscape - Cream/beige background
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [
      { color: "#F3EFE0" }
    ]
  },
  // Landscape - Man made structures
  {
    featureType: "landscape.man_made",
    elementType: "geometry",
    stylers: [
      { color: "#F0EDE0" }
    ]
  },
  // Parks - Soft green
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      { color: "#C5E0B4" },
      { lightness: 5 }
    ]
  },
  // Natural areas
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [
      { color: "#D8E8CE" }
    ]
  },
  // Roads - White clean lines
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      { color: "#FFFFFF" },
      { visibility: "simplified" }
    ]
  },
  // Highway roads
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      { color: "#FEFEFE" },
      { weight: 1.5 }
    ]
  },
  // Arterial roads
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      { color: "#F8F8F0" }
    ]
  },
  // Local roads
  {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [
      { color: "#F5F5F0" }
    ]
  },
  // Road labels text
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      { color: "#5C5C5C" },
      { weight: 0.5 }
    ]
  },
  // Road labels stroke
  {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [
      { color: "#FFFFFF" },
      { weight: 2 }
    ]
  },
  // Hide default POI markers
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  },
  // Hide POI icons
  {
    featureType: "poi",
    elementType: "icons",
    stylers: [
      { visibility: "off" }
    ]
  },
  // Transit - hidden for clean look
  {
    featureType: "transit",
    elementType: "all",
    stylers: [
      { visibility: "off" }
    ]
  },
  // Administrative boundaries
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [
      { color: "#D1D1D1" },
      { weight: 1.5 }
    ]
  },
  // Administrative labels
  {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [
      { color: "#4A4A4A" },
      { weight: 0.5 }
    ]
  },
  // Country boundaries
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [
      { color: "#A0A0A0" },
      { weight: 2 }
    ]
  },
  // Locality labels (city names)
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      { color: "#3D3D3D" },
      { weight: 1 }
    ]
  },
  // Neighborhood labels
  {
    featureType: "administrative.neighborhood",
    elementType: "labels",
    stylers: [
      { visibility: "on" },
      { weight: 0.3 }
    ]
  },
  // Building - subtle
  {
    featureType: "building",
    elementType: "geometry",
    stylers: [
      { color: "#E8E4D8" }
    ]
  },
  // Land parcel lines
  {
    featureType: "landscape",
    elementType: "geometry.stroke",
    stylers: [
      { visibility: "off" }
    ]
  }
];

// Leaflet TileLayer options for vintage style
export const leafletVintageOptions = {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19,
  className: 'vintage-map-tiles'
};

// Custom Leaflet CSS filter for vintage look
export const vintageMapFilter = `
  .vintage-map-tiles {
    filter: 
      sepia(15%) 
      saturate(85%) 
      brightness(105%) 
      hue-rotate(-5deg);
  }
`;

// Belgrade center coordinates
export const BELGRADE_CENTER: [number, number] = [44.787197, 20.457273];
export const DEFAULT_ZOOM = 13;
export const MIN_ZOOM = 11;
export const MAX_ZOOM = 18;

// Color palette matching the vintage design
export const VINTAGE_COLORS = {
  water: "#9CD2D8",
  land: "#F3EFE0",
  parks: "#C5E0B4",
  roads: "#FFFFFF",
  text: "#5C5C5C",
  border: "#D1D1D1",
  accent: "#D4A574", // Warm accent color
  secondary: "#7BA3A8", // Secondary teal
} as const;

// Category colors for markers
export const CATEGORY_COLORS: Record<string, string> = {
  landmarks: "#D4A574", // Warm gold for landmarks
  accommodation: "#7BA3A8", // Teal for hotels
  food: "#E8B86D", // Orange for restaurants
  nightlife: "#9B7EBD", // Purple for nightlife
  attractions: "#6B9E78", // Green for attractions
  transport: "#B8A090", // Brown for transport
  shopping: "#C47B7B", // Rose for shopping
  museums: "#6B8CAE", // Blue for museums
};
