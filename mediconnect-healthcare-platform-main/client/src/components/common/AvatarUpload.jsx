import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

/**
 * AvatarUpload — reusable avatar circle with click-to-upload
 * Place anywhere inside a profile page.
 * Shows current avatar (or initials fallback), overlays a camera icon on hover.
 */
const AvatarUpload = ({ size = 'lg' }) => {
  const { user, token, login } = useAuth()
  const inputRef = useRef()
  const [preview, setPreview] = useState(
    user?.avatar ? `http://localhost:5000${user.avatar}` : null
  )
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const dim = size === 'lg' ? 'w-24 h-24 text-3xl' : 'w-16 h-16 text-xl'

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { setError('File too large. Max 3MB.'); return }

    // Instant preview
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(file)

    const fd = new FormData()
    fd.append('avatar', file)
    setUploading(true)
    setError('')
    try {
      const res = await api.post('/auth/upload-avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      // Refresh auth context
      login(res.data.user, token)
    } catch (err) {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative ${dim} rounded-full cursor-pointer group`}
        onClick={() => inputRef.current?.click()}
        title="Click to change photo"
      >
        {preview ? (
          <img
            src={preview}
            alt="Avatar"
            className="w-full h-full rounded-full object-cover border-2 border-primary-light"
          />
        ) : (
          <div className={`w-full h-full rounded-full bg-primary text-white flex items-center justify-center font-bold border-2 border-primary-light ${dim}`}>
            {initials}
          </div>
        )}

        {/* Camera overlay on hover */}
        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {uploading ? (
            <svg className="w-6 h-6 text-white animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFile}
        />
      </div>

      <p className="text-xs text-neutral-400">Click to upload photo</p>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default AvatarUpload
