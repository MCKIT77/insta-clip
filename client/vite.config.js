import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 3000,
    open: true,
    proxy: process.env.NODE_ENV === 'development' ? {
      '/graphql': {
        target: 'http://localhost:3001',
        secure: false,
        changeOrigin: true
      }
    } : undefined // No proxy in production
  }
  ,
  test: {
    globals: true,
    environment: 'happy-dom'
  }
})