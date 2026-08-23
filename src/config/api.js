// Centralized API Base URL resolver with automatic Local vs Production switching
const isLocal = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.startsWith('192.168.')
);

const RENDER_PROD_URL = 'https://edusphere-code-it-2.onrender.com';

export const BACKEND_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
  : (isLocal ? 'http://localhost:5001' : RENDER_PROD_URL);

export const API_BASE = `${BACKEND_URL}/api`;
