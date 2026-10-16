import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PatientSidebar } from '../../components/layout/Sidebar'
import LoadingSpinner, { PageLoader } from '../../components/common/LoadingSpinner'
import StatusBadge from '../../components/common/StatusBadge'
import Button from '../../components/common/Button'
import { appointmentService } from '../../services/services'

const PatientAppointmentDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [appt, setAppt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState('')

  useEffect(() => {
    appointmentService.getById(id)
      .then(res => setAppt(res.data.appointment))
      .catch(() => navigate('/patient/appointments'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return
    setCancelling(true)
    try {
      const res = await appointmentService.updateStatus(id, { status: 'cancelled', cancellationReason: 'Cancelled by patient' })
      setAppt(res.data.appointment)
    } catch (err) {
      setCancelError(err.response?.data?.message || 'Failed to cancel')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) return <PageLoader />
  if (!appt) return null

  const isCancellable = appt.status === 'pending' || appt.status === 'confirmed'
  const isCompleted = appt.status === 'completed'

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <PatientSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate('/patient/appointments')} className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 mb-6 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to appointments
          </button>

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-neutral-900 mb-1">Appointment Details</h1>
                <p className="text-sm text-neutral-500">ID: {appt._id}</p>
              </div>
              <StatusBadge status={appt.status} />
            </div>

            {/* Content */}
            <div className="p-6 grid sm:grid-cols-2 gap-8">
              {/* Doctor Info */}
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">Doctor</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-primary">{appt.doctor?.name?.[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{appt.doctor?.name}</p>
                    <p className="text-xs text-neutral-500">{appt.doctorProfile?.specialization}</p>
                    <button onClick={() => navigate(`/patient/doctors/${appt.doctorProfile?._id}`)} className="text-xs text-primary hover:underline mt-0.5 inline-block">View profile</button>
                  </div>
                </div>
              </div>

              {/* Schedule Info */}
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">Schedule</p>
                <div className="space-y-2 text-sm text-neutral-800">
                  <div className="flex gap-2">
                    <svg className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span>{new Date(appt.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex gap-2">
                    <svg className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span>{appt.slot?.startTime} - {appt.slot?.endTime}</span>
                  </div>
                  <div className="flex gap-2">
                    <svg className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>{appt.doctorProfile?.hospital || 'Online Consultation'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reason */}
            {appt.reason && (
              <div className="p-6 border-t border-neutral-100">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">Reason for visit</p>
                <p className="text-sm text-neutral-800">{appt.reason}</p>
              </div>
            )}

            {/* Actions */}
            <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3">
              {cancelError && <span className="text-xs text-red-600 self-center mr-auto">{cancelError}</span>}
              
              {isCancellable && (
                <Button variant="danger" size="md" loading={cancelling} onClick={handleCancel}>
                  Cancel Appointment
                </Button>
              )}
              
              {isCompleted && (
                <Button variant="primary" size="md" onClick={() => navigate('/patient/medical-records')}>
                  View Consultation Notes
                </Button>
              )}
              
              {!isCancellable && !isCompleted && (
                <p className="text-sm text-neutral-500 italic">No actions available for this appointment.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PatientAppointmentDetailsPage
