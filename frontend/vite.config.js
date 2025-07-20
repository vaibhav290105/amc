import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // optional if you're running from project root
  server: {
    port: 5173,
  },
});
