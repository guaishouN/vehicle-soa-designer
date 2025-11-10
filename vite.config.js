import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Tauri expects a fixed port, so we set it here
  server: {
    port: 5173,
    strictPort: true,
  },
  
  // Tauri uses a different base path in production
  base: './',
  
  // Prevent vite from clearing screen in dev mode
  clearScreen: false,
})
