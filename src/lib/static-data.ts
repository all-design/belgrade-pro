// Static data for Vercel serverless deployment
// SQLite database doesn't work on Vercel, so we use static data

import { Location, Category } from './types'

export const staticCategories: Category[] = [
  {
    id: "cat-accommodation",
    name: "Hotels & Accommodation",
    slug: "accommodation",
    icon: "bed",
    color: "#3498DB",
    description: "Best hotels, hostels and apartments in Belgrade",
    createdAt: "2026-02-20T19:41:22.964Z",
    updatedAt: "2026-02-20T19:41:22.964Z",
    _count: { locations: 18 }
  },
  {
    id: "cat-food",
    name: "Restaurants & Dining",
    slug: "food",
    icon: "utensils",
    color: "#E74C3C",
    description: "Traditional Serbian cuisine and international restaurants",
    createdAt: "2026-02-20T19:41:22.965Z",
    updatedAt: "2026-02-20T19:41:22.965Z",
    _count: { locations: 25 }
  },
  {
    id: "cat-landmark",
    name: "Landmarks & Attractions",
    slug: "landmarks",
    icon: "landmark",
    color: "#FF6B35",
    description: "Historical monuments and must-see attractions",
    createdAt: "2026-02-20T19:41:22.963Z",
    updatedAt: "2026-02-20T19:41:22.963Z",
    _count: { locations: 35 }
  },
  {
    id: "cat-museum",
    name: "Museums & Galleries",
    slug: "museums",
    icon: "museum",
    color: "#2980B9",
    description: "Art, history and science museums",
    createdAt: "2026-02-20T19:41:22.969Z",
    updatedAt: "2026-02-20T19:41:22.969Z",
    _count: { locations: 20 }
  },
  {
    id: "cat-nature",
    name: "Parks & Nature",
    slug: "nature",
    icon: "tree",
    color: "#94AB3B",
    description: "Green spaces, rivers and recreational areas",
    createdAt: "2026-02-20T19:41:22.968Z",
    updatedAt: "2026-02-20T19:41:22.968Z",
    _count: { locations: 15 }
  },
  {
    id: "cat-nightlife",
    name: "Nightlife & Bars",
    slug: "nightlife",
    icon: "wine",
    color: "#9B59B6",
    description: "Clubs, bars and floating river clubs (splavovi)",
    createdAt: "2026-02-20T19:41:22.967Z",
    updatedAt: "2026-02-20T19:41:22.967Z",
    _count: { locations: 22 }
  }
]

// Category fallback images mapping
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  "cat-landmark": "/images/locations/kalemegdan.jpg",
  "cat-museum": "/images/locations/tesla-museum.jpg",
  "cat-food": "/images/locations/skadarlija.jpg",
  "cat-nightlife": "/images/locations/river-clubs.jpg",
  "cat-nature": "/images/locations/ada-ciganlija.jpg",
  "cat-accommodation": "/images/locations/hotel-moskva.jpg",
}

// Known existing images (will check file existence)
const EXISTING_IMAGES = new Set([
  "kalemegdan", "saint-sava", "tesla-museum", "skadarlija", "ada-ciganlija",
  "avala-tower", "republic-square", "knez-mihailova", "river-clubs",
  "hotel-moskva", "square-nine-hotel", "national-museum", "strahinjica-bana",
  "frans-restaurant", "zavicaj-restaurant", "kosutnjak", "usce-park"
])

// Helper function to create location objects
const createLocation = (
  id: string,
  name: string,
  slug: string,
  description: string,
  shortDesc: string,
  address: string,
  latitude: number,
  longitude: number,
  categoryId: string,
  options: {
    rating?: number
    priceLevel?: number
    phone?: string
    website?: string
    featured?: boolean
    verified?: boolean
    openingHours?: string
    imageOverride?: string
  } = {}
): Location => {
  // Determine image: use override, existing specific image, or category fallback
  let imageUrl: string
  if (options.imageOverride) {
    imageUrl = options.imageOverride
  } else if (EXISTING_IMAGES.has(slug)) {
    imageUrl = `/images/locations/${slug}.jpg`
  } else {
    imageUrl = CATEGORY_FALLBACK_IMAGES[categoryId] || "/images/locations/kalemegdan.jpg"
  }

  return {
    id,
    name,
    slug,
    description,
    shortDesc,
    address,
    latitude,
    longitude,
    images: `["${imageUrl}"]`,
  rating: options.rating ?? 4.0,
  priceLevel: options.priceLevel ?? 0,
  phone: options.phone ?? null,
  website: options.website ?? null,
  bookingUrl: null,
  openingHours: options.openingHours ?? null,
  featured: options.featured ?? false,
  verified: options.verified ?? true,
  categoryId,
  createdAt: "2026-02-20T19:41:22.970Z",
  updatedAt: "2026-02-20T19:41:22.970Z",
  category: staticCategories.find(c => c.id === categoryId)
  }
}

// ============================================
// LANDMARKS & ATTRACTIONS (35 locations)
// ============================================
const landmarkLocations: Location[] = [
  createLocation(
    "loc-kalemegdan",
    "Belgrade Fortress (Kalemegdan)",
    "kalemegdan",
    `Belgrade Fortress, also known as Kalemegdan, is the crown jewel of Belgrade's cultural heritage. Perched at the confluence of the Sava and Danube rivers, this magnificent fortress has witnessed over 2,000 years of history.

**Highlights inside the fortress:**
• The Victor Monument (Pobednik) - Iconic symbol of Belgrade
• Sahat Kula (Clock Tower) - Ottoman-era tower
• Roman Well - Mysterious ancient structure
• Ružica Church - Beautiful Orthodox chapel
• Military Museum - Extensive collection of weapons and artifacts
• Zindan and Istanbul Gates - Impressive Ottoman gateways

The fortress offers breathtaking panoramic views of New Belgrade, the rivers, and the Pannonian Plain.`,
    "Ancient fortress with stunning river views and 2000 years of history",
    "Kalemegdan Park, Belgrade",
    44.8227,
    20.4512,
    "cat-landmark",
    { rating: 4.8, featured: true, openingHours: '{"open":"06:00","close":"00:00","note":"Park open 24/7"}' }
  ),
  createLocation(
    "loc-hram-save",
    "Saint Sava Temple",
    "saint-sava",
    `The Temple of Saint Sava is the largest Orthodox church in the Balkans and one of the largest Orthodox churches in the world. This magnificent Serbian-Byzantine masterpiece dominates Belgrade's skyline with its 70-meter tall dome.

**Key facts:**
• Construction began in 1935, completed in 2004
• Can accommodate 10,000 worshippers
• The golden dome weighs 4,000 tons
• Crypt features stunning gold mosaics covering 1,500 m²

The interior is breathtaking, with marble floors, intricate frescoes, and a spiritual atmosphere.`,
    "The largest Orthodox church in the Balkans",
    "Krušedolska 2a, Vračar, Belgrade",
    44.7936,
    20.4694,
    "cat-landmark",
    { rating: 4.9, featured: true, openingHours: '{"open":"07:00","close":"20:00"}' }
  ),
  createLocation(
    "loc-avala",
    "Avala Tower",
    "avala-tower",
    `Avala Tower stands as a symbol of Belgrade's resilience. Rising 204.5 meters from Mount Avala, this unique TV tower is the only tower in the world with an eccentric base (not centered).

**History:**
• Original tower built in 1965, destroyed in 1999 NATO bombing
• Rebuilt and opened in 2010 as a symbol of Serbian determination

**Visitor information:**
• Observation deck at 115m height
• Panoramic restaurant
• Elevator access`,
    "Iconic TV tower with panoramic views of Belgrade",
    "Mount Avala, Belgrade",
    44.6872,
    20.5164,
    "cat-landmark",
    { rating: 4.6, priceLevel: 1, featured: true, openingHours: '{"open":"09:00","close":"20:00"}' }
  ),
  createLocation(
    "loc-knez-mihailova",
    "Knez Mihailova Street",
    "knez-mihailova",
    `Knez Mihailova Street is Belgrade's main pedestrian thoroughfare and one of the city's most valuable cultural-historical areas. This lively street connects Terazije Square to Kalemegdan Fortress.

**What you'll find:**
• International and Serbian fashion brands
• Historic buildings with architectural significance
• Outdoor cafés and restaurants
• Street performers and artists
• Bookstores and art galleries`,
    "Main pedestrian shopping street in the city center",
    "Knez Mihailova Street, Belgrade",
    44.8158,
    20.4565,
    "cat-landmark",
    { rating: 4.4, priceLevel: 2, featured: true }
  ),
  createLocation(
    "loc-republic-square",
    "Republic Square (Trg Republike)",
    "republic-square",
    `Republic Square is the central square of Belgrade and the most popular meeting point in the city. Dominated by the iconic equestrian statue of Prince Mihailo Obrenović.

**Key landmarks:**
• Prince Mihailo Monument - Meeting point for locals
• National Museum of Serbia
• National Theater

**Popular with locals:**
"Vidimo se kod konja!" ("See you at the horse!") is the most common phrase for arranging meetings here.`,
    "Central square with iconic Prince Mihailo monument",
    "Republic Square, Belgrade",
    44.8135,
    20.4603,
    "cat-landmark",
    { rating: 4.3, featured: true }
  ),
  createLocation(
    "loc-belgrade-zoo",
    "Belgrade Zoo",
    "belgrade-zoo",
    `Belgrade Zoo, also known as "Garden of Good Hope," is located within Kalemegdan Fortress. Home to over 200 species and 2,000 animals.

**Highlights:**
• White lions and white tigers
• Hippo named "Beba" - the zoo's mascot for decades
• Aquarium with exotic fish
• Snake farm
• Petting zoo for children`,
    "Zoo within Kalemegdan Fortress with 200+ species",
    "Kalemegdan Park, Belgrade",
    44.8220,
    20.4505,
    "cat-landmark",
    { rating: 4.2, priceLevel: 1, openingHours: '{"open":"08:00","close":"16:00"}' }
  ),
  createLocation(
    "loc-belgrade-waterfront",
    "Belgrade Waterfront",
    "belgrade-waterfront",
    `Belgrade Waterfront is a major urban renewal development along the Sava River. This modern district features luxury residences, hotels, restaurants, and the iconic Belgrade Tower.

**Features:**
• Belgrade Tower - 168m landmark skyscraper
• Galerija shopping mall
• Sava Park
• Riverside promenade
• Luxury restaurants and cafés`,
    "Modern riverside development with tower and shopping",
    "Sava Riverbank, Savamala, Belgrade",
    44.8065,
    20.4489,
    "cat-landmark",
    { rating: 4.4, priceLevel: 3, featured: true }
  ),
  createLocation(
    "loc-pobednik",
    "Victor Monument (Pobednik)",
    "pobednik-monument",
    `The Victor Monument is the most iconic symbol of Belgrade. This bronze sculpture by Ivan Meštrović stands at the Upper Town of Belgrade Fortress, overlooking the confluence of the Sava and Danube rivers.

**History:**
• Created in 1913 to celebrate Serbian victories
• Originally planned for Kalemegdan
• Has become THE symbol of Belgrade`,
    "Iconic bronze monument symbolizing Belgrade",
    "Kalemegdan Upper Town, Belgrade",
    44.8225,
    20.4500,
    "cat-landmark",
    { rating: 4.8 }
  ),
  createLocation(
    "loc-tasmajdan",
    "Tašmajdan Park",
    "tasmajdan-park",
    `Tašmajdan Park is one of Belgrade's central parks featuring sports facilities, a church, and entertainment venues.

**Features:**
• Church of Saint Mark
• Tašmajdan Sports Center with pools
• Children's playgrounds
• Walking paths
• Cafés`,
    "Central park with sports center and St. Mark Church",
    "Bulevar kralja Aleksandra, Belgrade",
    44.8083,
    20.4703,
    "cat-landmark",
    { rating: 4.3 }
  ),
  createLocation(
    "loc-topcider",
    "Topčider Park",
    "topcider-park",
    `Topčider is a historic park and former royal estate in Belgrade, known for its beautiful greenery and historical buildings.

**Highlights:**
• Milošev Konak (Miloš's Residence) - 19th century palace
• Church of the Holy Apostles Peter and Paul
• The famous Topčider plane tree (over 150 years old)
• Restaurant "Mladost"`,
    "Historic park with royal residence and old church",
    "Topčider, Savski Venac, Belgrade",
    44.7856,
    20.4556,
    "cat-landmark",
    { rating: 4.4 }
  ),
  createLocation(
    "loc-old-palace",
    "Old Palace (Stari Dvor)",
    "old-palace",
    `The Old Palace was the royal residence of the Obrenović dynasty. Built in 1884, it now houses the City Assembly of Belgrade.

**Architecture:**
• Academism style with Renaissance elements
• Beautifully preserved interior
• Part of the Royal Compound`,
    "Former royal residence, now City Assembly building",
    "Kralja Milana 1, Belgrade",
    44.8108,
    20.4600,
    "cat-landmark",
    { rating: 4.3 }
  ),
  createLocation(
    "loc-new-palace",
    "New Palace (Novi Dvor)",
    "new-palace",
    `The New Palace was built for the Karađorđević dynasty between 1911-1922. Today it serves as the seat of the President of Serbia.

**Architecture:**
• Neo-Renaissance style
• Beautifully decorated facade
• Part of the Royal Compound with the Old Palace`,
    "Presidential palace in Neo-Renaissance style",
    "Kralja Milana 3, Belgrade",
    44.8105,
    20.4595,
    "cat-landmark",
    { rating: 4.4 }
  ),
  createLocation(
    "loc-assembly",
    "National Assembly Building",
    "national-assembly",
    `The National Assembly of Serbia is an impressive building in Baroque style, housing the country's parliament. Built between 1907-1936.

**Features:**
• Monumental Baroque architecture
• Impressive interior chambers
• Historic significance`,
    "Serbia's parliament building in monumental Baroque style",
    "Kralja Milana 14, Belgrade",
    44.8097,
    20.4647,
    "cat-landmark",
    { rating: 4.5 }
  ),
  createLocation(
    "loc-slavija",
    "Slavija Square",
    "slavija-square",
    `Slavija Square is one of Belgrade's major traffic intersections and a busy urban area. The square is dominated by the roundabout with several notable buildings.

**Features:**
• Dimitrije Tucović monument
• Hotel Slavija
• Numerous shops and cafés
• Important transport hub`,
    "Major traffic intersection and urban square",
    "Slavija Square, Belgrade",
    44.7986,
    20.4667,
    "cat-landmark",
    { rating: 3.8 }
  ),
  createLocation(
    "loc-terazije",
    "Terazije Square",
    "terazije-square",
    `Terazije is one of Belgrade's central squares, known for its historic fountain and proximity to Hotel Moskva.

**Features:**
• Terazije Fountain - historic landmark
• Hotel Moskva - iconic Art Nouveau hotel
• Shopping and dining options`,
    "Central square with historic fountain",
    "Terazije, Belgrade",
    44.8117,
    20.4589,
    "cat-landmark",
    { rating: 4.2 }
  ),
  createLocation(
    "loc-pasic-square",
    "Nikola Pašić Square",
    "pasic-square",
    `Nikola Pašić Square is a central square named after the famous Serbian politician. Connected to Terazije and features the Trade Union Hall.

**Features:**
• Nikola Pašić Monument
• Trade Union Hall (Dom Sindikata)
• Shopping center
• Fountain`,
    "Central square named after famous Serbian politician",
    "Nikola Pašić Square, Belgrade",
    44.8100,
    20.4617,
    "cat-landmark",
    { rating: 4.0 }
  ),
  createLocation(
    "loc-st-mark",
    "Church of Saint Mark",
    "st-mark-church",
    `The Church of Saint Mark is one of Belgrade's largest churches, built in Serbian-Byzantine style between 1931-1940. Located in Tašmajdan Park.

**Features:**
• Serbian-Byzantine architecture
• Beautiful interior frescoes
• Tzar Dušan's tomb (remains)`,
    "Large Serbian-Byzantine church in Tašmajdan",
    "Bulevar kralja Aleksandra 17, Belgrade",
    44.8086,
    20.4694,
    "cat-landmark",
    { rating: 4.6, openingHours: '{"open":"07:00","close":"19:00"}' }
  ),
  createLocation(
    "loc-ruzica",
    "Ružica Church",
    "ruzica-church",
    `Ružica Church is a charming Serbian Orthodox church located within the Belgrade Fortress. Dedicated to the Nativity of the Theotokos.

**Features:**
• 15th century origins
• Beautiful icons and frescoes
• Chandeliers made from WWI weaponry
• Located in Kalemegdan`,
    "Charming Orthodox church inside Belgrade Fortress",
    "Kalemegdan Park, Belgrade",
    44.8231,
    20.4497,
    "cat-landmark",
    { rating: 4.7, openingHours: '{"open":"08:00","close":"17:00"}' }
  ),
  createLocation(
    "loc-st-petka",
    "Church of Saint Petka",
    "st-petka-church",
    `The Church of Saint Petka is a small Orthodox chapel in Kalemegdan, known for its healing spring water.

**Features:**
• Healing spring water
• Beautiful mosaics
• Pilgrimage site
• Ottoman-era origins`,
    "Small chapel with healing spring in Kalemegdan",
    "Kalemegdan Park, Belgrade",
    44.8230,
    20.4500,
    "cat-landmark",
    { rating: 4.6, openingHours: '{"open":"08:00","close":"17:00"}' }
  ),
  createLocation(
    "loc-sahat-kula",
    "Sahat Kula (Clock Tower)",
    "sahat-kula",
    `Sahat Kula is the Ottoman clock tower in the Belgrade Fortress, built in the 18th century. One of the few remaining Ottoman structures.

**Features:**
• 27 meters tall
• Ottoman Baroque architecture
• Working clock mechanism`,
    "Ottoman-era clock tower in Belgrade Fortress",
    "Kalemegdan Park, Belgrade",
    44.8228,
    20.4503,
    "cat-landmark",
    { rating: 4.5 }
  ),
  createLocation(
    "loc-roman-well",
    "Roman Well",
    "roman-well",
    `The Roman Well is a mysterious structure within Belgrade Fortress. Despite its name, it was actually built in the 18th century.

**Features:**
• 62 meters deep
• Mysterious legends
• Guided tours available`,
    "Mysterious 62m deep well in Belgrade Fortress",
    "Kalemegdan Park, Belgrade",
    44.8226,
    20.4510,
    "cat-landmark",
    { rating: 4.2, priceLevel: 1 }
  ),
  createLocation(
    "loc-stambol-gate",
    "Stambol Gate",
    "stambol-gate",
    `Stambol Gate is one of the main entrances to the Belgrade Fortress, built during the Ottoman period in the 18th century.

**Features:**
• Ottoman architecture
• Historic significance
• Main fortress entrance`,
    "Ottoman-era gate at Belgrade Fortress",
    "Kalemegdan Park, Belgrade",
    44.8222,
    20.4520,
    "cat-landmark",
    { rating: 4.4 }
  ),
  createLocation(
    "loc-zindan-gate",
    "Zindan Gate",
    "zindan-gate",
    `Zindan Gate is an impressive Ottoman gate with two round towers. Built in the mid-15th century.

**Features:**
• Two round defensive towers
• Ottoman architecture
• Historic entrance to Upper Town`,
    "Ottoman gate with twin round towers",
    "Kalemegdan Upper Town, Belgrade",
    44.8230,
    20.4508,
    "cat-landmark",
    { rating: 4.5 }
  ),
  createLocation(
    "loc-despot-tower",
    "Despot Stefan Tower",
    "despot-stefan-tower",
    `Despot Stefan Tower is the best-preserved medieval tower in Belgrade Fortress, built in the early 15th century by Despot Stefan Lazarević.

**Features:**
• Medieval architecture
• Part of original Serbian fortress
• Historical significance`,
    "Best-preserved medieval tower in Belgrade",
    "Kalemegdan Upper Town, Belgrade",
    44.8235,
    20.4495,
    "cat-landmark",
    { rating: 4.5 }
  ),
  createLocation(
    "loc-unknown-hero",
    "Monument to the Unknown Hero",
    "unknown-hero-monument",
    `The Monument to the Unknown Hero on Mount Avala commemorates the unknown Serbian soldiers from World War I.

**Features:**
• Designed by Ivan Meštrović
• Eight caryatids representing Yugoslav peoples
• Monumental architecture
• Views over Avala`,
    "Monument to unknown WWI soldiers on Mount Avala",
    "Mount Avala, Belgrade",
    44.6850,
    20.5180,
    "cat-landmark",
    { rating: 4.7 }
  ),
  createLocation(
    "loc-belgrade-arena",
    "Štark Arena (Belgrade Arena)",
    "belgrade-arena",
    `Štark Arena is the largest indoor arena in Serbia, hosting major concerts, sports events, and exhibitions.

**Features:**
• Capacity: 20,000
• Modern facilities
• Concerts and sports events`,
    "Largest indoor arena in Serbia",
    "Bulevar Mihajla Pupina, Novi Beograd",
    44.8158,
    20.4239,
    "cat-landmark",
    { rating: 4.3 }
  ),
  createLocation(
    "loc-sava-centar",
    "Sava Centar",
    "sava-centar",
    `Sava Centar is a congress center and theater venue in New Belgrade, hosting major conferences and performances.

**Features:**
• Congress hall
• Theater
• Conference facilities`,
    "Congress center and theater venue",
    "Bulevar Mihajla Pupina 9, Novi Beograd",
    44.8056,
    20.4250,
    "cat-landmark",
    { rating: 4.2 }
  ),
  createLocation(
    "loc-belgrade-fair",
    "Belgrade Fair (Beogradski Sajam)",
    "belgrade-fair",
    `Belgrade Fair is a major exhibition center hosting trade fairs, concerts, and events throughout the year.

**Features:**
• Multiple exhibition halls
• Annual Book Fair
• Car Show
• Various events`,
    "Major exhibition center for fairs and events",
    "Bulevar Vojvode Mišića 14, Belgrade",
    44.8064,
    20.4389,
    "cat-landmark",
    { rating: 4.1 }
  ),
  createLocation(
    "loc-gradic-pejton",
    "Građić Peyton Market",
    "gradic-pejton",
    `Građić Peyton is a vibrant market area in Belgrade, known for fresh produce and local goods.

**Features:**
• Fresh produce
• Local products
• Traditional market atmosphere`,
    "Traditional market with fresh produce",
    "Gundulićev venac, Belgrade",
    44.8142,
    20.4550,
    "cat-landmark",
    { rating: 4.2, priceLevel: 1 }
  ),
  createLocation(
    "loc-zeleni-venac",
    "Zeleni Venac Market",
    "zeleni-venac",
    `Zeleni Venac is one of Belgrade's oldest and most famous open-air markets. A great place to experience local life.

**Features:**
• Fresh fruits and vegetables
• Local cheese and meats
• Traditional atmosphere
• Historic location`,
    "Famous open-air market in city center",
    "Zeleni Venac, Belgrade",
    44.8131,
    20.4528,
    "cat-landmark",
    { rating: 4.3, priceLevel: 1 }
  ),
  createLocation(
    "loc-kalemegdan-park",
    "Kalemegdan Park",
    "kalemegdan-park",
    `Kalemegdan Park surrounds Belgrade Fortress, offering beautiful green spaces, monuments, and stunning views.

**Features:**
• Historic monuments
• Walking paths
• Playgrounds
• Art pavilion`,
    "Beautiful park surrounding Belgrade Fortress",
    "Kalemegdan, Belgrade",
    44.8220,
    20.4515,
    "cat-landmark",
    { rating: 4.7 }
  ),
  createLocation(
    "loc-vuk-monument",
    "Vuk Karadžić Monument",
    "vuk-monument",
    `Monument to Vuk Stefanović Karadžić, the reformer of the Serbian language and alphabet.

**Features:**
• Monument by Petar Ubavkić
• Cultural significance
• Near the Faculty of Philology`,
    "Monument to Serbian language reformer",
    "Studentski Trg, Belgrade",
    44.8138,
    20.4575,
    "cat-landmark",
    { rating: 4.4 }
  ),
  createLocation(
    "loc-tesla-monument",
    "Nikola Tesla Monument",
    "tesla-monument",
    `Monument to Nikola Tesla, the famous Serbian-American inventor, located near the Faculty of Electrical Engineering.

**Features:**
• Sculpture by Frano Kršinić
• Cultural significance
• Popular photo spot`,
    "Monument to the famous inventor",
    "Bulevar kralja Aleksandra, Belgrade",
    44.8078,
    20.4708,
    "cat-landmark",
    { rating: 4.5 }
  ),
  createLocation(
    "loc-hram-vaznesenja",
    "Church of the Ascension",
    "hram-vaznesenja",
    `The Church of the Ascension is a beautiful Serbian Orthodox church built in 1863, known for its historical and architectural value.

**Features:**
• Historic architecture
• Beautiful frescoes
• Religious significance`,
    "Historic Orthodox church from 1863",
    "Admirala Geprata 19, Belgrade",
    44.8056,
    20.4653,
    "cat-landmark",
    { rating: 4.5, openingHours: '{"open":"07:00","close":"19:00"}' }
  ),
  createLocation(
    "loc-alexander-nevsky",
    "Church of Alexander Nevsky",
    "alexander-nevsky",
    `The Church of Alexander Nevsky in Dorćol is dedicated to the Russian saint and serves as a memorial to Russian volunteers who died in the Balkan Wars.

**Features:**
• Russian Orthodox influence
• Historical significance
• Beautiful interior`,
    "Russian Orthodox church in Dorćol",
    "Cara Dušana 63, Dorćol, Belgrade",
    44.8197,
    20.4561,
    "cat-landmark",
    { rating: 4.4, openingHours: '{"open":"08:00","close":"18:00"}' }
  ),
  createLocation(
    "loc-kralja-petra",
    "Kralja Petra Street",
    "kralja-petra",
    `Kralja Petra Street is one of Belgrade's oldest streets, running through Dorćol and connecting important historic sites.

**Features:**
• Historic architecture
• Traditional shops
• Near Belgrade Fortress`,
    "One of Belgrade's oldest streets",
    "Kralja Petra, Dorćol, Belgrade",
    44.8203,
    20.4558,
    "cat-landmark",
    { rating: 4.3 }
  ),
]

// ============================================
// MUSEUMS & GALLERIES (20 locations)
// ============================================
const museumLocations: Location[] = [
  createLocation(
    "loc-nikola-tesla-museum",
    "Nikola Tesla Museum",
    "tesla-museum",
    `The Nikola Tesla Museum is dedicated to the life and work of one of history's greatest inventors. Located in a beautiful 1927 villa.

**Interactive exhibits include:**
• Working Tesla coils with spectacular electrical demonstrations
• Remote control demonstrations
• Original patents and technical drawings
• Personal belongings and photographs`,
    "Dedicated to the genius who invented the modern world",
    "Proleterske solidarnosti 31, Belgrade",
    44.8019,
    20.4683,
    "cat-museum",
    { rating: 4.7, priceLevel: 1, featured: true, phone: "+381 11 2433 886", website: "https://nikolateslamuseum.org", openingHours: '{"open":"10:00","close":"20:00","closed":"Monday"}' }
  ),
  createLocation(
    "loc-national-museum",
    "National Museum of Serbia",
    "national-museum",
    `The National Museum of Serbia is the oldest and largest museum in the country, housing an extensive collection spanning from prehistoric times to contemporary art.

**Collections include:**
• Prehistoric artifacts from Vinča culture
• Medieval Serbian art and religious icons
• European paintings (Picasso, Renoir, Monet)
• Serbian modern art`,
    "Serbia's largest museum with world-class art collections",
    "Republic Square 1a, Belgrade",
    44.8131,
    20.4598,
    "cat-museum",
    { rating: 4.6, priceLevel: 1, phone: "+381 11 3315 700", website: "https://www.narodnimuzej.rs", openingHours: '{"open":"10:00","close":"18:00","closed":"Monday"}' }
  ),
  createLocation(
    "loc-museum-contemporary-art",
    "Museum of Contemporary Art",
    "museum-contemporary-art",
    `The Museum of Contemporary Art in New Belgrade houses an impressive collection of 20th and 21st century art from Serbia and the former Yugoslavia.

**Collections:**
• Modern and contemporary art
• Yugoslav art from 1900 onwards
• Temporary exhibitions
• Photography collection`,
    "Major museum for modern and contemporary art",
    "Ušće 10, Novi Beograd",
    44.8231,
    20.4428,
    "cat-museum",
    { rating: 4.5, priceLevel: 1, openingHours: '{"open":"10:00","close":"20:00","closed":"Monday"}' }
  ),
  createLocation(
    "loc-ethnographic-museum",
    "Ethnographic Museum",
    "ethnographic-museum",
    `The Ethnographic Museum showcases Serbian folk culture through costumes, textiles, tools, and everyday objects.

**Collections:**
• Traditional costumes
• Folk art and crafts
• Rural architecture models
• Agricultural tools`,
    "Traditional Serbian folk culture and costumes",
    "Studentski Trg 13, Belgrade",
    44.8135,
    20.4586,
    "cat-museum",
    { rating: 4.4, priceLevel: 1, openingHours: '{"open":"10:00","close":"17:00","closed":"Monday"}' }
  ),
  createLocation(
    "loc-military-museum",
    "Military Museum",
    "military-museum",
    `The Military Museum in Kalemegdan Fortress displays over 3,000 items including weapons, uniforms, and military equipment from ancient times to today.

**Collections:**
• Medieval weapons and armor
• Ottoman and Austrian military items
• World War I and II artifacts
• Modern military equipment`,
    "Extensive military history collection in Kalemegdan",
    "Kalemegdan Park, Belgrade",
    44.8228,
    20.4505,
    "cat-museum",
    { rating: 4.5, priceLevel: 1, openingHours: '{"open":"10:00","close":"17:00"}' }
  ),
  createLocation(
    "loc-museum-yugoslav-history",
    "Museum of Yugoslav History",
    "museum-yugoslav-history",
    `The Museum of Yugoslav History chronicles the history of Yugoslavia, including the Tito era. Contains the House of Flowers where Tito is buried.

**Features:**
• Tito's mausoleum (House of Flowers)
• Historical exhibitions
• Relics from socialist era`,
    "History of Yugoslavia and Tito's mausoleum",
    "Botićeva 6, Dedinje, Belgrade",
    44.7756,
    20.4592,
    "cat-museum",
    { rating: 4.4, priceLevel: 1, openingHours: '{"open":"10:00","close":"16:00","closed":"Monday"}' }
  ),
  createLocation(
    "loc-church-museum",
    "Museum of Serbian Orthodox Church",
    "church-museum",
    `The Museum of the Serbian Orthodox Church houses religious artifacts, icons, manuscripts, and liturgical objects.

**Collections:**
• Medieval icons
• Religious manuscripts
• Liturgical vestments
• Church treasures`,
    "Religious artifacts and Orthodox heritage",
    "Kralja Petra 5, Belgrade",
    44.8194,
    20.4556,
    "cat-museum",
    { rating: 4.5, priceLevel: 1, openingHours: '{"open":"09:00","close":"16:00"}' }
  ),
  createLocation(
    "loc-jewish-museum",
    "Jewish Historical Museum",
    "jewish-museum",
    `The Jewish Historical Museum documents the history of Jewish communities in Serbia and the former Yugoslavia.

**Collections:**
• Holocaust documentation
• Jewish religious objects
• Historical photographs
• Personal stories`,
    "History of Jewish communities in Serbia",
    "Kralja Petra 71a, Belgrade",
    44.8186,
    20.4556,
    "cat-museum",
    { rating: 4.4, priceLevel: 0, openingHours: '{"open":"10:00","close":"14:00"}' }
  ),
  createLocation(
    "loc-applied-art-museum",
    "Museum of Applied Art",
    "applied-art-museum",
    `The Museum of Applied Art showcases decorative arts, design, and crafts from medieval times to present.

**Collections:**
• Furniture and interior design
• Ceramics and glass
• Textiles and fashion
• Graphic design`,
    "Decorative arts and design museum",
    "Vuka Karadžića 18, Belgrade",
    44.8122,
    20.4589,
    "cat-museum",
    { rating: 4.3, priceLevel: 1, openingHours: '{"open":"10:00","close":"17:00","closed":"Monday"}' }
  ),
  createLocation(
    "loc-natural-history-museum",
    "Museum of Natural History",
    "natural-history-museum",
    `The Museum of Natural History features exhibits on geology, biology, and paleontology from Serbia and the Balkans.

**Collections:**
• Minerals and fossils
• Flora and fauna of Serbia
• Paleontological finds
• Geological specimens`,
    "Natural history from Serbia and the Balkans",
    "Njegoševa 51, Belgrade",
    44.8025,
    20.4669,
    "cat-museum",
    { rating: 4.2, priceLevel: 1, openingHours: '{"open":"09:00","close":"16:00"}' }
  ),
  createLocation(
    "loc-aviation-museum",
    "Aviation Museum",
    "aviation-museum",
    `The Aviation Museum at Nikola Tesla Airport displays historic aircraft and aviation artifacts. The building itself is architecturally unique.

**Collections:**
• Historic aircraft
• Aviation equipment
• Flight simulators
• Military and civil aviation`,
    "Historic aircraft and aviation history",
    "Nikola Tesla Airport, Surčin, Belgrade",
    44.8189,
    20.3086,
    "cat-museum",
    { rating: 4.5, priceLevel: 1, openingHours: '{"open":"09:00","close":"18:00"}' }
  ),
  createLocation(
    "loc-automobile-museum",
    "Automobile Museum",
    "automobile-museum",
    `The Automobile Museum displays vintage and classic cars, telling the story of automotive history in Serbia.

**Collections:**
• Vintage automobiles
• Classic cars
• Automotive memorabilia`,
    "Vintage and classic cars collection",
    "Džordža Vašingtona 54, Belgrade",
    44.8058,
    20.4631,
    "cat-museum",
    { rating: 4.2, priceLevel: 1, openingHours: '{"open":"10:00","close":"18:00"}' }
  ),
  createLocation(
    "loc-police-museum",
    "Police Museum",
    "police-museum",
    `The Police Museum showcases the history of Serbian police forces, including uniforms, equipment, and notable cases.

**Collections:**
• Historical uniforms
• Police equipment
• Famous criminal cases`,
    "History of Serbian police forces",
    "Bulevar Despota Stefana 30, Belgrade",
    44.8181,
    20.4633,
    "cat-museum",
    { rating: 4.0, priceLevel: 0, openingHours: '{"open":"10:00","close":"16:00"}' }
  ),
  createLocation(
    "loc-pupin-museum",
    "Pupin Museum",
    "pupin-museum",
    `The Pupin Museum in the village of Idvor (Pupin's birthplace) is dedicated to Mihajlo Pupin, the famous Serbian-American scientist and inventor.

**Collections:**
• Pupin's inventions
• Personal belongings
• Scientific achievements`,
    "Dedicated to scientist Mihajlo Pupin",
    "Idvor, Belgrade municipality",
    45.0667,
    20.2333,
    "cat-museum",
    { rating: 4.3, priceLevel: 0, openingHours: '{"open":"09:00","close":"16:00"}' }
  ),
  createLocation(
    "loc-science-museum",
    "Museum of Science and Technology",
    "science-museum",
    `The Museum of Science and Technology showcases technological development and industrial heritage of Serbia.

**Collections:**
• Industrial machinery
• Scientific instruments
• Technological innovations`,
    "Technological development and industrial heritage",
    "Skender-begova 51, Belgrade",
    44.8144,
    20.4531,
    "cat-museum",
    { rating: 4.3, priceLevel: 1, openingHours: '{"open":"10:00","close":"18:00","closed":"Monday"}' }
  ),
  createLocation(
    "loc-fresco-museum",
    "Gallery of Frescoes",
    "fresco-gallery",
    `The Gallery of Frescoes displays copies of Serbian medieval frescoes from monasteries across Serbia and Kosovo.

**Collections:**
• Medieval fresco copies
• Byzantine art
• Religious paintings`,
    "Copies of Serbian medieval frescoes",
    "Bulevar Despota Stefana 10, Belgrade",
    44.8189,
    20.4614,
    "cat-museum",
    { rating: 4.5, priceLevel: 1, openingHours: '{"open":"10:00","close":"17:00","closed":"Sunday"}' }
  ),
  createLocation(
    "loc-historical-museum",
    "Historical Museum of Serbia",
    "historical-museum",
    `The Historical Museum of Serbia chronicles the history of the Serbian people from ancient times to the present.

**Collections:**
• Serbian history exhibits
• Historical artifacts
• Documents and photographs`,
    "History of the Serbian people",
    "Trg Nikole Pašića 11, Belgrade",
    44.8103,
    20.4619,
    "cat-museum",
    { rating: 4.3, priceLevel: 1, openingHours: '{"open":"10:00","close":"18:00","closed":"Monday"}' }
  ),
  createLocation(
    "loc-ulus-gallery",
    "ULUS Gallery",
    "ulus-gallery",
    `ULUS Gallery is the main exhibition space of the Association of Fine Artists of Serbia, featuring contemporary art exhibitions.

**Features:**
• Contemporary art exhibitions
• Local artists
• Rotating shows`,
    "Contemporary art exhibitions by Serbian artists",
    "Knez Mihailova 37, Belgrade",
    44.8164,
    20.4569,
    "cat-museum",
    { rating: 4.2, priceLevel: 0, openingHours: '{"open":"11:00","close":"19:00","closed":"Monday"}' }
  ),
  createLocation(
    "loc-pedagogical-museum",
    "Pedagogical Museum",
    "pedagogical-museum",
    `The Pedagogical Museum documents the history of education in Serbia with exhibits on schools, teaching methods, and educational materials.

**Collections:**
• School history
• Educational materials
• Historical classrooms`,
    "History of education in Serbia",
    "Uzun Mirkova 14, Belgrade",
    44.8200,
    20.4553,
    "cat-museum",
    { rating: 4.0, priceLevel: 0, openingHours: '{"open":"10:00","close":"16:00"}' }
  ),
  createLocation(
    "loc-salon-mocca",
    "Salon of MoCRA",
    "salon-mocca",
    `The Salon of the Museum of Contemporary Art is an exhibition space for contemporary art projects and experimental installations.

**Features:**
• Experimental art
• Contemporary exhibitions
• Art projects`,
    "Contemporary art exhibition space",
    "Pariska 14, Belgrade",
    44.8219,
    20.4497,
    "cat-museum",
    { rating: 4.3, priceLevel: 0, openingHours: '{"open":"12:00","close":"20:00","closed":"Monday"}' }
  ),
]

// ============================================
// RESTAURANTS & DINING (25 locations)
// ============================================
const foodLocations: Location[] = [
  createLocation(
    "loc-skadarlija",
    "Skadarlija (Bohemian Quarter)",
    "skadarlija",
    `Skadarlija is Belgrade's historic bohemian quarter, often called "Belgrade's Montmartre." This charming cobblestone street has been the heart of the city's artistic and culinary scene since the 19th century.

**Famous restaurants (kafanas):**
• Dva Jelena (Two Deer) - Operating since 1832
• Tri Šešira (Three Hats) - Traditional cuisine since 1864`,
    "Historic bohemian street with traditional restaurants",
    "Skadarska Street, Dorćol, Belgrade",
    44.8175,
    20.4619,
    "cat-food",
    { rating: 4.6, priceLevel: 3, featured: true, openingHours: '{"open":"11:00","close":"02:00"}' }
  ),
  createLocation(
    "loc-frans",
    "Franš Restaurant",
    "frans",
    `Franš is an elegant French restaurant in the heart of Belgrade, offering sophisticated cuisine in a refined atmosphere. Perfect for special occasions.

**Signature dishes:**
• Beef Bourguignon
• Duck Confit
• Fresh seafood platters`,
    "Elegant French fine dining",
    "Francuska 7, Dorćol, Belgrade",
    44.8145,
    20.4612,
    "cat-food",
    { rating: 4.6, priceLevel: 4, openingHours: '{"open":"12:00","close":"23:00"}' }
  ),
  createLocation(
    "loc-zavicaj",
    "Zavičaj Restaurant",
    "zavicaj",
    `Zavičaj is a traditional Serbian kafana on Skadarlija Street, offering authentic local cuisine and live folk music.

**Traditional dishes:**
• Roštilj (grilled meats) - Ćevapi, pljeskavica
• Karađorđeva šnicla
• Homemade bread and kajmak`,
    "Traditional Serbian kafana with live music",
    "Skadarska 21, Belgrade",
    44.8178,
    20.4621,
    "cat-food",
    { rating: 4.5, priceLevel: 2, openingHours: '{"open":"11:00","close":"01:00"}' }
  ),
  createLocation(
    "loc-dva-jelena",
    "Dva Jelena (Two Deer)",
    "dva-jelena",
    `Dva Jelena is one of Belgrade's oldest restaurants, operating since 1832. Located on Skadarlija, it serves traditional Serbian cuisine.

**Specialties:**
• Traditional Serbian dishes
• Live music
• Historic atmosphere`,
    "Historic restaurant since 1832 on Skadarlija",
    "Skadarska 32, Belgrade",
    44.8181,
    20.4622,
    "cat-food",
    { rating: 4.5, priceLevel: 3, openingHours: '{"open":"11:00","close":"01:00"}' }
  ),
  createLocation(
    "loc-tri-sesira",
    "Tri Šešira (Three Hats)",
    "tri-sesira",
    `Tri Šešira is a legendary Skadarlija restaurant serving traditional Serbian cuisine since 1864.

**Specialties:**
• Traditional Serbian cuisine
• Live tamburica music
• Outdoor summer seating`,
    "Traditional restaurant on Skadarlija since 1864",
    "Skadarska 29, Belgrade",
    44.8180,
    20.4618,
    "cat-food",
    { rating: 4.4, priceLevel: 3, openingHours: '{"open":"11:00","close":"01:00"}' }
  ),
  createLocation(
    "loc-lorenzo-kakalamba",
    "Lorenzo & Kakalamba",
    "lorenzo-kakalamba",
    `Lorenzo & Kakalamba is a quirky, artistic restaurant known for its creative Italian-Serbian fusion cuisine and unique interior design.

**Specialties:**
• Italian-Serbian fusion
• Creative presentations
• Artistic atmosphere`,
    "Quirky Italian-Serbian fusion restaurant",
    "Cara Nikolaja II 83, Belgrade",
    44.7939,
    20.4431,
    "cat-food",
    { rating: 4.5, priceLevel: 3, openingHours: '{"open":"12:00","close":"00:00"}' }
  ),
  createLocation(
    "loc-homa",
    "Homa Restaurant",
    "homa",
    `Homa is a modern Mediterranean restaurant with a sophisticated atmosphere and creative cuisine.

**Specialties:**
• Mediterranean cuisine
• Modern presentations
• Extensive wine list`,
    "Modern Mediterranean cuisine",
    "Zmaj Jovina 12, Belgrade",
    44.8153,
    20.4575,
    "cat-food",
    { rating: 4.6, priceLevel: 3, openingHours: '{"open":"12:00","close":"00:00"}' }
  ),
  createLocation(
    "loc-mezestoran-dvor",
    "Mezestoran Dvor",
    "mezestoran-dvor",
    `Mezestoran Dvor offers Mediterranean mezze-style dining in a charming courtyard setting.

**Specialties:**
• Mezze platters
• Mediterranean dishes
• Courtyard dining`,
    "Mediterranean mezze-style dining",
    "Dobračina 29, Belgrade",
    44.8164,
    20.4589,
    "cat-food",
    { rating: 4.5, priceLevel: 3, openingHours: '{"open":"11:00","close":"23:00"}' }
  ),
  createLocation(
    "loc-mala-fabrika",
    "Mala Fabrika Ukusa",
    "mala-fabrika",
    `Mala Fabrika Ukusa (Little Factory of Taste) serves traditional Serbian cuisine in a cozy, rustic setting.

**Specialties:**
• Traditional Serbian dishes
• Homemade recipes
• Rustic atmosphere`,
    "Traditional Serbian cuisine in rustic setting",
    "Kralja Petra 13, Belgrade",
    44.8197,
    20.4564,
    "cat-food",
    { rating: 4.4, priceLevel: 2, openingHours: '{"open":"11:00","close":"23:00"}' }
  ),
  createLocation(
    "loc-saran",
    "Šaran Fish Restaurant",
    "saran",
    `Šaran is a famous fish restaurant located on Ada Ciganlija, serving fresh fish from the Danube region.

**Specialties:**
• Fresh fish dishes
• Grilled specialties
• Riverside dining`,
    "Famous fish restaurant on Ada Ciganlija",
    "Ada Ciganlija, Belgrade",
    44.7842,
    20.4086,
    "cat-food",
    { rating: 4.4, priceLevel: 3, openingHours: '{"open":"11:00","close":"23:00"}' }
  ),
  createLocation(
    "loc-madera",
    "Madera Restaurant",
    "madera",
    `Madera is a traditional restaurant near Kalemegdan, serving classic Serbian and international dishes since 1955.

**Specialties:**
• Classic Serbian dishes
• International cuisine
• Near Kalemegdan`,
    "Traditional restaurant since 1955",
    "Pariska 23, Belgrade",
    44.8214,
    20.4522,
    "cat-food",
    { rating: 4.3, priceLevel: 3, openingHours: '{"open":"08:00","close":"23:00"}' }
  ),
  createLocation(
    "loc-prolece",
    "Proleće Restaurant",
    "prolece",
    `Proleće is a legendary Belgrade restaurant serving traditional Serbian cuisine since 1954.

**Specialties:**
• Traditional Serbian dishes
• Historic atmosphere
• Central location`,
    "Legendary Serbian restaurant since 1954",
    "Knez Mihailova 39, Belgrade",
    44.8158,
    20.4572,
    "cat-food",
    { rating: 4.2, priceLevel: 2, openingHours: '{"open":"09:00","close":"23:00"}' }
  ),
  createLocation(
    "loc-jevrem",
    "Jevrem Restaurant",
    "jevrem",
    `Jevrem is a trendy restaurant in Dorćol known for modern Serbian cuisine and stylish interior.

**Specialties:**
• Modern Serbian cuisine
• Stylish atmosphere
• Brunch menu`,
    "Trendy modern Serbian restaurant",
    "Gundulićev venac 13, Belgrade",
    44.8142,
    20.4553,
    "cat-food",
    { rating: 4.5, priceLevel: 3, openingHours: '{"open":"09:00","close":"00:00"}' }
  ),
  createLocation(
    "loc-mali-kopenhagen",
    "Mali Kopenhagen",
    "mali-kopenhagen",
    `Mali Kopenhagen (Little Copenhagen) is a Scandinavian-inspired café and restaurant in Dorćol.

**Specialties:**
• Scandinavian dishes
• Coffee and pastries
• Cozy atmosphere`,
    "Scandinavian-inspired café and restaurant",
    "Dobračina 25, Belgrade",
    44.8167,
    20.4583,
    "cat-food",
    { rating: 4.4, priceLevel: 2, openingHours: '{"open":"09:00","close":"23:00"}' }
  ),
  createLocation(
    "loc-toro",
    "Toro Latin GastroBar",
    "toro",
    `Toro is a Latin American gastro bar offering small plates and creative cocktails in a vibrant atmosphere.

**Specialties:**
• Latin American small plates
• Creative cocktails
• Vibrant atmosphere`,
    "Latin American gastro bar",
    "Strahinjića Bana 69, Belgrade",
    44.8192,
    20.4592,
    "cat-food",
    { rating: 4.5, priceLevel: 3, openingHours: '{"open":"12:00","close":"01:00"}' }
  ),
  createLocation(
    "loc-splendido",
    "Splendido Restaurant",
    "splendido",
    `Splendido offers Italian cuisine with a modern twist in an elegant setting near Knez Mihailova.

**Specialties:**
• Italian cuisine
• Pasta and seafood
• Elegant atmosphere`,
    "Elegant Italian restaurant",
    "Knez Mihailova 56, Belgrade",
    44.8147,
    20.4578,
    "cat-food",
    { rating: 4.4, priceLevel: 3, openingHours: '{"open":"12:00","close":"23:00"}' }
  ),
  createLocation(
    "loc-salon-5",
    "Salon 5",
    "salon-5",
    `Salon 5 is a contemporary restaurant known for its innovative cuisine and artistic presentation.

**Specialties:**
• Innovative cuisine
• Artistic presentation
• Modern atmosphere`,
    "Contemporary innovative cuisine",
    "Kosančićev venac 24, Belgrade",
    44.8197,
    20.4547,
    "cat-food",
    { rating: 4.6, priceLevel: 4, openingHours: '{"open":"18:00","close":"01:00"}' }
  ),
  createLocation(
    "loc-ambar",
    "Ambar Restaurant",
    "ambar",
    `Ambar is a modern Balkan restaurant with locations in Belgrade and Washington DC, offering contemporary takes on traditional dishes.

**Specialties:**
• Modern Balkan cuisine
• Small plates concept
• Craft cocktails`,
    "Modern Balkan cuisine",
    "Karađorđeva 2-4, Savamala, Belgrade",
    44.8097,
    20.4519,
    "cat-food",
    { rating: 4.5, priceLevel: 3, openingHours: '{"open":"11:00","close":"01:00"}' }
  ),
  createLocation(
    "loc-iguana",
    "Iguana Restaurant",
    "iguana",
    `Iguana is a popular restaurant and bar in Savamala offering international cuisine and lively nightlife.

**Specialties:**
• International cuisine
• Great cocktails
• Nightlife spot`,
    "International cuisine and nightlife",
    "Karađorđeva 48, Savamala, Belgrade",
    44.8103,
    20.4514,
    "cat-food",
    { rating: 4.3, priceLevel: 3, openingHours: '{"open":"12:00","close":"02:00"}' }
  ),
  createLocation(
    "loc-comunale",
    "Comunale Restaurant",
    "comunale",
    `Comunale is an Italian restaurant in a historic building in Savamala, known for authentic Italian cuisine and great wine selection.

**Specialties:**
• Authentic Italian cuisine
• Extensive wine list
• Historic building`,
    "Authentic Italian in historic Savamala building",
    "Karađorđeva 46, Savamala, Belgrade",
    44.8106,
    20.4511,
    "cat-food",
    { rating: 4.5, priceLevel: 3, openingHours: '{"open":"12:00","close":"00:00"}' }
  ),
  createLocation(
    "loc-sofia",
    "Sofia Restaurant",
    "sofia",
    `Sofia is an upscale Mediterranean restaurant in Vračar with elegant décor and refined cuisine.

**Specialties:**
• Mediterranean cuisine
• Elegant atmosphere
• Fine dining`,
    "Upscale Mediterranean restaurant",
    "Gundulićev venac 14, Belgrade",
    44.8144,
    20.4550,
    "cat-food",
    { rating: 4.4, priceLevel: 4, openingHours: '{"open":"12:00","close":"23:00"}' }
  ),
  createLocation(
    "loc-voulez-vous",
    "Voulez Vous Restaurant",
    "voulez-vous",
    `Voulez Vous is a French-inspired restaurant and bar with elegant Art Deco interior.

**Specialties:**
• French cuisine
• Art Deco atmosphere
• Great wine selection`,
    "French-inspired restaurant with Art Deco style",
    "Kralja Milana 21, Belgrade",
    44.8111,
    20.4597,
    "cat-food",
    { rating: 4.3, priceLevel: 3, openingHours: '{"open":"12:00","close":"00:00"}' }
  ),
  createLocation(
    "loc-aragosta",
    "Aragosta Restaurant",
    "aragosta",
    `Aragosta is a seafood restaurant specializing in Mediterranean cuisine and fresh seafood dishes.

**Specialties:**
• Fresh seafood
• Mediterranean cuisine
• Elegant dining`,
    "Seafood and Mediterranean cuisine",
    "Bulevar Oslobođenja 101, Belgrade",
    44.7967,
    20.4653,
    "cat-food",
    { rating: 4.4, priceLevel: 4, openingHours: '{"open":"12:00","close":"23:00"}' }
  ),
  createLocation(
    "loc-zlatni-bokal",
    "Zlatni Bokal (Golden Goblet)",
    "zlatni-bokal",
    `Zlatni Bokal is a traditional restaurant on Skadarlija with a long history and live music.

**Specialties:**
• Traditional Serbian cuisine
• Live music
• Historic atmosphere`,
    "Traditional Skadarlija restaurant with live music",
    "Skadarska 18, Belgrade",
    44.8172,
    20.4614,
    "cat-food",
    { rating: 4.3, priceLevel: 2, openingHours: '{"open":"11:00","close":"01:00"}' }
  ),
  createLocation(
    "loc-sesir-moj",
    "Šešir Moj (My Hat)",
    "sesir-moj",
    `Šešir Moj is a cozy Skadarlija restaurant known for traditional Serbian dishes and friendly service.

**Specialties:**
• Traditional Serbian dishes
• Cozy atmosphere
• Live music`,
    "Cozy Skadarlija restaurant",
    "Skadarska 22, Belgrade",
    44.8176,
    20.4617,
    "cat-food",
    { rating: 4.3, priceLevel: 2, openingHours: '{"open":"11:00","close":"01:00"}' }
  ),
]

// ============================================
// NIGHTLIFE & BARS (22 locations)
// ============================================
const nightlifeLocations: Location[] = [
  createLocation(
    "loc-splavovi",
    "Sava River Clubs (Splavovi)",
    "river-clubs",
    `Belgrade's famous floating river clubs (splavovi) are unique venues anchored along the Sava and Danube rivers. These legendary clubs define Belgrade's reputation as one of Europe's premier nightlife destinations.

**Popular clubs:**
• 20/44 - Electronic music, underground vibes
• Freestyler - Commercial hits, party atmosphere`,
    "Legendary floating clubs on the Sava River",
    "Sava Riverbank (Savamala), Belgrade",
    44.8089,
    20.4519,
    "cat-nightlife",
    { rating: 4.5, priceLevel: 2, featured: true, openingHours: '{"open":"22:00","close":"05:00"}' }
  ),
  createLocation(
    "loc-strahinjica-bana",
    "Strahinjića Bana (Silicone Valley)",
    "strahinjica-bana",
    `Strahinjića Bana Street in Dorćol is Belgrade's trendiest nightlife strip, nicknamed "Silicone Valley." This narrow street packs more bars and cafés per square meter than anywhere else in the city.

**Popular venues:**
• Čarolija - Cozy cocktail bar
• Tezga - Craft beer and live music`,
    "Trendy bar street in Dorćol district",
    "Strahinjića Bana Street, Dorćol, Belgrade",
    44.8192,
    20.4598,
    "cat-nightlife",
    { rating: 4.4, priceLevel: 2, openingHours: '{"open":"08:00","close":"02:00"}' }
  ),
  createLocation(
    "loc-20-44",
    "20/44 Club",
    "club-20-44",
    `20/44 is one of Belgrade's most iconic floating clubs, known for electronic music and underground vibes. Named after its coordinates.

**Features:**
• Electronic music
• Underground atmosphere
• River views`,
    "Iconic electronic music floating club",
    "Sava Riverbank, Belgrade",
    44.8092,
    20.4522,
    "cat-nightlife",
    { rating: 4.4, priceLevel: 2, openingHours: '{"open":"23:00","close":"05:00"}' }
  ),
  createLocation(
    "loc-freestyler",
    "Freestyler Club",
    "freestyler",
    `Freestyler is a popular floating club on the Sava River, known for commercial hits and great party atmosphere.

**Features:**
• Commercial and pop music
• Large dance floor
• Summer parties`,
    "Popular floating club with commercial hits",
    "Sava Riverbank, Belgrade",
    44.8086,
    20.4525,
    "cat-nightlife",
    { rating: 4.3, priceLevel: 2, openingHours: '{"open":"23:00","close":"05:00"}' }
  ),
  createLocation(
    "loc-drugstore",
    "Drugstore Club",
    "drugstore",
    `Drugstore is an alternative club known for indie, rock, and electronic music in a gritty industrial setting.

**Features:**
• Alternative music
• Industrial atmosphere
• Live performances`,
    "Alternative club for indie and electronic music",
    "Bulevar Despota Stefana 115, Belgrade",
    44.8236,
    20.4731,
    "cat-nightlife",
    { rating: 4.3, priceLevel: 1, openingHours: '{"open":"22:00","close":"05:00"}' }
  ),
  createLocation(
    "loc-shake-n-shake",
    "Shake 'n' Shake",
    "shake-n-shake",
    `Shake 'n' Shake is a beach bar style floating club with house music and summer party vibes.

**Features:**
• House music
• Beach bar feel
• Summer season`,
    "Beach bar style floating club",
    "Sava Riverbank, Belgrade",
    44.8081,
    20.4531,
    "cat-nightlife",
    { rating: 4.2, priceLevel: 2, openingHours: '{"open":"22:00","close":"05:00"}' }
  ),
  createLocation(
    "loc-toranj",
    "Toranj Club",
    "toranj",
    `Toranj is an exclusive floating club offering VIP experience and premium bottle service.

**Features:**
• VIP experience
• Premium service
• Exclusive atmosphere`,
    "Exclusive VIP floating club",
    "Sava Riverbank, Belgrade",
    44.8078,
    20.4528,
    "cat-nightlife",
    { rating: 4.1, priceLevel: 4, openingHours: '{"open":"23:00","close":"05:00"}' }
  ),
  createLocation(
    "loc-mr-stefan-braun",
    "Mr. Stefan Braun",
    "mr-stefan-braun",
    `Mr. Stefan Braun is a legendary club on the top floor of a building, known for electronic music and sunrise parties.

**Features:**
• Electronic music
• Rooftop location
• Famous after-parties`,
    "Legendary rooftop club for electronic music",
    "Bulevar Oslobođenja 119, Belgrade",
    44.7958,
    20.4647,
    "cat-nightlife",
    { rating: 4.2, priceLevel: 2, openingHours: '{"open":"00:00","close":"08:00"}' }
  ),
  createLocation(
    "loc-ludost",
    "Ludost Club",
    "ludost",
    `Ludost is an underground club in Savamala known for alternative music and artistic events.

**Features:**
• Alternative music
• Artistic events
• Underground vibes`,
    "Underground alternative club in Savamala",
    "Braće Krsmanovića 5, Savamala, Belgrade",
    44.8092,
    20.4514,
    "cat-nightlife",
    { rating: 4.3, priceLevel: 1, openingHours: '{"open":"22:00","close":"04:00"}' }
  ),
  createLocation(
    "loc-kabinet",
    "Kabinet Club",
    "kabinet",
    `Kabinet is a cozy bar and club in Dorćol with vintage décor and alternative music.

**Features:**
• Vintage décor
• Alternative music
• Cozy atmosphere`,
    "Cozy vintage bar and club",
    "Knez Mihailova 6, Belgrade",
    44.8169,
    20.4575,
    "cat-nightlife",
    { rating: 4.4, priceLevel: 2, openingHours: '{"open":"18:00","close":"02:00"}' }
  ),
  createLocation(
    "loc-kc-grad",
    "KC Grad (Cultural Center Grad)",
    "kc-grad",
    `KC Grad is a cultural center and club in Savamala hosting concerts, exhibitions, and parties.

**Features:**
• Concerts and events
• Art exhibitions
• Cultural center`,
    "Cultural center with concerts and parties",
    "Braće Krsmanovića 4, Savamala, Belgrade",
    44.8094,
    20.4517,
    "cat-nightlife",
    { rating: 4.4, priceLevel: 1, openingHours: '{"open":"20:00","close":"04:00"}' }
  ),
  createLocation(
    "loc-kc-ribnica",
    "KC Ribnica",
    "kc-ribnica",
    `KC Ribnica is an alternative cultural center under the Gazela Bridge, known for concerts and urban culture.

**Features:**
• Alternative concerts
• Urban culture
• Unique location`,
    "Alternative cultural center under Gazela Bridge",
    "Sava Riverbank, Belgrade",
    44.8025,
    20.4500,
    "cat-nightlife",
    { rating: 4.2, priceLevel: 1, openingHours: '{"open":"20:00","close":"04:00"}' }
  ),
  createLocation(
    "loc-bitef-art-cafe",
    "Bitef Art Café",
    "bitef-art-cafe",
    `Bitef Art Café is a cultural café and club near the National Theatre, known for theater events and live music.

**Features:**
• Cultural events
• Live music
• Theater connections`,
    "Cultural café and club near National Theatre",
    "Makedonska 22, Belgrade",
    44.8117,
    20.4592,
    "cat-nightlife",
    { rating: 4.3, priceLevel: 2, openingHours: '{"open":"18:00","close":"02:00"}' }
  ),
  createLocation(
    "loc-bgd-underground",
    "Bgd. Underground",
    "bgd-underground",
    `Bgd. Underground is a travel agency and bar offering tours and pub crawls with a unique alternative vibe.

**Features:**
• Alternative tours
• Pub crawls
• Unique concept`,
    "Alternative travel bar and tour operator",
    "Simina 21, Belgrade",
    44.8153,
    20.4608,
    "cat-nightlife",
    { rating: 4.4, priceLevel: 1, openingHours: '{"open":"16:00","close":"02:00"}' }
  ),
  createLocation(
    "loc-carolija",
    "Čarolija Bar",
    "carolija",
    `Čarolija (Magic) is a cozy cocktail bar on Strahinjića Bana with creative cocktails and intimate atmosphere.

**Features:**
• Creative cocktails
• Cozy atmosphere
• Professional bartenders`,
    "Cozy cocktail bar on Strahinjića Bana",
    "Strahinjića Bana 55, Belgrade",
    44.8194,
    20.4594,
    "cat-nightlife",
    { rating: 4.5, priceLevel: 2, openingHours: '{"open":"18:00","close":"02:00"}' }
  ),
  createLocation(
    "loc-tezga",
    "Tezga Bar",
    "tezga",
    `Tezga is a popular craft beer bar on Strahinjića Bana with live music and a relaxed atmosphere.

**Features:**
• Craft beers
• Live music
• Relaxed vibe`,
    "Craft beer bar with live music",
    "Strahinjića Bana 56, Belgrade",
    44.8194,
    20.4595,
    "cat-nightlife",
    { rating: 4.4, priceLevel: 1, openingHours: '{"open":"17:00","close":"02:00"}' }
  ),
  createLocation(
    "loc-bulevar",
    "Bulevar Bar",
    "bulevar-bar",
    `Bulevar is a stylish café by day and bar by night on Strahinjića Bana street.

**Features:**
• Café by day
• Bar by night
• Stylish interior`,
    "Stylish café and bar on Strahinjića Bana",
    "Strahinjića Bana 65, Belgrade",
    44.8191,
    20.4597,
    "cat-nightlife",
    { rating: 4.3, priceLevel: 2, openingHours: '{"open":"08:00","close":"02:00"}' }
  ),
  createLocation(
    "loc-ona",
    "Ona Bar",
    "ona-bar",
    `Ona is a stylish lounge bar on Strahinjića Bana with sophisticated cocktails and elegant atmosphere.

**Features:**
• Sophisticated cocktails
• Elegant interior
• Lounge atmosphere`,
    "Stylish lounge bar on Strahinjića Bana",
    "Strahinjića Bana 58, Belgrade",
    44.8192,
    20.4594,
    "cat-nightlife",
    { rating: 4.4, priceLevel: 2, openingHours: '{"open":"18:00","close":"02:00"}' }
  ),
  createLocation(
    "loc-tevrdik",
    "Tevrđik Rakia Bar",
    "tevrdik",
    `Tevrđik is a traditional rakia bar offering dozens of varieties of Serbian fruit brandy.

**Features:**
• Wide rakia selection
• Traditional atmosphere
• Expert guidance`,
    "Traditional rakia bar with extensive selection",
    "Strahinjića Bana 59, Belgrade",
    44.8192,
    20.4593,
    "cat-nightlife",
    { rating: 4.3, priceLevel: 1, openingHours: '{"open":"16:00","close":"02:00"}' }
  ),
  createLocation(
    "loc-lasta",
    "Lasta Club",
    "lasta",
    `Lasta is a popular floating club with pop music and a diverse crowd.

**Features:**
• Pop music
• Diverse crowd
• Summer parties`,
    "Popular floating club with pop music",
    "Sava Riverbank, Belgrade",
    44.8075,
    20.4535,
    "cat-nightlife",
    { rating: 4.2, priceLevel: 2, openingHours: '{"open":"23:00","close":"05:00"}' }
  ),
  createLocation(
    "loc-polet",
    "Polet Bar",
    "polet",
    `Polet is a casual bar in Dorćol with alternative music and young crowd.

**Features:**
• Alternative music
• Young crowd
• Casual atmosphere`,
    "Casual alternative bar in Dorćol",
    "Dobračina 9, Belgrade",
    44.8172,
    20.4578,
    "cat-nightlife",
    { rating: 4.2, priceLevel: 1, openingHours: '{"open":"18:00","close":"02:00"}' }
  ),
  createLocation(
    "loc-zicer",
    "Zicer Club",
    "zicer",
    `Zicer is an underground club at the Faculty of Political Sciences known for alternative concerts and student parties.

**Features:**
• Alternative concerts
• Student parties
• Underground vibes`,
    "Alternative club at Faculty of Political Sciences",
    "Jove Ilića 165, Belgrade",
    44.7956,
    20.4697,
    "cat-nightlife",
    { rating: 4.1, priceLevel: 1, openingHours: '{"open":"22:00","close":"04:00"}' }
  ),
]

// ============================================
// PARKS & NATURE (15 locations)
// ============================================
const natureLocations: Location[] = [
  createLocation(
    "loc-ada-ciganlija",
    "Ada Ciganlija (Belgrade's Sea)",
    "ada-ciganlija",
    `Ada Ciganlija is a river island turned peninsula on the Sava River, known as "Belgrade's Sea." This 7-kilometer paradise offers everything for outdoor enthusiasts and beach lovers.

**Activities & facilities:**
• 7 km of arranged beaches with lifeguards
• Swimming and water sports
• Beach volleyball and basketball courts`,
    "Belgrade's Sea - 7km of beaches on the Sava River",
    "Ada Ciganlija, Čukarica, Belgrade",
    44.7864,
    20.4036,
    "cat-nature",
    { rating: 4.5, priceLevel: 1, featured: true, openingHours: '{"open":"00:00","close":"00:00"}' }
  ),
  createLocation(
    "loc-kosutnjak",
    "Košutnjak Forest Park",
    "kosutnjak",
    `Košutnjak is a sprawling forest park covering 330 hectares on the edge of Belgrade. This green oasis offers numerous recreational activities.

**Activities:**
• Hiking and nature trails
• Mountain biking paths
• Sports courts`,
    "330-hectare forest park for recreation",
    "Košutnjak, Čukarica, Belgrade",
    44.7628,
    20.4222,
    "cat-nature",
    { rating: 4.4, openingHours: '{"open":"00:00","close":"00:00"}' }
  ),
  createLocation(
    "loc-usce",
    "Ušće Park",
    "usce-park",
    `Ušće Park is located at the confluence (ušće) of the Sava and Danube rivers, offering spectacular views of both waterways and New Belgrade.

**Highlights:**
• Panoramic views of Kalemegdan
• Walking and cycling paths
• Open-air events`,
    "Park at the confluence of Sava and Danube rivers",
    "Ušće, Novi Beograd, Belgrade",
    44.825,
    20.4483,
    "cat-nature",
    { rating: 4.3, openingHours: '{"open":"00:00","close":"00:00"}' }
  ),
  createLocation(
    "loc-botanical-garden",
    "Botanical Garden Jevremovac",
    "botanical-garden",
    `The Botanical Garden Jevremovac is a green oasis in the city center with over 1,500 plant species and a historic greenhouse.

**Features:**
• 1,500+ plant species
• Historic greenhouse
• Japanese garden`,
    "Historic botanical garden with 1,500+ species",
    "Takovska 43, Belgrade",
    44.8064,
    20.4725,
    "cat-nature",
    { rating: 4.4, priceLevel: 1, openingHours: '{"open":"09:00","close":"18:00"}' }
  ),
  createLocation(
    "loc-karadjordjev-park",
    "Karađorđev Park",
    "karadjordjev-park",
    `Karađorđev Park is one of Belgrade's oldest parks, created in honor of the First Serbian Uprising leader.

**Features:**
• Historic monuments
• Walking paths
• Central location`,
    "Historic park from First Serbian Uprising era",
    "Karađorđev Park, Vračar, Belgrade",
    44.7958,
    20.4719,
    "cat-nature",
    { rating: 4.2 }
  ),
  createLocation(
    "loc-academic-park",
    "Academic Park (Studentski Park)",
    "academic-park",
    `Academic Park is a green space near the University of Belgrade, popular with students and locals.

**Features:**
• Student hangout
• Green lawns
• Near university buildings`,
    "Green park popular with students",
    "Studentski Trg, Belgrade",
    44.8144,
    20.4575,
    "cat-nature",
    { rating: 4.1 }
  ),
  createLocation(
    "loc-manjez-park",
    "Manjež Park",
    "manjez-park",
    `Manjež Park is a small but popular park in the city center, known for its children's playground and cafés.

**Features:**
• Children's playground
• Outdoor cafés
• Central location`,
    "Popular central park with playground",
    "Nemanjina 4, Belgrade",
    44.8094,
    20.4614,
    "cat-nature",
    { rating: 4.3 }
  ),
  createLocation(
    "loc-pionir-park",
    "Pionir Park",
    "pionir-park",
    `Pionir Park is a small park near the Old and New Palaces, with well-maintained gardens and walking paths.

**Features:**
• Well-maintained gardens
• Near royal palaces
• Quiet atmosphere`,
    "Small park near the Royal Compound",
    "Kralja Milana, Belgrade",
    44.8103,
    20.4597,
    "cat-nature",
    { rating: 4.2 }
  ),
  createLocation(
    "loc-banjicka-suma",
    "Banjička Šuma",
    "banjicka-suma",
    `Banjička Šuma is a small forest area in the Banjica neighborhood, popular for walking and jogging.

**Features:**
• Walking trails
• Jogging paths
• Natural setting`,
    "Forest area popular for walking and jogging",
    "Banjica, Voždovac, Belgrade",
    44.7706,
    20.4653,
    "cat-nature",
    { rating: 4.1 }
  ),
  createLocation(
    "loc-stepin-gaj",
    "Stepin Gaj",
    "stepin-gaj",
    `Stepin Gaj is a forested area on the slopes of Avala, offering hiking trails and natural scenery.

**Features:**
• Hiking trails
• Forest setting
• Near Avala`,
    "Forested area with hiking trails near Avala",
    "Stepin Gaj, Belgrade",
    44.7083,
    20.5167,
    "cat-nature",
    { rating: 4.2 }
  ),
  createLocation(
    "loc-milutinovac",
    "Milutinovac",
    "milutinovac",
    `Milutinovac is a green recreational area with sports facilities and picnic spots.

**Features:**
• Sports facilities
• Picnic areas
• Recreational area`,
    "Green recreational area with sports facilities",
    "Milutinovac, Belgrade",
    44.7500,
    20.4000,
    "cat-nature",
    { rating: 4.0 }
  ),
  createLocation(
    "loc-zvezdara-forest",
    "Zvezdara Forest",
    "zvezdara-forest",
    `Zvezdara Forest is a large wooded area on Zvezdara hill, popular for hiking and outdoor activities.

**Features:**
• Hiking trails
• viewpoints
• Natural forest`,
    "Large forest on Zvezdara hill",
    "Zvezdara, Belgrade",
    44.8194,
    20.4819,
    "cat-nature",
    { rating: 4.3 }
  ),
  createLocation(
    "loc-lisicji-potok",
    "Lisičji Potok",
    "lisicji-potok",
    `Lisičji Potok (Fox Creek) is a park and recreational area near Topčider with walking trails and nature.

**Features:**
• Walking trails
• Natural creek
• Near Topčider`,
    "Park and recreational area near Topčider",
    "Lisičji Potok, Savski Venac, Belgrade",
    44.7803,
    20.4508,
    "cat-nature",
    { rating: 4.2 }
  ),
  createLocation(
    "loc-hajd-park",
    "Hajd Park",
    "hajd-park",
    `Hajd Park is a wellness and spa complex within Košutnjak forest, featuring pools and recreational facilities.

**Features:**
• Swimming pools
• Wellness center
• Forest setting`,
    "Wellness and spa complex in Košutnjak",
    "Košutnjak, Belgrade",
    44.7614,
    20.4219,
    "cat-nature",
    { rating: 4.4, priceLevel: 3, openingHours: '{"open":"07:00","close":"22:00"}' }
  ),
  createLocation(
    "loc-ada-međica",
    "Ada Medjica",
    "ada-medjica",
    `Ada Međica is a smaller river island near Ada Ciganlija, offering a more natural and wild beach experience.

**Features:**
• Wild beaches
• Natural setting
• Less crowded`,
    "Smaller river island with wild beaches",
    "Sava River, Belgrade",
    44.7825,
    20.3986,
    "cat-nature",
    { rating: 4.3 }
  ),
]

// ============================================
// HOTELS & ACCOMMODATION (18 locations)
// ============================================
const accommodationLocations: Location[] = [
  createLocation(
    "loc-square-nine",
    "Square Nine Hotel Belgrade",
    "square-nine-hotel",
    `Square Nine Hotel is Belgrade's premier luxury boutique hotel, perfectly situated next to Knez Mihailova pedestrian street. This 5-star property offers world-class service.

**Amenities:**
• 45 luxuriously appointed rooms and suites
• Intense Spa & Wellness center with indoor pool
• The Square restaurant - fine dining`,
    "Luxury boutique hotel in the heart of Belgrade",
    "Studentski trg 9, Belgrade",
    44.8139,
    20.4589,
    "cat-accommodation",
    { rating: 4.7, priceLevel: 4, featured: true, phone: "+381 11 3333 000", website: "https://www.squarenine.rs" }
  ),
  createLocation(
    "loc-moscow",
    "Hotel Moskva",
    "hotel-moskva",
    `Hotel Moskva is a Belgrade landmark and one of the most iconic hotels in the Balkans. Built in 1908, this Art Nouveau masterpiece has hosted royalty, politicians, and celebrities.

**Historic features:**
• Original Art Nouveau architecture
• Famous pastry shop - try the legendary Moskva Šnit cake
• Historic significance`,
    "Iconic 1908 Art Nouveau hotel",
    "Terazije 19, Belgrade",
    44.8117,
    20.4586,
    "cat-accommodation",
    { rating: 4.5, priceLevel: 3, featured: true, phone: "+381 11 3020 100", website: "https://www.hotelmoskva.rs" }
  ),
  createLocation(
    "loc-metropol-palace",
    "Metropol Palace Hotel",
    "metropol-palace",
    `Metropol Palace is a 5-star hotel in a landmark building from 1957, featuring modern luxury with historic charm.

**Amenities:**
• Rooftop restaurant
• Spa and wellness
• Indoor pool`,
    "5-star hotel in landmark 1957 building",
    "Bulevar Kralja Aleksandra 69, Belgrade",
    44.8056,
    20.4708,
    "cat-accommodation",
    { rating: 4.6, priceLevel: 4, phone: "+381 11 3303 500", website: "https://www.metropolpalace.com" }
  ),
  createLocation(
    "loc-saint-ten",
    "Saint Ten Hotel",
    "saint-ten",
    `Saint Ten Hotel is a modern 5-star hotel in Vračar, offering contemporary design and excellent service.

**Amenities:**
• Modern design
• Spa facilities
• Near Saint Sava Temple`,
    "Modern 5-star hotel in Vračar",
    "Katenčićeva 1, Belgrade",
    44.7956,
    20.4678,
    "cat-accommodation",
    { rating: 4.6, priceLevel: 4, phone: "+381 11 4444 100", website: "https://www.saintten.com" }
  ),
  createLocation(
    "loc-aleksandar-palas",
    "Hotel Aleksandar Palas",
    "aleksandar-palas",
    `Hotel Aleksandar Palas is a boutique hotel with classic elegance near Republic Square.

**Amenities:**
• Boutique luxury
• Classic design
• Central location`,
    "Boutique hotel with classic elegance",
    "Kralja Petra 56, Belgrade",
    44.8186,
    20.4550,
    "cat-accommodation",
    { rating: 4.4, priceLevel: 4, phone: "+381 11 3034 000" }
  ),
  createLocation(
    "loc-envoy-hotel",
    "Hotel Envoy",
    "envoy-hotel",
    `Hotel Envoy is a modern boutique hotel with personalized service and contemporary design.

**Amenities:**
• Modern design
• Personalized service
• Near Knez Mihailova`,
    "Modern boutique hotel with personalized service",
    "Kralja Petra 28, Belgrade",
    44.8183,
    20.4561,
    "cat-accommodation",
    { rating: 4.5, priceLevel: 3, phone: "+381 11 3300 100" }
  ),
  createLocation(
    "loc-townhouse-27",
    "Townhouse 27",
    "townhouse-27",
    `Townhouse 27 is a stylish boutique hotel with modern amenities in a historic building.

**Amenities:**
• Historic building
• Modern amenities
• Central location`,
    "Stylish boutique hotel in historic building",
    "Dobračina 27, Belgrade",
    44.8167,
    20.4578,
    "cat-accommodation",
    { rating: 4.4, priceLevel: 3, phone: "+381 11 3344 272" }
  ),
  createLocation(
    "loc-hyatt-regency",
    "Hyatt Regency Belgrade",
    "hyatt-regency",
    `Hyatt Regency Belgrade is a 5-star hotel in New Belgrade, popular with business travelers.

**Amenities:**
• Business facilities
• Multiple restaurants
• Fitness center`,
    "5-star business hotel in New Belgrade",
    "Milentija Popovića 5, Novi Beograd",
    44.8067,
    20.4219,
    "cat-accommodation",
    { rating: 4.5, priceLevel: 4, phone: "+381 11 3011 234", website: "https://www.hyatt.com" }
  ),
  createLocation(
    "loc-hilton-belgrade",
    "Hilton Belgrade",
    "hilton-belgrade",
    `Hilton Belgrade is a modern 5-star hotel in the city center with contemporary design.

**Amenities:**
• Rooftop bar
• Modern design
• Central location`,
    "Modern 5-star hotel in city center",
    "Kralja Milana 35, Belgrade",
    44.8108,
    20.4619,
    "cat-accommodation",
    { rating: 4.5, priceLevel: 4, phone: "+381 11 3777 000", website: "https://www.hilton.com" }
  ),
  createLocation(
    "loc-crowne-plaza",
    "Crowne Plaza Belgrade",
    "crowne-plaza",
    `Crowne Plaza Belgrade is a 4-star hotel in New Belgrade, convenient for business and events.

**Amenities:**
• Business center
• Near Sava Centar
• Conference facilities`,
    "4-star hotel near Belgrade Arena",
    "Vladimira Popovića 10, Novi Beograd",
    44.8083,
    20.4194,
    "cat-accommodation",
    { rating: 4.3, priceLevel: 3, phone: "+381 11 3111 333", website: "https://www.ihg.com" }
  ),
  createLocation(
    "loc-radisson",
    "Radisson Collection Belgrade",
    "radisson-collection",
    `Radisson Collection is a 5-star hotel in Old Belgrade with modern amenities and great views.

**Amenities:**
• River views
• Modern design
• Spa facilities`,
    "5-star hotel with river views",
    "Karađorđeva 3, Savamala, Belgrade",
    44.8100,
    20.4508,
    "cat-accommodation",
    { rating: 4.5, priceLevel: 4, phone: "+381 11 3303 300", website: "https://www.radisson.com" }
  ),
  createLocation(
    "loc-falkensteiner",
    "Falkensteiner Hotel Belgrade",
    "falkensteiner",
    `Falkensteiner Hotel is a modern hotel in New Belgrade with wellness facilities.

**Amenities:**
• Wellness center
• Modern rooms
• Business facilities`,
    "Modern hotel with wellness in New Belgrade",
    "Omladinskih brigada 11a, Novi Beograd",
    44.8136,
    20.4231,
    "cat-accommodation",
    { rating: 4.3, priceLevel: 3, phone: "+381 11 2201 000" }
  ),
  createLocation(
    "loc-in-hotel",
    "IN Hotel Belgrade",
    "in-hotel",
    `IN Hotel is a modern 4-star hotel in New Belgrade, popular with business travelers.

**Amenities:**
• Business facilities
• Modern design
• Near Arena`,
    "Modern 4-star hotel near Belgrade Arena",
    "Bulevar Mihajla Pupina 10b, Novi Beograd",
    44.8139,
    20.4228,
    "cat-accommodation",
    { rating: 4.2, priceLevel: 3, phone: "+381 11 3131 313" }
  ),
  createLocation(
    "loc-holiday-inn",
    "Holiday Inn Express Belgrade",
    "holiday-inn",
    `Holiday Inn Express is a convenient budget-friendly option in New Belgrade.

**Amenities:**
• Free breakfast
• Modern rooms
• Budget-friendly`,
    "Budget-friendly hotel in New Belgrade",
    "Bulevar Mihajla Pupina 10v, Novi Beograd",
    44.8142,
    20.4222,
    "cat-accommodation",
    { rating: 4.1, priceLevel: 2, phone: "+381 11 3111 500" }
  ),
  createLocation(
    "loc-hotel-rex",
    "Hotel Rex",
    "hotel-rex",
    `Hotel Rex is a budget-friendly hotel in a historic building in Dorćol.

**Amenities:**
• Historic building
• Budget-friendly
• Central location`,
    "Budget-friendly hotel in historic Dorćol",
    "Jevrejska 24, Dorćol, Belgrade",
    44.8200,
    20.4564,
    "cat-accommodation",
    { rating: 4.0, priceLevel: 2, phone: "+381 11 3286 900" }
  ),
  createLocation(
    "loc-hotel-slavija",
    "Hotel Slavija Lux",
    "hotel-slavija",
    `Hotel Slavija Lux is a mid-range hotel at Slavija Square with good transport connections.

**Amenities:**
• Central location
• Transport connections
• Mid-range pricing`,
    "Mid-range hotel at Slavija Square",
    "Bulevar Oslobođenja 2, Belgrade",
    44.7986,
    20.4661,
    "cat-accommodation",
    { rating: 3.9, priceLevel: 2, phone: "+381 11 3088 000" }
  ),
  createLocation(
    "loc-hotel-majestic",
    "Hotel Majestic",
    "hotel-majestic",
    `Hotel Majestic is a historic 4-star hotel near Republic Square with classic charm.

**Amenities:**
• Historic charm
• Classic design
• Near Republic Square`,
    "Historic 4-star hotel near Republic Square",
    "Hajduk Veljkov venac 4, Belgrade",
    44.8125,
    20.4583,
    "cat-accommodation",
    { rating: 4.2, priceLevel: 3, phone: "+381 11 3286 500" }
  ),
  createLocation(
    "loc-hotel-prag",
    "Hotel Prag",
    "hotel-prag",
    `Hotel Prag is a historic hotel near Terazije with traditional charm and good value.

**Amenities:**
• Traditional charm
• Good value
• Central location`,
    "Historic hotel with traditional charm",
    "Kralja Milana 4, Belgrade",
    44.8114,
    20.4592,
    "cat-accommodation",
    { rating: 4.1, priceLevel: 2, phone: "+381 11 3242 444" }
  ),
]

// Combine all locations
export const staticLocations: Location[] = [
  ...landmarkLocations,
  ...museumLocations,
  ...foodLocations,
  ...nightlifeLocations,
  ...natureLocations,
  ...accommodationLocations,
]

// Helper function to get location by slug
export const getLocationBySlug = (slug: string): Location | undefined => {
  return staticLocations.find(loc => loc.slug === slug)
}

// Helper function to get locations by category
export const getLocationsByCategory = (categoryId: string): Location[] => {
  return staticLocations.filter(loc => loc.categoryId === categoryId)
}

// Helper function to get featured locations
export const getFeaturedLocations = (): Location[] => {
  return staticLocations.filter(loc => loc.featured)
}

// Helper function to search locations
export const searchLocations = (query: string): Location[] => {
  const lowerQuery = query.toLowerCase()
  return staticLocations.filter(loc => 
    loc.name.toLowerCase().includes(lowerQuery) ||
    loc.description.toLowerCase().includes(lowerQuery) ||
    loc.address?.toLowerCase().includes(lowerQuery)
  )
}
