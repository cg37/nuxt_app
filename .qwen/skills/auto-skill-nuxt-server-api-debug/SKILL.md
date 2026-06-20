---
name: nuxt-server-api-debug
description: Troubleshoot Nuxt server API routes that return HTML instead of expected responses
source: auto-skill
extracted_at: '2026-06-19T15:24:34.380Z'
---

## Symptom
A `server/api/xxx.post.ts` route returns a full HTML page (SSR fallback) instead of the expected API response, even though the file exists and exports `defineEventHandler` correctly.

## Root Causes & Fixes

### 1. File naming convention
Nuxt expects API route files to use **kebab-case** (lowercase + hyphens). Files with underscores or PascalCase like `export_PDF.post.ts` may not be recognized.

**Fix:** Rename to kebab-case, e.g. `export-pdf.post.ts`.

### 2. HMR doesn't detect new server files
Nuxt's hot module replacement **does not always pick up newly added files** in `server/api/` after the dev server has started. The Nitro server needs to be restarted to register new routes.

**Fix:** Kill the `nuxt dev` process and restart it:
```bash
# Find and kill the nuxt dev process (the main node process, not child esbuild/sass processes)
kill -9 <nuxt-main-pid>
pnpm dev
```

### 3. ArrayBuffer → Buffer for binary responses in Nitro
When proxying binary responses (PDFs, images, etc.) through a Nitro server route, returning a raw `ArrayBuffer` from `response.arrayBuffer()` can cause truncated transfers.

**Fix:** Wrap in `Buffer.from()`:
```ts
const pdfBuffer = Buffer.from(await response.arrayBuffer());
setResponseHeaders(event, {
  'Content-Type': 'application/pdf',
  'Content-Disposition': 'attachment; filename="report.pdf"',
});
return pdfBuffer;
```

## Quick Diagnostic
```bash
# If this returns HTML instead of your expected content-type, the route isn't registered:
curl -v -X POST http://localhost:3000/api/your-route -H "Content-Type: application/json" -d '{}' 2>&1 | grep "content-type"
```
