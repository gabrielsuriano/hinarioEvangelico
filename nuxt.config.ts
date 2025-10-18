// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  ssr: false, // SSR desabilitado - Ionic não funciona bem com SSR

  modules: ['@pinia/nuxt', '@vite-pwa/nuxt'],

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/hinos',
        '/antifonas',
        '/ritos'
      ]
    }
  },

  pwa: {
    registerType: 'prompt', // Mudado de autoUpdate para prompt - não atualiza automaticamente
    includeAssets: ['favicon.png', 'icon.svg', '*.png'],
    manifest: {
      name: 'Hinário Evangélico',
      short_name: 'Hinário Evangélico',
      description: 'Hinário  - Acesso offline completo disponível',
      theme_color: '#3880ff',
      background_color: '#3880ff',
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
      navigateFallbackDenylist: [/\/_nuxt\/.*\.hot-update\.json$/, /\/sw\.js$/, /\/workbox-.*\.js$/],
      navigateFallbackAllowlist: [/.*/],
      globPatterns: ['**/*.{js,css,html,png,svg,ico,json,woff,woff2,ttf,eot}'],
      globIgnores: ['**/offline.html'],
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      clientsClaim: true,
      maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB - aumentado para cachear tudo
      // Configurações adicionais para melhor offline
      offlineGoogleAnalytics: false,
      sourcemap: false,
      runtimeCaching: [
        {
          // Páginas HTML - tenta rede primeiro, depois cache
          urlPattern: ({ request, url }: { request: Request; url: URL }) => {
            return request.destination === 'document' ||
                   url.pathname === '/' ||
                   url.pathname.startsWith('/hinos') ||
                   url.pathname.startsWith('/antifonas') ||
                   url.pathname.startsWith('/ritos')
          },
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages-cache',
            networkTimeoutSeconds: 3,
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 7 // 7 dias
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
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
            cacheName: 'hymnal-data-cache-v2', // v2 para forçar novo cache
            networkTimeoutSeconds: 5,
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias - tenta rede primeiro
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
              maxEntries: 200,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano - código muda com versão
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /\/hinos.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'pages-cache',
            expiration: {
              maxEntries: 600,
              maxAgeSeconds: 60 * 60 * 24 * 365
            }
          }
        },
        {
          urlPattern: /\/antifonas.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'pages-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 365
            }
          }
        },
        {
          urlPattern: /\/ritos.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'pages-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 365
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
      navigateFallback: '/index.html',
      type: 'module'
    },
    injectManifest: {
      globPatterns: ['**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm}']
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 0 // Desabilitado - verifica apenas ao abrir o app
    }
  },

  vite: {
    css: {
      preprocessorOptions: {}
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      rollupOptions: {
        output: {
          // Gera nomes de chunk mais estáveis
          chunkFileNames: '_nuxt/[name]-[hash].js',
          entryFileNames: '_nuxt/[name]-[hash].js',
          assetFileNames: '_nuxt/[name]-[hash].[ext]'
        }
      }
    }
  },

  experimental: {
    payloadExtraction: false
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
      title: 'Hinário Evangélico',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Hinário Evangélico - Web, Mobile e PWA' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'msapplication-tap-highlight', content: 'no' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
        { name: 'theme-color', content: '#3880ff' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/icon-192x192.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' }
      ]
    },
  },

  pinia: {
    storesDirs: ['./stores/**'],
  },

  compatibilityDate: '2024-10-14',
} as any)
