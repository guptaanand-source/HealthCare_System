import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Button from '../../components/common/Button'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Admin portal
  const [adminExpanded, setAdminExpanded] = useState(false)
  const [adminForm, setAdminForm] = useState({ email: '', password: '' })
  const [adminError, setAdminError] = useState('')
  const [adminLoading, setAdminLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (serverError) setServerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', {
        email: form.email.trim(),
        password: form.password,
      })
      login(data.user, data.token)
      const map = { patient: '/patient/dashboard', doctor: '/doctor/dashboard', admin: '/admin/dashboard' }
      navigate(map[data.user.role] || '/')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    if (!adminForm.email || !adminForm.password) { setAdminError('Both fields are required'); return }
    setAdminLoading(true)
    setAdminError('')
    try {
      const { data } = await api.post('/auth/login', {
        email: adminForm.email.trim(),
        password: adminForm.password,
      })
      if (data.user.role !== 'admin') {
        setAdminError('This portal is for administrators only.')
        return
      }
      login(data.user, data.token)
      navigate('/admin/dashboard')
    } catch (err) {
      setAdminError(err.response?.data?.message || 'Admin login failed.')
    } finally {
      setAdminLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="bg-white border-b border-neutral-200 h-14 flex items-center px-6">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="6.5" y="1" width="3" height="14" rx="1.5" fill="white"/>
              <rect x="1" y="6.5" width="14" height="3" rx="1.5" fill="white"/>
            </svg>
          </div>
          <span className="text-sm font-bold text-neutral-800">Medi<span className="text-primary">Connect</span></span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-sm"
        >
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-neutral-900 mb-1">Welcome back</h1>
            <p className="text-sm text-neutral-500">Log in to your MediConnect account</p>
          </div>

          {serverError && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 flex gap-2">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p className="text-sm text-red-700">{serverError}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="email" className="form-label">Email address</label>
              <input id="email" name="email" type="email" autoComplete="email"
                value={form.email} onChange={handleChange}
                className={errors.email ? 'form-input-error' : 'form-input'}
                placeholder="you@example.com" />
              {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div className="relative">
                <input id="password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password} onChange={handleChange}
                  className={`${errors.password ? 'form-input-error' : 'form-input'} pr-10`}
                  placeholder="Enter your password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  {showPassword
                    ? <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              Log in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary no-underline hover:underline">Register as a patient</Link>
          </p>
          <p className="mt-2 text-center text-sm text-neutral-500">
            Are you a doctor?{' '}
            <Link to="/register/doctor" className="font-medium text-primary no-underline hover:underline">Register as a doctor</Link>
          </p>

          {/* ── Admin Portal (subtle, collapsible) ── */}
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <button
              onClick={() => { setAdminExpanded(!adminExpanded); setAdminError('') }}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-600 transition-colors mx-auto"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Admin access
              <svg className={`w-3 h-3 transition-transform ${adminExpanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>

            <AnimatePresence>
              {adminExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <form onSubmit={handleAdminLogin} className="mt-4 space-y-3 bg-neutral-900 rounded-xl p-4">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Administrator Portal</p>
                    {adminError && <p className="text-xs text-red-400">{adminError}</p>}
                    <input type="email" placeholder="Admin email"
                      value={adminForm.email}
                      onChange={e => setAdminForm(p => ({ ...p, email: e.target.value }))}
                      className="block w-full rounded-md bg-neutral-800 border border-neutral-700 text-white text-xs px-3 py-2 placeholder-neutral-500 focus:outline-none focus:border-primary" />
                    <input type="password" placeholder="Password"
                      value={adminForm.password}
                      onChange={e => setAdminForm(p => ({ ...p, password: e.target.value }))}
                      className="block w-full rounded-md bg-neutral-800 border border-neutral-700 text-white text-xs px-3 py-2 placeholder-neutral-500 focus:outline-none focus:border-primary" />
                    <button type="submit" disabled={adminLoading}
                      className="w-full bg-primary text-white text-xs font-semibold py-2 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50">
                      {adminLoading ? 'Signing in…' : 'Sign in as Admin'}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      </main>
    </div>
  )
}

export default LoginPage
