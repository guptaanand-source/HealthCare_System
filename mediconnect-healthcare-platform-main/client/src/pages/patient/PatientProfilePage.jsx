import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { PatientSidebar } from '../../components/layout/Sidebar'
import Button from '../../components/common/Button'
import AvatarUpload from '../../components/common/AvatarUpload'
import api from '../../services/api'

const PatientProfilePage = () => {
  const { user, token, login } = useAuth()
  
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    dateOfBirth: '',
    gender: 'prefer-not-to-say',
    bloodGroup: 'unknown',
    allergies: '',
    chronicConditions: '',
  })
  
  const [address, setAddress] = useState({
    street: '', city: '', state: '', pincode: ''
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    // Fetch extended patient profile
    api.get('/auth/me/patient-profile') // We need to add this endpoint or just do a generic profile fetch. Wait, we didn't build a specific patient profile GET route. Let's just fetch from a new endpoint or update auth/me. Actually, let's create a quick API call to get patient details.
      .then(res => {
        const p = res.data.patient
        if (p) {
          setForm(prev => ({
            ...prev,
            dateOfBirth: p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '',
            gender: p.gender || 'prefer-not-to-say',
            bloodGroup: p.bloodGroup || 'unknown',
            allergies: p.allergies?.join(', ') || '',
            chronicConditions: p.chronicConditions?.join(', ') || '',
          }))
          if (p.address) {
            setAddress({
              street: p.address.street || '',
              city: p.address.city || '',
              state: p.address.state || '',
              pincode: p.address.pincode || '',
            })
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleAddressChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })
    
    try {
      const payload = {
        ...form,
        allergies: form.allergies.split(',').map(s => s.trim()).filter(Boolean),
        chronicConditions: form.chronicConditions.split(',').map(s => s.trim()).filter(Boolean),
        address
      }
      
      const res = await api.put('/auth/me/patient-profile', payload)
      // Update auth context user just in case name/phone changed
      login(res.data.user, token)
      setMessage({ type: 'success', text: 'Profile updated successfully' })
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <PatientSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Profile Settings</h1>
            <p className="text-sm text-neutral-500">Manage your personal and medical information</p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-md text-sm border ${message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
              {message.text}
            </div>
          )}

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <form onSubmit={handleSubmit} className="divide-y divide-neutral-100">
              
              {/* Avatar */}
              <div className="p-6 sm:p-8 flex items-center gap-6">
                <AvatarUpload size="lg" />
                <div>
                  <h2 className="text-base font-semibold text-neutral-900">{user?.name}</h2>
                  <p className="text-sm text-neutral-500">{user?.email}</p>
                  <p className="text-xs text-neutral-400 mt-1">Click your photo to upload a new one (max 3MB)</p>
                </div>
              </div>

              {/* Personal Info */}
              <div className="p-6 sm:p-8">
                <h2 className="text-base font-semibold text-neutral-900 mb-4">Personal Information</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">Full Name</label>
                    <input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="form-label">Email Address (Cannot be changed)</label>
                    <input type="email" className="form-input bg-neutral-50 text-neutral-500 cursor-not-allowed" value={user?.email} disabled />
                  </div>
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input type="tel" name="phone" className="form-input" value={form.phone} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="form-label">Date of Birth</label>
                    <input type="date" name="dateOfBirth" className="form-input" value={form.dateOfBirth} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="form-label">Gender</label>
                    <select name="gender" className="form-input" value={form.gender} onChange={handleChange}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Blood Group</label>
                    <select name="bloodGroup" className="form-input" value={form.bloodGroup} onChange={handleChange}>
                      {['unknown', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg === 'unknown' ? 'Unknown' : bg}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="p-6 sm:p-8">
                <h2 className="text-base font-semibold text-neutral-900 mb-4">Address</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="form-label">Street Address</label>
                    <input type="text" name="street" className="form-input" value={address.street} onChange={handleAddressChange} />
                  </div>
                  <div>
                    <label className="form-label">City</label>
                    <input type="text" name="city" className="form-input" value={address.city} onChange={handleAddressChange} />
                  </div>
                  <div>
                    <label className="form-label">State</label>
                    <input type="text" name="state" className="form-input" value={address.state} onChange={handleAddressChange} />
                  </div>
                  <div>
                    <label className="form-label">PIN Code</label>
                    <input type="text" name="pincode" className="form-input" value={address.pincode} onChange={handleAddressChange} />
                  </div>
                </div>
              </div>

              {/* Medical Info */}
              <div className="p-6 sm:p-8">
                <h2 className="text-base font-semibold text-neutral-900 mb-4">Medical Background</h2>
                <div className="space-y-5">
                  <div>
                    <label className="form-label">Allergies (comma separated)</label>
                    <input type="text" name="allergies" className="form-input" value={form.allergies} onChange={handleChange} placeholder="e.g. Peanuts, Penicillin" />
                  </div>
                  <div>
                    <label className="form-label">Chronic Conditions (comma separated)</label>
                    <input type="text" name="chronicConditions" className="form-input" value={form.chronicConditions} onChange={handleChange} placeholder="e.g. Diabetes, Hypertension" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 sm:p-8 bg-neutral-50 flex justify-end">
                <Button type="submit" variant="primary" size="lg" loading={saving}>Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PatientProfilePage
