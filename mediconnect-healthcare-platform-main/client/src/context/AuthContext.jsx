import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

/**
 * AuthContext
 *
 * Provides authentication state to the entire application.
 * Any component can call useAuth() to access:
 *   - user: the logged-in user object (or null)
 *   - token: the JWT string (or null)
 *   - loading: true while we're verifying the token on app startup
 *   - login(userData, token): call after successful login
 *   - logout(): clear auth state
 *   - isAuthenticated: boolean
 *   - isPatient / isDoctor / isAdmin: role helpers
 *
 * How it works:
 * On app startup, we check localStorage for a stored token.
 * If found, we call /api/auth/me to verify it's still valid.
 * If invalid, we clear it and show the public site.
 */
const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // On mount: verify stored token against the backend
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) {
        setLoading(false)
        return
      }

      try {
        const { data } = await api.get('/auth/me')
        setUser(data.user)
        setToken(storedToken)
      } catch {
        // Token invalid or expired — clear everything
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [])

  const login = useCallback((userData, jwtToken) => {
    localStorage.setItem('token', jwtToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setToken(jwtToken)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
  }, [])

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isPatient: user?.role === 'patient',
    isDoctor:  user?.role === 'doctor',
    isAdmin:   user?.role === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth hook
 * Usage: const { user, login, logout, isAuthenticated } = useAuth()
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return context
}

export default AuthContext
