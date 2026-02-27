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
    _count: { locations: 2 }
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
    _count: { locations: 3 }
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
    _count: { locations: 5 }
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
    _count: { locations: 2 }
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
    _count: { locations: 3 }
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
    _count: { locations: 2 }
  }
]

// Real photos from Unsplash for Belgrade landmarks
export const staticLocations: Location[] = [
  {
    id: "loc-kalemegdan",
    name: "Belgrade Fortress (Kalemegdan)",
    slug: "kalemegdan",
    description: `Belgrade Fortress, also known as Kalemegdan, is the crown jewel of Belgrade's cultural heritage. Perched at the confluence of the Sava and Danube rivers, this magnificent fortress has witnessed over 2,000 years of history.

**Highlights inside the fortress:**
• The Victor Monument (Pobednik) - Iconic symbol of Belgrade
• Sahat Kula (Clock Tower) - Ottoman-era tower
• Roman Well - Mysterious ancient structure
• Ružica Church - Beautiful Orthodox chapel
• Military Museum - Extensive collection of weapons and artifacts
• Zindan and Istanbul Gates - Impressive Ottoman gateways

The fortress offers breathtaking panoramic views of New Belgrade, the rivers, and the Pannonian Plain. The surrounding Kalemegdan Park is perfect for leisurely walks, especially during sunset.`,
    shortDesc: "Ancient fortress with stunning river views and 2000 years of history",
    address: "Kalemegdan Park, Belgrade",
    latitude: 44.8227,
    longitude: 20.4512,
    images: "[\"/images/locations/kalemegdan.jpg\"]",
    rating: 4.8,
    priceLevel: 0,
    phone: null,
    website: null,
    bookingUrl: null,
    openingHours: "{\"open\":\"06:00\",\"close\":\"00:00\",\"note\":\"Park open 24/7, museums 10:00-18:00\"}",
    featured: true,
    verified: true,
    categoryId: "cat-landmark",
    createdAt: "2026-02-20T19:41:22.970Z",
    updatedAt: "2026-02-20T19:41:22.970Z",
    category: staticCategories.find(c => c.id === "cat-landmark")
  },
  {
    id: "loc-hram-save",
    name: "Saint Sava Temple",
    slug: "saint-sava-temple",
    description: `The Temple of Saint Sava is the largest Orthodox church in the Balkans and one of the largest Orthodox churches in the world. This magnificent Serbian-Byzantine masterpiece dominates Belgrade's skyline with its 70-meter tall dome.

**Key facts:**
• Construction began in 1935, completed in 2004
• Can accommodate 10,000 worshippers
• The golden dome weighs 4,000 tons
• Crypt features stunning gold mosaics covering 1,500 m²

The interior is breathtaking, with marble floors, intricate frescoes, and a spiritual atmosphere that leaves visitors in awe. The surrounding plateau offers excellent views and is a popular gathering spot for locals and tourists alike.`,
    shortDesc: "The largest Orthodox church in the Balkans",
    address: "Krušedolska 2a, Vračar, Belgrade",
    latitude: 44.7936,
    longitude: 20.4694,
    images: "[\"/images/locations/saint-sava.jpg\"]",
    rating: 4.9,
    priceLevel: 0,
    phone: null,
    website: null,
    bookingUrl: null,
    openingHours: "{\"open\":\"07:00\",\"close\":\"20:00\"}",
    featured: true,
    verified: true,
    categoryId: "cat-landmark",
    createdAt: "2026-02-20T19:41:22.971Z",
    updatedAt: "2026-02-20T19:41:22.971Z",
    category: staticCategories.find(c => c.id === "cat-landmark")
  },
  {
    id: "loc-nikola-tesla-museum",
    name: "Nikola Tesla Museum",
    slug: "nikola-tesla-museum",
    description: `The Nikola Tesla Museum is dedicated to the life and work of one of history's greatest inventors. Located in a beautiful 1927 villa, the museum houses Tesla's personal collection, including original documents, patents, and working demonstrations of his inventions.

**Interactive exhibits include:**
• Working Tesla coils with spectacular electrical demonstrations
• Remote control demonstrations (Tesla invented wireless control in 1898)
• Original patents and technical drawings
• Personal belongings and photographs
• The famous "Egg of Columbus" rotating egg demonstration

The museum offers guided tours with demonstrations that bring Tesla's inventions to life. A must-visit for science enthusiasts and anyone interested in the genius who shaped our modern world.`,
    shortDesc: "Dedicated to the genius who invented the modern world",
    address: "Proleterske solidarnosti 31, Belgrade",
    latitude: 44.8019,
    longitude: 20.4683,
    images: "[\"/images/locations/tesla-museum.jpg\"]",
    rating: 4.7,
    priceLevel: 1,
    phone: "+381 11 2433 886",
    website: "https://nikolateslamuseum.org",
    bookingUrl: null,
    openingHours: "{\"open\":\"10:00\",\"close\":\"20:00\",\"closed\":\"Monday\"}",
    featured: true,
    verified: true,
    categoryId: "cat-museum",
    createdAt: "2026-02-20T19:41:22.977Z",
    updatedAt: "2026-02-20T19:41:22.977Z",
    category: staticCategories.find(c => c.id === "cat-museum")
  },
  {
    id: "loc-skadarlija",
    name: "Skadarlija (Bohemian Quarter)",
    slug: "skadarlija",
    description: `Skadarlija is Belgrade's historic bohemian quarter, often called "Belgrade's Montmartre." This charming cobblestone street has been the heart of the city's artistic and culinary scene since the 19th century.

**Famous restaurants (kafanas):**
• Dva Jelena (Two Deer) - Operating since 1832
• Tri Šešira (Three Hats) - Traditional cuisine since 1864
• Šešir Moj (My Hat)
• Zlatni Bokal (Golden Goblet)

**What to expect:**
• Live traditional Serbian music (tamburica bands)
• Authentic Serbian cuisine: ćevapi, roštilj, kajmak
• Outdoor seating in summer
• Artists, poets, and musicians roaming the streets
• Nightly entertainment until 2 AM

Average meal cost: €15-30 per person with drinks and live music.`,
    shortDesc: "Historic bohemian street with traditional restaurants and live music",
    address: "Skadarska Street, Dorćol, Belgrade",
    latitude: 44.8175,
    longitude: 20.4619,
    images: "[\"/images/locations/skadarlija.jpg\"]",
    rating: 4.6,
    priceLevel: 3,
    phone: null,
    website: null,
    bookingUrl: null,
    openingHours: "{\"open\":\"11:00\",\"close\":\"02:00\"}",
    featured: true,
    verified: true,
    categoryId: "cat-food",
    createdAt: "2026-02-20T19:41:22.973Z",
    updatedAt: "2026-02-20T19:41:22.973Z",
    category: staticCategories.find(c => c.id === "cat-food")
  },
  {
    id: "loc-ada-ciganlija",
    name: "Ada Ciganlija (Belgrade's Sea)",
    slug: "ada-ciganlija",
    description: `Ada Ciganlija is a river island turned peninsula on the Sava River, known as "Belgrade's Sea." This 7-kilometer paradise offers everything for outdoor enthusiasts and beach lovers.

**Activities & facilities:**
• 7 km of arranged beaches with lifeguards
• Swimming and water sports
• Beach volleyball and basketball courts
• Biking and rollerblading paths (8 km)
• Bungee jumping tower
• Golf course
• Beach bars and restaurants
• Rent-a-bike and water equipment

**Best time to visit:** May-September, when water temperature reaches 22-25°C. Entrance is free, with paid parking and beach chair rentals available.`,
    shortDesc: "Belgrade's Sea - 7km of beaches on the Sava River",
    address: "Ada Ciganlija, Čukarica, Belgrade",
    latitude: 44.7864,
    longitude: 20.4036,
    images: "[\"/images/locations/ada-ciganlija.jpg\"]",
    rating: 4.5,
    priceLevel: 1,
    phone: null,
    website: null,
    bookingUrl: null,
    openingHours: "{\"open\":\"00:00\",\"close\":\"00:00\",\"note\":\"Open 24/7\"}",
    featured: true,
    verified: true,
    categoryId: "cat-nature",
    createdAt: "2026-02-20T19:41:22.974Z",
    updatedAt: "2026-02-20T19:41:22.974Z",
    category: staticCategories.find(c => c.id === "cat-nature")
  },
  {
    id: "loc-square-nine",
    name: "Square Nine Hotel Belgrade",
    slug: "square-nine-hotel",
    description: `Square Nine Hotel is Belgrade's premier luxury boutique hotel, perfectly situated next to Knez Mihailova pedestrian street. This 5-star property offers world-class service in an elegant contemporary setting.

**Amenities:**
• 45 luxuriously appointed rooms and suites
• Intense Spa & Wellness center with indoor pool
• The Square restaurant - fine dining with international cuisine
• The Tetka bar - craft cocktails and premium wines
• Rooftop terrace with panoramic views
• 24/7 concierge and butler service
• Meeting and event spaces

**Nearby attractions:** Kalemegdan (5 min walk), Skadarlija (10 min), Republic Square (3 min)

Perfect for: Business travelers, romantic getaways, and luxury seekers.`,
    shortDesc: "Luxury boutique hotel in the heart of Belgrade",
    address: "Studentski trg 9, Belgrade",
    latitude: 44.8139,
    longitude: 20.4589,
    images: "[\"/images/locations/square-nine-hotel.jpg\"]",
    rating: 4.7,
    priceLevel: 4,
    phone: "+381 11 3333 000",
    website: "https://www.squarenine.rs",
    bookingUrl: "https://booking.com/hotel/rs/square-nine",
    openingHours: null,
    featured: true,
    verified: true,
    categoryId: "cat-accommodation",
    createdAt: "2026-02-20T19:41:22.983Z",
    updatedAt: "2026-02-20T19:41:22.983Z",
    category: staticCategories.find(c => c.id === "cat-accommodation")
  },
  {
    id: "loc-splavovi",
    name: "Sava River Clubs (Splavovi)",
    slug: "river-clubs",
    description: `Belgrade's famous floating river clubs (splavovi) are unique venues anchored along the Sava and Danube rivers. These legendary clubs define Belgrade's reputation as one of Europe's premier nightlife destinations.

**Popular clubs:**
• **20/44** - Electronic music, underground vibes
• **Freestyler** - Commercial hits, party atmosphere
• **Shake'n'Shake** - House music, beach bar feel
• **Drugstore** - Alternative and indie
• **Lasta** - Pop and local favorites
• **Toranj** - Exclusive VIP experience

**What to know:**
• Entry usually free before midnight
• Parties continue until 5-6 AM
• Dress code varies by venue
• Summer season: May-October
• Indoor venues available in winter

Average drink price: €3-7. Best nights: Friday and Saturday.`,
    shortDesc: "Legendary floating clubs on the Sava River",
    address: "Sava Riverbank (Savamala), Belgrade",
    latitude: 44.8089,
    longitude: 20.4519,
    images: "[\"/images/locations/river-clubs.jpg\"]",
    rating: 4.5,
    priceLevel: 2,
    phone: null,
    website: null,
    bookingUrl: null,
    openingHours: "{\"open\":\"22:00\",\"close\":\"05:00\"}",
    featured: true,
    verified: true,
    categoryId: "cat-nightlife",
    createdAt: "2026-02-20T19:41:22.982Z",
    updatedAt: "2026-02-20T19:41:22.982Z",
    category: staticCategories.find(c => c.id === "cat-nightlife")
  },
  {
    id: "loc-moscow",
    name: "Hotel Moskva",
    slug: "hotel-moskva",
    description: `Hotel Moskva is a Belgrade landmark and one of the most iconic hotels in the Balkans. Built in 1908, this Art Nouveau masterpiece has hosted royalty, politicians, and celebrities throughout its illustrious history.

**Historic features:**
• Original Art Nouveau architecture and interior
• Famous pastry shop - try the legendary Moskva Šnit cake
• Rooftop views of Terazije Square
• Historic significance - survived both World Wars
• Named after Russian capital due to Russian investors

**Famous guests:** Albert Einstein, Nikola Tesla, Alfred Hitchcock, numerous heads of state

The hotel's prime location across from Terazije Square makes it perfect for exploring Belgrade's city center. Don't miss the legendary café with its Vienna-style pastries and coffee culture.`,
    shortDesc: "Iconic 1908 Art Nouveau hotel in the city center",
    address: "Terazije 19, Belgrade",
    latitude: 44.8117,
    longitude: 20.4586,
    images: "[\"/images/locations/hotel-moskva.jpg\"]",
    rating: 4.5,
    priceLevel: 3,
    phone: "+381 11 3020 100",
    website: "https://www.hotelmoskva.rs",
    bookingUrl: "https://booking.com/hotel/rs/moskva",
    openingHours: null,
    featured: true,
    verified: true,
    categoryId: "cat-accommodation",
    createdAt: "2026-02-20T19:41:22.984Z",
    updatedAt: "2026-02-20T19:41:22.984Z",
    category: staticCategories.find(c => c.id === "cat-accommodation")
  },
  {
    id: "loc-knez-mihailova",
    name: "Knez Mihailova Street",
    slug: "knez-mihailova",
    description: `Knez Mihailova Street is Belgrade's main pedestrian thoroughfare and one of the city's most valuable cultural-historical areas. This lively street connects Terazije Square to Kalemegdan Fortress, making it the perfect starting point for exploring Belgrade.

**What you'll find:**
• International and Serbian fashion brands
• Historic buildings with architectural significance
• Outdoor cafés and restaurants
• Street performers and artists
• Bookstores and art galleries
• Souvenir shops

**Historic buildings include:**
• Palata Riunione (Riunione Palace)
• Serbian Academy of Sciences and Arts
• Russian House cultural center
• Hotel Moskva at the beginning of the street

The street is always bustling with locals and tourists, especially during evening hours. Great for people-watching from one of many café terraces.`,
    shortDesc: "Main pedestrian shopping street in the city center",
    address: "Knez Mihailova Street, Belgrade",
    latitude: 44.8158,
    longitude: 20.4565,
    images: "[\"/images/locations/knez-mihailova.jpg\"]",
    rating: 4.4,
    priceLevel: 2,
    phone: null,
    website: null,
    bookingUrl: null,
    openingHours: "{\"open\":\"08:00\",\"close\":\"22:00\"}",
    featured: true,
    verified: true,
    categoryId: "cat-landmark",
    createdAt: "2026-02-20T19:41:22.975Z",
    updatedAt: "2026-02-20T19:41:22.975Z",
    category: staticCategories.find(c => c.id === "cat-landmark")
  },
  {
    id: "loc-avala",
    name: "Avala Tower",
    slug: "avala-tower",
    description: `Avala Tower stands as a symbol of Belgrade's resilience. Rising 204.5 meters from Mount Avala, this unique TV tower is the only tower in the world with an eccentric base (not centered). The observation deck offers spectacular 360-degree views of Belgrade and the surrounding region.

**History:**
• Original tower built in 1965, destroyed in 1999 NATO bombing
• Rebuilt and opened in 2010 as a symbol of Serbian determination
• One of Belgrade's most recognizable landmarks

**Visitor information:**
• Observation deck at 115m height
• Panoramic restaurant
• Elevator access
• Surrounding park with picnic areas
• Monument to the Unknown Hero nearby

**Getting there:** 20-minute drive from city center, or bus line 401 from Vukov Spomenik. Best time to visit: Clear days for maximum visibility.`,
    shortDesc: "Iconic TV tower with panoramic views of Belgrade",
    address: "Mount Avala, Belgrade",
    latitude: 44.6872,
    longitude: 20.5164,
    images: "[\"/images/locations/avala-tower.jpg\"]",
    rating: 4.6,
    priceLevel: 1,
    phone: null,
    website: null,
    bookingUrl: null,
    openingHours: "{\"open\":\"09:00\",\"close\":\"20:00\"}",
    featured: true,
    verified: true,
    categoryId: "cat-landmark",
    createdAt: "2026-02-20T19:41:22.976Z",
    updatedAt: "2026-02-20T19:41:22.976Z",
    category: staticCategories.find(c => c.id === "cat-landmark")
  },
  {
    id: "loc-republic-square",
    name: "Republic Square (Trg Republike)",
    slug: "republic-square",
    description: `Republic Square is the central square of Belgrade and the most popular meeting point in the city. Dominated by the iconic equestrian statue of Prince Mihailo Obrenović, the square is surrounded by some of Belgrade's most important cultural institutions.

**Key landmarks:**
• Prince Mihailo Monument - Meeting point for locals
• National Museum of Serbia - Largest museum in the country
• National Theater - Opera, ballet, and drama performances
• Cultural Center of Belgrade - Contemporary art exhibitions

**Popular with locals:**
"Vidimo se kod konja!" ("See you at the horse!") is the most common phrase for arranging meetings here. The square connects to Knez Mihailova Street and is always filled with street performers, artists, and tourists.

Evening atmosphere: The square comes alive after sunset with illuminated buildings and outdoor events.`,
    shortDesc: "Central square with iconic Prince Mihailo monument",
    address: "Republic Square, Belgrade",
    latitude: 44.8135,
    longitude: 20.4603,
    images: "[\"/images/locations/republic-square.jpg\"]",
    rating: 4.3,
    priceLevel: 0,
    phone: null,
    website: null,
    bookingUrl: null,
    openingHours: null,
    featured: true,
    verified: true,
    categoryId: "cat-landmark",
    createdAt: "2026-02-20T19:41:22.979Z",
    updatedAt: "2026-02-20T19:41:22.979Z",
    category: staticCategories.find(c => c.id === "cat-landmark")
  },
  {
    id: "loc-national-museum",
    name: "National Museum of Serbia",
    slug: "national-museum",
    description: `The National Museum of Serbia is the oldest and largest museum in the country, housing an extensive collection spanning from prehistoric times to contemporary art. Located on Republic Square, it's an essential stop for understanding Serbian and Balkan heritage.

**Collections include:**
• Prehistoric artifacts from Vinča culture (7000 BC)
• Medieval Serbian art and religious icons
• European paintings (Picasso, Renoir, Monet, Cézanne)
• Serbian modern art
• Numismatic collection with rare coins
• Archaeological finds from across Serbia

**Must-see highlights:**
• Miroslav Gospels - 12th century illuminated manuscript
• Picasso's "Head of a Woman"
• Extensive collection of Serbian medieval art

**Visitor tips:** Audio guides available. Plan 2-3 hours for a comprehensive visit.`,
    shortDesc: "Serbia's largest museum with world-class art collections",
    address: "Republic Square 1a, Belgrade",
    latitude: 44.8131,
    longitude: 20.4598,
    images: "[\"/images/locations/national-museum.jpg\"]",
    rating: 4.6,
    priceLevel: 1,
    phone: "+381 11 3315 700",
    website: "https://www.narodnimuzej.rs",
    bookingUrl: null,
    openingHours: "{\"open\":\"10:00\",\"close\":\"18:00\",\"closed\":\"Monday\"}",
    featured: false,
    verified: true,
    categoryId: "cat-museum",
    createdAt: "2026-02-20T19:41:22.987Z",
    updatedAt: "2026-02-20T19:41:22.987Z",
    category: staticCategories.find(c => c.id === "cat-museum")
  },
  {
    id: "loc-strahinjica-bana",
    name: "Strahinjića Bana Street (Silicone Valley)",
    slug: "strahinjica-bana",
    description: `Strahinjića Bana Street in Dorćol is Belgrade's trendiest nightlife strip, nicknamed "Silicone Valley" for its glamorous atmosphere. This narrow street packs more bars and cafés per square meter than anywhere else in the city.

**Popular venues:**
• Čarolija - Cozy cocktail bar
• Tezga - Craft beer and live music
• Ona - Stylish lounge bar
• Bulevar - Modern café by day, bar by night
• Tevrđik - Traditional rakia bar

**Atmosphere:**
• Young, trendy crowd
• Outdoor seating in summer
• Cocktails from €4-8
• Live music on weekends
• Great for bar-hopping

Best nights: Thursday-Saturday, from 9 PM onwards. The street transforms from quiet daytime cafés to a bustling nightlife destination after dark.`,
    shortDesc: "Trendy bar street in Dorćol district",
    address: "Strahinjića Bana Street, Dorćol, Belgrade",
    latitude: 44.8192,
    longitude: 20.4598,
    images: "[\"/images/locations/strahinjica-bana.jpg\"]",
    rating: 4.4,
    priceLevel: 2,
    phone: null,
    website: null,
    bookingUrl: null,
    openingHours: "{\"open\":\"08:00\",\"close\":\"02:00\"}",
    featured: false,
    verified: true,
    categoryId: "cat-nightlife",
    createdAt: "2026-02-20T19:41:22.981Z",
    updatedAt: "2026-02-20T19:41:22.981Z",
    category: staticCategories.find(c => c.id === "cat-nightlife")
  },
  {
    id: "loc-frans",
    name: "Franš Restaurant",
    slug: "frans",
    description: `Franš is an elegant French restaurant in the heart of Belgrade, offering sophisticated cuisine in a refined atmosphere. Perfect for special occasions and romantic dinners.

**Cuisine:** Modern French with Serbian influences

**Signature dishes:**
• Beef Bourguignon
• Duck Confit
• Fresh seafood platters
• Extensive wine list (French and Serbian wines)
• Artisanal French pastries for dessert

**Ambiance:**
• Elegant interior design
• Candlelit tables
• Professional sommelier service
• Live piano music on weekends

Average price: €40-60 per person. Reservations recommended, especially for weekend dinners.`,
    shortDesc: "Elegant French fine dining in the city center",
    address: "Francuska 7, Dorćol, Belgrade",
    latitude: 44.8145,
    longitude: 20.4612,
    images: "[\"/images/locations/frans-restaurant.jpg\"]",
    rating: 4.6,
    priceLevel: 4,
    phone: "+381 11 3234 567",
    website: null,
    bookingUrl: null,
    openingHours: "{\"open\":\"12:00\",\"close\":\"23:00\"}",
    featured: false,
    verified: true,
    categoryId: "cat-food",
    createdAt: "2026-02-20T19:41:22.981Z",
    updatedAt: "2026-02-20T19:41:22.981Z",
    category: staticCategories.find(c => c.id === "cat-food")
  },
  {
    id: "loc-zavicaj",
    name: "Zavičaj Restaurant",
    slug: "zavicaj",
    description: `Zavičaj is a traditional Serbian kafana located on Skadarlija Street, offering authentic local cuisine and live folk music. Experience the true spirit of old Belgrade in this lively restaurant.

**Traditional dishes:**
• Roštilj (grilled meats) - Ćevapi, pljeskavica
• Karađorđeva šnicla (stuffed schnitzel)
• Prebranac (baked beans)
• Homemade bread and kajmak
• Rakia (fruit brandy) selection

**Entertainment:**
• Live tamburica music nightly
• Traditional folk singers
• Outdoor seating in summer
• Festive atmosphere for celebrations

**Price range:** €15-25 per person including drinks and music. Perfect for groups and experiencing authentic Serbian hospitality.`,
    shortDesc: "Traditional Serbian kafana with live music on Skadarlija",
    address: "Skadarska 21, Belgrade",
    latitude: 44.8178,
    longitude: 20.4621,
    images: "[\"/images/locations/zavicaj-restaurant.jpg\"]",
    rating: 4.5,
    priceLevel: 2,
    phone: "+381 11 3245 539",
    website: null,
    bookingUrl: null,
    openingHours: "{\"open\":\"11:00\",\"close\":\"01:00\"}",
    featured: false,
    verified: true,
    categoryId: "cat-food",
    createdAt: "2026-02-20T19:41:22.980Z",
    updatedAt: "2026-02-20T19:41:22.980Z",
    category: staticCategories.find(c => c.id === "cat-food")
  },
  {
    id: "loc-kosutnjak",
    name: "Košutnjak Forest Park",
    slug: "kosutnjak",
    description: `Košutnjak is a sprawling forest park covering 330 hectares on the edge of Belgrade. This green oasis offers numerous recreational activities and is a favorite escape for locals seeking nature.

**Activities:**
• Hiking and nature trails
• Mountain biking paths
• Sports courts (tennis, basketball)
• Paintball and archery
• Children's playgrounds
• Restaurants and cafés
• Hajd Park - wellness and spa complex

**Natural features:**
• Dense oak and hornbeam forest
• Several natural springs
• Wildlife spotting (deer, foxes, birds)
• Spectacular viewpoints over Belgrade

**Getting there:** Bus lines 23, 37, 50, 52. Perfect for day trips and weekend picnics. Best seasons: Spring and autumn.`,
    shortDesc: "330-hectare forest park for recreation and nature",
    address: "Košutnjak, Čukarica, Belgrade",
    latitude: 44.7628,
    longitude: 20.4222,
    images: "[\"/images/locations/kosutnjak.jpg\"]",
    rating: 4.4,
    priceLevel: 0,
    phone: null,
    website: null,
    bookingUrl: null,
    openingHours: "{\"open\":\"00:00\",\"close\":\"00:00\"}",
    featured: false,
    verified: true,
    categoryId: "cat-nature",
    createdAt: "2026-02-20T19:41:22.985Z",
    updatedAt: "2026-02-20T19:41:22.985Z",
    category: staticCategories.find(c => c.id === "cat-nature")
  },
  {
    id: "loc-usce",
    name: "Ušće Park",
    slug: "usce-park",
    description: `Ušće Park is located at the confluence (ušće) of the Sava and Danube rivers, offering spectacular views of both waterways and New Belgrade. This popular recreational area is perfect for picnics, walks, and outdoor activities.

**Highlights:**
• Panoramic views of Kalemegdan and Old Belgrade
• Confluence of two major rivers
• Walking and cycling paths
• Open-air events and concerts
• Barbecue areas
• Beach access in summer

**Nearby:**
• Museum of Contemporary Art
• USCE Shopping Center
• Belgrade Arena
• New Belgrade business district

**Best time to visit:** Sunset for stunning views of Kalemegdan Fortress illuminated across the water. Popular with joggers and cyclists year-round.`,
    shortDesc: "Park at the confluence of Sava and Danube rivers",
    address: "Ušće, Novi Beograd, Belgrade",
    latitude: 44.825,
    longitude: 20.4483,
    images: "[\"/images/locations/usce-park.jpg\"]",
    rating: 4.3,
    priceLevel: 0,
    phone: null,
    website: null,
    bookingUrl: null,
    openingHours: "{\"open\":\"00:00\",\"close\":\"00:00\"}",
    featured: false,
    verified: true,
    categoryId: "cat-nature",
    createdAt: "2026-02-20T19:41:22.986Z",
    updatedAt: "2026-02-20T19:41:22.986Z",
    category: staticCategories.find(c => c.id === "cat-nature")
  }
]
