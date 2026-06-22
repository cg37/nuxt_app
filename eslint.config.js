import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
    // JS/TS 基础规则
    js.configs.recommended,
    ...tseslint.configs.recommended,
    prettierRecommended,

    // JS/TS 文件
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                useRoute: 'readonly',
                useRouter: 'readonly',
                defineNuxtConfig: 'readonly',
                defineEventHandler: 'readonly',
                readBody: 'readonly',
                setResponseHeader: 'readonly',
                createError: 'readonly',
                onMounted: 'readonly',
                ref: 'readonly',
                computed: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { vars: 'all', args: 'after-used', ignoreRestSiblings: false, caughtErrors: 'none' },
            ],
        },
    },

    // Vue 文件
    ...pluginVue.configs['flat/essential'],
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: vueParser,
            parserOptions: { parser: tseslint.parser },
            globals: {
                useRoute: 'readonly',
                useRouter: 'readonly',
                onMounted: 'readonly',
                ref: 'readonly',
                computed: 'readonly',
                defineProps: 'readonly',
                NuxtLink: 'readonly',
                NuxtPage: 'readonly',
                ClientOnly: 'readonly',
            },
        },
    },

    // PDF 工具代码需要 any 类型（第三方库类型不完善）
    {
        files: ['**/utils/parse-markdown.ts', '**/server/api/export-pdf.post.ts'],
        rules: { '@typescript-eslint/no-explicit-any': 'off' },
    },

    // Nuxt 页面组件（按约定命名，无法改为 multi-word）
    {
        files: ['**/pages/**'],
        rules: { 'vue/multi-word-component-names': 'off' },
    },

    // Table 组件名
    {
        files: ['**/components/Table.vue'],
        rules: { 'vue/multi-word-component-names': 'off' },
    },

    // 自定义规则
    {
        rules: {
            'vue/html-self-closing': [
                'error',
                {
                    html: { void: 'always', normal: 'never', component: 'always' },
                    svg: 'always',
                    math: 'always',
                },
            ],
        },
    },

    // 忽略
    { ignores: ['*.d.ts', 'node_modules', 'dist/', 'build/', '.output/', '.nuxt/'] },
]
