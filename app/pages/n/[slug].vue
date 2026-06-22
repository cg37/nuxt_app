<template>
  <div class="article-page">
    <NuxtLink to="/" class="back-link">← 返回首页</NuxtLink>

    <div v-if="ArticleComponent" class="article-content">
      <MDXProvider>
        <ArticleComponent />
      </MDXProvider>
    </div>
    <div v-else class="not-found">
      <p>文章未找到</p>
      <NuxtLink to="/" class="back-link">← 返回首页</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { MDXProvider } from '@mdx-js/vue'

const route = useRoute()
const slug = computed(() => (route.params.slug as string) ?? '')

// 动态导入 MDX 文件
const mdxModules = import.meta.glob('../../n/*.mdx')

const ArticleComponent = computed(() => {
  const path = `../../n/${slug.value}.mdx`
  const importFn = mdxModules[path]
  if (!importFn) return null
  return defineAsyncComponent(importFn)
})
</script>

<style scoped>
.article-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  color: #e0e0e0;
}

.back-link {
  display: inline-block;
  color: #5b9bf5;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 20px;
}

.back-link:hover {
  text-decoration: underline;
}

.article-content {
  line-height: 1.8;
  color: #e0e0e0;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3),
.article-content :deep(h4),
.article-content :deep(h5),
.article-content :deep(h6) {
  color: #f0f0f0;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.article-content :deep(h1) {
  font-size: 1.8em;
  border-bottom: 1px solid #333;
  padding-bottom: 0.3em;
}
.article-content :deep(h2) {
  font-size: 1.4em;
  border-bottom: 1px solid #2a2a2a;
  padding-bottom: 0.2em;
}
.article-content :deep(h3) {
  font-size: 1.15em;
}

.article-content :deep(p) {
  margin: 0.8em 0;
}

.article-content :deep(a) {
  color: #5b9bf5;
  text-decoration: none;
}

.article-content :deep(a:hover) {
  text-decoration: underline;
}

.article-content :deep(code) {
  background: #1e1e2e;
  color: #e8a0bf;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
}

.article-content :deep(pre) {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1em 0;
}

.article-content :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
}

.article-content :deep(blockquote) {
  border-left: 3px solid #333;
  padding-left: 16px;
  color: #888;
  margin: 1em 0;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  padding-left: 24px;
}

.article-content :deep(li) {
  margin: 4px 0;
}

.article-content :deep(hr) {
  border: none;
  border-top: 1px solid #333;
  margin: 2em 0;
}

.article-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
}

.article-content :deep(th),
.article-content :deep(td) {
  border: 1px solid #333;
  padding: 8px 12px;
  text-align: left;
}

.article-content :deep(th) {
  background: #1a1a2e;
  color: #f0f0f0;
}

.article-content :deep(img) {
  max-width: 100%;
  border-radius: 8px;
}

.not-found {
  text-align: center;
  padding: 60px 0;
  color: #888;
}
</style>
