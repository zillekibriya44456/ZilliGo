import { API_BASE } from './config';

const getHeaders = () => {
  try {
    const stored = localStorage.getItem('zilligo_user');
    const user = stored ? JSON.parse(stored) : null;
    return {
      'Content-Type': 'application/json',
      'Authorization': user?.token ? `Bearer ${user.token}` : '',
    };
  } catch (err) {
    return {
      'Content-Type': 'application/json',
      'Authorization': '',
    };
  }
};

export const api = {
  // Auth
  login: (credentials) => fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  }).then(res => res.json()),

  register: (data) => fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),

  getProfile: () => fetch(`${API_BASE}/auth/profile`, {
    headers: getHeaders(),
  }).then(res => res.json()),

  updateProfile: (data) => fetch(`${API_BASE}/auth/profile`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(res => res.json()),

  refreshToken: (data) => fetch(`${API_BASE}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),

  forgotPassword: (data) => fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),

  resetPassword: (data) => fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),

  // Tours
  getTours: (filters = '') => fetch(`${API_BASE}/tours?${filters}`).then(res => res.json()),
  getTourById: (id) => fetch(`${API_BASE}/tours/${id}`).then(res => res.json()),
  createTour: (data) => fetch(`${API_BASE}/tours`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(res => res.json()),

  // Bookings
  createBooking: (data) => fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(res => res.json()),

  getMyBookings: () => fetch(`${API_BASE}/bookings/my`, {
    headers: getHeaders(),
  }).then(res => res.json()),

  // Payments
  createCheckoutSession: (data) => fetch(`${API_BASE}/payments/stripe/create-checkout`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(res => res.json()),

  createRazorpayOrder: (data) => fetch(`${API_BASE}/payments/razorpay/create-order`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(res => res.json()),

  verifyRazorpayPayment: (data) => fetch(`${API_BASE}/payments/razorpay/verify`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(res => res.json()),

  confirmPayment: (data) => fetch(`${API_BASE}/payments/confirm`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(res => res.json()),


  // Admin
  getAdminStats: () => fetch(`${API_BASE}/admin/stats`, {
    headers: getHeaders(),
  }).then(res => res.json()),

  getAdminUsers: () => fetch(`${API_BASE}/admin/users`, {
    headers: getHeaders(),
  }).then(res => res.json()),

  verifyUser: (id) => fetch(`${API_BASE}/admin/verify/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
  }).then(res => res.json()),

  suspendUser: (id, suspended) => fetch(`${API_BASE}/admin/suspend/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ suspended }),
  }).then(res => res.json()),

  getAdminTickets: () => fetch(`${API_BASE}/admin/tickets`, {
    headers: getHeaders(),
  }).then(res => res.json()),

  updateAdminTicket: (id, data) => fetch(`${API_BASE}/admin/tickets/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(res => res.json()),

  getAdminReports: () => fetch(`${API_BASE}/admin/reports`, {
    headers: getHeaders(),
  }).then(res => res.json()),

  getGuideProfile: (id) => fetch(`${API_BASE}/marketplace/guides/${id}`).then(res => res.json()),

  updateAdminReport: (id, status) => fetch(`${API_BASE}/admin/reports/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  }).then(res => res.json()),

  getAdminSettings: () => fetch(`${API_BASE}/admin/settings`, {
    headers: getHeaders(),
  }).then(res => res.json()),

  updateAdminSetting: (data) => fetch(`${API_BASE}/admin/settings`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(res => res.json()),

  getAdminAuditLogs: () => fetch(`${API_BASE}/admin/audit-logs`, {
    headers: getHeaders(),
  }).then(res => res.json()),

  getAdminBookings: () => fetch(`${API_BASE}/admin/bookings`, {
    headers: getHeaders(),
  }).then(res => res.json()),

  cancelAdminBooking: (id) => fetch(`${API_BASE}/admin/bookings/${id}/cancel`, {
    method: 'PUT',
    headers: getHeaders(),
  }).then(res => res.json()),

  sendAdminAnnouncement: (data) => fetch(`${API_BASE}/admin/announcement`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(res => res.json()),

  // Guide Applications
  submitGuideApplication: (data) => fetch(`${API_BASE}/guides/apply`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(res => res.json()),

  getGuideApplicationStatus: () => fetch(`${API_BASE}/guides/status`, {
    headers: getHeaders(),
  }).then(res => res.json()),

  getGuideApplications: () => fetch(`${API_BASE}/guides/applications`, {
    headers: getHeaders(),
  }).then(res => res.json()),

  updateGuideApplication: (id, status) => fetch(`${API_BASE}/guides/applications/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  }).then(res => res.json()),

  getGuides: () => fetch(`${API_BASE}/guides`).then(res => res.json()),

  // ── Marketplace ──
  getMarketplaceGuides: (params = '') =>
    fetch(`${API_BASE}/marketplace/guides?${params}`).then(res => res.json()),
  getMarketplaceGuide: (id) =>
    fetch(`${API_BASE}/marketplace/guides/${id}`).then(res => res.json()),

  requestBooking: (data) => fetch(`${API_BASE}/marketplace/bookings`, {
    method: 'POST', headers: getHeaders(), body: JSON.stringify(data),
  }).then(res => res.json()),

  getTravelerBookings: () =>
    fetch(`${API_BASE}/marketplace/bookings/traveler`, { headers: getHeaders() }).then(res => res.json()),

  getGuideBookings: () =>
    fetch(`${API_BASE}/marketplace/bookings/guide`, { headers: getHeaders() }).then(res => res.json()),

  updateBookingStatus: (id, status) => fetch(`${API_BASE}/marketplace/bookings/${id}/status`, {
    method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ status }),
  }).then(res => res.json()),

  getGuideStats: () =>
    fetch(`${API_BASE}/marketplace/guide/stats`, { headers: getHeaders() }).then(res => res.json()),

  submitReview: (data) => fetch(`${API_BASE}/marketplace/reviews`, {
    method: 'POST', headers: getHeaders(), body: JSON.stringify(data),
  }).then(res => res.json()),

  getNotifications: () =>
    fetch(`${API_BASE}/marketplace/notifications`, { headers: getHeaders() }).then(res => res.json()),

  markAllNotificationsRead: () => fetch(`${API_BASE}/marketplace/notifications/read-all`, {
    method: 'PATCH', headers: getHeaders(),
  }).then(res => res.json()),

  getPassport: () =>
    fetch(`${API_BASE}/marketplace/passport`, { headers: getHeaders() }).then(res => res.json()),

  addPassportStamp: (data) =>
    fetch(`${API_BASE}/marketplace/passport/stamp`, {
      method: 'POST', headers: getHeaders(), body: JSON.stringify(data)
    }).then(res => res.json()),

  // Public
  getPublicHomepage: () => fetch(`${API_BASE}/public/homepage`).then(res => res.json()),
  getPublicLiveStream: (id) => fetch(`${API_BASE}/public/live/${id}`).then(res => res.json()),
  getLiveChat: (id) => fetch(`${API_BASE}/public/live/${id}/chat`).then(res => res.json()),
  getLiveQuestions: (id) => fetch(`${API_BASE}/public/live/${id}/questions`).then(res => res.json()),

  // Creators
  getCreatorProfile: (id) => fetch(`${API_BASE}/creators/profile/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(res => res.json()),
  updateCreatorProfile: (data) => fetch(`${API_BASE}/creators/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify(data),
  }).then(res => res.json()),
  uploadVideo: (data) => fetch(`${API_BASE}/creators/videos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify(data),
  }).then(res => res.json()),
  followCreator: (id) => fetch(`${API_BASE}/creators/follow/${id}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then(res => res.json()),

  // Shop & Academy
  getDigitalProducts: (category) => fetch(`${API_BASE}/shop/products${category ? `?category=${category}` : ''}`).then(res => res.json()),
  purchaseProduct: (data) => fetch(`${API_BASE}/shop/purchase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify(data),
  }).then(res => res.json()),
  getCourses: () => fetch(`${API_BASE}/academy/courses`).then(res => res.json()),
  getCourseLessons: (id) => fetch(`${API_BASE}/academy/courses/${id}/lessons`).then(res => res.json()),
  enrollInCourse: (courseId) => fetch(`${API_BASE}/academy/enroll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify({ courseId }),
  }).then(res => res.json()),
  updateCourseProgress: (data) => fetch(`${API_BASE}/academy/progress`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify(data),
  }).then(res => res.json()),

  // Agora WebRTC
  getAgoraToken: (channelName, role = 'subscriber') => fetch(`${API_BASE}/agora/token/${channelName}?role=${role}`, {
    headers: getHeaders(),
  }).then(res => res.json()),

  startLiveStream: (tourId) => fetch(`${API_BASE}/agora/start-stream`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ tourId })
  }).then(res => res.json()),

  // Matching Suggestions
  getSuggestions: (userId) => fetch(`${API_BASE}/matching/suggestions/${userId}`, {
    headers: getHeaders(),
  }).then(res => res.json()),

  // Olympics
  getOlympicLeaderboard: () => fetch(`${API_BASE}/olympics/leaderboard`).then(res => res.json()),
  castOlympicVote: (data) => fetch(`${API_BASE}/olympics/vote`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(res => res.json()),

  // Messages
  getConversations: () => fetch(`${API_BASE}/messages/conversations`, {
    headers: getHeaders(),
  }).then(res => res.json()),
  getChatHistory: (partnerId) => fetch(`${API_BASE}/messages/history/${partnerId}`, {
    headers: getHeaders(),
  }).then(res => res.json()),
  sendMessage: (data) => fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(res => res.json()),
};
