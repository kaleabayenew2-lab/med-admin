import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { decryptString, encryptString } from '../utils/secureStorage';

type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const INACTIVITY_MS = 3 * 60 * 1000; // 3 minutes

const DEMO_EMAIL = 'kaleabayenew2@gmail.com';
const DEMO_PASSWORD = 'Kale@1513';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // load token from storage
  useEffect(() => {
    const loadToken = async () => {
      try {
        // Try encrypted token first with timeout
        const rawEnc = localStorage.getItem('authTokenEnc');
        
        if (rawEnc) {
          try {
            const decryptPromise = decryptString(rawEnc);
            const timeoutPromise = new Promise<string | null>((_, reject) => {
              setTimeout(() => reject(new Error('Decryption timeout')), 3000);
            });
            
            const t = await Promise.race([decryptPromise, timeoutPromise]);
            
            if (t) {
              setToken(t);
              // Force a small delay to ensure state updates are processed
              setTimeout(() => {
                setIsLoading(false);
              }, 0);
              return;
            }
          } catch (decryptError) {
            console.warn('Failed to decrypt token, trying plain storage', decryptError);
          }
        }

        // Fallback to plain token
        const rawPlain = localStorage.getItem('authToken');
        
        if (rawPlain) {
          setToken(rawPlain);
          setTimeout(() => {
            setIsLoading(false);
          }, 0);
        } else {
          // Clear any corrupted encrypted token
          localStorage.removeItem('authTokenEnc');
          setTimeout(() => {
            setIsLoading(false);
          }, 0);
        }
      } catch (e) {
        console.warn('Failed to load auth token from storage', e);
        // Clear potentially corrupted tokens on error
        localStorage.removeItem('authTokenEnc');
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    // Add a safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn('🔐 Authentication loading timeout, forcing completion');
        setIsLoading(false);
      }
    }, 5000);

    loadToken().finally(() => {
      clearTimeout(safetyTimeout);
    });
  }, []);

  // inactivity logout
  useEffect(() => {
    let timeout: number | null = null;
    const reset = () => {
      if (timeout) {
        clearTimeout(timeout as number);
      }
      timeout = window.setTimeout(() => {
        // auto logout after inactivity
        logout();
      }, INACTIVITY_MS);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'click'];
    events.forEach((ev) => window.addEventListener(ev, reset));
    reset();
    return () => {
      if (timeout) clearTimeout(timeout as number);
      events.forEach((ev) => window.removeEventListener(ev, reset));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (email: string, password: string) => {
    // basic validation
    if (!email || !password) return { ok: false, message: 'Email and password are required' };
    const emailRe = /\S+@\S+\.\S+/;
    if (!emailRe.test(email)) return { ok: false, message: 'Invalid email address' };
    if (password.length < 6) return { ok: false, message: 'Password must be at least 6 characters' };

    // Demo auth: check against hardcoded credentials
    const t = 'demo-token-' + Date.now();
    const completeLogin = async () => {
      try {
        const enc = await encryptString(t);
        localStorage.setItem('authTokenEnc', enc);
      } catch (e) {
        // fallback to plain storage if encryption is unavailable
        try {
          localStorage.setItem('authToken', t);
        } catch (innerError) {
          console.warn('Failed to store auth token', innerError);
        }
      }
      setToken(t);
      try {
        window.dispatchEvent(new CustomEvent('admin:toast', { detail: { type: 'success', message: 'Signed in successfully' } }));
      } catch (e) {}
      return { ok: true };
    };

    // Attempt real backend authentication.
    try {
      const res = await api.post('/api/users/login', {
        email: email.toLowerCase(),
        password,
      });

      if (res.data && res.data.token) {
        const token = res.data.token;
        const enc = await encryptString(token);
        localStorage.setItem('authTokenEnc', enc);
        setToken(token);
        window.dispatchEvent(new CustomEvent('admin:toast', { detail: { type: 'success', message: 'Signed in successfully' } }));
        return { ok: true };
      }

      return { ok: false, message: res.data?.message || 'Login failed' };
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Login failed';
      return { ok: false, message };
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('authTokenEnc');
      localStorage.removeItem('authToken');
    } catch (e) {}
    setToken(null);
    try { window.dispatchEvent(new CustomEvent('admin:toast', { detail: { type: 'info', message: 'Signed out' } })); } catch (e) {}
    navigate('/login');
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('admin:auth-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('admin:auth-unauthorized', handleUnauthorized);
    };
  }, [logout]);

  const value = useMemo(() => ({ isAuthenticated: !!token, token, isLoading, login, logout }), [token, isLoading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export default AuthContext;
