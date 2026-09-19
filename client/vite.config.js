import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // The browser only talks to Vite; Vite forwards /api to the Express server.
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
