const { Pool } = require('pg');
require('dotenv').config();

let pool;
let isDemoMode = false;

try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 2000,
  });

  pool.on('error', (err) => {
    if (err.code === 'ECONNREFUSED' || err.message.includes('connect')) {
      isDemoMode = true;
    }
  });
} catch (err) {
  isDemoMode = true;
}

// Global In-Memory Mock DB state to handle signup/login & booking workflows when Postgres is offline
const mockDB = {
  users: [
    { id: 1, name: 'Admin User', email: 'admin@zilligo.com', password_hash: '$2b$10$ePWfm/5O/6glEPGRZWh1WuRxNG.P0WFegWqxs25a1p0tmm7QD7STq', role: 'admin', verified: true, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', bio: 'Main administrator of ZilliGo.', location: 'San Francisco, CA' },
    { id: 2, name: 'Alex Johnson', email: 'alex@example.com', password_hash: '$2b$10$ePWfm/5O/6glEPGRZWh1WuRxNG.P0WFegWqxs25a1p0tmm7QD7STq', role: 'traveler', verified: true, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80', bio: 'Adventure traveler & tech geek.', location: 'New York, NY' },
    { id: 3, name: 'Yuki Tanaka', email: 'yuki@example.com', password_hash: '$2b$10$ePWfm/5O/6glEPGRZWh1WuRxNG.P0WFegWqxs25a1p0tmm7QD7STq', role: 'guide', verified: true, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', bio: 'Tokyo nightlife & food guide. 5+ years experience.', location: 'Tokyo, Japan', hourly_rate: 45 },
    { id: 4, name: 'Priya Sharma', email: 'priya@example.com', password_hash: '$2b$10$ePWfm/5O/6glEPGRZWh1WuRxNG.P0WFegWqxs25a1p0tmm7QD7STq', role: 'guide', verified: true, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80', bio: 'Indian culture, heritage, and safari specialist.', location: 'Jaipur, India', hourly_rate: 35 },
    { id: 5, name: 'Sophie Dubois', email: 'sophie@example.com', password_hash: '$2b$10$ePWfm/5O/6glEPGRZWh1WuRxNG.P0WFegWqxs25a1p0tmm7QD7STq', role: 'guide', verified: true, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80', bio: 'Art historian & Paris native.', location: 'Paris, France', hourly_rate: 55 },
  ],
  refresh_tokens: [],
  login_history: [],
  tours: [
    { id: 1, guide_id: 3, title: 'Tokyo Neon Lights Tour', description: 'Explore Tokyo at night.', price: 45, location: 'Tokyo, Japan', rating: 4.8, review_count: 124, cover_image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=80', duration_minutes: 90, max_participants: 10 },
    { id: 2, guide_id: 5, title: 'Paris Midnight Walk', description: 'A charming stroll through the historic streets of Paris.', price: 55, location: 'Paris, France', rating: 4.9, review_count: 98, cover_image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', duration_minutes: 120, max_participants: 8 },
    { id: 3, guide_id: 3, title: 'Tokyo Street Food Walk', description: 'Taste standard local street food in Shibuya & Shinjuku.', price: 35, location: 'Tokyo, Japan', rating: 4.7, review_count: 67, cover_image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=80', duration_minutes: 60, max_participants: 15 },
    { id: 4, guide_id: 4, title: 'Rajasthan Desert Safari', description: 'Experience the golden desert sands and traditional culture.', price: 35, location: 'Jaipur, India', rating: 4.6, review_count: 45, cover_image: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?w=600&q=80', duration_minutes: 180, max_participants: 12 },
  ],
  bookings: [
    { id: 1, user_id: 2, tour_id: 1, booking_date: '2026-06-12', booking_time: '14:00', participants: 2, total_amount: 90, status: 'confirmed', created_at: new Date() },
    { id: 2, user_id: 2, tour_id: 4, booking_date: '2026-06-18', booking_time: '10:00', participants: 1, total_amount: 35, status: 'pending', created_at: new Date() },
    { id: 3, user_id: 2, tour_id: 2, booking_date: '2026-05-20', booking_time: '20:00', participants: 1, total_amount: 55, status: 'completed', created_at: new Date() },
  ],
  reviews: [],
  notifications: [
    { id: 1, user_id: 2, type: 'booking', title: 'Tour Confirmed!', message: 'Your booking for Tokyo Neon Lights Tour has been accepted.', reference_id: '1', is_read: false, created_at: new Date() }
  ],
  payments: [],
  transactions: [],
  commissions: [],
  refunds: [],
};

const runMockQuery = (text, params) => {
  const norm = text.replace(/\s+/g, ' ').trim();

  // 1. SELECT * FROM users WHERE email = $1
  if (norm.includes('FROM users WHERE email = $1')) {
    const user = mockDB.users.find(u => u.email === params[0]);
    return { rows: user ? [user] : [] };
  }

  // 2. INSERT INTO users
  if (norm.startsWith('INSERT INTO users')) {
    const name = params[0];
    const email = params[1];
    const password_hash = params[2];
    const role = params[3] || 'traveler';
    const newUser = {
      id: mockDB.users.length + 1,
      name,
      email,
      password_hash,
      role,
      verified: true, // Auto-verify in demo mode for ease
      suspended: false,
      reward_points: 100,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00F5D4&color=030712`,
      bio: '',
      location: '',
      created_at: new Date()
    };
    mockDB.users.push(newUser);
    return { rows: [newUser] };
  }

  // 3. SELECT id, name, email, role, avatar, verified... FROM users WHERE id = $1
  if (norm.includes('FROM users WHERE id = $1') || norm.includes('FROM users WHERE id=$1')) {
    const id = Number(params[0]);
    const user = mockDB.users.find(u => u.id === id);
    return { rows: user ? [user] : [] };
  }

  // 4. Guide/User profile lookup by guide/user id: WHERE u.id = $1
  if (norm.includes('WHERE u.id = $1') || norm.includes('WHERE u.id=$1')) {
    const id = Number(params[0]);
    const u = mockDB.users.find(user => user.id === id);
    if (u) {
      return { rows: [{
        id: u.id,
        name: u.name,
        avatar: u.avatar,
        email: u.email,
        location: u.location || 'Tokyo, Japan',
        bio: u.bio || 'Local verified guide.',
        verified: u.verified,
        created_at: u.created_at || new Date(),
        avg_rating: u.rating || 4.8,
        review_count: u.review_count || 124,
        total_tours: u.toursCompleted || 45
      }] };
    }
    return { rows: [] };
  }

  // 5. UPDATE users SET
  if (norm.startsWith('UPDATE users SET')) {
    // [name, bio, location, avatar, req.user.id]
    const id = Number(params[4]);
    const user = mockDB.users.find(u => u.id === id);
    if (user) {
      if (params[0] !== undefined && params[0] !== null) user.name = params[0];
      if (params[1] !== undefined && params[1] !== null) user.bio = params[1];
      if (params[2] !== undefined && params[2] !== null) user.location = params[2];
      if (params[3] !== undefined && params[3] !== null) user.avatar = params[3];
      return { rows: [user] };
    }
    return { rows: [] };
  }

  // 6. INSERT INTO refresh_tokens
  if (norm.startsWith('INSERT INTO refresh_tokens')) {
    const record = { user_id: params[0], token: params[1], expires_at: params[2], revoked: false };
    mockDB.refresh_tokens.push(record);
    return { rows: [record] };
  }

  // 7. SELECT * FROM refresh_tokens
  if (norm.startsWith('SELECT * FROM refresh_tokens')) {
    const record = mockDB.refresh_tokens.find(r => r.token === params[0] && !r.revoked);
    return { rows: record ? [record] : [] };
  }

  // 8. INSERT INTO login_history
  if (norm.startsWith('INSERT INTO login_history')) {
    const record = { user_id: params[0], ip_address: params[1], user_agent: params[2], success: params[3], created_at: new Date() };
    mockDB.login_history.push(record);
    return { rows: [record] };
  }

  // 9. Tours by guide id
  if (norm.includes('FROM tours WHERE guide_id = $1')) {
    const guideId = Number(params[0]);
    const tours = mockDB.tours.filter(t => t.guide_id === guideId);
    return { rows: tours };
  }

  // 9a. SELECT * FROM tours WHERE id = $1
  if (norm.includes('FROM tours WHERE id = $1') || norm.includes('FROM tours WHERE id=$1')) {
    let rawId = params[0];
    let idNum = parseInt(rawId);
    
    if (isNaN(idNum)) {
      if (rawId === 'original-1') idNum = 1;
      else if (rawId === 'original-2') idNum = 3;
      else if (rawId.includes('india-0')) idNum = 4;
      else idNum = 1;
    }

    const tour = mockDB.tours.find(t => t.id === idNum);
    return { rows: tour ? [tour] : [] };
  }

  // 10. Reviews for guide profile
  if (norm.includes('FROM reviews r JOIN users u')) {
    const guideId = Number(params[0]);
    const reviews = mockDB.reviews.filter(r => {
      const t = mockDB.tours.find(tour => tour.id === r.tour_id) || {};
      return t.guide_id === guideId;
    }).map(r => {
      const u = mockDB.users.find(user => user.id === r.user_id) || {};
      return {
        ...r,
        reviewer_name: u.name || 'Anonymous',
        reviewer_avatar: u.avatar
      };
    });
    return { rows: reviews };
  }

  // 11. SELECT u.id, u.name, u.avatar, u.location, u.bio, u.verified (Marketplace Discovery / Guides)
  if (norm.includes('FROM users u') && (norm.includes('JOIN tours t') || norm.includes('g.*') || norm.includes('specialties') || norm.includes('hourly_rate'))) {
    // Return guides list
    const guides = mockDB.users.filter(u => u.role === 'guide').map(u => ({
      id: u.id,
      name: u.name,
      avatar: u.avatar,
      location: u.location || 'Tokyo, Japan',
      bio: u.bio || 'Local verified guide.',
      verified: u.verified,
      hourly_rate: u.hourly_rate || 45,
      rating: u.rating || 4.8,
      review_count: u.review_count || 124,
      specialties: u.specialties || ['Historical', 'Food & Culture']
    }));
    return { rows: guides };
  }

  // 12. INSERT INTO bookings
  if (norm.startsWith('INSERT INTO bookings')) {
    const id = mockDB.bookings.length + 1;
    let userId = params[0];
    let tourId = Number(params[1]);
    let date = params[2];
    let time = params[3];
    let total_amount = params[4];
    let status = 'pending';
    
    if (params.length >= 6) {
      total_amount = params[4];
      status = params[5];
    }
    
    const newBooking = {
      id,
      user_id: userId,
      tour_id: tourId,
      booking_date: date,
      booking_time: time,
      participants: 1,
      total_amount: parseFloat(total_amount) || 45.00,
      status: status || 'pending',
      created_at: new Date()
    };
    mockDB.bookings.push(newBooking);
    return { rows: [newBooking] };
  }

  // 12a. SELECT * FROM bookings WHERE id = $1
  if (norm.includes('FROM bookings WHERE id = $1')) {
    const id = Number(params[0]);
    const booking = mockDB.bookings.find(b => b.id === id);
    return { rows: booking ? [booking] : [] };
  }

  // 12b. INSERT INTO payments
  if (norm.startsWith('INSERT INTO payments')) {
    const id = mockDB.payments.length + 1;
    const payment = {
      id,
      user_id: params[0],
      provider: params[1],
      provider_id: params[2],
      amount: parseFloat(params[3]) || 45.00,
      currency: params[4] || 'USD',
      status: params[5] || 'pending',
      payment_type: params[6] || 'tour_booking',
      reference_id: params[7],
      created_at: new Date()
    };
    mockDB.payments.push(payment);
    return { rows: [payment] };
  }

  // 12c. SELECT * FROM payments WHERE provider_id = $1 OR provider_id = $2
  if (norm.includes('FROM payments WHERE provider_id = $1 OR provider_id = $2') || norm.includes('FROM payments WHERE provider_id = $1')) {
    const p1 = params[0];
    const p2 = params[1] || p1;
    const payment = mockDB.payments.find(p => p.provider_id === p1 || p.provider_id === p2);
    return { rows: payment ? [payment] : [] };
  }

  // 12d. UPDATE payments SET status
  if (norm.startsWith('UPDATE payments SET status')) {
    let status = 'pending';
    let provider_id = null;
    let id = null;

    if (norm.includes("status = 'succeeded'")) {
      status = 'succeeded';
      provider_id = params[0];
      id = Number(params[1]);
    } else if (norm.includes("status = 'failed'")) {
      status = 'failed';
      id = Number(params[0]);
    } else if (norm.includes("status = $1")) {
      status = params[0];
      id = Number(params[1]);
    } else {
      status = params[0];
      id = Number(params[1]);
    }

    const payment = mockDB.payments.find(p => p.id === id || p.provider_id === id || p.provider_id === provider_id);
    if (payment) {
      payment.status = status;
      if (provider_id) payment.provider_id = provider_id;
      return { rows: [payment] };
    }
    return { rows: [] };
  }

  // 12e. INSERT INTO transactions
  if (norm.startsWith('INSERT INTO transactions')) {
    const transaction = {
      id: mockDB.transactions.length + 1,
      wallet_id: params[0],
      payment_id: params[1],
      amount: parseFloat(params[2]) || 0,
      type: params[3],
      status: params[4],
      description: params[5],
      created_at: new Date()
    };
    mockDB.transactions.push(transaction);
    return { rows: [transaction] };
  }

  // 12f. INSERT INTO commissions
  if (norm.startsWith('INSERT INTO commissions')) {
    const commission = {
      id: mockDB.commissions.length + 1,
      payment_id: params[0],
      total_amount: parseFloat(params[1]) || 0,
      platform_fee: parseFloat(params[2]) || 0,
      guide_amount: parseFloat(params[3]) || 0,
      created_at: new Date()
    };
    mockDB.commissions.push(commission);
    return { rows: [commission] };
  }

  // 13. SELECT b.*, t.title AS tour_title (Traveler Bookings)
  if (norm.includes('b.user_id = $1') && norm.includes('tour_title')) {
    const userId = Number(params[0]);
    const res = mockDB.bookings.filter(b => b.user_id === userId).map(b => {
      const t = mockDB.tours.find(tour => tour.id === b.tour_id) || {};
      const guide = mockDB.users.find(u => u.id === t.guide_id) || {};
      return {
        ...b,
        tour_title: t.title || 'Virtual Tour',
        tour_location: t.location || 'Tokyo, Japan',
        cover_image: t.cover_image,
        guide_name: guide.name || 'Local Guide',
        guide_avatar: guide.avatar
      };
    });
    return { rows: res };
  }

  // 14. SELECT b.*, t.title AS tour_title (Guide Bookings)
  if (norm.includes('t.guide_id = $1') && norm.includes('tour_title')) {
    const guideId = Number(params[0]);
    const res = mockDB.bookings.filter(b => {
      const t = mockDB.tours.find(tour => tour.id === b.tour_id) || {};
      return t.guide_id === guideId;
    }).map(b => {
      const t = mockDB.tours.find(tour => tour.id === b.tour_id) || {};
      const traveler = mockDB.users.find(u => u.id === b.user_id) || {};
      return {
        ...b,
        tour_title: t.title || 'Virtual Tour',
        tour_location: t.location || 'Tokyo, Japan',
        cover_image: t.cover_image,
        traveler_name: traveler.name || 'Traveler',
        traveler_avatar: traveler.avatar
      };
    });
    return { rows: res };
  }

  // 15. UPDATE bookings SET status
  if (norm.startsWith('UPDATE bookings SET status')) {
    const status = params[0];
    const bookingId = Number(params[1]);
    const booking = mockDB.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = status;
      return { rows: [booking] };
    }
    return { rows: [] };
  }

  // 16. Guide Stats
  if (norm.includes('SUM(total_amount * 0.85)')) {
    const guideId = Number(params[0]);
    const guideBookings = mockDB.bookings.filter(b => {
      const t = mockDB.tours.find(tour => tour.id === b.tour_id) || {};
      return t.guide_id === guideId && b.status === 'completed';
    });
    const net = guideBookings.reduce((sum, b) => sum + (b.total_amount * 0.85), 0);
    return { rows: [{ net_earnings: net }] };
  }
  if (norm.includes('COUNT(*) AS total FROM bookings')) {
    const guideId = Number(params[0]);
    const total = mockDB.bookings.filter(b => {
      const t = mockDB.tours.find(tour => tour.id === b.tour_id) || {};
      return t.guide_id === guideId;
    }).length;
    return { rows: [{ total }] };
  }
  if (norm.includes('COALESCE(AVG(r.rating)')) {
    const guideId = Number(params[0]);
    const guideReviews = mockDB.reviews.filter(r => {
      const t = mockDB.tours.find(tour => tour.id === r.tour_id) || {};
      return t.guide_id === guideId;
    });
    const count = guideReviews.length;
    const avg = count > 0 ? (guideReviews.reduce((sum, r) => sum + r.rating, 0) / count) : 4.8;
    return { rows: [{ avg: Number(avg), count }] };
  }
  if (norm.includes('COUNT(*) AS count FROM tours WHERE guide_id = $1')) {
    const guideId = Number(params[0]);
    const count = mockDB.tours.filter(t => t.guide_id === guideId).length;
    return { rows: [{ count }] };
  }

  // 17. Reviews
  if (norm.startsWith('INSERT INTO reviews')) {
    const newReview = {
      id: mockDB.reviews.length + 1,
      user_id: params[0],
      tour_id: params[1],
      rating: Number(params[2]),
      comment: params[3],
      created_at: new Date()
    };
    mockDB.reviews.push(newReview);
    return { rows: [newReview] };
  }

  // 18. Notifications
  if (norm.startsWith('INSERT INTO notifications')) {
    const record = { id: mockDB.notifications.length + 1, user_id: params[0], type: params[1], title: params[2], message: params[3], reference_id: params[4], is_read: false, created_at: new Date() };
    mockDB.notifications.push(record);
    return { rows: [record] };
  }
  if (norm.startsWith('SELECT * FROM notifications')) {
    const userId = Number(params[0]);
    const list = mockDB.notifications.filter(n => n.user_id === userId);
    return { rows: list };
  }
  if (norm.includes('UPDATE notifications SET is_read = true')) {
    const userId = Number(params[0]);
    mockDB.notifications.forEach(n => { if (n.user_id === userId) n.is_read = true; });
    return { rows: [] };
  }

  // Fallbacks
  return { rows: [] };
};

module.exports = {
  query: async (text, params) => {
    if (isDemoMode) {
      return runMockQuery(text, params);
    }

    try {
      return await pool.query(text, params);
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.message.includes('connect')) {
        console.warn('⚠️ Database offline. Falling back to Demo Mode.');
        isDemoMode = true;
        return runMockQuery(text, params);
      }
      throw err;
    }
  },
};
