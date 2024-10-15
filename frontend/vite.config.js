import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const __dirname = path.resolve()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': 'https://food-ordering-platform-qa3z.onrender.com',
    },
  }
})
