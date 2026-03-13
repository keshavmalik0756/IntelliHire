import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React must be first to avoid circular dependencies
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            if (id.includes('firebase')) return 'vendor-firebase';
            if (id.includes('framer-motion')) return 'vendor-framer-motion';
            if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
            if (id.includes('lucide-react')) return 'vendor-lucide';
            if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) return 'vendor-redux';
            if (id.includes('axios')) return 'vendor-axios';
            if (id.includes('@mediapipe')) return 'vendor-mediapipe';
            return 'vendor-others';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1500,
  },
})
