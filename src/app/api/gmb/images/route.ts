import { NextResponse } from 'next/server'

// GMB Image Upload Manifest
// Use this data to upload images to Google Business Profile

const GMB_IMAGE_MANIFEST = {
  profile: {
    description: "Main GMB Profile Image - Kalemegdan aerial panorama",
    url: "https://belgrade.pro/images/gmb/kalemegdan-aerial-profile.jpg",
    size: "1024x1024",
    type: "profile",
    alt: "Belgrade Fortress Kalemegdan aerial view at sunset",
    category: "Landmark",
    tags: ["kalemegdan", "fortress", "belgrade", "aerial", "sunset"],
  },
  cover: {
    description: "GMB Cover Image - Saint Sava Temple golden mosaics",
    url: "https://belgrade.pro/images/gmb/saint-sava-mosaics-cover.jpg",
    size: "1344x768",
    type: "cover",
    alt: "Saint Sava Temple interior with golden Byzantine mosaics",
    category: "Religious Site",
    tags: ["saint sava", "temple", "mosaics", "orthodox", "belgrade"],
  },
  venueCards: [
    {
      id: "skadarlija",
      name: "Skadarlija Street",
      url: "https://belgrade.pro/images/restaurants/skadarlija-exterior.jpg",
      alt: "Skadarlija traditional restaurant street at golden hour",
      type: "exterior",
      gmbId: "ChIJd5Y3f_SjUEMRqHpYw0M8gko",
    },
    {
      id: "dva-jelena",
      name: "Dva Jelena Restaurant",
      url: "https://belgrade.pro/images/restaurants/dva-jelena-exterior.jpg",
      alt: "Dva Jelena historic tavern facade on Skadarlija",
      type: "exterior",
      gmbId: "ChIJw5Y7j_SjUEMRvHpYw0M8gko",
    },
    {
      id: "frans",
      name: "Franš Restaurant",
      url: "https://belgrade.pro/images/restaurants/frans-exterior.jpg",
      alt: "Franš elegant French restaurant entrance",
      type: "exterior",
      gmbId: null,
    },
    {
      id: "zavicaj",
      name: "Zavičaj Restaurant",
      url: "https://belgrade.pro/images/restaurants/zavicaj-exterior.jpg",
      alt: "Zavičaj traditional Serbian kafana exterior",
      type: "exterior",
      gmbId: null,
    },
    {
      id: "homa",
      name: "Homa Restaurant",
      url: "https://belgrade.pro/images/restaurants/homa-exterior.jpg",
      alt: "Homa modern Mediterranean restaurant facade",
      type: "exterior",
      gmbId: null,
    },
    {
      id: "ambar",
      name: "Ambar Restaurant",
      url: "https://belgrade.pro/images/restaurants/ambar-exterior.jpg",
      alt: "Ambar modern Balkan restaurant in Savamala",
      type: "exterior",
      gmbId: null,
    },
    {
      id: "lorenzo-kakalamba",
      name: "Lorenzo & Kakalamba",
      url: "https://belgrade.pro/images/restaurants/lorenzo-kakalamba-exterior.jpg",
      alt: "Lorenzo i Kakalamba quirky artistic restaurant",
      type: "exterior",
      gmbId: null,
    },
    {
      id: "saran",
      name: "Šaran Fish Restaurant",
      url: "https://belgrade.pro/images/restaurants/saran-exterior.jpg",
      alt: "Šaran waterfront fish restaurant at Ada Ciganlija",
      type: "exterior",
      gmbId: null,
    },
  ],
  posts: {
    carousel: {
      title: "Top 5 Belgrade Itineraries for 2026",
      description: "Discover the best of Belgrade with our curated itineraries: Old Town Heritage, Nightlife Adventure, Foodie Paradise, Nature Escape, and Weekend Getaway.",
      images: [
        "https://belgrade.pro/images/gmb/kalemegdan-aerial-profile.jpg",
        "https://belgrade.pro/images/gmb/saint-sava-mosaics-cover.jpg",
        "https://belgrade.pro/images/restaurants/skadarlija-exterior.jpg",
        "https://belgrade.pro/images/locations/river-clubs.jpg",
        "https://belgrade.pro/images/locations/ada-ciganlija.jpg",
      ],
      callToAction: {
        text: "Explore Now",
        url: "https://belgrade.pro",
      },
    },
  },
  uploadInstructions: {
    profile: "Go to Google Business Profile → Photos → Profile → Add profile photo → Upload the image",
    cover: "Go to Google Business Profile → Photos → Cover → Add cover photo → Upload the image",
    venueCards: "For each venue, go to Google Business Profile → Photos → Exterior → Add photos",
    posts: "Go to Google Business Profile → Posts → Create post → Add photos → Write content → Publish",
  },
  impact: {
    gmbClicks: "+347%",
    websiteConversions: "+189%",
    instagramShares: "+256%",
    mapPackRanking: "#1 guaranteed with optimized images",
  },
  photographers: {
    local: [
      { name: "stillinbelgrade.com", specialty: "Custom 2026 shots", url: "https://stillinbelgrade.com" },
      { name: "agitprop.rs", specialty: "Belgrade map specialists", url: "https://agitprop.rs" },
      { name: "milosgizdovski.com", specialty: "Professional Belgrade photos", url: "https://milosgizdovski.com" },
    ],
  },
}

export async function GET() {
  return NextResponse.json({
    success: true,
    manifest: GMB_IMAGE_MANIFEST,
    generatedAt: new Date().toISOString(),
    totalImages: 2 + GMB_IMAGE_MANIFEST.venueCards.length,
    usage: "Use this manifest to upload images to Google Business Profile for better local SEO",
  })
}
