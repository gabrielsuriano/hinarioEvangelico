// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  ssr: false, // SSR desabilitado - Ionic não funciona bem com SSR

  modules: ['@pinia/nuxt', '@vite-pwa/nuxt'],

  pwa: {
    registerType: 'autoUpdate',
    includeAssets: ['favicon.png', 'icon.svg', '*.png'],
    manifest: {
      name: 'Hinário Evangélico Metodista',
      short_name: 'Hinário Metodista',
      description: 'Hinário oficial da Igreja Metodista - Acesso offline completo',
      theme_color: '#3880ff',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/icon-192x192-maskable.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/icon-512x512-maskable.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ],
      categories: ['lifestyle', 'education'],
      lang: 'pt-BR'
    },
    workbox: {
      navigateFallback: '/',
      navigateFallbackDenylist: [/^\/api\//],
      globPatterns: ['**/*.{js,css,html,png,svg,ico,json,woff,woff2,ttf,eot}'],
      globDirectory: '.output/public',
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'gstatic-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /\/api\/hymnal/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'hymnal-data-cache',
            networkTimeoutSeconds: 10,
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /\/_nuxt\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'nuxt-app-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
            }
          }
        },
        {
          urlPattern: /\/.*\.(png|jpg|jpeg|svg|gif|webp|ico)/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
            }
          }
        }
      ]
    },
    devOptions: {
      enabled: false, // Desabilitado em produção
      suppressWarnings: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\//],
      type: 'module'
    },
    injectManifest: {
      globPatterns: ['**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm}']
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20
    }
  },

  vite: {
    css: {
      preprocessorOptions: {}
    }
  },

  css: [
    '@ionic/vue/css/core.css',
    '@ionic/vue/css/normalize.css',
    '@ionic/vue/css/structure.css',
    '@ionic/vue/css/typography.css',
    '@ionic/vue/css/padding.css',
    '@ionic/vue/css/float-elements.css',
    '@ionic/vue/css/text-alignment.css',
    '@ionic/vue/css/text-transformation.css',
    '@ionic/vue/css/flex-utils.css',
    '@ionic/vue/css/display.css',
    '@ionic/vue/css/ionic.bundle.css',
    '~/assets/css/theme.css',
  ],

  app: {
    head: {
      title: 'Hinário Evangélico Metodista',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Hinário Evangélico Metodista - Web, Mobile e PWA' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'msapplication-tap-highlight', content: 'no' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
        { name: 'theme-color', content: '#3880ff' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/icon-192x192.png' }
      ]
    },
  },

  pinia: {
    storesDirs: ['./stores/**'],
  },

  compatibilityDate: '2024-10-14',
} as any)
