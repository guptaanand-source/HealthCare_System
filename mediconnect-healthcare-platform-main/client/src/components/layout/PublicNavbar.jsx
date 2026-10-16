import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'

/**
 * PublicNavbar — shown on the landing page and other public pages.
 *
 * Design decisions:
 * - White background, subtle bottom border — professional, not flashy
 * - Logo uses the brand green — single accent, no gradients
 * - Nav links are simple text — no hover animations, no dropdowns (not needed yet)
 * - Two CTAs: Login (secondary) and Register (primary)
 * - Mobile: hamburger menu collapses links into a dropdown
 */
const PublicNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  // If user is already logged in, redirect to their dashboard
  const getDashboardPath = () => {
    if (user?.role === 'doctor') return '/doctor/dashboard'
    if (user?.role === 'admin') return '/admin/dashboard'
    return '/patient/dashboard'
  }

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ──────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            {/* Simple icon mark — a cross in the brand green */}
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="6.5" y="1" width="3" height="14" rx="1.5" fill="white"/>
                <rect x="1" y="6.5" width="14" height="3" rx="1.5" fill="white"/>
              </svg>
            </div>
            <span className="font-semibold text-neutral-900 text-base tracking-tight">
              Medi<span className="text-primary">Connect</span>
            </span>
          </Link>

          {/* ── Desktop Nav ───────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <Link
              to="/#how-it-works"
              className="text-sm text-neutral-600 hover:text-neutral-900 no-underline transition-colors"
            >
              How it works
            </Link>
            <Link
              to="/#for-patients"
              className="text-sm text-neutral-600 hover:text-neutral-900 no-underline transition-colors"
            >
              For patients
            </Link>
            <Link
              to="/#for-doctors"
              className="text-sm text-neutral-600 hover:text-neutral-900 no-underline transition-colors"
            >
              For doctors
            </Link>
          </nav>

          {/* ── Auth Buttons ──────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(getDashboardPath())}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Log in
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Get started
                </Button>
              </>
            )}
          </div>

          {/* ── Mobile Menu Toggle ────────────────────────────── */}
          <button
            className="md:hidden btn-ghost btn-sm rounded-md p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* ── Mobile Dropdown ──────────────────────────────────── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-neutral-100 pb-4 pt-2">
            <nav className="flex flex-col gap-1">
              <Link
                to="/#how-it-works"
                className="px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md no-underline"
                onClick={() => setMobileOpen(false)}
              >
                How it works
              </Link>
              <Link
                to="/#for-patients"
                className="px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md no-underline"
                onClick={() => setMobileOpen(false)}
              >
                For patients
              </Link>
              <Link
                to="/#for-doctors"
                className="px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md no-underline"
                onClick={() => setMobileOpen(false)}
              >
                For doctors
              </Link>
            </nav>
            <div className="mt-3 px-3 flex flex-col gap-2">
              {isAuthenticated ? (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => { navigate(getDashboardPath()); setMobileOpen(false) }}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => { navigate('/login'); setMobileOpen(false) }}
                  >
                    Log in
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => { navigate('/register'); setMobileOpen(false) }}
                  >
                    Get started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default PublicNavbar
