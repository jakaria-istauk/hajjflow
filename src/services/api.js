import axios from 'axios';

const WP_URL          = import.meta.env.VITE_WP_URL?.replace(/\/+$/, '');
const LOGGED_IN_KEY   = import.meta.env.VITE_WP_LOGGED_IN_KEY;
const AUTH_SALT       = import.meta.env.VITE_WP_AUTH_SALT;

// ─────────────────────────────────────────────────────────────────────────────
// HMAC-SHA256 signing via Web Crypto API
// Mirrors PHP: hash_hmac('sha256', "$timestamp:$nonce", LOGGED_IN_KEY . AUTH_SALT)
// ─────────────────────────────────────────────────────────────────────────────
async function signRequest() {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce     = crypto.randomUUID().replace(/-/g, '');
  const secret    = LOGGED_IN_KEY + AUTH_SALT;
  const message   = `${timestamp}:${nonce}`;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  const sig = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)));

  return { 'X-HajjFlow-Timestamp': timestamp, 'X-HajjFlow-Nonce': nonce, 'X-HajjFlow-Sig': sig };
}

// ─────────────────────────────────────────────────────────────────────────────
// Axios instance factory — injects signature headers on every request
// ─────────────────────────────────────────────────────────────────────────────
const api = axios.create({ baseURL: `${WP_URL}/wp-json/hajjflow/v1` });

api.interceptors.request.use(async (config) => {
  const sigHeaders = await signRequest();
  config.headers = { ...config.headers, ...sigHeaders };

  const token = localStorage.getItem('hajjflow_jwt');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;

  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      // JWT expired — clear auth, let store handle redirect
      localStorage.removeItem('hajjflow_jwt');
      window.dispatchEvent(new CustomEvent('hajjflow:auth-expired'));
    }
    return Promise.reject(err);
  }
);

export default api;
