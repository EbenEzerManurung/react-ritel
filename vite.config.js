import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon-72.svg', 'icon-96.svg', 'icon-128.svg', 'icon-144.svg', 'icon-152.svg', 'icon-192.svg', 'icon-384.svg', 'icon-512.svg'],
      manifest: {
        name: 'React Ritel',
        short_name: 'RitelApp',
        description: 'Aplikasi Manajemen Ritel Modern',
        theme_color: '#3B82F6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          { src: '/icon-72.svg', sizes: '72x72', type: 'image/svg+xml' },
          { src: '/icon-96.svg', sizes: '96x96', type: 'image/svg+xml' },
          { src: '/icon-128.svg', sizes: '128x128', type: 'image/svg+xml' },
          { src: '/icon-144.svg', sizes: '144x144', type: 'image/svg+xml' },
          { src: '/icon-152.svg', sizes: '152x152', type: 'image/svg+xml' },
          { src: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
          { src: '/icon-384.svg', sizes: '384x384', type: 'image/svg+xml' },
          { src: '/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' }
        ]
      }
    })
  ]
})
