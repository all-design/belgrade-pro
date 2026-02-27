// Custom Vintage Map Style Configuration
// This mimics the "printed tourist map" aesthetic with pastel colors

export const VINTAGE_MAP_STYLE = {
  // Base map tile layer - using CartoDB Positron for clean base
  // Alternative: Stamen Toner Lite, CartoDB Voyager
  tileLayer: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  },
  
  // Alternative vintage style tiles
  vintageTiles: {
    url: "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg",
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>',
    maxZoom: 18,
  },
};

// Map center coordinates for Belgrade
export const BELGRADE_CENTER: [number, number] = [44.787197, 20.457273];

// Default zoom level
export const DEFAULT_ZOOM = 13;

// Min/Max zoom levels
export const ZOOM_BOUNDS = {
  min: 11,
  max: 19,
};

// Map bounds (roughly Belgrade metropolitan area)
export const BELGRADE_BOUNDS: [[number, number], [number, number]] = [
  [44.65, 20.25], // Southwest
  [44.92, 20.65], // Northeast
];

// Color palette matching the vintage tourist map style
export const MAP_COLORS = {
  // Water colors (Sava, Danube)
  water: "#9CD2D8",
  waterDark: "#7BC4CC",
  
  // Land colors
  land: "#F3EFE0",
  landDark: "#E8E4D5",
  
  // Park/Nature colors
  park: "#C5E0B4",
  parkDark: "#A8D494",
  
  // Road colors
  road: "#FFFFFF",
  roadMain: "#FEFEFE",
  roadSecondary: "#F5F5F5",
  
  // Text colors
  textDark: "#5C5C5C",
  textLight: "#888888",
  
  // Border/Administrative
  border: "#D1D1D1",
  
  // Category marker colors
  categories: {
    attractions: "#E07B39",     // Warm orange for landmarks
    accommodation: "#4A90A4",   // Blue for hotels
    food: "#C73E3E",           // Red for restaurants
    nightlife: "#7B4B94",       // Purple for bars/clubs
    parks: "#4A9B4F",          // Green for parks
    museums: "#D4A84B",        // Gold for museums
    shopping: "#E86CA4",       // Pink for shopping
    transport: "#5C7C99",      // Steel blue for transport
  },
  
  // UI accents
  accent: "#B87333",          // Copper accent
  accentLight: "#CD853F",     // Peru
  highlight: "#FFD700",       // Gold for featured
  featured: "#B8860B",        // Dark golden rod
};

// Custom marker icons configuration
export const MARKER_ICONS = {
  attractions: {
    icon: "landmark",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
  },
  accommodation: {
    icon: "bed",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 22V8l9-6 9 6v14H3zm2-2h14V9l-7-4.5L5 9v11z"/></svg>`,
  },
  food: {
    icon: "utensils",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05l-5 2.18V1h-2v8.72l-5-2.18 1.66 16.49c.09.81.78 1.46 1.63 1.46h1.66L12 12.36l6.06 10.63z"/></svg>`,
  },
  nightlife: {
    icon: "wine",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/></svg>`,
  },
  parks: {
    icon: "tree",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L8 9h3l-4 8h5v5h2v-5h5l-4-8h3L12 2z"/></svg>`,
  },
  museums: {
    icon: "museum",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>`,
  },
  shopping: {
    icon: "shopping-bag",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2z"/></svg>`,
  },
  transport: {
    icon: "bus",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/></svg>`,
  },
};

// Famous Belgrade landmarks with coordinates
export const BELGRADE_LANDMARKS = [
  {
    id: "kalemegdan",
    name: "Kalemegdan Fortress",
    coordinates: [44.8225, 20.4514] as [number, number],
    description: "Historic fortress and park at the confluence of the Sava and Danube rivers",
  },
  {
    id: "saint-sava",
    name: "Saint Sava Temple",
    coordinates: [44.7983, 20.4683] as [number, number],
    description: "One of the largest Orthodox churches in the world",
  },
  {
    id: "republic-square",
    name: "Republic Square",
    coordinates: [44.8167, 20.4603] as [number, number],
    description: "Main city square with the National Museum and National Theatre",
  },
  {
    id: "skadarlija",
    name: "Skadarlija",
    coordinates: [44.8214, 20.4625] as [number, number],
    description: "Historic bohemian street with traditional restaurants",
  },
  {
    id: "ada-ciganlija",
    name: "Ada Ciganlija",
    coordinates: [44.7833, 20.4000] as [number, number],
    description: "Popular river island and recreational area",
  },
  {
    id: "knez-mihailova",
    name: "Knez Mihailova Street",
    coordinates: [44.8178, 20.4581] as [number, number],
    description: "Main pedestrian shopping street in Belgrade",
  },
  {
    id: "belgrade-waterfront",
    name: "Belgrade Waterfront",
    coordinates: [44.8119, 20.4489] as [number, number],
    description: "Modern waterfront development along the Sava River",
  },
  {
    id: "avalon-tower",
    name: "Avala Tower",
    coordinates: [44.6872, 20.5144] as [number, number],
    description: "Telecommunications tower with observation deck",
  },
];
