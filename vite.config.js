import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Use relative paths for maximum compatibility
  server: {
    port: 5173,
    host: 'localhost', // Explicitly use IPv4 loopback
  },
  plugins: [
    tailwindcss(),
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // code-splitting for large dependencies
          }
        }
      }
    }
  }
})
