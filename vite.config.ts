import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Needed for GitHub Pages: https://<user>.github.io/<repo>/
  base: '/SmartPantry-Chef/',
  plugins: [react()],
})

