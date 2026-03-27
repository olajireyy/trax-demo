import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  base: '/trax-demo/', // Fix for GitHub Pages blank screen
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
