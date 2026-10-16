/**
 * Placeholder pages — used while those phases aren't built yet.
 * These prevent broken routes and make the app navigable from Phase 1.
 * Each will be replaced with the real implementation in its phase.
 */
const ComingSoon = ({ pageName }) => (
  <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-xl font-semibold text-neutral-800 mb-2">{pageName}</h1>
      <p className="text-sm text-neutral-500">This page will be built in the next phase.</p>
    </div>
  </div>
)

export const LoginPage = () => <ComingSoon pageName="Login — Coming in Phase 2" />
export const RegisterPage = () => <ComingSoon pageName="Patient Registration — Coming in Phase 2" />
export const DoctorRegisterPage = () => <ComingSoon pageName="Doctor Registration — Coming in Phase 2" />
export const PatientDashboard = () => <ComingSoon pageName="Patient Dashboard — Coming in Phase 3" />
export const DoctorDashboard = () => <ComingSoon pageName="Doctor Dashboard — Coming in Phase 3" />
export const AdminDashboard = () => <ComingSoon pageName="Admin Dashboard — Coming in Phase 10" />
