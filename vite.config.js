import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // SPA: semua navigation request dilayan oleh index.html (offline pun boleh)
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          // ── Supabase REST API (GET) — NetworkFirst ─────────────────────
          {
            urlPattern: /^https:\/\/zvkxrhljrfyoqeonipoy\.supabase\.co\/rest\/v1\/.*/i,
            method: 'GET',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-data-cache',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // ── Supabase REST API (POST/PATCH/DELETE) — Background Sync ───
          // Jika gagal (offline), masuk queue dan retry bila online semula
          {
            urlPattern: /^https:\/\/zvkxrhljrfyoqeonipoy\.supabase\.co\/rest\/v1\/.*/i,
            method: 'POST',
            handler: 'NetworkOnly',
            options: {
              backgroundSync: {
                name: 'bukutrack-sync-queue',
                options: { maxRetentionTime: 24 * 60 }, // 24 jam (minit)
              },
            },
          },
          {
            urlPattern: /^https:\/\/zvkxrhljrfyoqeonipoy\.supabase\.co\/rest\/v1\/.*/i,
            method: 'PATCH',
            handler: 'NetworkOnly',
            options: {
              backgroundSync: {
                name: 'bukutrack-sync-queue',
                options: { maxRetentionTime: 24 * 60 },
              },
            },
          },
          // ── Google Fonts ───────────────────────────────────────────────
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'gstatic-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
      manifest: {
        name: 'BukuTrack',
        short_name: 'BukuTrack',
        description: 'Sistem Rekod Buku Teks Murid untuk Cikgu',
        theme_color: '#6b8fd4',
        background_color: '#f0f4f8',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/dashboard',
        scope: '/',
        lang: 'ms',
        categories: ['education', 'productivity'],
        icons: [
          { src: '/icons/icon-192.png',          sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png',          sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Scan QR', short_name: 'Scan', description: 'Mula scan QR murid', url: '/scan', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
          { name: 'Dashboard', short_name: 'Dashboard', description: 'Lihat ringkasan', url: '/', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
        ],
        screenshots: [
          {
            src: '/screenshots/mobile.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Senarai Kelas — BukuTrack',
          },
          {
            src: '/screenshots/desktop.png',
            sizes: '1280x800',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Rekod Semakan Matriks — BukuTrack',
          },
        ],
      },
    }),
  ],
})
