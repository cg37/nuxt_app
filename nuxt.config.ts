// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath, URL } from 'node:url'
import mdx from '@mdx-js/rollup'
import vueJsx from '@vitejs/plugin-vue-jsx'

const srcDir = fileURLToPath(new URL('./app', import.meta.url))

export default defineNuxtConfig({
    srcDir,
    compatibilityDate: '2026-06-20',
    devtools: { enabled: true },
    css: ['@/assets/css/print.scss', '@/assets/css/main.scss', '@/assets/css/fonts.scss'],

    modules: ['@nuxtjs/color-mode'],
    colorMode: {
        preference: 'light',
        fallback: 'light',
        classSuffix: '',
        storage: 'cookie',
    },

    debug: process.env.NODE_ENV !== 'production',
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
