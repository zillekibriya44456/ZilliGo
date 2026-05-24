const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getHeaders = () => {
  try {
    const stored = localStorage.getItem('zillgo_user');
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
};
