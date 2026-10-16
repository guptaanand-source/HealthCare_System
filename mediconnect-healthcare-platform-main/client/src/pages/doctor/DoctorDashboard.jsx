import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { DoctorSidebar } from '../../components/layout/Sidebar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import { appointmentService } from '../../services/services'

const DoctorDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [upcoming, setUpcoming] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    appointmentService.getMy({ upcoming: true })
      .then(res => setUpcoming(res.data.appointments.slice(0, 5)))
      .catch(() => setUpcoming([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <DoctorSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, Dr. {user?.name?.split(' ').pop()}</h1>
            <p className="text-sm text-neutral-500">Here's an overview of your schedule today.</p>
          </div>

          {!user?.isVerified && (
            <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <div>
                  <h3 className="text-sm font-semibold text-amber-900">Verification Pending</h3>
                  <p className="text-xs text-amber-800 mt-1">Your account is under review by an administrator. You will not appear in patient searches until verified.</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-base font-semibold text-neutral-900 mb-4">Upcoming Appointments</h2>
              
              {loading ? (
                <div className="flex justify-center py-12"><LoadingSpinner /></div>
              ) : upcoming.length === 0 ? (
                <EmptyState
                  title="No upcoming appointments"
                  description="Your schedule is clear. Make sure your availability is up to date."
                  action={{ label: 'Manage Availability', onClick: () => navigate('/doctor/availability') }}
                />
              ) : (
                <div className="space-y-3">
                  {upcoming.map(appt => (
                    <div key={appt._id} className="card p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">
                          {appt.patient?.name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">{appt.patient?.name}</p>
                          <p className="text-xs text-neutral-500">{new Date(appt.date).toLocaleDateString()} • {appt.slot.startTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusBadge status={appt.status} />
                        <button onClick={() => navigate(`/doctor/appointments`)} className="btn-sm btn-ghost">View</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-1">
              <h2 className="text-base font-semibold text-neutral-900 mb-4">Quick Links</h2>
              <div className="card p-2">
                <button onClick={() => navigate('/doctor/availability')} className="w-full text-left p-3 hover:bg-neutral-50 rounded text-sm text-neutral-700 flex items-center gap-3">
                  <svg className="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Manage Availability
                </button>
                <button onClick={() => navigate('/doctor/patients')} className="w-full text-left p-3 hover:bg-neutral-50 rounded text-sm text-neutral-700 flex items-center gap-3">
                  <svg className="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                  My Patients
                </button>
                <button onClick={() => navigate('/doctor/profile')} className="w-full text-left p-3 hover:bg-neutral-50 rounded text-sm text-neutral-700 flex items-center gap-3">
                  <svg className="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                  Profile Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DoctorDashboard
