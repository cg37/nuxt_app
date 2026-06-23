<template>
    <div class="home">
        <div class="homepage-title">Craig</div>

        <section class="article-list">
            <div v-for="year in sortedYears" :key="year" class="year-group">
                <h2 class="year-title">{{ year }}</h2>
                <NuxtLink
                    v-for="article in grouped[year]"
                    :key="article.slug"
                    :to="`/n/${article.slug}`"
                    class="article-card"
                >
                    <span class="article-title">{{ article.title }}</span>
                </NuxtLink>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
// 递归扫描 ./n/ 下所有 .mdx 文件，读取其中导出的 metadata
const mdxFiles = import.meta.glob('./n/**/*.mdx', { eager: true, import: 'metadata' })

interface Article {
    slug: string
    title: string
    year: string
}

const articles: Article[] = Object.entries(mdxFiles).map(([path, meta]) => {
    const rel = path.replace('./n/', '')
    const parts = rel.replace('.mdx', '').split('/')
    const year = parts[0] ?? ''
    const slug = parts.join('/')

    const base =
        parts[parts.length - 1] === 'content'
            ? (parts[parts.length - 2] ?? parts[parts.length - 1])
            : parts[parts.length - 1]
    const metadata = meta as Record<string, unknown> | undefined

    return {
        slug,
        title: (metadata?.title as string) ?? base,
        year,
    }
})

// 按年份分组
const grouped: Record<string, Article[]> = {}
for (const a of articles) {
    if (!grouped[a.year]) grouped[a.year] = []
    grouped[a.year].push(a)
}

const sortedYears = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))
</script>

<style scoped>
.home {
    max-width: 900px;
    margin: 0 auto;
    padding: 24px;
}

.homepage-title {
    font-size: 2.5rem;
    color: theme(text_main);
    margin-bottom: 32px;
}

.article-list {
    margin-bottom: 40px;
}

.year-group {
    margin-bottom: 40px;
}

.year-title {
    font-size: 14px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 12px;
    border-bottom: 1px solid #2a2a2a;
    padding-bottom: 8px;
}

.article-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    text-decoration: none;
    color: #e0e0e0;
    margin-bottom: 8px;
}

.article-card:hover {
    border-color: transparent;
    background: transparent;
}

.article-title {
    font-size: 15px;
    font-weight: 500;
    color: #60a5fa; /* blue-400 */
    text-decoration-line: underline;
    text-underline-offset: 4px;
    text-decoration-color: rgba(59, 130, 246, 0.3); /* blue-500/30 */
    transition:
        color 0.15s,
        text-decoration-color 0.15s;
}

.article-card:hover .article-title {
    color: #93c5fd; /* blue-300 */
    text-decoration-color: rgba(59, 130, 246, 0.6); /* blue-500/60 */
}

.article-arrow {
    color: #888;
    font-size: 16px;
}
</style>
