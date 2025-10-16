// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  ssr: true, // SSR habilitado globalmente, mas podemos desabilitar por página

  modules: ['@pinia/nuxt'],

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
      ],
    },
  },

  pinia: {
    storesDirs: ['./stores/**'],
  },

  compatibilityDate: '2024-10-14',
} as any)
