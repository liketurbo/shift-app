import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [react()],
    server: {
      watch: {
        usePolling: true
      }
    },
    // GitHub Pages uses /ozon-calendar/. Mirrors can build with VITE_BASE_PATH=/.
    base: env.VITE_BASE_PATH || '/ozon-calendar/',
  }
})
