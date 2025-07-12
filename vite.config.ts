import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3500,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp,woff,woff2,ttf,eot}']
      },
      includeAssets: ['favicon.svg', 'apple-touch-icon.svg', 'safari-pinned-tab.svg'],
      manifest: {
        name: 'Plantgram - 식물도 피드를 올린다',
        short_name: 'Plantgram',
        description: '식물들의 특별한 순간을 기록하고 공유하는 소셜 플랫폼',
        theme_color: '#22c55e',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        lang: 'ko',
        categories: ['lifestyle', 'social', 'utilities'],
        icons: [
          {
            src: 'pwa-64x64.svg',
            sizes: '64x64',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'maskable-icon-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-alert-dialog'],
          query: ['@tanstack/react-query'],
          supabase: ['@supabase/supabase-js'],
          openai: ['openai']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
}));
