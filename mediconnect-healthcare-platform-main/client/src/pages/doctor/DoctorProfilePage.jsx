import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { DoctorSidebar } from '../../components/layout/Sidebar'
import Button from '../../components/common/Button'
import AvatarUpload from '../../components/common/AvatarUpload'
import { doctorService } from '../../services/services'

const DoctorProfilePage = () => {
  const { user, login } = useAuth()
  
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    specialization: '',
    qualification: '',
    experience: 0,
    hospital: '',
    consultationFee: 0,
    bio: '',
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    doctorService.getMyProfile()
      .then(res => {
        const d = res.data.doctor
        if (d) {
          setForm({
            name: d.user?.name || '',
            phone: d.user?.phone || '',
            specialization: d.specialization || '',
            qualification: d.qualification || '',
            experience: d.experience || 0,
            hospital: d.hospital || '',
            consultationFee: d.consultationFee || 0,
            bio: d.bio || '',
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })
    
    try {
      const res = await doctorService.updateProfile(form)
      // Update auth context user in case name changed
      login(res.data.doctor.user, localStorage.getItem('token'))
      setMessage({ type: 'success', text: 'Professional profile updated successfully' })
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <DoctorSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Profile Settings</h1>
            <p className="text-sm text-neutral-500">Manage your professional information</p>
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
                  <p className="text-xs text-neutral-400 mt-1">Click photo to upload (max 3MB · JPG, PNG, WEBP)</p>
                </div>
              </div>
              
              <div className="p-6 sm:p-8">
                <h2 className="text-base font-semibold text-neutral-900 mb-4">Account Information</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">Full Name</label>
                    <input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-input bg-neutral-50 text-neutral-500 cursor-not-allowed" value={user?.email} disabled />
                  </div>
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input type="tel" name="phone" className="form-input" value={form.phone} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <h2 className="text-base font-semibold text-neutral-900 mb-4">Professional Details</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">Specialization</label>
                    <input type="text" name="specialization" className="form-input" value={form.specialization} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="form-label">Qualification</label>
                    <input type="text" name="qualification" className="form-input" value={form.qualification} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="form-label">Years of Experience</label>
                    <input type="number" name="experience" className="form-input" value={form.experience} onChange={handleChange} min="0" required />
                  </div>
                  <div>
                    <label className="form-label">Consultation Fee (₹)</label>
                    <input type="number" name="consultationFee" className="form-input" value={form.consultationFee} onChange={handleChange} min="0" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label">Hospital / Clinic</label>
                    <input type="text" name="hospital" className="form-input" value={form.hospital} onChange={handleChange} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label">Professional Bio</label>
                    <textarea name="bio" className="form-input resize-none" rows="4" value={form.bio} onChange={handleChange}></textarea>
                  </div>
                </div>
              </div>

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

export default DoctorProfilePage
