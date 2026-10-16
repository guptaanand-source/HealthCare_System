/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Primary ──────────────────────────────────────────
        // Deep healthcare green — communicates trust, health, calm
        primary: {
          DEFAULT: '#1A6B4A',
          hover:   '#155C3E',
          light:   '#EAF4EE',
          50:      '#F0FAF4',
          100:     '#D6F0E1',
          200:     '#AAE0C2',
          500:     '#1A6B4A',
          600:     '#155C3E',
          700:     '#0F4D33',
        },
        // ── Accent ───────────────────────────────────────────
        // Deep navy — secondary actions, links
        accent: {
          DEFAULT: '#0F4C81',
          light:   '#EBF3FB',
          500:     '#0F4C81',
          600:     '#0C3E6B',
        },
        // ── Neutrals ─────────────────────────────────────────
        neutral: {
          50:  '#F8F9FA',
          100: '#F1F3F5',
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#CED4DA',
          500: '#ADB5BD',
          600: '#6C757D',
          700: '#495057',
          800: '#343A40',
          900: '#212529',
        },
        // ── Semantic Status Colors ────────────────────────────
        // Used ONLY for meaningful status communication
        status: {
          confirmed:   '#16A34A',
          pending:     '#D97706',
          cancelled:   '#DC2626',
          completed:   '#6B7280',
          rescheduled: '#2563EB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'page-title':    ['1.875rem', { lineHeight: '2.25rem', fontWeight: '600' }],
        'section-title': ['1.25rem',  { lineHeight: '1.75rem', fontWeight: '600' }],
        'card-title':    ['1rem',     { lineHeight: '1.5rem',  fontWeight: '600' }],
      },
      boxShadow: {
        // Restrained shadows — healthcare, not SaaS
        'card':   '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)',
        'card-md':'0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
        'modal':  '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
