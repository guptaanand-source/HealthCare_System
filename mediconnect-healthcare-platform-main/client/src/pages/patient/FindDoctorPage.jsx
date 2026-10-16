import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PatientSidebar } from '../../components/layout/Sidebar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { doctorService } from '../../services/services'

const DoctorCard = ({ doctor, onClick }) => (
  <div className="card p-5 hover:shadow-card-md transition-shadow cursor-pointer" onClick={onClick}>
    <div className="flex items-start gap-4 mb-4">
      <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
        <span className="text-lg font-bold text-primary">{doctor.user?.name?.[0]}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-neutral-900 truncate">{doctor.user?.name}</h3>
        <p className="text-sm text-primary font-medium">{doctor.specialization}</p>
        <p className="text-xs text-neutral-500 mt-0.5">{doctor.qualification}</p>
      </div>
    </div>
    <div className="flex flex-wrap gap-3 text-xs text-neutral-600 mb-4">
      <span className="flex items-center gap-1">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        {doctor.experience} yr{doctor.experience !== 1 ? 's' : ''} exp.
      </span>
      {doctor.hospital && (
        <span className="flex items-center gap-1 truncate">
          <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          {doctor.hospital}
        </span>
      )}
      {doctor.consultationFee > 0 && (
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          ₹{doctor.consultationFee}
        </span>
      )}
    </div>
    <button className="w-full btn-sm btn-primary">Book appointment</button>
  </div>
)

const FindDoctorPage = () => {
  const navigate = useNavigate()
  const [doctors, setDoctors]             = useState([])
  const [specializations, setSpecs]       = useState([])
  const [search, setSearch]               = useState('')
  const [selectedSpec, setSelectedSpec]   = useState('')
  const [loading, setLoading]             = useState(true)
  const [debouncedSearch, setDebounced]   = useState('')

  useEffect(() => {
    doctorService.getSpecializations().then(r => setSpecs(r.data.specializations)).catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (debouncedSearch) params.search = debouncedSearch
    if (selectedSpec)    params.specialization = selectedSpec
    doctorService.getAll(params)
      .then(r => setDoctors(r.data.doctors))
      .catch(() => setDoctors([]))
      .finally(() => setLoading(false))
  }, [debouncedSearch, selectedSpec])

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <PatientSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-5xl">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Find a doctor</h1>
            <p className="text-sm text-neutral-500">Search by name or specialization</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, specialization or hospital…"
                className="form-input pl-9" />
            </div>
            <select value={selectedSpec} onChange={e => setSelectedSpec(e.target.value)}
              className="form-input sm:w-56">
              <option value="">All specializations</option>
              {specializations.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
          ) : doctors.length === 0 ? (
            <EmptyState
              title="No doctors found"
              description={search || selectedSpec ? 'Try adjusting your search or filter.' : 'No verified doctors are available yet.'}
              action={search || selectedSpec ? { label: 'Clear filters', onClick: () => { setSearch(''); setSelectedSpec('') } } : undefined}
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map(doc => (
                <DoctorCard key={doc._id} doctor={doc}
                  onClick={() => navigate(`/patient/doctors/${doc._id}`)} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default FindDoctorPage
