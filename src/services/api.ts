import axios from 'axios';
import { decryptString } from '../utils/secureStorage';

export const API_BASE = import.meta.env.VITE_API_BASE || '';
const WITH_CREDENTIALS = (import.meta.env.VITE_API_WITH_CREDENTIALS || 'false').toLowerCase() === 'true';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  withCredentials: WITH_CREDENTIALS,
});

// Add authorization header if token exists
api.interceptors.request.use(async (config) => {
  try {
    const raw = localStorage.getItem('authTokenEnc');
    if (raw) {
      const token = await decryptString(raw);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {}
  try { window.dispatchEvent(new CustomEvent('admin:api-request')); } catch (e) {}
  return config;
});

api.interceptors.response.use(
  (response) => {
    try { window.dispatchEvent(new CustomEvent('admin:api-response')); } catch (e) {}
    // emit success toast for mutating requests that return a message
    try {
      const method = (response.config && response.config.method) || '';
      if (['post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
        const msg = response.data && (response.data.message || response.data.msg || response.data.result || null);
        if (msg) window.dispatchEvent(new CustomEvent('admin:toast', { detail: { type: 'success', message: msg } }));
      }
    } catch (e) {}
    return response;
  },
  (error) => {
    try { window.dispatchEvent(new CustomEvent('admin:api-response')); } catch (e) {}
    // show error toast
    try {
      const msg = error?.response?.data?.message || error?.message || 'Request failed';
      window.dispatchEvent(new CustomEvent('admin:toast', { detail: { type: 'error', message: String(msg) } }));
    } catch (e) {}
    return Promise.reject(error);
  }
);

export function normalizeBackendUrl(url: string | null | undefined) {
  if (!url || typeof url !== 'string') return url;
  const trimmed = url.trim();
  const base = API_BASE.replace(/\/+$/, '');

  if (trimmed.startsWith('http://localhost') || trimmed.startsWith('http://127.0.0.1') || trimmed.startsWith('http://10.0.2.2')) {
    try {
      const parsed = new URL(trimmed);
      const path = parsed.pathname.replace(/^\/+/, '');
      return `${base}/${path}`;
    } catch {
      return `${base}/uploads/${encodeURIComponent(trimmed.replace(/^\/+/, ''))}`;
    }
  }

  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    return `${base}/${trimmed.replace(/^\/+/, '')}`;
  }

  return trimmed;
}

export default api;
