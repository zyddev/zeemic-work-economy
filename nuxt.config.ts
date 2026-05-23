// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-22',
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/tokens.css'],

  imports: {
    dirs: ['composables/**', 'stores/**'],
  },

  runtimeConfig: {
    cryptoSecret: '',  // NUXT_CRYPTO_SECRET — server-only
    public: {
      appUrl:     '',  // NUXT_PUBLIC_APP_URL
      storageUrl: '',  // NUXT_PUBLIC_STORAGE_URL
      siteUrl:    '',  // NUXT_PUBLIC_SITE_URL
    },
  },

  routeRules: {
    '/guidelines':  { prerender: true },
    '/terms':       { prerender: true },
    '/policies/**': { prerender: true },
    '/landing':     { prerender: true },
  },

  app: {
    head: {
      title: 'Zeemic — Work Economy Marketplace',
      meta: [
        { name: 'description', content: 'Hire skills, find jobs, connect with recruiters.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://www.googletagmanager.com' },
        { rel: 'dns-prefetch', href: 'https://www.google-analytics.com' },
        { rel: 'dns-prefetch', href: 'https://amazonaws.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap',
        },
      ],
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-8Z8EDQHMGC',
          async: true,
        },
        {
          innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-8Z8EDQHMGC',{anonymize_ip:true})`,
        },
      ],
    },
  },
})
