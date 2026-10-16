import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { PatientSidebar } from '../../components/layout/Sidebar'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import Button from '../../components/common/Button'
import { appointmentService, notificationService } from '../../services/services'

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

const QuickAction = ({ icon, label, onClick, color = 'bg-primary-light text-primary' }) => (
  <motion.button
    variants={fadeUp}
    whileHover={{ scale: 1.03, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className="card p-4 flex flex-col items-center gap-2.5 cursor-pointer w-full transition-colors hover:border-primary"
  >
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
    <span className="text-xs font-semibold text-neutral-700 text-center">{label}</span>
  </motion.button>
)

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const PatientDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [upcoming, setUpcoming] = useState([])
  const [recent, setRecent] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [upcomingRes, recentRes, notifRes] = await Promise.all([
          appointmentService.getMy({ upcoming: true }),
          appointmentService.getMy({ status: 'completed' }),
          notificationService.getAll(),
        ])
        setUpcoming(upcomingRes.data.appointments.slice(0, 3))
        setRecent(recentRes.data.appointments.slice(0, 3))
        setUnreadCount(notifRes.data.notifications?.filter(n => !n.isRead).length || 0)
      } catch { /* handled */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const avatarSrc = user?.avatar ? `http://localhost:5000${user.avatar}` : null
  const formatDate = (d) => new Date(d + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <PatientSidebar />
      <main className="flex-1 min-w-0">

        {/* Mobile top bar */}
        <div className="bg-white border-b border-neutral-200 h-14 flex items-center justify-between px-4 md:hidden">
          <span className="text-sm font-bold text-neutral-800">Medi<span className="text-primary">Connect</span></span>
          <button onClick={() => navigate('/patient/profile')} className="w-8 h-8 rounded-full overflow-hidden bg-primary flex items-center justify-center">
            {avatarSrc
              ? <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
              : <span className="text-xs font-bold text-white">{user?.name?.[0]}</span>
            }
          </button>
        </div>

        <div className="p-6 max-w-5xl">

          {/* Welcome banner */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-7 flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-neutral-400 mb-0.5">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <h1 className="text-2xl font-bold text-neutral-900">
                {getGreeting()}, {user?.name?.split(' ')[0]} 👋
              </h1>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => navigate('/patient/notifications')}
                className="relative flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                {unreadCount} new notification{unreadCount > 1 ? 's' : ''}
              </button>
            )}
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
          ) : (
            <motion.div initial="hidden" animate="visible" variants={stagger}>

              {/* Quick actions */}
              <motion.section variants={fadeUp} className="mb-8">
                <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">Quick actions</h2>
                <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <QuickAction onClick={() => navigate('/patient/find-doctor')} label="Find a Doctor"
                    color="bg-blue-50 text-blue-600"
                    icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>} />
                  <QuickAction onClick={() => navigate('/patient/appointments')} label="Appointments"
                    color="bg-primary-light text-primary"
                    icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>} />
                  <QuickAction onClick={() => navigate('/patient/prescriptions')} label="Prescriptions"
                    color="bg-purple-50 text-purple-600"
                    icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>} />
                  <QuickAction onClick={() => navigate('/patient/reports')} label="Upload Report"
                    color="bg-amber-50 text-amber-600"
                    icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>} />
                </motion.div>
              </motion.section>

              {/* Upcoming appointments */}
              <motion.section variants={fadeUp} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-neutral-900">Upcoming appointments</h2>
                  <button onClick={() => navigate('/patient/appointments')} className="text-xs text-primary hover:underline font-medium">View all</button>
                </div>
                {upcoming.length === 0 ? (
                  <EmptyState
                    title="No upcoming appointments"
                    description="Find a verified doctor and book your first slot."
                    action={{ label: 'Find a doctor', onClick: () => navigate('/patient/find-doctor') }}
                  />
                ) : (
                  <motion.div variants={stagger} className="space-y-3">
                    {upcoming.map((appt) => (
                      <motion.div
                        key={appt._id}
                        variants={fadeUp}
                        whileHover={{ x: 3 }}
                        onClick={() => navigate(`/patient/appointments/${appt._id}`)}
                        className="card p-4 flex items-center gap-4 hover:shadow-card-md transition-shadow cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                          {appt.doctor?.name?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-neutral-900">{appt.doctor?.name}</p>
                          <p className="text-xs text-neutral-500">{appt.doctorProfile?.specialization} · {appt.doctorProfile?.hospital}</p>
                          <p className="text-xs text-neutral-400 mt-0.5">📅 {formatDate(appt.date)} at {appt.slot?.startTime}</p>
                        </div>
                        <StatusBadge status={appt.status} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.section>

              {/* Recent visits */}
              {recent.length > 0 && (
                <motion.section variants={fadeUp}>
                  <h2 className="text-base font-semibold text-neutral-900 mb-4">Recent visits</h2>
                  <div className="space-y-2">
                    {recent.map((appt) => (
                      <button key={appt._id} onClick={() => navigate(`/patient/appointments/${appt._id}`)}
                        className="card p-3 flex items-center gap-3 w-full text-left hover:shadow-card-md transition-shadow">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-neutral-500">{appt.doctor?.name?.[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-neutral-800">{appt.doctor?.name} · <span className="text-neutral-500 font-normal">{appt.doctorProfile?.specialization}</span></p>
                          <p className="text-xs text-neutral-400">{formatDate(appt.date)}</p>
                        </div>
                        <StatusBadge status={appt.status} />
                      </button>
                    ))}
                  </div>
                </motion.section>
              )}

            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

export default PatientDashboard
