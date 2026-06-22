<template>
    <a
        :href="href"
        class="modern-link"
        :class="{ 'is-external': isExternal }"
        :target="isExternal ? '_blank' : '_self'"
        :rel="isExternal ? 'noopener noreferrer' : undefined"
    >
        <slot></slot>
        <!-- 如果是外部链接，显示一个极简的右上角小箭头图标 -->
        <ExternalLinkIcon v-if="isExternal" />
    </a>
</template>

<script setup>
import { computed } from 'vue'
import ExternalLinkIcon from './ExternalLinkIcon.vue'

const props = defineProps({
    href: {
        type: String,
        default: '',
    },
})

const isExternal = computed(() => {
    return props.href && (props.href.startsWith('http://') || props.href.startsWith('https://'))
})
</script>

<style>
/* =========================================
   1. 定义 CSS 变量 (支持亮色/暗色模式)
   ========================================= */
:root {
    --link-color: #2563eb; /* 现代亮蓝色 */
    --link-hover-color: #1d4ed8; /* 悬停深蓝 */
    --link-bg-color: rgba(37, 99, 235, 0.1); /* 浅蓝荧光笔背景 */
}

/* 自动适配系统暗黑模式 */
@media (prefers-color-scheme: dark) {
    :root {
        --link-color: #60a5fa; /* 柔和的浅蓝 */
        --link-hover-color: #93c5fd; /* 悬停更亮 */
        --link-bg-color: rgba(96, 165, 250, 0.15); /* 暗黑模式下的背景 */
    }
}

/* =========================================
   2. 核心链接样式
   ========================================= */
.modern-link {
    color: var(--link-color);
    text-decoration: none;
    font-weight: 500;
    position: relative;

    /* 使用 padding 制造背景空间，margin 抵消 padding 对行内排版的影响 */
    padding: 0.1em 0.25em;
    margin: 0 -0.25em;
    border-radius: 4px;

    /* 关键：处理多行文本换行时，背景色独立包裹每一行 */
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;

    /* 平滑过渡动画 */
    transition:
        color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 悬停状态：背景高亮 + 文字变色 */
.modern-link:hover {
    color: var(--link-hover-color);
    background-color: var(--link-bg-color);
}

/* =========================================
   3. 底部下划线滑入动画 (高级感来源)
   ========================================= */
.modern-link::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 0.25em;
    right: 0.25em;
    height: 1.5px;
    background-color: currentColor;

    /* 初始状态： scaleX(0) 隐藏下划线，且从右侧开始收缩 */
    transform: scaleX(0);
    transform-origin: bottom right;
    transition: transform 0.3s cubic-bezier(0.86, 0, 0.07, 1);
}

/* 悬停时：下划线从左到右滑入展开 */
.modern-link:hover::after {
    transform-origin: bottom left;
    transform: scaleX(1);
}

.modern-link:hover :deep(.external-icon) {
    opacity: 1;
    transform: translate(1px, -1px);
}
</style>
