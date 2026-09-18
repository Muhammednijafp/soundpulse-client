import axios from 'axios';

// Get Base API URL from environment variable (e.g. on Vercel: https://soundpulse-api.onrender.com)
// If empty (local development or custom reverse proxy), defaults to '' (relative URLs)
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
export const API_BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

// Configure global Axios instance
axios.defaults.baseURL = API_BASE_URL;

/**
 * Returns a fully qualified API URL for native audio streaming, downloads, or direct links.
 * Example: getApiUrl('/api/stream?id=xyz') => 'https://soundpulse-api.onrender.com/api/stream?id=xyz'
 */
export function getApiUrl(path) {
  if (!path) return '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (API_BASE_URL) {
    return `${API_BASE_URL}${cleanPath}`;
  }
  return cleanPath;
}

export default axios;

