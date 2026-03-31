import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/MultiPlanet/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'icons/icon-72.png',
        'icons/icon-96.png',
        'icons/icon-128.png',
        'icons/icon-144.png',
        'icons/icon-152.png',
        'icons/icon-192.png',
        'icons/icon-384.png',
        'icons/icon-512.png',
        'icons/icon-maskable.png'
      ],
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
          { src: '/MultiPlanet/icons/icon-72.png',        sizes: '72x72',   type: 'image/png' },
          { src: '/MultiPlanet/icons/icon-96.png',        sizes: '96x96',   type: 'image/png' },
          { src: '/MultiPlanet/icons/icon-128.png',       sizes: '128x128', type: 'image/png' },
          { src: '/MultiPlanet/icons/icon-144.png',       sizes: '144x144', type: 'image/png' },
          { src: '/MultiPlanet/icons/icon-152.png',       sizes: '152x152', type: 'image/png' },
          { src: '/MultiPlanet/icons/icon-192.png',       sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/MultiPlanet/icons/icon-384.png',       sizes: '384x384', type: 'image/png' },
          { src: '/MultiPlanet/icons/icon-512.png',       sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/MultiPlanet/icons/icon-maskable.png',  sizes: '512x512', type: 'image/png', purpose: 'maskable' }
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
})import { defineConfig } from 'vite'
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
  { src: '/MultiPlanet/icons/icon-72.png',   sizes: '72x72',   type: 'image/png' },
  { src: '/MultiPlanet/icons/icon-96.png',   sizes: '96x96',   type: 'image/png' },
  { src: '/MultiPlanet/icons/icon-128.png',  sizes: '128x128', type: 'image/png' },
  { src: '/MultiPlanet/icons/icon-144.png',  sizes: '144x144', type: 'image/png' },
  { src: '/MultiPlanet/icons/icon-152.png',  sizes: '152x152', type: 'image/png' },
  { src: '/MultiPlanet/icons/icon-192.png',  sizes: '192x192', type: 'image/png', purpose: 'any' },
  { src: '/MultiPlanet/icons/icon-384.png',  sizes: '384x384', type: 'image/png' },
  { src: '/MultiPlanet/icons/icon-512.png',  sizes: '512x512', type: 'image/png', purpose: 'any' },
  { src: '/MultiPlanet/icons/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
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
