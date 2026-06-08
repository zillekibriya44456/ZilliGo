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
  createCheckoutSession: (data) => fetch(`${API_BASE}/payments/create-checkout-session`, {
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

  // Guide Applications
  submitGuideApplication: (data) => fetch(`${API_BASE}/guides/apply`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
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
};
