const fallbackApiBase = import.meta.env.PROD ? '/api' : 'http://localhost:5001/api';

export const API_BASE = (import.meta.env.VITE_API_URL || fallbackApiBase).replace(/\/$/, '');
