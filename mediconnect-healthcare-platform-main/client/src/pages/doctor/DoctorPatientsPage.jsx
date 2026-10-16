import { useState, useEffect } from 'react'
import { DoctorSidebar } from '../../components/layout/Sidebar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { appointmentService } from '../../services/services'

const DoctorPatientsPage = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    appointmentService.getMy()
      .then(res => {
        const uniquePatients = new Map()
        res.data.appointments.forEach(appt => {
          if (appt.patient && !uniquePatients.has(appt.patient._id)) {
            uniquePatients.set(appt.patient._id, {
              ...appt.patient,
              lastVisit: appt.date,
              totalVisits: 1
            })
          } else if (appt.patient) {
            const p = uniquePatients.get(appt.patient._id)
            p.totalVisits += 1
            if (appt.date > p.lastVisit) p.lastVisit = appt.date
          }
        })
        setPatients(Array.from(uniquePatients.values()))
      })
      .catch(() => setPatients([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <DoctorSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-neutral-900 mb-1">My Patients</h1>
            <p className="text-sm text-neutral-500">List of all patients you have consulted or have upcoming appointments with</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
          ) : patients.length === 0 ? (
            <EmptyState title="No patients yet" description="Your patient list will populate as appointments are booked." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {patients.map(p => (
                <div key={p._id} className="card p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                      {p.name?.[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">{p.name}</h3>
                      <p className="text-xs text-neutral-500">{p.email}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
                    <div>
                      <p className="text-[10px] text-neutral-400 uppercase">Last Visit</p>
                      <p className="text-xs font-medium text-neutral-800">{new Date(p.lastVisit).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-400 uppercase text-right">Visits</p>
                      <p className="text-xs font-medium text-neutral-800 text-right">{p.totalVisits}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default DoctorPatientsPage
