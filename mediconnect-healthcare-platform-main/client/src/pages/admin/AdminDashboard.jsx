import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { adminService } from '../../services/services'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import StatusBadge from '../../components/common/StatusBadge'

const adminNav = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Doctors',   path: '/admin/doctors' },
  { label: 'Patients',  path: '/admin/patients' },
]

export const AdminSidebar = () => {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="w-56 bg-neutral-900 text-neutral-300 min-h-screen flex flex-col">
      <div className="h-14 flex items-center px-6 border-b border-neutral-800 flex-shrink-0">
        <span className="text-sm font-bold text-white tracking-wide">MediConnect <span className="text-primary-light font-normal text-xs">Admin</span></span>
      </div>
      <nav className="flex-1 py-6 space-y-1 px-3">
        {adminNav.map(item => (
          <Link key={item.path} to={item.path}
            className={`block px-3 py-2 rounded text-sm transition-colors ${pathname.startsWith(item.path) ? 'bg-neutral-800 text-white font-medium' : 'hover:bg-neutral-800 hover:text-white'}`}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-neutral-800">
        <p className="text-xs font-medium text-white">{user?.name}</p>
        <p className="text-xs text-neutral-500 mb-3">{user?.email}</p>
        <button onClick={() => { logout(); navigate('/') }} className="text-xs text-neutral-400 hover:text-white transition-colors">
          Log out
        </button>
      </div>
    </aside>
  )
}

const StatCard = ({ label, value }) => (
  <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-3xl font-semibold text-neutral-900">{value}</p>
  </div>
)

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminService.getStats(),
      adminService.getAppointments({ limit: 5 })
    ]).then(([statRes, apptRes]) => {
      setStats(statRes.data.stats)
      setAppointments(apptRes.data.appointments)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">Overview</h1>
          <p className="text-sm text-neutral-500">System statistics and recent activity</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total Patients" value={stats?.totalPatients || 0} />
              <StatCard label="Total Doctors" value={stats?.totalDoctors || 0} />
              <StatCard label="Total Appointments" value={stats?.totalAppointments || 0} />
              <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 shadow-sm">
                <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1">Pending Doctors</p>
                <p className="text-3xl font-semibold text-amber-900">{stats?.pendingDoctors || 0}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center">
                <h2 className="font-semibold text-neutral-900">Recent Appointments</h2>
              </div>
              <div className="divide-y divide-neutral-100">
                {appointments.map(appt => (
                  <div key={appt._id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{appt.patient?.name} <span className="text-neutral-400 font-normal mx-1">with</span> {appt.doctor?.name}</p>
                      <p className="text-xs text-neutral-500">{new Date(appt.date).toLocaleDateString()} at {appt.slot.startTime}</p>
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
