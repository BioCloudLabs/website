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
    // Removed the proxy setting since I will be directly calling an external API now
  }
})
