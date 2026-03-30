import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // ⚠️ Remplace "MultiPlanet" par le nom exact de ton dépôt GitHub
  base: '/MultiPlanet/',

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable.png'],
      manifest: {
        name: "MultiPlanet – L'aventure des chiffres !",
        short_name: 'MultiPlanet',
        description: 'Jeu éducatif de tables de multiplication pour enfants 8-11 ans',
        start_url: '/MultiPlanet/',
        scope: '/MultiPlanet/',
        display: 'fullscreen',
        orientation: 'portrait',
        background_color: '#1a0a3e',
        theme_color: '#1a0a3e',
        categories: ['education', 'games'],
        icons: [
          {
            src: '/MultiPlanet/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/MultiPlanet/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/MultiPlanet/icons/icon-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ]
})
