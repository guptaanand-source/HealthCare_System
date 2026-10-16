import axios from 'axios'

/**
 * Axios instance pre-configured for this application.
 *
 * baseURL: '/api' — Vite proxy forwards /api/* to Express on port 5000.
 * Authorization header: automatically injected from localStorage if a token exists.
 *
 * Usage:
 *   import api from '../services/api'
 *   const res = await api.get('/health')
 *   const res = await api.post('/auth/login', { email, password })
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request Interceptor ──────────────────────────────────────────────────────
// Before every request, attach the JWT token if one is stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor ─────────────────────────────────────────────────────
// If the server returns 401 (unauthorized/token expired), clear auth state
// and redirect to login. This handles expired tokens automatically.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Redirect to login — don't import router here to avoid circular deps
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
