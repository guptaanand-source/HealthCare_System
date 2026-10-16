import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { PageLoader } from './components/common/LoadingSpinner'
import Chatbot from './components/common/Chatbot'

// Public
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/public/LoginPage'
import PatientRegisterPage from './pages/public/PatientRegisterPage'
import DoctorRegisterPage from './pages/public/DoctorRegisterPage'

// Patient
import PatientDashboard from './pages/patient/PatientDashboard'
import FindDoctorPage from './pages/patient/FindDoctorPage'
import DoctorProfilePage from './pages/patient/DoctorProfilePage'
import PatientAppointmentsPage from './pages/patient/PatientAppointmentsPage'
import PatientAppointmentDetailsPage from './pages/patient/PatientAppointmentDetailsPage'
import MedicalRecordsPage from './pages/patient/MedicalRecordsPage'
import PrescriptionsPage from './pages/patient/PrescriptionsPage'
import ReportsPage from './pages/patient/ReportsPage'
import PatientProfilePage from './pages/patient/PatientProfilePage'

// Doctor
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorAppointmentsPage from './pages/doctor/DoctorAppointmentsPage'
import DoctorPatientsPage from './pages/doctor/DoctorPatientsPage'
import DoctorAvailabilityPage from './pages/doctor/DoctorAvailabilityPage'
import DoctorProfileSettings from './pages/doctor/DoctorProfilePage'

import NotificationsPage from './pages/common/NotificationsPage'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import { AdminDoctorsPage, AdminPatientsPage } from './pages/admin/AdminUsersPages'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const redirectMap = { patient: '/patient/dashboard', doctor: '/doctor/dashboard', admin: '/admin/dashboard' }
    return <Navigate to={redirectMap[user?.role] || '/'} replace />
  }
  return children
}

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (isAuthenticated) {
    const redirectMap = { patient: '/patient/dashboard', doctor: '/doctor/dashboard', admin: '/admin/dashboard' }
    return <Navigate to={redirectMap[user?.role] || '/'} replace />
  }
  return children
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
    <Route path="/register" element={<PublicOnlyRoute><PatientRegisterPage /></PublicOnlyRoute>} />
    <Route path="/register/doctor" element={<PublicOnlyRoute><DoctorRegisterPage /></PublicOnlyRoute>} />

    {/* Patient Routes */}
    <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>} />
    <Route path="/patient/find-doctor" element={<ProtectedRoute allowedRoles={['patient']}><FindDoctorPage /></ProtectedRoute>} />
    <Route path="/patient/doctors/:id" element={<ProtectedRoute allowedRoles={['patient']}><DoctorProfilePage /></ProtectedRoute>} />
    <Route path="/patient/appointments" element={<ProtectedRoute allowedRoles={['patient']}><PatientAppointmentsPage /></ProtectedRoute>} />
    <Route path="/patient/appointments/:id" element={<ProtectedRoute allowedRoles={['patient']}><PatientAppointmentDetailsPage /></ProtectedRoute>} />
    <Route path="/patient/medical-records" element={<ProtectedRoute allowedRoles={['patient']}><MedicalRecordsPage /></ProtectedRoute>} />
    <Route path="/patient/prescriptions" element={<ProtectedRoute allowedRoles={['patient']}><PrescriptionsPage /></ProtectedRoute>} />
    <Route path="/patient/reports" element={<ProtectedRoute allowedRoles={['patient']}><ReportsPage /></ProtectedRoute>} />
    <Route path="/patient/profile" element={<ProtectedRoute allowedRoles={['patient']}><PatientProfilePage /></ProtectedRoute>} />
    <Route path="/patient/notifications" element={<ProtectedRoute allowedRoles={['patient']}><NotificationsPage /></ProtectedRoute>} />

    {/* Doctor Routes */}
    <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
    <Route path="/doctor/appointments" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorAppointmentsPage /></ProtectedRoute>} />
    <Route path="/doctor/patients" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorPatientsPage /></ProtectedRoute>} />
    <Route path="/doctor/availability" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorAvailabilityPage /></ProtectedRoute>} />
    <Route path="/doctor/profile" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorProfileSettings /></ProtectedRoute>} />
    <Route path="/doctor/notifications" element={<ProtectedRoute allowedRoles={['doctor']}><NotificationsPage /></ProtectedRoute>} />

    {/* Admin Routes */}

    <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
    <Route path="/admin/doctors" element={<ProtectedRoute allowedRoles={['admin']}><AdminDoctorsPage /></ProtectedRoute>} />
    <Route path="/admin/patients" element={<ProtectedRoute allowedRoles={['admin']}><AdminPatientsPage /></ProtectedRoute>} />

    <Route path="*" element={
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-center">
        <div>
          <p className="text-6xl font-bold text-neutral-200">404</p>
          <h1 className="text-xl font-semibold mt-4">Page not found</h1>
          <a href="/" className="btn-md btn-primary inline-flex mt-6 no-underline">Go home</a>
        </div>
      </div>
    } />
  </Routes>
)

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
      <Chatbot />
    </AuthProvider>
  </BrowserRouter>
)

export default App
