import LoadingSpinner from './LoadingSpinner'

/**
 * Button component
 *
 * Centralizes button styling. Every button in the app should use this.
 * This ensures visual consistency without duplicating Tailwind classes.
 *
 * Props:
 *   variant: 'primary' | 'secondary' | 'ghost' | 'danger'  (default: 'primary')
 *   size: 'sm' | 'md' | 'lg'  (default: 'md')
 *   loading: boolean — shows spinner and disables button
 *   disabled: boolean
 *   type: 'button' | 'submit' | 'reset'  (default: 'button')
 *   onClick, className, children: standard props
 */
const variantClasses = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
  danger:    'btn-danger',
}

const sizeClasses = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
}

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  children,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {loading && <LoadingSpinner size="sm" className="text-current" />}
      {children}
    </button>
  )
}

export default Button
