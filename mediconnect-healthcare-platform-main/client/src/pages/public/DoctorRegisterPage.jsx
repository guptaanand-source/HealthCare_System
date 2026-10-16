import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Button from '../../components/common/Button'

/**
 * DoctorRegisterPage
 *
 * Doctors need additional professional information at registration:
 * specialization, qualification, years of experience.
 *
 * After registration, their account is PENDING ADMIN VERIFICATION.
 * They will see a pending state until admin approves their profile.
 * This is shown via a success screen rather than redirecting to dashboard.
 */
const SPECIALIZATIONS = [
  'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
  'General Medicine', 'General Surgery', 'Gynecology', 'Neurology',
  'Oncology', 'Ophthalmology', 'Orthopedics', 'Pediatrics',
  'Psychiatry', 'Pulmonology', 'Radiology', 'Urology', 'Other',
]

const DoctorRegisterPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [step, setStep] = useState(1) // 1: account info, 2: professional info
  const [form, setForm] = useState({
    // Step 1 — Account
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Step 2 — Professional
    specialization: '',
    qualification: '',
    experience: '',
    hospital: '',
    consultationFee: '',
    bio: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false) // show pending screen

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    if (serverError) setServerError('')
  }

  // ── Step 1 validation ──────────────────────────────────────────────────────
  const validateStep1 = () => {
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
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  // ── Step 2 validation ──────────────────────────────────────────────────────
  const validateStep2 = () => {
    const errs = {}
    if (!form.specialization)
      errs.specialization = 'Please select your specialization'
    if (!form.qualification.trim())
      errs.qualification = 'Qualification is required (e.g. MBBS, MD)'
    if (form.experience === '' || isNaN(Number(form.experience)) || Number(form.experience) < 0)
      errs.experience = 'Enter valid years of experience (0 or more)'
    if (form.consultationFee && (isNaN(Number(form.consultationFee)) || Number(form.consultationFee) < 0))
      errs.consultationFee = 'Enter a valid consultation fee'
    return errs
  }

  const handleNext = () => {
    const errs = validateStep1()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateStep2()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', {
        name:            form.name.trim(),
        email:           form.email.trim(),
        password:        form.password,
        phone:           form.phone.trim() || undefined,
        role:            'doctor',
        specialization:  form.specialization,
        qualification:   form.qualification.trim(),
        experience:      Number(form.experience),
        hospital:        form.hospital.trim() || '',
        consultationFee: Number(form.consultationFee) || 0,
        bio:             form.bio.trim() || '',
      })
      login(data.user, data.token)
      setRegistered(true) // show pending approval screen
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Pending approval screen ────────────────────────────────────────────────
  if (registered) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Account under review</h2>
          <p className="text-sm text-neutral-600 leading-relaxed mb-6">
            Your doctor profile has been submitted and is pending admin verification.
            You'll be able to access your dashboard once approved.
          </p>
          <Button variant="secondary" size="md" onClick={() => navigate('/login')}>
            Go to login
          </Button>
        </div>
      </div>
    )
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
        <div className="w-full max-w-md">
          {/* ── Step indicator ─────────────────────────── */}
          <div className="flex items-center gap-3 mb-7">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors
                    ${step >= s ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-500'}`}
                >
                  {s}
                </div>
                <span className={`text-xs ${step >= s ? 'text-neutral-700' : 'text-neutral-400'}`}>
                  {s === 1 ? 'Account' : 'Professional'}
                </span>
                {s < 2 && <div className={`w-8 h-px ${step > s ? 'bg-primary' : 'bg-neutral-300'}`} />}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-neutral-900 mb-1">
              {step === 1 ? 'Create your account' : 'Professional details'}
            </h1>
            <p className="text-sm text-neutral-500">
              {step === 1
                ? 'Set up your login credentials'
                : 'Tell patients about your expertise'}
            </p>
          </div>

          {serverError && (
            <div className="mb-5 rounded-md bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          {/* ════════════ STEP 1: Account Info ════════════ */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="form-label">Full name</label>
                <input id="name" name="name" type="text"
                  value={form.name} onChange={handleChange}
                  className={errors.name ? 'form-input-error' : 'form-input'}
                  placeholder="Dr. First Last"
                />
                {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="form-label">Email address</label>
                <input id="email" name="email" type="email"
                  value={form.email} onChange={handleChange}
                  className={errors.email ? 'form-input-error' : 'form-input'}
                  placeholder="doctor@hospital.com"
                />
                {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="form-label">
                  Phone <span className="text-neutral-400 normal-case font-normal">(optional)</span>
                </label>
                <input id="phone" name="phone" type="tel"
                  value={form.phone} onChange={handleChange}
                  className={errors.phone ? 'form-input-error' : 'form-input'}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="password" className="form-label">Password</label>
                <input id="password" name="password" type="password"
                  value={form.password} onChange={handleChange}
                  className={errors.password ? 'form-input-error' : 'form-input'}
                  placeholder="At least 6 characters"
                />
                {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="form-label">Confirm password</label>
                <input id="confirmPassword" name="confirmPassword" type="password"
                  value={form.confirmPassword} onChange={handleChange}
                  className={errors.confirmPassword ? 'form-input-error' : 'form-input'}
                  placeholder="Re-enter password"
                />
                {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword}</p>}
              </div>

              <Button variant="primary" size="lg" className="w-full mt-1" onClick={handleNext}>
                Next — Professional details
              </Button>
            </div>
          )}

          {/* ════════════ STEP 2: Professional Info ════════ */}
          {step === 2 && (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label htmlFor="specialization" className="form-label">Specialization</label>
                <select id="specialization" name="specialization"
                  value={form.specialization} onChange={handleChange}
                  className={errors.specialization ? 'form-input-error' : 'form-input'}
                >
                  <option value="">Select specialization</option>
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.specialization && <p className="mt-1.5 text-xs text-red-600">{errors.specialization}</p>}
              </div>

              <div>
                <label htmlFor="qualification" className="form-label">Qualification</label>
                <input id="qualification" name="qualification" type="text"
                  value={form.qualification} onChange={handleChange}
                  className={errors.qualification ? 'form-input-error' : 'form-input'}
                  placeholder="e.g. MBBS, MD (Cardiology)"
                />
                {errors.qualification && <p className="mt-1.5 text-xs text-red-600">{errors.qualification}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="experience" className="form-label">Years of experience</label>
                  <input id="experience" name="experience" type="number"
                    min="0" max="60"
                    value={form.experience} onChange={handleChange}
                    className={errors.experience ? 'form-input-error' : 'form-input'}
                    placeholder="e.g. 8"
                  />
                  {errors.experience && <p className="mt-1.5 text-xs text-red-600">{errors.experience}</p>}
                </div>
                <div>
                  <label htmlFor="consultationFee" className="form-label">
                    Consultation fee (₹)
                    <span className="text-neutral-400 normal-case font-normal ml-1">(opt.)</span>
                  </label>
                  <input id="consultationFee" name="consultationFee" type="number"
                    min="0"
                    value={form.consultationFee} onChange={handleChange}
                    className={errors.consultationFee ? 'form-input-error' : 'form-input'}
                    placeholder="e.g. 500"
                  />
                  {errors.consultationFee && <p className="mt-1.5 text-xs text-red-600">{errors.consultationFee}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="hospital" className="form-label">
                  Hospital / Clinic <span className="text-neutral-400 normal-case font-normal">(optional)</span>
                </label>
                <input id="hospital" name="hospital" type="text"
                  value={form.hospital} onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. City General Hospital"
                />
              </div>

              <div>
                <label htmlFor="bio" className="form-label">
                  Short bio <span className="text-neutral-400 normal-case font-normal">(optional)</span>
                </label>
                <textarea id="bio" name="bio"
                  rows={3}
                  value={form.bio} onChange={handleChange}
                  className="form-input resize-none"
                  placeholder="Briefly describe your expertise, approach, or areas of focus (max 500 characters)"
                  maxLength={500}
                />
                <p className="mt-1 text-xs text-neutral-400 text-right">{form.bio.length}/500</p>
              </div>

              <div className="flex gap-3 pt-1">
                <Button variant="ghost" size="md" className="border border-neutral-300" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" variant="primary" size="lg" loading={loading} className="flex-1">
                  Submit for review
                </Button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary no-underline hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default DoctorRegisterPage
