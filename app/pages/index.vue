<template>
  <div class="home">
    <section class="article-list">
      <h1 class="section-title">Craig</h1>
      <NuxtLink v-for="article in articles" :key="article.slug" :to="`/n/${article.slug}`" class="article-card">
        <span class="article-title">{{ article.title }}</span>
      </NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
const mdxFiles = import.meta.glob('./n/*.mdx')
const articles = Object.keys(mdxFiles).map((path) => {
  const slug = path.replace('./n/', '').replace('.mdx', '')
  const titleMap: Record<string, string> = {
    resume: '个人简历',
  }
  return { slug, title: titleMap[slug] ?? slug }
})
</script>

<style scoped>
.home {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.article-list {
  margin-bottom: 40px;
}

.section-title {
  font-size: 18px;
  margin-bottom: 12px;
  color: #e0e0e0;
}

.article-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  text-decoration: none;
  color: #e0e0e0;
  transition:
    border-color 0.2s,
    background 0.2s;
  margin-bottom: 8px;
}

.article-card:hover {
  border-color: #1662dc;
  background: #1a1a2e;
}

.article-title {
  font-size: 15px;
  font-weight: 500;
}

.article-arrow {
  color: #888;
  font-size: 16px;
}
</style>
