<template>
    <div class="content_container">
        <h1>Craig</h1>
        <br />
        Write, Learn and Code
        <h2>Blog</h2>
        <div v-for="year in sortedYears" :key="year" class="year-group">
            <h3>{{ year }}</h3>
            <ul class="article-list">
                <li v-for="article in grouped[year]" :key="article.slug">
                    <NuxtLink :to="article.path" class="article-link">
                        {{ article.title }}
                    </NuxtLink>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
const mdxFiles = import.meta.glob('@/content/**/content.mdx', { eager: true, import: 'metadata' })

interface Article {
    slug: string
    title: string
    year: string
    path: string
}

const articles: Article[] = Object.entries(mdxFiles).map(([path, meta]) => {
    const rel = path.replace('/content/', '').replace('/content.mdx', '')
    const metadata = meta as Record<string, unknown> | undefined

    const parts = rel.split('/')
    console.log('parts', rel, parts, path)
    const year = parts[0] ?? ''
    const defaultTitle = parts[parts.length - 1] ?? ''

    return {
        slug: rel,
        title: (metadata?.title as string) ?? defaultTitle,
        year,
        path: `/n/${rel}`,
    }
})

// 按年份分组
const grouped: Record<string, Article[]> = {}
for (const a of articles) {
    if (!grouped[a.year]) grouped[a.year] = []
    grouped[a.year].push(a)
}

const sortedYears = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))
// watch(
//     () => articles,
//     () => {
//         // console.log('articles', articles)
//     },
//     { deep: true, immediate: true },
// )
</script>

<style scoped>
.content_container {
    width: 60ch;
    margin: auto;
}

.article-list li {
    margin-bottom: 6px;
}

.article-link {
    color: #60a5fa;
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-color: rgba(96, 165, 250, 0.3);
    transition:
        color 0.15s,
        text-decoration-color 0.15s;
}

.article-link:hover {
    color: #93c5fd;
    text-decoration-color: rgba(96, 165, 250, 0.6);
}
</style>
