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
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    origin: 'http://0.0.0.0:5173',
    proxy: {
      '/showdata': 'http://localhost:5000', // Showdata is the endpoint link with localhost:5000
    }}
})