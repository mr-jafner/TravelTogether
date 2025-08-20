import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/traveltogether/', // This is the key line!
  build: {
    outDir: 'dist'
  }
})