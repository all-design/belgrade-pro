import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  {
    id: 'cat-landmark',
    name: 'Landmarks',
    slug: 'landmarks',
    icon: 'landmark',
    color: '#FF6B35', // Vivid orange like Budva map
    description: 'Historical and cultural landmarks of Belgrade'
  },
  {
    id: 'cat-accommodation',
    name: 'Accommodation',
    slug: 'accommodation',
    icon: 'bed',
    color: '#3498DB', // Vivid blue
    description: 'Hotels, apartments and accommodation'
  },
  {
    id: 'cat-food',
    name: 'Food & Dining',
    slug: 'food',
    icon: 'utensils',
    color: '#E74C3C', // Vivid red
    description: 'Restaurants, cafes and local cuisine'
  },
  {
    id: 'cat-nightlife',
    name: 'Nightlife',
    slug: 'nightlife',
    icon: 'wine',
    color: '#9B59B6', // Vivid purple
    description: 'Bars, clubs and river boats'
  },
  {
    id: 'cat-nature',
    name: 'Nature & Parks',
    slug: 'nature',
    icon: 'tree',
    color: '#94AB3B', // Park green from brief
    description: 'Parks, rivers and recreational areas'
  },
  {
    id: 'cat-museum',
    name: 'Museums',
    slug: 'museums',
    icon: 'museum',
    color: '#2980B9', // Vivid dark blue
    description: 'Museums and galleries'
  }
];

const locations = [
  // Landmarks
  {
    id: 'loc-kalemegdan',
    name: 'Kalemegdan Fortress',
    slug: 'kalemegdan',
    description: `Kalemegdan is the oldest and largest cultural monument in Belgrade. The fortress is located at the confluence of the Sava and Danube rivers, on a prominent ridge that has been strategically important throughout history. Today it is the most visited tourist attraction in Belgrade with stunning views of the rivers and New Belgrade.

Inside the fortress walls you will find:
- The Victor monument (Pobednik)
- Clock Tower (Sahat Kula)
- Roman Well
- Ružica Church
- Military Museum
- Zindan Gate and Istanbul Gate`,
    shortDesc: 'Historic fortress with park and breathtaking river views',
    address: 'Kalemegdan, Belgrade',
    latitude: 44.8227,
    longitude: 20.4512,
    rating: 4.8,
    priceLevel: 0,
    images: JSON.stringify(['/images/kalemegdan.jpg']),
    openingHours: JSON.stringify({ open: '06:00', close: '00:00', note: 'Park open 24/7' }),
    featured: true,
    verified: true,
    categoryId: 'cat-landmark'
  },
  {
    id: 'loc-hram-save',
    name: 'Saint Sava Temple',
    slug: 'saint-sava-temple',
    description: `The Temple of Saint Sava is the largest Orthodox church in the Balkans and one of the largest in the world. Its construction lasted over a century. The impressive architecture in Serbian-Byzantine style features an incredible interior that takes your breath away.

The crypt is particularly impressive, fully decorated with frescoes representing a true masterpiece of modern Serbian art. The golden dome dominates the Belgrade skyline.`,
    shortDesc: 'The largest Orthodox church in the Balkans',
    address: 'Krušedolska 2a, Belgrade',
    latitude: 44.7936,
    longitude: 20.4694,
    rating: 4.9,
    priceLevel: 0,
    images: JSON.stringify(['/images/hram.jpg']),
    openingHours: JSON.stringify({ open: '07:00', close: '20:00' }),
    featured: true,
    verified: true,
    categoryId: 'cat-landmark'
  },
  {
    id: 'loc-skadarlija',
    name: 'Skadarlija Street',
    slug: 'skadarlija',
    description: `Skadarlija is the old bohemian quarter of Belgrade, known as "Belgrade's Montmartre". This pedestrian street is filled with traditional restaurants (kafanas) with live music, preserving the spirit of old Belgrade from the 19th century.

Famous restaurants include:
- Dva Jelena (Two Deer) - since 1832
- Tri Šešira (Three Hats) - since 1864
- Šešir Moj (My Hat)
- Zlatni Bokal`,
    shortDesc: 'Historic bohemian street with traditional restaurants',
    address: 'Skadarska Street, Belgrade',
    latitude: 44.8175,
    longitude: 20.4619,
    rating: 4.6,
    priceLevel: 3,
    images: JSON.stringify(['/images/skadarlija.jpg']),
    openingHours: JSON.stringify({ open: '11:00', close: '02:00' }),
    featured: true,
    verified: true,
    categoryId: 'cat-food'
  },
  {
    id: 'loc-ada',
    name: 'Ada Ciganlija',
    slug: 'ada-ciganlija',
    description: `Ada Ciganlija is a river island on the Sava that was artificially turned into a peninsula. Known as "Belgrade's Sea" with 7 km of arranged beaches, numerous sports courts, restaurants and cafes. Perfect for summer days.

Activities include:
- Swimming and sunbathing
- Biking and rollerblading
- Beach volleyball and basketball
- Bungee jumping
- Golf course
- Numerous restaurants and beach bars`,
    shortDesc: "Belgrade's Sea - 7km of beach on the Sava River",
    address: 'Ada Ciganlija, Belgrade',
    latitude: 44.7864,
    longitude: 20.4036,
    rating: 4.5,
    priceLevel: 1,
    images: JSON.stringify(['/images/ada.jpg']),
    openingHours: JSON.stringify({ open: '00:00', close: '00:00', note: 'Open 24/7' }),
    featured: true,
    verified: true,
    categoryId: 'cat-nature'
  },
  {
    id: 'loc-knez-mihailova',
    name: 'Knez Mihailova Street',
    slug: 'knez-mihailova',
    description: `Knez Mihailova is the main pedestrian street in Belgrade and one of the oldest and most valuable cultural-historical areas of the city. Filled with boutiques, cafes, restaurants and historic buildings. It leads from Terazije to Kalemegdan.

Historic buildings include:
- Palata Riunione
- Serbian Academy of Sciences building
- Russian House
- Hotel Moskva (at Terazije)`,
    shortDesc: 'Main pedestrian shopping street',
    address: 'Knez Mihailova, Belgrade',
    latitude: 44.8158,
    longitude: 20.4565,
    rating: 4.4,
    priceLevel: 2,
    images: JSON.stringify(['/images/knez.jpg']),
    openingHours: JSON.stringify({ open: '08:00', close: '22:00' }),
    featured: true,
    verified: true,
    categoryId: 'cat-landmark'
  },
  {
    id: 'loc-avala',
    name: 'Avala Tower',
    slug: 'avala-tower',
    description: `Avala Tower is a TV tower on Mount Avala, 204.5 meters high. It is the only tower in the world with an eccentric base (not in the center). From the observation deck, there is an incredible view of Belgrade and the surroundings.

The original tower was destroyed in 1999 NATO bombing, and the new one opened in 2010. It has become a symbol of Belgrade's resilience.`,
    shortDesc: 'Impressive TV tower with observation deck',
    address: 'Avala Mountain, Belgrade',
    latitude: 44.6872,
    longitude: 20.5164,
    rating: 4.6,
    priceLevel: 1,
    images: JSON.stringify(['/images/avala.jpg']),
    openingHours: JSON.stringify({ open: '09:00', close: '20:00', note: 'Observation deck' }),
    featured: true,
    verified: true,
    categoryId: 'cat-landmark'
  },
  {
    id: 'loc-nikola-tesla-museum',
    name: 'Nikola Tesla Museum',
    slug: 'nikola-tesla-museum',
    description: `The Nikola Tesla Museum preserves the legacy of one of the world's greatest scientists. Located in a beautiful villa from 1927. The museum has original documents, drawings and laboratory demonstrations of Tesla's inventions.

Interactive exhibits include:
- Working Tesla coils
- Remote control demonstrations
- Original patents and documents
- Personal belongings and photographs`,
    shortDesc: 'Museum dedicated to genius Nikola Tesla',
    address: 'Proleterske solidarnosti 31, Belgrade',
    latitude: 44.8019,
    longitude: 20.4683,
    rating: 4.7,
    priceLevel: 1,
    images: JSON.stringify(['/images/tesla.jpg']),
    openingHours: JSON.stringify({ open: '10:00', close: '20:00', closed: 'Monday' }),
    featured: true,
    verified: true,
    categoryId: 'cat-museum'
  },
  {
    id: 'loc-republic-square',
    name: 'Republic Square',
    slug: 'republic-square',
    description: `Republic Square is the central square of Belgrade with the iconic equestrian statue of Prince Mihailo. Surrounded by the National Museum and National Theater. One of the most famous meeting spots in the city.`,
    shortDesc: 'Central square with Prince Mihailo monument',
    address: 'Republic Square, Belgrade',
    latitude: 44.8135,
    longitude: 20.4603,
    rating: 4.3,
    priceLevel: 0,
    images: JSON.stringify(['/images/trg.jpg']),
    featured: true,
    verified: true,
    categoryId: 'cat-landmark'
  },
  // Food
  {
    id: 'loc-zavicaj',
    name: 'Zavičaj Restaurant',
    slug: 'zavicaj',
    description: `Traditional Serbian restaurant in Skadarlija with authentic cuisine and live music. Known for excellent barbecue, homemade specialties and warm atmosphere. Perfect for experiencing a real kafana.`,
    shortDesc: 'Traditional kafana in Skadarlija',
    address: 'Skadarska 21, Belgrade',
    latitude: 44.8178,
    longitude: 20.4621,
    rating: 4.5,
    priceLevel: 2,
    phone: '+381 11 3245 539',
    images: JSON.stringify(['/images/zavicaj.jpg']),
    openingHours: JSON.stringify({ open: '11:00', close: '01:00' }),
    featured: false,
    verified: true,
    categoryId: 'cat-food'
  },
  {
    id: 'loc-frans',
    name: 'Franš Restaurant',
    slug: 'frans',
    description: `Modern French restaurant in the center of Belgrade. Known for sophisticated cuisine, excellent wine list and elegant interior. Perfect for special occasions and romantic dinners.`,
    shortDesc: 'Elegant French restaurant',
    address: 'Francuska 7, Belgrade',
    latitude: 44.8145,
    longitude: 20.4612,
    rating: 4.6,
    priceLevel: 4,
    phone: '+381 11 3234 567',
    images: JSON.stringify(['/images/frans.jpg']),
    openingHours: JSON.stringify({ open: '12:00', close: '23:00' }),
    featured: false,
    verified: true,
    categoryId: 'cat-food'
  },
  // Nightlife
  {
    id: 'loc-strahinjica-bana',
    name: 'Strahinjića Bana Street',
    slug: 'strahinjica-bana',
    description: `Strahinjića Bana is a street in Dorćol known for numerous bars, cafes and restaurants. The center of Belgrade's nightlife, where young creative crowds gather. Great atmosphere until late at night.`,
    shortDesc: 'Street with the best bars in town',
    address: 'Strahinjića Bana, Belgrade',
    latitude: 44.8192,
    longitude: 20.4598,
    rating: 4.4,
    priceLevel: 2,
    images: JSON.stringify(['/images/strahinjic.jpg']),
    openingHours: JSON.stringify({ open: '08:00', close: '02:00' }),
    featured: false,
    verified: true,
    categoryId: 'cat-nightlife'
  },
  {
    id: 'loc-splavovi',
    name: 'River Clubs (Splavovi)',
    slug: 'river-clubs',
    description: `Belgrade's river clubs (splavovi) are unique floating clubs along the banks of the Sava River. Offering diverse music from local folk to electronic. In summer, this is the epicenter of nightlife with an incredible atmosphere.

Popular clubs include:
- 20/44 (electronic music)
- Freestyler (commercial)
- Shake'n'Shake (house)
- Drugstore (alternative)`,
    shortDesc: 'Floating clubs on the Sava - heart of nightlife',
    address: 'Sava Riverbank, Belgrade',
    latitude: 44.8089,
    longitude: 20.4519,
    rating: 4.5,
    priceLevel: 2,
    images: JSON.stringify(['/images/splavovi.jpg']),
    openingHours: JSON.stringify({ open: '22:00', close: '05:00' }),
    featured: true,
    verified: true,
    categoryId: 'cat-nightlife'
  },
  // Accommodation
  {
    id: 'loc-square-nine',
    name: 'Square Nine Hotel',
    slug: 'square-nine-hotel',
    description: `Luxury boutique hotel in the heart of Belgrade, right next to Knez Mihailova. Offers elegant rooms, spa center and top restaurant. Perfect for business and tourist visits.

5-star service with:
- Spa and wellness center
- Rooftop terrace
- Fine dining restaurant
- 24/7 concierge`,
    shortDesc: 'Luxury boutique hotel in the center',
    address: 'Studentski trg 9, Belgrade',
    latitude: 44.8139,
    longitude: 20.4589,
    rating: 4.7,
    priceLevel: 4,
    phone: '+381 11 3333 000',
    website: 'https://www.squarenine.rs',
    bookingUrl: 'https://booking.com/hotel/square-nine',
    images: JSON.stringify(['/images/squarenine.jpg']),
    featured: true,
    verified: true,
    categoryId: 'cat-accommodation'
  },
  {
    id: 'loc-moscow',
    name: 'Hotel Moskva',
    slug: 'hotel-moskva',
    description: `Historic hotel from 1908, one of the most recognizable symbols of Belgrade. Art Nouveau architecture, rich history and legendary cakes in the iconic café. Located across from Terazije Square.

A Belgrade landmark featuring:
- Original Art Nouveau interior
- Famous pastry shop
- Historical significance
- Prime location`,
    shortDesc: 'Legendary hotel with Art Nouveau architecture',
    address: 'Terazije 19, Belgrade',
    latitude: 44.8117,
    longitude: 20.4586,
    rating: 4.5,
    priceLevel: 3,
    phone: '+381 11 3020 100',
    website: 'https://www.hotelmoskva.rs',
    images: JSON.stringify(['/images/moskva.jpg']),
    featured: true,
    verified: true,
    categoryId: 'cat-accommodation'
  },
  // Nature
  {
    id: 'loc-kosutnjak',
    name: 'Košutnjak Park',
    slug: 'kosutnjak',
    description: `Košutnjak is a forest park and sports-recreational center covering 330 hectares. Numerous walking trails, sports courts, restaurants and Hajd Park make it a favorite recreation spot.`,
    shortDesc: 'Large forest park for recreation',
    address: 'Košutnjak, Belgrade',
    latitude: 44.7628,
    longitude: 20.4222,
    rating: 4.4,
    priceLevel: 0,
    images: JSON.stringify(['/images/kosutnjak.jpg']),
    openingHours: JSON.stringify({ open: '00:00', close: '00:00' }),
    featured: false,
    verified: true,
    categoryId: 'cat-nature'
  },
  {
    id: 'loc-usce',
    name: 'Ušće Park',
    slug: 'usce-park',
    description: `Ušće is a park at the confluence of the Sava and Danube rivers, near Kalemegdan. Offers incredible views of the rivers and New Belgrade. Popular spot for walking, barbecues and enjoying nature.`,
    shortDesc: 'Park at the confluence of two rivers',
    address: 'Ušće, Belgrade',
    latitude: 44.8250,
    longitude: 20.4483,
    rating: 4.3,
    priceLevel: 0,
    images: JSON.stringify(['/images/usce.jpg']),
    openingHours: JSON.stringify({ open: '00:00', close: '00:00' }),
    featured: false,
    verified: true,
    categoryId: 'cat-nature'
  },
  // Museums
  {
    id: 'loc-national-museum',
    name: 'National Museum',
    slug: 'national-museum',
    description: `The National Museum is the oldest and largest museum institution in Serbia. Located in the building on Republic Square. Rich collection of artworks from ancient times to contemporary art.`,
    shortDesc: 'The largest museum in Serbia',
    address: 'Republic Square 1a, Belgrade',
    latitude: 44.8131,
    longitude: 20.4598,
    rating: 4.6,
    priceLevel: 1,
    phone: '+381 11 3315 700',
    images: JSON.stringify(['/images/narodni.jpg']),
    openingHours: JSON.stringify({ open: '10:00', close: '18:00', closed: 'Monday' }),
    featured: false,
    verified: true,
    categoryId: 'cat-museum'
  }
];

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.location.deleteMany();
  await prisma.category.deleteMany();
  console.log('Cleared existing data');

  // Create categories
  for (const category of categories) {
    await prisma.category.create({
      data: category
    });
  }
  console.log('Categories created');

  // Create locations
  for (const location of locations) {
    await prisma.location.create({
      data: location
    });
  }
  console.log('Locations created');

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
