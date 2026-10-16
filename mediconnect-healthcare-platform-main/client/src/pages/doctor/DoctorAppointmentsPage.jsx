import { useState, useEffect } from 'react'
import { DoctorSidebar } from '../../components/layout/Sidebar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import Button from '../../components/common/Button'
import { appointmentService, consultationService, prescriptionService } from '../../services/services'

const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('upcoming')
  const [selectedAppt, setSelectedAppt] = useState(null)
  
  // Consultation Modal State
  const [showConsultModal, setShowConsultModal] = useState(false)
  const [consultForm, setConsultForm] = useState({ chiefComplaint: '', diagnosis: '', clinicalNotes: '' })
  const [submitting, setSubmitting] = useState(false)

  const fetchAppointments = () => {
    setLoading(true)
    const params = filter === 'upcoming' ? { upcoming: true } : {}
    appointmentService.getMy(params)
      .then(res => {
        let data = res.data.appointments
        if (filter === 'past') {
          const today = new Date().toISOString().split('T')[0]
          data = data.filter(a => a.status === 'completed' || a.status === 'cancelled' || a.date < today)
        }
        setAppointments(data)
      })
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchAppointments()
    setSelectedAppt(null)
  }, [filter])

  const handleStatusUpdate = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, { status })
      fetchAppointments()
      if (selectedAppt?._id === id) setSelectedAppt({ ...selectedAppt, status })
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const handleConsultSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await consultationService.create({
        appointmentId: selectedAppt._id,
        ...consultForm
      })
      setShowConsultModal(false)
      fetchAppointments()
      setSelectedAppt({ ...selectedAppt, status: 'completed' })
    } catch (err) {
      alert('Failed to save consultation')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <DoctorSidebar />
      <main className="flex-1 p-6 flex gap-6 h-screen overflow-hidden">
        
        {/* Left List */}
        <div className="w-1/2 flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
            <h2 className="font-semibold text-neutral-900">Appointments</h2>
            <select className="form-input py-1 text-xs w-32" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loading ? (
              <div className="flex justify-center py-10"><LoadingSpinner /></div>
            ) : appointments.length === 0 ? (
              <EmptyState title="No appointments" description="No appointments match this filter." />
            ) : (
              appointments.map(appt => (
                <div 
                  key={appt._id} 
                  onClick={() => setSelectedAppt(appt)}
                  className={`p-3 rounded-lg cursor-pointer flex justify-between items-center transition-colors border
                    ${selectedAppt?._id === appt._id ? 'border-primary bg-primary-light' : 'border-transparent hover:bg-neutral-50'}`}
                >
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{appt.patient?.name}</p>
                    <p className="text-xs text-neutral-500">{appt.date} • {appt.slot.startTime}</p>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="w-1/2 flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
          {selectedAppt ? (
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 border-b border-neutral-100 bg-neutral-50 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">{selectedAppt.patient?.name}</h2>
                  <p className="text-sm text-neutral-500">Contact: {selectedAppt.patient?.phone || 'N/A'}</p>
                </div>
                <StatusBadge status={selectedAppt.status} />
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">Schedule Details</h3>
                  <div className="text-sm text-neutral-800 space-y-1 border rounded-lg p-3 bg-neutral-50">
                    <p><span className="text-neutral-500 w-20 inline-block">Date:</span> {selectedAppt.date}</p>
                    <p><span className="text-neutral-500 w-20 inline-block">Time:</span> {selectedAppt.slot.startTime} - {selectedAppt.slot.endTime}</p>
                    <p><span className="text-neutral-500 w-20 inline-block">Type:</span> <span className="capitalize">{selectedAppt.type.replace('-', ' ')}</span></p>
                  </div>
                </div>
                
                {selectedAppt.reason && (
                  <div>
                    <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">Reason for Visit</h3>
                    <p className="text-sm text-neutral-800 bg-amber-50 p-3 rounded-lg border border-amber-100">{selectedAppt.reason}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-neutral-100">
                  <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAppt.status === 'pending' && (
                      <>
                        <Button variant="primary" size="sm" onClick={() => handleStatusUpdate(selectedAppt._id, 'confirmed')}>Accept Appointment</Button>
                        <Button variant="danger" size="sm" onClick={() => handleStatusUpdate(selectedAppt._id, 'cancelled')}>Decline</Button>
                      </>
                    )}
                    {selectedAppt.status === 'confirmed' && (
                      <>
                        <Button variant="primary" size="sm" onClick={() => setShowConsultModal(true)}>Start Consultation</Button>
                        <Button variant="danger" size="sm" onClick={() => handleStatusUpdate(selectedAppt._id, 'cancelled')}>Cancel</Button>
                      </>
                    )}
                    {selectedAppt.status === 'completed' && (
                      <p className="text-sm text-green-600 font-medium">Consultation Completed.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-400 text-sm">
              Select an appointment to view details
            </div>
          )}
        </div>
      </main>

      {/* Consultation Modal */}
      {showConsultModal && (
        <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-neutral-900">Consultation Form</h2>
              <button onClick={() => setShowConsultModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="consultForm" onSubmit={handleConsultSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Chief Complaint</label>
                  <input type="text" className="form-input" required value={consultForm.chiefComplaint} onChange={e => setConsultForm({...consultForm, chiefComplaint: e.target.value})} />
                </div>
                <div>
                  <label className="form-label">Diagnosis</label>
                  <input type="text" className="form-input" required value={consultForm.diagnosis} onChange={e => setConsultForm({...consultForm, diagnosis: e.target.value})} />
                </div>
                <div>
                  <label className="form-label">Clinical Notes</label>
                  <textarea className="form-input resize-none" rows="4" value={consultForm.clinicalNotes} onChange={e => setConsultForm({...consultForm, clinicalNotes: e.target.value})}></textarea>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowConsultModal(false)}>Cancel</Button>
              <Button type="submit" form="consultForm" variant="primary" loading={submitting}>Complete Consultation</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorAppointmentsPage
