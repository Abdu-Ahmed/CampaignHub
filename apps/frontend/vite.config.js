import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  /* … */
  server: {
    proxy: {
      // GraphQL over the gateway
      '/api/graphql': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      // Auth endpoints
      '/api/login': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
      '/api/register': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
    },
  },
})