import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: process.env.GH_PAGES ? './' : '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node'
  }
}))

