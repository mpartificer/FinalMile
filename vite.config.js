import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    svgr({
      exportType: 'default', // This is important
      svgrOptions: {
        icon: true,
        svgo: true,
        jsx: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})