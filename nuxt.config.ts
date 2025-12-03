// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/supabase'],
  supabase: {
    redirect: false
  },
  css: ['~/assets/css/main.css'],
  build: {
    transpile: ['@supabase/supabase-js']
  },
  vite: {
    plugins: [
      require('@tailwindcss/vite').default(),
    ],
  },
})
