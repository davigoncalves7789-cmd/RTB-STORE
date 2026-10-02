import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Tailwind v4 se integra direto como plugin do Vite — não precisa mais de
// tailwind.config.js nem postcss.config.js separados.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
