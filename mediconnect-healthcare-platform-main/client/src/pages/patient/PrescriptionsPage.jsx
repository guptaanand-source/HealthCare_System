import { useState, useEffect } from 'react'
import { PatientSidebar } from '../../components/layout/Sidebar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { prescriptionService } from '../../services/services'

const PrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    prescriptionService.getMy()
      .then(res => setPrescriptions(res.data.prescriptions))
      .catch(() => setPrescriptions([]))
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <PatientSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Prescriptions</h1>
              <p className="text-sm text-neutral-500">Medications prescribed by your doctors</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
          ) : prescriptions.length === 0 ? (
            <EmptyState
              title="No prescriptions"
              description="You have no active or past prescriptions."
            />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {prescriptions.map(rx => (
                <div key={rx._id} className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-card-md transition-shadow">
                  {/* Rx Header */}
                  <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-start">
                    <div>
                      <p className="text-xs text-neutral-500 mb-0.5">{formatDate(rx.createdAt)}</p>
                      <p className="text-sm font-semibold text-neutral-900">{rx.doctor?.name}</p>
                      <p className="text-xs text-neutral-500">{rx.appointment?.doctorProfile?.specialization}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.5 20.5L3.5 13.5C2 12 2 9.5 3.5 8s4-1.5 5.5 0l7 7c1.5 1.5 1.5 4 0 5.5s-4 1.5-5.5 0z"/><path d="M16 2l4 4"/><path d="M12 6l6 6"/></svg>
                    </div>
                  </div>
                  
                  {/* Medicines List */}
                  <div className="p-4">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">Medicines</p>
                    <ul className="space-y-3">
                      {rx.medicines.map((med, i) => (
                        <li key={i} className="text-sm">
                          <div className="font-medium text-neutral-900 flex justify-between">
                            <span>{med.name} <span className="text-neutral-500 font-normal ml-1">{med.dosage}</span></span>
                            <span className="text-neutral-500 text-xs">{med.duration}</span>
                          </div>
                          <p className="text-xs text-neutral-600 mt-0.5">{med.frequency} • {med.instructions}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer Notes */}
                  {rx.additionalInstructions && (
                    <div className="px-4 pb-4">
                      <div className="p-3 bg-amber-50 rounded text-xs text-amber-900 border border-amber-100">
                        <span className="font-semibold block mb-0.5">Instructions:</span>
                        {rx.additionalInstructions}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default PrescriptionsPage
