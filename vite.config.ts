import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: "/school-days-title-generator/",
  plugins: [
    react(),
    tailwindcss()
  ],
})
