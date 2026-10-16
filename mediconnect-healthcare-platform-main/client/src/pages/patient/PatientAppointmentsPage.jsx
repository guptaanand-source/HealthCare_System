import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PatientSidebar } from '../../components/layout/Sidebar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import { appointmentService } from '../../services/services'

const PatientAppointmentsPage = () => {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('upcoming') // 'upcoming' or 'past'

  useEffect(() => {
    setLoading(true)
    const statusFilter = filter === 'upcoming' 
      ? { status: ['pending', 'confirmed'].join(',') } // We'll handle this purely on client for simplicity if backend doesn't support $in array via query
      : undefined
      
    // The backend `upcoming=true` handles future dates and pending/confirmed status.
    const params = filter === 'upcoming' ? { upcoming: true } : {}
    
    appointmentService.getMy(params)
      .then(res => {
        let data = res.data.appointments
        if (filter === 'past') {
          // Filter out future pending/confirmed to simulate "past" tab
          const today = new Date().toISOString().split('T')[0]
          data = data.filter(a => a.status === 'completed' || a.status === 'cancelled' || a.date < today)
        }
        setAppointments(data)
      })
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false))
  }, [filter])

  const formatDate = (dateStr) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    })
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <PatientSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 mb-1">My Appointments</h1>
              <p className="text-sm text-neutral-500">Manage your upcoming and past visits</p>
            </div>
            
            {/* Tabs */}
            <div className="flex bg-neutral-200 p-1 rounded-lg self-start">
              <button 
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'upcoming' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'}`}
                onClick={() => setFilter('upcoming')}
              >
                Upcoming
              </button>
              <button 
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'past' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'}`}
                onClick={() => setFilter('past')}
              >
                Past
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
          ) : appointments.length === 0 ? (
            <EmptyState
              title={filter === 'upcoming' ? "No upcoming appointments" : "No past appointments"}
              description={filter === 'upcoming' ? "You don't have any appointments scheduled." : "Your appointment history is empty."}
              action={filter === 'upcoming' ? { label: 'Book now', onClick: () => navigate('/patient/find-doctor') } : undefined}
            />
          ) : (
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="divide-y divide-neutral-100">
                {appointments.map(appt => (
                  <div 
                    key={appt._id} 
                    onClick={() => navigate(`/patient/appointments/${appt._id}`)}
                    className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-neutral-50 cursor-pointer transition-colors"
                  >
                    {/* Date Block */}
                    <div className="sm:w-32 flex-shrink-0">
                      <p className="text-sm font-medium text-neutral-900">{formatDate(appt.date)}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{appt.slot?.startTime} - {appt.slot?.endTime}</p>
                    </div>
                    
                    {/* Doctor Info */}
                    <div className="flex-1 flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">{appt.doctor?.name?.[0]}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-neutral-900 truncate">{appt.doctor?.name}</p>
                        <p className="text-xs text-neutral-500 truncate">{appt.doctorProfile?.specialization} • {appt.doctorProfile?.hospital}</p>
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:w-40 flex-shrink-0">
                      <StatusBadge status={appt.status} />
                      <svg className="w-4 h-4 text-neutral-400 hidden sm:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default PatientAppointmentsPage
