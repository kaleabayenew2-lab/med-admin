// Centralized backend base URL sourced from Vite env.
export const API_BASE = import.meta.env.VITE_API_BASE || '';

export function requireApiBase() {
  if (!API_BASE) {
    // Warn in development to help catch missing env config.
    // eslint-disable-next-line no-console
    console.warn('VITE_API_BASE is not set. API requests will be relative to the current host.');
  }
}
