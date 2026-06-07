/**
 * Full Global Tour Database for ZilliGO
 * Expanded with deep hierarchical data for India and other major regions.
 * Updated with High-Resolution Real Imagery.
 */

const baseCountries = [
  { name: "Afghanistan", capital: "Kabul", category: "Historical", img: "https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?w=1200&q=80" },
  { name: "Albania", capital: "Tirana", category: "Art & Culture", img: "https://images.unsplash.com/photo-1580993183141-86082987157a?w=1200&q=80" },
];

const indiaDeepData = [
  { city: "Bangalore", state: "Karnataka", category: "Tech & Innovation", img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&q=80" },
  { city: "Mumbai", state: "Maharashtra", category: "Urban Exploration", img: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=1200&q=80" },
  { city: "Jaipur", state: "Rajasthan", category: "Historical", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80" },
  { city: "Kochi", state: "Kerala", category: "Nature & Scenic", img: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&q=80" },
  { city: "New Delhi", state: "Delhi", category: "Historical", img: "https://images.unsplash.com/photo-1587474260584-1f21d42aebd8?w=1200&q=80" },
  { city: "Chennai", state: "Tamil Nadu", category: "Art & Culture", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80" },
];

const usaDeepData = [
  { city: "New York City", state: "New York", category: "Urban Exploration", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80" },
  { city: "Los Angeles", state: "California", category: "Art & Culture", img: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=1200&q=80" },
];

const worldMajorCities = [
  { country: "UK", city: "London", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80" },
  { country: "France", city: "Paris", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80" },
  { country: "Japan", city: "Tokyo", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80" },
  { country: "UAE", city: "Dubai", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80" },
  { country: "Italy", city: "Rome", img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80" },
  { country: "Egypt", city: "Cairo", img: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=1200&q=80" },
  { country: "Switzerland", city: "Bern", img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200&q=80" },
  { country: "Brazil", city: "Rio", img: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&q=80" },
];

export const GLOBAL_TOURS = [
  ...indiaDeepData.map((d, i) => ({
    id: `india-${i}`,
    title: `${d.city} ${d.category} Adventure`,
    description: `Deep dive into ${d.city}, ${d.state}. Explore the local culture, food, and landmarks with a native expert.`,
    location: `${d.city}, ${d.state}, India`,
    lat: 0, lng: 0,
    category: d.category,
    type: 'live',
    price: 15 + i,
    currency: 'USD',
    duration: 90,
    rating: 4.8,
    reviewCount: 450,
    language: 'English, Hindi, Local',
    maxParticipants: 20,
    currentParticipants: 8,
    coverImage: d.img,
    guide: `g${(i % 8) + 1}`,
    tags: [d.category, 'India', d.state],
    upcoming: new Date(Date.now() + 86400000).toISOString(),
    featured: i === 0,
    kidFriendly: true,
  })),
  ...usaDeepData.map((d, i) => ({
    id: `usa-${i}`,
    title: `${d.city} Full City Tour`,
    description: `Explore the best of ${d.city}, ${d.state} in this immersive live session.`,
    location: `${d.city}, ${d.state}, USA`,
    lat: 0, lng: 0,
    category: d.category,
    type: 'live',
    price: 25 + i,
    currency: 'USD',
    duration: 120,
    rating: 4.9,
    reviewCount: 890,
    language: 'English',
    maxParticipants: 15,
    currentParticipants: 5,
    coverImage: d.img,
    guide: `g${(i % 8) + 1}`,
    tags: [d.category, 'USA', d.state],
    upcoming: new Date(Date.now() + 172800000).toISOString(),
    featured: false,
    kidFriendly: true,
  })),
  ...worldMajorCities.map((d, i) => ({
    id: `world-major-${i}`,
    title: `Experience ${d.city}, ${d.country}`,
    description: `A breathtaking journey through the most iconic parts of ${d.city}.`,
    location: `${d.city}, ${d.country}`,
    lat: 0, lng: 0,
    category: i % 2 === 0 ? 'Historical' : 'Nature & Scenic',
    type: 'recorded',
    price: 19,
    currency: 'USD',
    duration: 75,
    rating: 4.7,
    reviewCount: 340,
    language: 'English',
    maxParticipants: 999,
    currentParticipants: 0,
    coverImage: d.img,
    guide: `g${(i % 8) + 1}`,
    tags: ['World', d.country],
    upcoming: null,
    featured: false,
    kidFriendly: true,
  }))
];
