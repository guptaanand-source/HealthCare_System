import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PatientSidebar } from '../../components/layout/Sidebar'
import LoadingSpinner, { PageLoader } from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'
import { doctorService, appointmentService } from '../../services/services'

const DoctorProfilePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Booking state
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [reason, setReason] = useState('')
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState('')

  // Date constraints
  const today = new Date()
  const minDate = today.toISOString().split('T')[0]
  const maxDateObj = new Date()
  maxDateObj.setDate(today.getDate() + 30) // Book up to 30 days in advance
  const maxDate = maxDateObj.toISOString().split('T')[0]

  useEffect(() => {
    doctorService.getById(id)
      .then(res => setDoctor(res.data.doctor))
      .catch(() => navigate('/patient/find-doctor'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([])
      setSelectedSlot(null)
      return
    }
    
    setLoadingSlots(true)
    setSelectedSlot(null)
    
    appointmentService.getSlots(id, selectedDate)
      .then(res => setAvailableSlots(res.data.slots || []))
      .catch(() => setAvailableSlots([]))
      .finally(() => setLoadingSlots(false))
  }, [id, selectedDate])

  const handleBook = async () => {
    if (!selectedDate || !selectedSlot) return
    setBooking(true)
    setError('')
    try {
      await appointmentService.book({
        doctorId: id,
        date: selectedDate,
        slot: selectedSlot,
        type: 'first-visit',
        reason
      })
      navigate('/patient/appointments')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment')
    } finally {
      setBooking(false)
    }
  }

  if (loading) return <PageLoader />
  if (!doctor) return null

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <PatientSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 mb-6 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to search
          </button>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Col: Doctor Info */}
            <div className="md:col-span-2 space-y-6">
              <div className="card p-6">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">{doctor.user?.name?.[0]}</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-neutral-900">{doctor.user?.name}</h1>
                    <p className="text-primary font-medium">{doctor.specialization}</p>
                    <p className="text-sm text-neutral-500 mt-1">{doctor.qualification}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-100">
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wide">Experience</p>
                    <p className="text-sm font-medium text-neutral-900 mt-0.5">{doctor.experience} Years</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wide">Hospital</p>
                    <p className="text-sm font-medium text-neutral-900 mt-0.5 truncate">{doctor.hospital || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wide">Consultation Fee</p>
                    <p className="text-sm font-medium text-neutral-900 mt-0.5">₹{doctor.consultationFee}</p>
                  </div>
                </div>

                {doctor.bio && (
                  <div className="mt-6 pt-6 border-t border-neutral-100">
                    <p className="text-xs text-neutral-500 uppercase tracking-wide mb-2">About Doctor</p>
                    <p className="text-sm text-neutral-700 leading-relaxed">{doctor.bio}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Booking Form */}
            <div className="md:col-span-1">
              <div className="card p-5 sticky top-6">
                <h2 className="text-base font-semibold text-neutral-900 mb-4">Book Appointment</h2>
                
                {error && (
                  <div className="mb-4 rounded-md bg-red-50 p-3 text-xs text-red-700 border border-red-100">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="form-label">Select Date</label>
                    <input 
                      type="date" 
                      className="form-input"
                      min={minDate}
                      max={maxDate}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>

                  {selectedDate && (
                    <div>
                      <label className="form-label mb-2 flex justify-between">
                        Available Slots
                        {loadingSlots && <LoadingSpinner size="sm" />}
                      </label>
                      
                      {!loadingSlots && availableSlots.length === 0 ? (
                        <div className="p-3 bg-neutral-50 rounded border border-neutral-200 text-center">
                          <p className="text-xs text-neutral-500">No slots available on this date.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {availableSlots.map(slot => {
                            const isSelected = selectedSlot?.startTime === slot.startTime
                            return (
                              <button
                                key={slot.startTime}
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-2 text-xs font-medium rounded border transition-colors
                                  ${isSelected 
                                    ? 'bg-primary border-primary text-white' 
                                    : 'bg-white border-neutral-200 text-neutral-700 hover:border-primary-light hover:bg-primary-light'
                                  }`}
                              >
                                {slot.startTime}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {selectedSlot && (
                    <div>
                      <label className="form-label">Reason for visit (optional)</label>
                      <textarea
                        className="form-input resize-none"
                        rows="2"
                        placeholder="Briefly describe your symptoms"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      ></textarea>
                    </div>
                  )}

                  <Button 
                    variant="primary" 
                    className="w-full mt-2" 
                    disabled={!selectedDate || !selectedSlot}
                    loading={booking}
                    onClick={handleBook}
                  >
                    Confirm Booking
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DoctorProfilePage
