<template>
    <pre class="code-block"><code ref="codeRef" class="code-block-inner"><slot /></code></pre>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getHighlighter } from '../../composable/useShiki'

const codeRef = ref<HTMLElement | null>(null)

onMounted(async () => {
    const el = codeRef.value
    if (!el) return

    const classList = el.className || ''
    const match = classList.match(/language-(\w+)/)
    const lang = match ? match[1] : 'text'
    const code = el.textContent || ''

    try {
        const h = await getHighlighter()
        const isDark = document.documentElement.classList.contains('dark')
        const theme = isDark ? 'dark-plus' : 'light-plus'
        const html = h.codeToHtml(code, { lang, theme })
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
})
</script>

<style lang="scss" scoped>
.code-block {
    padding: 0 18px;
    overflow-x: auto;
    border-radius: 6px;
    border: 1px solid theme(border);
    background-color: theme(bg-muted);

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
