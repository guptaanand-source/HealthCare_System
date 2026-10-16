import { useState, useEffect } from 'react'
import { PatientSidebar } from '../../components/layout/Sidebar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import Button from '../../components/common/Button'
import { reportService } from '../../services/services'
import api from '../../services/api' // using raw api for baseURL extraction if needed, but we'll use Vite proxy

const ReportsPage = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  // Upload Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('lab')
  const [notes, setNotes] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const fetchReports = () => {
    setLoading(true)
    reportService.getMy()
      .then(res => setReports(res.data.reports))
      .catch(() => setReports([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !title) return
    
    setUploading(true)
    setUploadError('')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('type', type)
    formData.append('notes', notes)

    try {
      await reportService.upload(formData)
      setIsModalOpen(false)
      setFile(null)
      setTitle('')
      setNotes('')
      fetchReports() // Refresh list
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Failed to upload report')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return
    try {
      await reportService.delete(id)
      setReports(reports.filter(r => r._id !== id))
    } catch (err) {
      alert('Failed to delete report')
    }
  }

  const formatSize = (bytes) => {
    if (!bytes) return 'Unknown size'
    const mb = bytes / (1024 * 1024)
    return mb < 1 ? Math.round(bytes / 1024) + ' KB' : mb.toFixed(1) + ' MB'
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <PatientSidebar />
      <main className="flex-1 p-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Reports</h1>
              <p className="text-sm text-neutral-500">Manage your lab results and medical documents</p>
            </div>
            <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
              Upload Report
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
          ) : reports.length === 0 ? (
            <EmptyState
              title="No reports uploaded"
              description="Upload your lab results or medical scans to share with your doctors."
              action={{ label: 'Upload Report', onClick: () => setIsModalOpen(true) }}
            />
          ) : (
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-3 font-medium text-neutral-500">Document</th>
                    <th className="px-6 py-3 font-medium text-neutral-500">Type</th>
                    <th className="px-6 py-3 font-medium text-neutral-500">Date Added</th>
                    <th className="px-6 py-3 font-medium text-neutral-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {reports.map(r => (
                    <tr key={r._id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900">{r.title}</p>
                            <p className="text-xs text-neutral-500">{formatSize(r.fileSize)} • {r.fileName.split('.').pop().toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize text-neutral-700">{r.type}</td>
                      <td className="px-6 py-4 text-neutral-500">
                        {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* We use Vite proxy to access the static files served by express */}
                          <a href={r.fileUrl} target="_blank" rel="noreferrer" className="btn-sm btn-ghost inline-flex">View</a>
                          <button onClick={() => handleDelete(r._id)} className="p-2 text-neutral-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-neutral-900">Upload Report</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              {uploadError && <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-100">{uploadError}</div>}
              
              <div>
                <label className="form-label">Report Title</label>
                <input type="text" required className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Blood Test Results" />
              </div>
              
              <div>
                <label className="form-label">Type</label>
                <select className="form-input" value={type} onChange={e => setType(e.target.value)}>
                  <option value="lab">Lab Report</option>
                  <option value="radiology">Radiology / Scan</option>
                  <option value="prescription">Past Prescription</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="form-label">File (PDF, JPG, PNG)</label>
                <input type="file" required className="form-input file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-primary-light file:text-primary hover:file:bg-primary/20" 
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={e => setFile(e.target.files[0])} />
                <p className="text-[10px] text-neutral-400 mt-1">Max size: 10MB</p>
              </div>

              <div>
                <label className="form-label">Notes (Optional)</label>
                <textarea className="form-input resize-none" rows="2" value={notes} onChange={e => setNotes(e.target.value)}></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button variant="primary" type="submit" loading={uploading}>Upload File</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportsPage
