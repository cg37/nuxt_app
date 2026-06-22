// https://nuxt.com/docs/api/configuration/nuxt-config
import mdx from '@mdx-js/rollup'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.scss'],

  extensions: ['.mdx'],
  debug: true,
  vite: {
    optimizeDeps: {
      include: ['@mdx-js/vue'],
    },
    plugins: [
      {
        ...mdx({
          jsxImportSource: 'vue',
          providerImportSource: '@mdx-js/vue',
        }),
        enforce: 'pre',
      },
      vueJsx({
        include: [/\.[jt]sx$/, /\.mdx$/],
      }),
    ],
  },
  nitro: {
    externals: {
      inline: ['@mdx-js/vue'],
    },
  },
})
