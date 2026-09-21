import axios from 'axios';

// Auto-detect environment:
// 1. Localhost / Local IP (127.0.0.1, 192.168.x.x) -> ALWAYS use local Django backend (http://<hostname>:8000)
// 2. Explicit VITE_API_BASE_URL (for custom cloud backend)
// 3. Vercel / Cloud Hosting -> fallback to live Render backend (https://soundpulse-fq3b.onrender.com)
function resolveApiBaseUrl() {
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

  let envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    envUrl = envUrl.replace(/['"]+/g, '').trim();
    if (envUrl !== '') {
      return envUrl;
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