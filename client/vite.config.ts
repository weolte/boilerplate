import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import viteVue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  root: import.meta.dirname,
  plugins: [viteVue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5555,
    host: true,
    allowedHosts: process.env.ALLOWED_HOSTS ? process.env.ALLOWED_HOSTS.split(',') : ['localhost', 'devhr.navoiyuran.uz'],
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
