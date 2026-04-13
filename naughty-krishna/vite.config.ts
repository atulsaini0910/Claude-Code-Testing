import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  server: {
    port: 5174,
    open: true,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          framer: ['framer-motion'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          carousel: ['embla-carousel-react'],
        },
      },
    },
  },
})
