<template>
  <div class="article-page">
    <div v-if="ArticleComponent" class="article-content">
      <MDXProvider :components="mdxComponents">
        <ArticleComponent />
      </MDXProvider>
    </div>
    <div v-else class="not-found">
      <p>文章未找到</p>
      <NuxtLink to="/" class="back-link">返回首页</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { MDXProvider } from '@mdx-js/vue'
import CustomLink from '../../components/CustomLink.vue'

const route = useRoute()
// catch-all 路由: /n/a/b/c → params.slug = ['a', 'b', 'c']
const slug = computed(() => {
  const parts = route.params.slug as string[]
  return parts.join('/')
})

// 递归扫描同级目录下所有 .mdx 文件
const mdxModules = import.meta.glob('../n/**/*.mdx')

const ArticleComponent = computed(() => {
  const path = `../n/${slug.value}.mdx`
  const importFn = mdxModules[path]
  if (!importFn) return null
  return defineAsyncComponent(importFn)
})

const mdxComponents = {
    a: CustomLink,
}
</script>
<style scoped lang="scss">
.not-found {
  text-align: center;
  padding: 60px 0;
  color: #888;
}
</style>
