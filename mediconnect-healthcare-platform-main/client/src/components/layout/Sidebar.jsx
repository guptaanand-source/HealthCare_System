import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * PatientSidebar
 * Persistent left navigation for the patient section.
 * Highlights the current active route.
 */
const patientNav = [
  { label: 'Dashboard',       path: '/patient/dashboard',      icon: 'grid' },
  { label: 'Find Doctor',     path: '/patient/find-doctor',    icon: 'search' },
  { label: 'Appointments',    path: '/patient/appointments',   icon: 'calendar' },
  { label: 'Medical Records', path: '/patient/medical-records',icon: 'file-text' },
  { label: 'Prescriptions',   path: '/patient/prescriptions',  icon: 'clipboard' },
  { label: 'Reports',         path: '/patient/reports',        icon: 'upload' },
  { label: 'Notifications',   path: '/patient/notifications',  icon: 'bell' },
  { label: 'Profile',         path: '/patient/profile',        icon: 'user' },
]

const NavIcon = ({ name }) => {
  const icons = {
    grid:      <path d="M3 3h7v7H3zM13 3h7v7h-7zM3 13h7v7H3zM13 13h7v7h-7z"/>,
    search:    <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>,
    calendar:  <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    'file-text':<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    clipboard: <><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></>,
    upload:    <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></>,
    user:      <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    patients:  <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
    clock:     <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    settings:  <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    shield:    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    bell:      <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name] || <circle cx="12" cy="12" r="10"/>}
    </svg>
  )
}

export const PatientSidebar = () => {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="hidden md:flex flex-col w-56 bg-white border-r border-neutral-200 min-h-screen">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-neutral-200 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="6.5" y="1" width="3" height="14" rx="1.5" fill="white"/><rect x="1" y="6.5" width="14" height="3" rx="1.5" fill="white"/></svg>
          </div>
          <span className="text-sm font-semibold text-neutral-800">Medi<span className="text-primary">Connect</span></span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {patientNav.map((item) => {
          const active = pathname === item.path || pathname.startsWith(item.path + '/')
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors no-underline
                ${active ? 'bg-primary-light text-primary font-medium' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'}`}
            >
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="border-t border-neutral-200 p-3">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-primary">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-neutral-800 truncate">{user?.name}</p>
            <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/') }}
          className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Log out
        </button>
      </div>
    </aside>
  )
}

const doctorNav = [
  { label: 'Dashboard',    path: '/doctor/dashboard',     icon: 'grid' },
  { label: 'Appointments', path: '/doctor/appointments',  icon: 'calendar' },
  { label: 'Patients',     path: '/doctor/patients',      icon: 'patients' },
  { label: 'Availability', path: '/doctor/availability',  icon: 'clock' },
  { label: 'Notifications',path: '/doctor/notifications', icon: 'bell' },
  { label: 'Profile',      path: '/doctor/profile',       icon: 'settings' },
]

export const DoctorSidebar = () => {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="hidden md:flex flex-col w-56 bg-white border-r border-neutral-200 min-h-screen">
      <div className="h-14 flex items-center px-4 border-b border-neutral-200 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="6.5" y="1" width="3" height="14" rx="1.5" fill="white"/><rect x="1" y="6.5" width="14" height="3" rx="1.5" fill="white"/></svg>
          </div>
          <span className="text-sm font-semibold text-neutral-800">Medi<span className="text-primary">Connect</span></span>
        </Link>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {doctorNav.map((item) => {
          const active = pathname === item.path || pathname.startsWith(item.path + '/')
          return (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors no-underline
                ${active ? 'bg-primary-light text-primary font-medium' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'}`}
            >
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-neutral-200 p-3">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-primary">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-neutral-800 truncate">{user?.name}</p>
            <p className="text-xs text-neutral-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/') }}
          className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Log out
        </button>
      </div>
    </aside>
  )
}

export { NavIcon }
