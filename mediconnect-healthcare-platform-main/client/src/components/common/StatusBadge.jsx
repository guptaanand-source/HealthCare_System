/**
 * StatusBadge component
 *
 * Displays appointment/record status with semantic color coding.
 * Color communicates meaning, not decoration.
 *
 * Props:
 *   status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'rescheduled'
 */
const statusConfig = {
  confirmed:   { label: 'Confirmed',   className: 'badge-confirmed' },
  pending:     { label: 'Pending',     className: 'badge-pending' },
  cancelled:   { label: 'Cancelled',   className: 'badge-cancelled' },
  completed:   { label: 'Completed',   className: 'badge-completed' },
  rescheduled: { label: 'Rescheduled', className: 'badge-rescheduled' },
}

const StatusBadge = ({ status }) => {
  const config = statusConfig[status?.toLowerCase()] || {
    label: status || 'Unknown',
    className: 'badge bg-neutral-100 text-neutral-600',
  }

  return (
    <span className={config.className}>
      {config.label}
    </span>
  )
}

export default StatusBadge
