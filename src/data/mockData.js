// Static data constants that are safe to be hardcoded on frontend

export const TOURS = [];
export const GUIDES = [];
export const STATS = {
  tours: 1200,
  guides: 800,
  cities: 180,
  travelers: 340000
};

export const CATEGORIES = [
  { id: 'historical', label: 'Historical & Cultural', icon: '🏛️', count: 420 },
  { id: 'food', label: 'Food & Culinary', icon: '🍜', count: 350 },
  { id: 'adventure', label: 'Adventure & Nature', icon: '🌋', count: 210 },
  { id: 'nightlife', label: 'Nightlife & Entertainment', icon: '🎵', count: 180 },
  { id: 'art', label: 'Art & Museums', icon: '🎨', count: 290 },
  { id: 'shopping', label: 'Local Shopping', icon: '🛍️', count: 150 },
  { id: 'wellness', label: 'Wellness & Retreat', icon: '🧘', count: 90 },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    rating: 5,
    tour: "Night walk in Shibuya",
    text: "Felt exactly like I was walking through Tokyo. The guide answered all my questions in real-time. Unbelievable experience!"
  },
  {
    id: 2,
    name: "David Chen",
    location: "Toronto, CA",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    rating: 5,
    tour: "Colosseum Underground",
    text: "Saved thousands on flights and still got to see the Colosseum up close without the crowds. The guide was incredibly knowledgeable."
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    location: "Madrid, ES",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    rating: 5,
    tour: "Street Food in Bangkok",
    text: "I could almost smell the Pad Thai! The 4K streaming quality was flawless and the interaction with the local vendors was so authentic."
  }
];

export const getGuideById = (id) => null;
