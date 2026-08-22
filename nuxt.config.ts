// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath, URL } from 'node:url'
import mdx from '@mdx-js/rollup'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer } from 'rollup-plugin-visualizer'

const srcDir = fileURLToPath(new URL('./app', import.meta.url))

// 可选：通过环境变量控制是否开启分析，避免每次 build 都弹窗
// 运行命令示例: ANALYZE=true npm run build
const isAnalyze = process.env.ANALYZE === 'true'

export default defineNuxtConfig({
    srcDir,
    compatibilityDate: '2026-06-20',
    devtools: { enabled: true },
    css: ['@/assets/css/print.scss', '@/assets/css/main.scss'],

    modules: ['@nuxtjs/color-mode'],
    colorMode: {
        preference: 'reference',
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
                    jsx: true,
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

    // 👇 新增：使用 Nuxt Hooks 精准注入 Visualizer 插件
    hooks: {
        'vite:extendConfig'(config, { isClient, isServer, isBuild }) {
            // 只在生产构建(build)时启用，且可通过环境变量控制
            if (!isBuild || !isAnalyze) return

            config.plugins = config.plugins || []

            if (isClient) {
                // 客户端构建分析（前端首屏体积，最值得关注）
                config.plugins.push(
                    visualizer({
                        open: true, // 构建完成后自动在浏览器打开
                        filename: 'client-stats.html', // 客户端报告文件名
                        gzipSize: true, // 显示 gzip 压缩后的大小（关键指标）
                        brotliSize: true, // 显示 brotli 压缩后的大小
                        template: 'treemap', // 树状图展示
                        title: 'Client Bundle Analysis',
                    }),
                )
            }

            if (isServer) {
                // 服务端构建分析（Node.js 运行时的体积）
                config.plugins.push(
                    visualizer({
                        open: false, // 服务端报告通常不需要自动打开
                        filename: 'server-stats.html', // 服务端报告文件名
                        gzipSize: true,
                        template: 'treemap',
                        title: 'Server Bundle Analysis',
                    }),
                )
            }
        },
    },
})
