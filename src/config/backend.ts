// Centralized backend base URL sourced from Vite env.
// Default to localhost:5000 so admin uses the local backend by default.
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export function requireApiBase() {
  if (!API_BASE) {
    // This should not occur because we default to localhost:5000,
    // but keep the warning for explicit empty overrides.
    // eslint-disable-next-line no-console
    console.warn('VITE_API_BASE is not set. API requests will be relative to the current host.');
  }
}
