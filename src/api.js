import axios from 'axios';

// Auto-detect environment:
// 1. Explicit VITE_API_BASE_URL (if provided and non-empty)
// 2. Localhost / Local IP (192.168.x.x) -> use local Django backend (http://<hostname>:8000)
// 3. Vercel / Cloud Hosting -> fallback to live Render backend (https://soundpulse-fq3b.onrender.com)
function resolveApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim();
  }

  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || 
                    hostname === '127.0.0.1' || 
                    hostname.startsWith('192.168.') || 
                    hostname.startsWith('10.') || 
                    hostname.endsWith('.local');

    if (isLocal) {
      // In local dev/network mode, connect directly to local Django backend at port 8000
      return `http://${hostname}:8000`;
    }
  }

  return 'https://soundpulse-fq3b.onrender.com';
}

const rawBaseUrl = resolveApiBaseUrl();
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

