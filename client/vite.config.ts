import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  preview: {
    port: 5173,
    strictPort: true
  },
  optimizeDeps: {
    exclude: ['package-name']
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    proxy: {
      // Proxying requests from /stripe to your Stripe backend
      '/api/stripe': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      // Existing proxy for /user requests
      '/api/user': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      // Existing proxy for /user requests
      '/api/azuredata': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      // Existing proxy for /user requests
      '/api/azurevm': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      }
    }
  }
})
