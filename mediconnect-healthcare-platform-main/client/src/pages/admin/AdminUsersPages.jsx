import { useState, useEffect } from 'react'
import { AdminSidebar } from './AdminDashboard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { adminService } from '../../services/services'
import Button from '../../components/common/Button'

export const AdminDoctorsPage = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDocs = () => {
    adminService.getDoctors()
      .then(res => setDoctors(res.data.doctors))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchDocs() }, [])

  const handleVerify = async (id, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'unverify' : 'verify'} this doctor?`)) return
    try {
      await adminService.verifyDoctor(id, { isVerified: !currentStatus })
      fetchDocs()
    } catch (err) { alert('Action failed') }
  }

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">Manage Doctors</h1>
        </div>
        {loading ? <div className="py-20 flex justify-center"><LoadingSpinner /></div> : (
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 font-medium text-neutral-500">Doctor</th>
                  <th className="px-6 py-3 font-medium text-neutral-500">Specialization</th>
                  <th className="px-6 py-3 font-medium text-neutral-500">Experience</th>
                  <th className="px-6 py-3 font-medium text-neutral-500">Status</th>
                  <th className="px-6 py-3 font-medium text-neutral-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {doctors.map(d => (
                  <tr key={d._id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-neutral-900">{d.user?.name}</p>
                      <p className="text-xs text-neutral-500">{d.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-neutral-700">{d.specialization}</td>
                    <td className="px-6 py-4 text-neutral-700">{d.experience} Yrs</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${d.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {d.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant={d.isVerified ? 'ghost' : 'primary'} size="sm" onClick={() => handleVerify(d._id, d.isVerified)}>
                        {d.isVerified ? 'Unverify' : 'Verify'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

export const AdminPatientsPage = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = () => {
    adminService.getUsers({ role: 'patient' })
      .then(res => setPatients(res.data.users))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const handleToggle = async (id, currentStatus) => {
    try {
      await adminService.toggleActive(id, { isActive: !currentStatus })
      fetchUsers()
    } catch (err) { alert('Action failed') }
  }

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">Manage Patients</h1>
        </div>
        {loading ? <div className="py-20 flex justify-center"><LoadingSpinner /></div> : (
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 font-medium text-neutral-500">Name</th>
                  <th className="px-6 py-3 font-medium text-neutral-500">Email</th>
                  <th className="px-6 py-3 font-medium text-neutral-500">Joined</th>
                  <th className="px-6 py-3 font-medium text-neutral-500">Status</th>
                  <th className="px-6 py-3 font-medium text-neutral-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {patients.map(p => (
                  <tr key={p._id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 font-medium text-neutral-900">{p.name}</td>
                    <td className="px-6 py-4 text-neutral-700">{p.email}</td>
                    <td className="px-6 py-4 text-neutral-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleToggle(p._id, p.isActive)}>
                        {p.isActive ? 'Suspend' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
