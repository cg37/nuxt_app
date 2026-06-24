<template>
    <div class="article-page">
        <div v-if="raw" class="article-content">
            <h1 class="article-title">{{ metadata?.title }}</h1>
            <component :is="raw" />
        </div>
        <div v-else class="not-found">
            <p>文章未找到</p>
            <NuxtLink to="/" class="back-link">返回首页</NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

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
</style>
