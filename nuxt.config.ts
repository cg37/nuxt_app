// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath, URL } from 'node:url'
import mdx from '@mdx-js/rollup'
import vueJsx from '@vitejs/plugin-vue-jsx'

const srcDir = fileURLToPath(new URL('./app', import.meta.url))

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
    resolve: {
      alias: {
        '~': srcDir,
        '@': srcDir,
      },
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
