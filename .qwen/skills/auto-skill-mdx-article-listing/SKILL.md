---
name: mdx-article-listing
description: Build an article listing page in Nuxt by scanning MDX files with import.meta.glob and reading exported metadata
source: auto-skill
extracted_at: '2026-06-22T09:25:45.928Z'
---

## Pattern: MDX article listing from directory structure

### Setup

In `index.vue` (or any listing page), use `import.meta.glob` to scan MDX files and read their exported `metadata`:

```ts
// Recursively scan all .mdx files under ./n/
const mdxFiles = import.meta.glob('./n/**/*.mdx', { eager: true, import: 'metadata' })

interface Article {
  slug: string
  title: string
  year: string
}

const articles: Article[] = Object.entries(mdxFiles).map(([path, meta]) => {
  // Example path: ./n/2026/resume/content.mdx
  const rel = path.replace('./n/', '')
  const parts = rel.replace('.mdx', '').split('/')
  const year = parts[0] ?? ''
  const slug = parts.join('/')

  // Derive title from directory name when file is named 'content.mdx'
  const base = parts[parts.length - 1] === 'content'
    ? (parts[parts.length - 2] ?? parts[parts.length - 1])
    : parts[parts.length - 1]

  const metadata = meta as Record<string, any> | undefined

  return {
    slug,
    title: (metadata?.title as string) ?? base,
    year,
  }
})
```

### MDX file format

Each MDX file exports `metadata` at the top:

```mdx
export const metadata = {
  title: '文章标题',
}
```

No need for `gray-matter` or frontmatter parsing — the MDX compiler handles the export directly.

### Grouping by year

```ts
const grouped: Record<string, Article[]> = {}
for (const a of articles) {
  if (!grouped[a.year]) grouped[a.year] = []
  grouped[a.year].push(a)
}

const sortedYears = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))
```

### Key decisions

- Use `import: 'metadata'` to only fetch the exported metadata, not the full compiled component
- Use `eager: true` for synchronous access at build time
- Do NOT use `gray-matter` — it adds an unnecessary dependency when MDX already supports JS exports
- Fallback title: if `metadata.title` is absent, use the directory name (handling `content.mdx` as a special case where parent dir becomes the title)
