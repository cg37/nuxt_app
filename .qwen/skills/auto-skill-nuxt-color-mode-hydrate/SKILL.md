---
name: nuxt-color-mode-hydrate
description: Troubleshoot @nuxtjs/color-mode v4 overriding initial class after hydration due to localStorage
source: auto-skill
extracted_at: '2026-06-23T10:00:00.000Z'
---

## Problem

Nuxt app with `@nuxtjs/color-mode` renders `class="light"` initially, then switches to `class="dark"` after 1-2 seconds, even though `nuxt.config.ts` has `preference: 'light'`.

## Root Cause

`@nuxtjs/color-mode` v4 uses a two-phase initialization:

1. **SSR/Initial script**: An inline script in `<head>` sets the HTML class based on `nuxt.config.ts` preference. This gives `class="light"`.

2. **Client hydration (`app:mounted`)**: The client plugin (`plugin.client.js`) checks `colorMode.unknown` and, if true, reads from `window.__NUXT_COLOR_MODE__` (the injected helper) which prioritizes `localStorage['nuxt-color-mode']` over the configured preference:

```js
nuxtApp.hook("app:mounted", () => {
  if (colorMode.unknown) {
    colorMode.preference = helper.preference;  // reads from localStorage
    setColorModeValue(colorMode, helper.value);
    colorMode.unknown = false;
  }
});
```

If the user previously set dark mode (or the browser/system defaulted to it), `localStorage['nuxt-color-mode']` contains `"dark"`, which overrides the SSR class.

## Diagnose

In browser console, check:
```js
localStorage.getItem('nuxt-color-mode')  // likely returns "dark"
```

## Fix

### Option 1: Clear the cached value (quick fix)
```js
localStorage.removeItem('nuxt-color-mode')
```

### Option 2: Use cookie storage instead (persistent fix)
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  colorMode: {
    preference: 'light',
    fallback: 'light',
    storage: 'cookie',  // use cookie instead of localStorage
  },
})
```

### Option 3: Force light regardless of storage (app.vue)
```vue
<script lang="ts" setup>
if (import.meta.client) {
  localStorage.removeItem('nuxt-color-mode')
}
</script>
```

## Key behavior notes for @nuxtjs/color-mode v4

- `storage` defaults to `"localStorage"` — previous user choices persist across sessions
- `preference` controls what the user prefers; `fallback` is the default when system preference can't be detected
- The client-side `app:mounted` hook always reads from storage if `colorMode.unknown` is true
- Setting `preference: 'light'` does NOT prevent localStorage from overriding it on mount
