import { motion } from 'framer-motion'

/**
 * PageWrapper — wraps any page with a smooth fade+slide-up animation on mount.
 * Usage: wrap the <main> content of any page with <PageWrapper>...</PageWrapper>
 */
const PageWrapper = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
)

export default PageWrapper
