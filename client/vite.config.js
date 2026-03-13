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
            // Group React, Redux, and Router together to avoid hook reference issues
            if (
              id.includes('react') || 
              id.includes('react-dom') || 
              id.includes('scheduler') ||
              id.includes('react-router') ||
              id.includes('react-redux') ||
              id.includes('@reduxjs/toolkit')
            ) {
              return 'vendor-core';
            }
            
            // Large isolated libraries
            if (id.includes('firebase')) return 'vendor-firebase';
            if (id.includes('framer-motion')) return 'vendor-framer-motion';
            if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
            if (id.includes('lucide-react')) return 'vendor-lucide';
            if (id.includes('axios')) return 'vendor-axios';
            if (id.includes('@mediapipe')) return 'vendor-mediapipe';
            
            return 'vendor-others';
          }
        },
      },
    },
    chunkSizeWarningLimit: 2000,
  },
})
