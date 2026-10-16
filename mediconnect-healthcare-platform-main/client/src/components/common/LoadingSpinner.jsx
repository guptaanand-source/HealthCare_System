/**
 * LoadingSpinner component
 * Shows a subtle spinning indicator.
 * Used for page-level loading and button loading states.
 *
 * Props:
 *   size: 'sm' | 'md' | 'lg'  (default: 'md')
 *   className: additional Tailwind classes
 */
const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
}

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  return (
    <svg
      className={`animate-spin text-primary ${sizeMap[size]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

/**
 * PageLoader — full-page centered loading state
 * Used while AuthContext is verifying the token on startup.
 */
export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-50">
    <div className="flex flex-col items-center gap-3">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-neutral-500">Loading…</p>
    </div>
  </div>
)

export default LoadingSpinner
