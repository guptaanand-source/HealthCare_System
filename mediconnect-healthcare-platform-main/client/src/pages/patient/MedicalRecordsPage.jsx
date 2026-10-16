import { useState, useEffect } from 'react'
import { PatientSidebar } from '../../components/layout/Sidebar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { consultationService } from '../../services/services'

const MedicalRecordsPage = () => {
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    consultationService.getMy()
      .then(res => setConsultations(res.data.consultations))
      .catch(() => setConsultations([]))
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (dateStr) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <PatientSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Medical Records</h1>
            <p className="text-sm text-neutral-500">History of your doctor consultations and notes</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
          ) : consultations.length === 0 ? (
            <EmptyState
              title="No medical records found"
              description="Your consultation history will appear here after your first completed doctor visit."
            />
          ) : (
            <div className="space-y-4">
              {consultations.map(consult => {
                const isExpanded = expandedId === consult._id
                return (
                  <div key={consult._id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                    {/* Header (Clickable to expand) */}
                    <div 
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors"
                      onClick={() => toggleExpand(consult._id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-primary">{consult.doctor?.name?.[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">{consult.doctor?.name}</p>
                          <p className="text-xs text-neutral-500">
                            {formatDate(consult.appointment?.date)} • {consult.appointment?.doctorProfile?.specialization}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="hidden sm:inline-block px-2.5 py-1 text-xs font-medium bg-neutral-100 text-neutral-600 rounded">
                          {consult.diagnosis ? 'Diagnosed' : 'Consultation'}
                        </span>
                        <svg className={`w-5 h-5 text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-neutral-100 p-5 bg-neutral-50/50">
                        <div className="grid sm:grid-cols-2 gap-6">
                          
                          {/* Left Col */}
                          <div className="space-y-5">
                            {consult.chiefComplaint && (
                              <div>
                                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Chief Complaint</p>
                                <p className="text-sm text-neutral-800">{consult.chiefComplaint}</p>
                              </div>
                            )}
                            {consult.symptoms?.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5">Symptoms</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {consult.symptoms.map((s, i) => (
                                    <span key={i} className="px-2 py-1 bg-white border border-neutral-200 rounded text-xs text-neutral-700">{s}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {consult.diagnosis && (
                              <div>
                                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Diagnosis</p>
                                <p className="text-sm font-medium text-neutral-900">{consult.diagnosis}</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Right Col */}
                          <div className="space-y-5">
                            {consult.vitals && Object.keys(consult.vitals).some(k => consult.vitals[k]) && (
                              <div>
                                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5">Vitals</p>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  {consult.vitals.bloodPressure && <div><span className="text-neutral-500 mr-1">BP:</span>{consult.vitals.bloodPressure}</div>}
                                  {consult.vitals.pulse && <div><span className="text-neutral-500 mr-1">Pulse:</span>{consult.vitals.pulse} bpm</div>}
                                  {consult.vitals.temperature && <div><span className="text-neutral-500 mr-1">Temp:</span>{consult.vitals.temperature} °F</div>}
                                  {consult.vitals.weight && <div><span className="text-neutral-500 mr-1">Weight:</span>{consult.vitals.weight} kg</div>}
                                </div>
                              </div>
                            )}
                            {consult.clinicalNotes && (
                              <div>
                                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Clinical Notes</p>
                                <p className="text-sm text-neutral-800 whitespace-pre-wrap">{consult.clinicalNotes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default MedicalRecordsPage
