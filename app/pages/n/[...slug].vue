<template>
    <div class="article-page">
        <div v-if="raw" class="article-content">
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

async function load() {
    const slug = (route.params.slug as string[]).join('/')
    const path = `@/content/${slug}/content.mdx`
    const fn = mdxModules[path]
    if (fn) {
        const mod = await fn()
        raw.value = mod as Record<string, unknown>
    } else {
        raw.value = null
    }
}

onMounted(load)
watch(() => route.fullPath, load)
</script>
