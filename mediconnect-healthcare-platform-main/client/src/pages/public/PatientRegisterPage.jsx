import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Button from '../../components/common/Button'

/**
 * PatientRegisterPage
 *
 * Registration for patients — minimal required fields.
 * We collect: name, email, password, phone (optional).
 *
 * Detailed health information (DOB, blood group, address)
 * is collected in the profile settings — not at registration.
 * Registration should be fast and low-friction.
 */
const PatientRegisterPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = 'Full name must be at least 2 characters'
    if (!form.email.trim())
      errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = 'Enter a valid email address'
    if (form.phone && !/^[0-9+\-\s()]{7,15}$/.test(form.phone))
      errs.phone = 'Enter a valid phone number'
    if (!form.password)
      errs.password = 'Password is required'
    else if (form.password.length < 6)
      errs.password = 'Password must be at least 6 characters'
    if (!form.confirmPassword)
      errs.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    if (serverError) setServerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', {
        name:     form.name.trim(),
        email:    form.email.trim(),
        password: form.password,
        phone:    form.phone.trim() || undefined,
        role:     'patient',
      })
      login(data.user, data.token)
      navigate('/patient/dashboard')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* ── Top bar ──────────────────────────────────────── */}
      <header className="bg-white border-b border-neutral-200 h-14 flex items-center px-6">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="6.5" y="1" width="3" height="14" rx="1.5" fill="white"/>
              <rect x="1" y="6.5" width="14" height="3" rx="1.5" fill="white"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-neutral-800">
            Medi<span className="text-primary">Connect</span>
          </span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-7">
            <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Create your account</h1>
            <p className="text-sm text-neutral-500">
              Register as a patient to book appointments and manage your health records.
            </p>
          </div>

          {serverError && (
            <div className="mb-5 rounded-md bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* ── Full name ──────────────────────────────── */}
            <div>
              <label htmlFor="name" className="form-label">Full name</label>
              <input
                id="name" name="name" type="text"
                autoComplete="name"
                value={form.name} onChange={handleChange}
                className={errors.name ? 'form-input-error' : 'form-input'}
                placeholder="First and last name"
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
            </div>

            {/* ── Email ──────────────────────────────────── */}
            <div>
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                id="email" name="email" type="email"
                autoComplete="email"
                value={form.email} onChange={handleChange}
                className={errors.email ? 'form-input-error' : 'form-input'}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
            </div>

            {/* ── Phone (optional) ───────────────────────── */}
            <div>
              <label htmlFor="phone" className="form-label">
                Phone number <span className="text-neutral-400 normal-case font-normal">(optional)</span>
              </label>
              <input
                id="phone" name="phone" type="tel"
                autoComplete="tel"
                value={form.phone} onChange={handleChange}
                className={errors.phone ? 'form-input-error' : 'form-input'}
                placeholder="+91 98765 43210"
              />
              {errors.phone && <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>}
            </div>

            {/* ── Password ───────────────────────────────── */}
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password" name="password" type="password"
                autoComplete="new-password"
                value={form.password} onChange={handleChange}
                className={errors.password ? 'form-input-error' : 'form-input'}
                placeholder="At least 6 characters"
              />
              {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
            </div>

            {/* ── Confirm password ───────────────────────── */}
            <div>
              <label htmlFor="confirmPassword" className="form-label">Confirm password</label>
              <input
                id="confirmPassword" name="confirmPassword" type="password"
                autoComplete="new-password"
                value={form.confirmPassword} onChange={handleChange}
                className={errors.confirmPassword ? 'form-input-error' : 'form-input'}
                placeholder="Re-enter your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-1">
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary no-underline hover:underline">
              Log in
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-neutral-500">
            Are you a doctor?{' '}
            <Link to="/register/doctor" className="font-medium text-primary no-underline hover:underline">
              Register as a doctor
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default PatientRegisterPage
