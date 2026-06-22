---
name: nuxt-dark-mode-print
description: Keep dark mode on screen while switching to white background for print in Nuxt
source: auto-skill
extracted_at: '2026-06-22T09:38:58.476Z'
---

## Problem

A Nuxt app has dark mode (`background: #0a0a0a`, `color: #e0e0e0`) set at multiple CSS layers. When printing (Ctrl+P / Cmd+P), the background remains black and text is unreadable.

## Root Cause

`@media print` rules that only target `body` are not enough — every intermediate element that has a background color set must be overridden individually. In Nuxt, the typical stack is:

```
body → #__nuxt → .site-wrapper → page content
```

If any of these has `background: #0a0a0a`, it will print black.

**Important:** Scoped `@media print` rules inside Vue `<style scoped>` may be ignored or overridden by Nuxt/Vite's CSS processing. Use **global (non-scoped)** `<style>` blocks or a separate CSS file for print overrides.

## Fix

### 1. Global CSS (`app/assets/css/main.scss`)

```scss
/* Screen styles (dark mode) */
body {
  background: #0a0a0a;
  color: #e0e0e0;
}

#__nuxt {
  background: #0a0a0a;
  color: #e0e0e0;
}

/* Print styles (white background) */
@media print {
  html,
  body,
  #__nuxt {
    background: #fff !important;
    color: #000 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

### 2. Component-level overrides (e.g., `app.vue`)

Use **non-scoped** `<style>` for print overrides — scoped print styles may be ignored:

```vue
<style>
.site-wrapper {
  min-height: 100vh;
  background: #0a0a0a;
  color: #e0e0e0;
}

@media print {
  .site-wrapper {
    background: #fff !important;
    color: #000 !important;
  }
}
</style>
```

## Checklist

When adding dark mode backgrounds, ask: **does this element have a `background` set?** If yes, add a corresponding `@media print` override.

Typical layers to cover:
- `body`
- `#__nuxt`
- Any wrapper component's root element (`.site-wrapper`, `.layout`, etc.)
- Any container with explicit `background` (sidebars, headers, cards)

## Key flags

- `-webkit-print-color-adjust: exact` / `print-color-adjust: exact` — tells browsers to respect background colors during print (useful when you want specific elements to retain their colored backgrounds, like code blocks)
