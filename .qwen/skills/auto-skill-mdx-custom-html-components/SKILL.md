---
name: mdx-custom-html-components
description: Override HTML elements in MDX with custom Vue components using @mdx-js/vue, or use global CSS as a simpler alternative (project)
source: auto-skill
extracted_at: '2026-06-22T11:51:57.709Z'
---

# 在 MDX 中自定义 HTML 元素（Nuxt + @mdx-js/vue）

## 推荐方案：全局 CSS（适用于纯样式需求）

如果只需要**改变样式**（如链接颜色、hover 效果），跳过组件替换，直接在文章页用**非 scoped** 的 `<style>` 块样式化元素：

```vue
<!-- pages/n/[...slug].vue -->
<style lang="scss">
.article-content a {
  color: #60a5fa;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    color: #93c5fd;
    text-decoration: underline;
  }
}

.article-content code {
  background: #1e1e2e;
  color: #e8a0bf;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
```

这比组件替换方案**更可靠**，因为 CSS 不依赖组件渲染机制。

## 备选方案：组件替换（适用于需要自定义逻辑）

如果需要替换元素为自定义 Vue 组件（如外部链接检测），`MDXProvider` 的 `:components` prop 在当前 Nuxt + `@mdx-js/vue` 配置下**可能不生效**，因为编译后的 MDX 使用 `props.components` 而非 `useMDXComponents()` 的 `provide/inject`。

如果要用组件替换，**样式必须是非 scoped 的**，否则可能被 MDX 动态渲染的子元素隔离：

```vue
<!-- CustomLink.vue -->
<style>  <!-- 不能用 scoped -->
.custom-link { color: #b19433; }
</style>
```

## 为什么 MDXProvider 组件替换不生效

MDX 编译后生成：
```js
function _createMdxContent(props) {
  const _components = {
    a: "a",
    ...props.components   // 覆盖在此处
  };
}
```

但 `MDXProvider` 用的是 `provide/inject`，编译后的 MDX 并未调用 `useMDXComponents()`。因此 `provide` 的组件不会自动合并。

## 文件约定

- 文章页：`app/pages/n/[...slug].vue`
- MDX 内容：`app/pages/n/**/*.mdx`
- 文章样式：写在该 Vue 文件的**非 scoped** `<style>` 块中
