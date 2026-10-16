import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { PatientSidebar, DoctorSidebar } from '../../components/layout/Sidebar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { notificationService } from '../../services/services'

const NotificationsPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = () => {
    setLoading(true)
    notificationService.getAll()
      .then(res => setNotifications(res.data.notifications || []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markRead(id)
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n))
    } catch (err) {
      console.error(err)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead()
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    } catch (err) {
      console.error(err)
    }
  }

  const Sidebar = user?.role === 'doctor' ? DoctorSidebar : PatientSidebar

  const getIconForType = (type) => {
    switch (type) {
      case 'appointment_confirmed':
        return <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      case 'appointment_cancelled':
        return <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      case 'prescription_added':
        return <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
      default:
        return <svg className="w-5 h-5 text-neutral-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
    }
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Notifications</h1>
              <p className="text-sm text-neutral-500">Stay updated on your appointments and medical records</p>
            </div>
            {notifications.some(n => !n.isRead) && (
              <button 
                onClick={handleMarkAllRead}
                className="text-sm font-medium text-primary hover:underline transition-all"
              >
                Mark all as read
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
          ) : notifications.length === 0 ? (
            <EmptyState
              title="You're all caught up!"
              description="You have no new notifications at the moment."
            />
          ) : (
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden divide-y divide-neutral-100">
              {notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  className={`p-4 sm:p-5 flex gap-4 transition-colors ${notif.isRead ? 'bg-white opacity-70' : 'bg-primary-light/10'}`}
                >
                  <div className="mt-1 flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notif.isRead ? 'bg-neutral-100' : 'bg-white shadow-sm border border-primary-light/50'}`}>
                      {getIconForType(notif.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${notif.isRead ? 'text-neutral-700' : 'font-medium text-neutral-900'}`}>
                      {notif.message}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {new Date(notif.createdAt).toLocaleString('en-US', { 
                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <button 
                      onClick={() => handleMarkAsRead(notif._id)}
                      className="flex-shrink-0 text-xs font-medium text-primary hover:text-primary-dark self-center px-2 py-1"
                    >
                      Mark read
                    </button>
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

export default NotificationsPage
