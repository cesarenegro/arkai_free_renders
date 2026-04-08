import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/pixazo': {
        target: 'https://gateway-stable-diffusion-v1-5-inpainting.appypie.workers.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pixazo/, '')
      },
      '/api/replicate': {
        target: 'https://api.replicate.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/replicate/, '')
      },
      '/api/fal': {
        target: 'https://queue.fal.run',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fal/, '')
      }
    }
  }
})
