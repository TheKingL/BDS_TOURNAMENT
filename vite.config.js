import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { adminApiPlugin } from './vite-admin-plugin.js'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss(), adminApiPlugin()],
  base: command === 'build' ? '/BDS_TOURNAMENT/' : '/',
}))
