import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite configuration
 *
 * The `server.proxy` setting is key:
 * Any request from React to /api/* is transparently forwarded
 * to the Express server on port 5000.
 * This means we write `axios.get('/api/health')` in React,
 * and Vite forwards it to `http://localhost:5000/api/health`.
 * No CORS issues during development.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
