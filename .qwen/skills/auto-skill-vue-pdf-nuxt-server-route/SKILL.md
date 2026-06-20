---
name: vue-pdf-nuxt-server-route
description: Use @ceereals/vue-pdf in Nuxt server routes for server-side PDF generation without external microservices
source: auto-skill
extracted_at: '2026-06-20T03:02:52.274Z'
---

## Goal
Generate PDFs server-side in Nuxt using `@ceereals/vue-pdf`'s Node API (`renderToBuffer` / `renderToStream`), eliminating the need for an external PDF microservice.

## Architecture

```
Client → POST /api/export-pdf { title, content }
        → Nuxt server route
        → @ceereals/vue-pdf (renderToBuffer)
        → Return PDF binary
```

## Prerequisites

### Node.js 22+ required

`@ceereals/vue-pdf` internally uses `Promise.withResolvers`, which is only available in Node.js v22+. On older versions you'll see:

```
Promise.withResolvers is not a function
```

If you must use Node < 22, add this polyfill at the top of your server route:

```ts
if (!Promise.withResolvers) {
  (Promise as any).withResolvers = function () {
    let resolve: any, reject: any
    const promise = new Promise((res, rej) => { resolve = res; reject = rej })
    return { promise, resolve, reject }
  }
}
```

## Key Rules

### 1. Import path — no `./node` subpath

The package only exports `"."` with conditional resolution:

```json
"exports": {
  ".": {
    "types": "./dist/types/index.d.ts",
    "browser": "./dist/dom/index.js",
    "default": "./dist/node/index.js"
  }
}
```

- **Browser** → resolves to `dist/dom/index.js` (contains `PDFViewer`, `usePdf`)
- **Node/Server** → resolves to `dist/node/index.js` (contains `renderToBuffer`, `Document`, `Page`, etc.)

```ts
// ✅ Correct — Nuxt server route auto-resolves to Node API
const { renderToBuffer, fontStore } = await import('@ceereals/vue-pdf');

// ❌ Wrong — "./node" is not defined in exports
import { renderToBuffer } from '@ceereals/vue-pdf/node';
```

### 2. No `StyleSheet` export

`StyleSheet.create()` does **not** exist in this library. Use plain JS objects for styles:

```ts
// ✅ Correct
const styles = { page: { padding: 40 }, title: { fontSize: 24 } };
h(Page, { style: styles.page }, ...);

// ❌ Wrong — StyleSheet is not exported
import { StyleSheet } from '@ceereals/vue-pdf';
```

### 3. Chinese font support via `fontStore`

Default fonts (Helvetica, Courier) do not support CJK characters. Register a Chinese font like Noto Sans SC:

```ts
import { fontStore } from '@ceereals/vue-pdf'
import { readFileSync } from 'fs'

// Download a font and place it in server/fonts/
const fontData = readFileSync('./server/fonts/NotoSansSC-Regular.ttf')

fontStore.register({
  family: 'NotoSansSC',
  fonts: [{ src: fontData, fontWeight: 400, fontStyle: 'normal' }],
})

// Then use it in styles
const styles = { page: { fontFamily: 'NotoSansSC', padding: 40 } }
```

### 4. Template components must be `.ts` with `h()`, not `.vue`

Nuxt server routes run in Nitro — **no Vue SFC compiler**. Define templates in `.ts` files:

```ts
// server/utils/pdfTemplate.ts
import { defineComponent, h } from 'vue'
import { Document, Page, Text } from '@ceereals/vue-pdf'

export const PdfTemplate = defineComponent({
  props: { title: String, content: String },
  setup(props) {
    return () => h(Document, { title: props.title }, [
      h(Page, { size: 'A4', style: { padding: 40 } }, [
        h(Text, { style: { fontSize: 24 } }, props.title),
        h(Text, { style: { fontSize: 12 } }, props.content),
      ]),
    ])
  },
})
```

### 5. Use relative paths for server imports

`~` alias in Nuxt points to `app/`, not project root. Server routes must use relative imports:

```ts
// ✅ Correct
const { PdfTemplate } = await import('../utils/pdfTemplate');

// ❌ Wrong — resolves to app/server/utils/pdfTemplate
const { PdfTemplate } = await import('~/server/utils/pdfTemplate');
```

### 6. Avoid cross-file initialization races in Nitro

If you get `Cannot access 'X' before initialization`, inline the component definition directly in the server route file instead of importing it. Dynamic imports of server utils can cause Nitro module ordering issues.

```ts
// If importing from another file fails, inline it:
const PdfDoc = defineComponent({
  setup() {
    return () => h(Document, {}, [
      h(Page, {}, [h(Text, {}, content)]),
    ])
  },
})
const pdfBuffer = await renderToBuffer(h(PdfDoc))
```

## Full server route example (with Chinese font support)

```ts
// server/api/export-pdf.post.ts
import { defineComponent, h } from 'vue'
import { readFileSync } from 'fs'

let fontRegistered = false

export default defineEventHandler(async (event) => {
  const { title, content } = await readBody(event);

  const vuePdf = await import('@ceereals/vue-pdf');
  const { renderToBuffer, fontStore, Document, Page, Text } = vuePdf;

  // Register Chinese font once
  if (!fontRegistered) {
    const fontData = readFileSync('./server/fonts/NotoSansSC-Regular.ttf')
    fontStore.register({
      family: 'NotoSansSC',
      fonts: [{ src: fontData, fontWeight: 400 }],
    })
    fontRegistered = true
  }

  const PdfDoc = defineComponent({
    setup() {
      return () => h(Document, { title }, [
        h(Page, { size: 'A4', style: { fontFamily: 'NotoSansSC', padding: 40 } }, [
          h(Text, { style: { fontSize: 24 } }, title),
          h(Text, { style: { fontSize: 12 } }, content),
        ]),
      ])
    },
  });

  const pdfBuffer = await renderToBuffer(h(PdfDoc));

  setResponseHeader(event, 'Content-Type', 'application/pdf');
  setResponseHeader(event, 'Content-Disposition', `attachment; filename="${encodeURIComponent(title)}.pdf"`);
  return pdfBuffer;
});
```

## Client-side alternative (preview only)

For browser preview without download, use `onMounted` + dynamic import to skip SSR:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const url = ref('');

onMounted(async () => {
  const { usePdf } = await import('@ceereals/vue-pdf');
  const { url: pdfUrl } = usePdf(MyComponent);
  url.value = pdfUrl;
});
</script>

<template>
  <iframe :src="url" />
</template>
```

## When to use server vs client

| Scenario | Approach |
|---|---|
| Download / export PDF | Server route + `renderToBuffer` |
| Online preview in iframe | Client + `usePdf` in `onMounted` |
| Exact print layout control | Server route (more deterministic) |
| Large documents / batch generation | Server route |
| Chinese / CJK text | Server route + `fontStore.register` |
