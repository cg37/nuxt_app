<template>
    <div class="article-page">
        <div v-if="raw" class="article-content">
            <template v-if="!metadata?.hideTitle">
                <h1 class="article-title">{{ metadata?.title }}</h1>
                <br />
            </template>
            <component :is="raw" />
        </div>
        <div v-else class="article-content">
            <br />
            <p>文章未找到</p>
            <CustomLink href="/">返回首页</CustomLink>
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
