<template>
    <div v-if="raw" class="article-content">
        <!-- <template v-if="!metadata?.hideTitle">
                <h1 class="article-title">{{ metadata?.title }}</h1>
                <br />
            </template> -->
        <component :is="raw" />
    </div>
    <div v-else class="article-content">
        <br />
        <p>文章未找到</p>
        <CustomLink href="/">返回首页</CustomLink>
    </div>
    <div class="pdf_button">
        <DownloadPdfButton :title="metadata?.titleEng" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import DownloadPdfButton from '/components/DownloadPdfButton'

const route = useRoute()
const mdxModules = import.meta.glob('@/content/**/content.mdx')

const raw = ref<Record<string, unknown> | null>(null)
const metadata = ref<Record<string, unknown> | null>(null)

async function load() {
    const slug = (route.params.slug as string[]).join('/')
    const path = `/content/${slug}/content.mdx`

    const fn = mdxModules[path]
    if (fn) {
        const mod = await fn()
        raw.value = (mod.default as Record<string, unknown>) ?? null
        metadata.value = (mod.metadata as Record<string, unknown>) ?? null
    } else {
        raw.value = null
        metadata.value = null
    }
}

onMounted(load)
watch(() => route.fullPath, load)
</script>
<style lang="scss" scoped>
.article-content {
    width: 60ch;
    margin: auto;
}
.pdf_button {
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    background: #3b82f6;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    transition:
        background 0.2s,
        transform 0.2s;
    z-index: 100;
}

@media print {
    .pdf_button {
        display: none;
    }
}
</style>
