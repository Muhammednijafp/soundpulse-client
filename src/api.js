import axios from 'axios';

// Get Base API URL from environment variable or fallback to live production Render backend
const envUrl = import.meta.env.VITE_API_BASE_URL;
const rawBaseUrl = (envUrl && envUrl.trim() !== '') ? envUrl : 'https://soundpulse-fq3b.onrender.com';
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

