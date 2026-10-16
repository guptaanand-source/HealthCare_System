/**
 * EmptyState component
 *
 * Displayed when a list has no items.
 * Never show a blank page — always give context and a next action.
 *
 * Props:
 *   icon: JSX element (optional SVG/emoji)
 *   title: main message
 *   description: helper text
 *   action: { label, onClick } (optional CTA button)
 */
import Button from './Button'

const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="mb-4 text-neutral-300">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-neutral-700 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-500 max-w-xs">{description}</p>
      )}
      {action && (
        <div className="mt-5">
          <Button variant="primary" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  )
}

export default EmptyState
