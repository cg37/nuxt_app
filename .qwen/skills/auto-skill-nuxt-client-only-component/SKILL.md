---
name: nuxt-client-only-component
description: Use browser-only libraries (PDF viewer, charts, etc.) in Nuxt SSR without errors
source: auto-skill
extracted_at: '2026-06-20T01:40:36.899Z'
---

## Symptom
`XXX is not available in the browser` or `window/document is not defined` when using browser-only libraries (e.g. `@ceereals/vue-pdf`, `pdfjs-dist`, ECharts) in a Nuxt app.

## Root Cause
Nuxt renders on the server first (SSR). Libraries that depend on browser globals (`window`, `document`, `navigator`, WebGL canvas, etc.) will fail during server-side rendering.

## Fix

### 1. Wrap with `<ClientOnly>`
```vue
<template>
  <ClientOnly>
    <PDFViewer :queryParams="{ toolbar: 1, view: 'fit' }">
      <slot />
    </PDFViewer>
    <template #fallback>
      <p>Loading PDF viewer...</p>
    </template>
  </ClientOnly>
</template>
```

### 2. Dynamic import with `defineNuxtComponent`
```ts
const PDFViewer = defineNuxtComponent(() =>
  import("@ceereals/vue-pdf").then((m) => m.PDFViewer)
);
```

### Combined pattern (recommended)
```vue
<template>
  <ClientOnly>
    <PDFViewer :queryParams="{ toolbar: 1 }">
      <HelloMdx />
    </PDFViewer>
  </ClientOnly>
</template>

<script setup lang="ts">
// Dynamic import — skips SSR entirely
const PDFViewer = defineNuxtComponent(() =>
  import("@ceereals/vue-pdf").then((m) => m.PDFViewer)
);
</script>
```

## When to use
Any library that:
- Accesses `window`, `document`, `navigator`, `localStorage`
- Uses `Canvas`, `WebGL`, `WebWorker`
- Depends on browser-specific APIs (`IntersectionObserver`, `ResizeObserver`)
- Is a viewer/renderer (PDF, video player, map, chart library)
