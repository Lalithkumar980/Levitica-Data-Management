const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const AUTH_TOKEN_KEY = 'levitica_token';
const AUTH_USER_KEY = 'levitica_current_user';

export function getToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

export function setAuth(token, user) {
  try {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
    if (user) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_USER_KEY);
  } catch (_) {}
}

export function clearAuth() {
  setAuth(null, null);
  try {
    localStorage.removeItem('levitica_user_role');
  } catch (_) {}
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Request to backend with optional auth header.
 * @param {string} path - e.g. '/api/auth/login'
 * @param {RequestInit & { body?: object }} options - fetch options; body will be JSON.stringify'd
 */
export async function apiRequest(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const config = { ...options, headers };
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }
  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || res.statusText || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
