<template>
    <div class="code-block-container">
        <div v-if="showHeader" class="code-block-header">
            <span v-if="title" class="code-block-filename">{{ title }}</span>
            <span v-else class="code-block-lang">{{ langType }}</span>
        </div>
        <pre class="code-block">
        <code ref="codeRef" class="code-block-inner"><slot /></code>
    </pre>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { getHighlighter } from '../../composable/useShiki'

// 可选：直接传入文件名（MDX 场景下会自动从代码块 info string 解析）
const props = defineProps<{ filename?: string }>()

const codeRef = ref<HTMLElement | null>(null)
// @nuxtjs/color-mode 的响应式状态，value 为 'dark' / 'light'
const colorMode = useColorMode()

// 缓存源码与语言：高亮会覆盖 innerHTML，之后需据此重绘
let code = ''
const langType = ref('text')
// 顶部标题：优先显示文件名，未传入时显示语言类型
const title = ref('')

const showHeader = computed(() => !!title.value || langType.value !== 'text')

function extractSource() {
    const el = codeRef.value
    if (!el) return
    // MDX 通过 slot 传入 <code class="language-xxx">，语言类名在它上面
    const langCode = el.querySelector<HTMLElement>('code')
    const classList = langCode?.className || ''
    const match = classList.match(/language-([\w-]+)/)
    langType.value = match?.[1] ?? 'text'
    code = langCode?.textContent || el.textContent || ''
    // 文件名优先级：传入的 filename prop > MDX meta 解析出的 data-file > 空（空则展示语言）
    title.value = props.filename ?? langCode?.getAttribute('data-file') ?? ''
}

async function renderHighlight() {
    const el = codeRef.value
    if (!el || !code) return
    try {
        const h = await getHighlighter()
        const theme = colorMode.value === 'dark' ? 'dark-plus' : 'light-plus'
        const html = h.codeToHtml(code, { lang: langType.value, theme })
        const temp = document.createElement('div')
        temp.innerHTML = html

        // 每行用 span 包裹，完全控制行距
        const lines = Array.from(temp.querySelectorAll('.line')).map(
            (l) => `<span class="line-row">${l.innerHTML}</span>`,
        )
        el.innerHTML = lines.join('')
    } catch {
        // 高亮失败时保留纯文本
    }
}

onMounted(() => {
    extractSource()
    renderHighlight()
    // 主题变化（切换 / 跟随系统 / HMR）时重新高亮，保证配色始终一致
    watch(() => colorMode.value, renderHighlight)
})
</script>

<style lang="scss" scoped>
.code-block-container {
    margin: 1rem 0;
    border-radius: 6px;
    // theme() 只在 main.scss 里可用；组件内直接用全局 CSS 变量
    border: 1px solid var(--color-border);
    background-color: var(--color-bg-muted);
    overflow: hidden;
}

.code-block-header {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-sub);
    background-color: var(--color-bg_hover);
    border-bottom: 1px solid var(--color-border);
    user-select: none;
}

.code-block-filename {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.code-block-lang {
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.code-block {
    padding: 0;
    margin: 0;
    // 原 overflow-x: display 是非法值，改为 auto 让长行可横向滚动
    overflow-x: auto;
    border-radius: 0;
    border: none;
    background: transparent;

    // 现代化滚动条 — 半透明悬浮感
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
    transition: scrollbar-color 0.3s ease;

    &:hover {
        scrollbar-color: rgba(128, 128, 128, 0.3) transparent;
    }

    &::-webkit-scrollbar {
        height: 4px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
        margin: 0 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: transparent;
        border-radius: 10px;
        transition: background 0.3s ease;
    }

    &:hover::-webkit-scrollbar-thumb {
        background: rgba(128, 128, 128, 0.35);
        box-shadow: 0 0 0 1px rgba(128, 128, 128, 0.1);
    }

    &:hover::-webkit-scrollbar-thumb:hover {
        background: rgba(128, 128, 128, 0.55);
    }
}

.code-block-inner {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    background: transparent;
    border: none;
    padding: 0;
    tab-size: 2;
    white-space: pre;
    word-wrap: normal;

    :deep(span) {
        font-family: var(--font-mono);
        font-size: inherit;
    }

    :deep(.line-row) {
        display: block;
        line-height: 1.15;
    }
}
</style>
