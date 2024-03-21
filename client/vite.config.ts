import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/showdata': 'http://localhost:5000', // Showdata is the endpoint link with localhost:5000
    },
  },
});
