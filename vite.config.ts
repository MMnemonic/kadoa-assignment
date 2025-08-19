import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '::',
    port: 5174,
    strictPort: true,
    hmr: {
      host: 'localhost',
      clientPort: 5174,
    },
  },
  preview: {
    host: '::',
    port: 5174,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts'
  }
})
