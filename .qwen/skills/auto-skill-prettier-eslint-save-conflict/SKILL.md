---
name: prettier-eslint-save-conflict
description: Fix Prettier + ESLint fighting over formatting on save in Nuxt/VSCode (indent, semicolons, etc.)
source: auto-skill
extracted_at: '2026-06-22T14:04:47.346Z'
---

# Prettier + ESLint 保存时格式化冲突

## 症状

保存文件后，代码先被 Prettier 格式化为正确缩进（如 4 空格），然后瞬间闪回为另一种缩进（如 2 空格）。

## 根因

两个格式化器在保存时同时运行且配置冲突：

1. **Prettier**（`editor.formatOnSave: true`）→ 按 `package.json` 或 `.prettierrc` 格式化
2. **ESLint**（`editor.codeActionsOnSave: { "source.fixAll.eslint": "explicit" }` + `eslint-plugin-prettier`）→ 再次格式化，可能覆盖 Prettier 的结果

两者谁后运行谁生效，导致「闪回」效果。

## 修复方案

只保留**一个**保存时格式化工具，另一个改为手动运行。

### 方案 A：只用 Prettier（推荐）

`.vscode/settings.json`：

```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "never"
    },
    "[vue]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
    "[typescript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
    "[javascript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" }
}
```

Lint 修复手动运行 `pnpm lint:fix`。

### 方案 B：只用 ESLint

`.vscode/settings.json`：

```json
{
    "editor.formatOnSave": false,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    }
}
```

确保 `eslint.config.js` 中配置了 `eslint-plugin-prettier/recommended`。

## 关键检查点

- 全局 VSCode 设置（`~/Library/Application Support/Code/User/settings.json`）中的 `editor.codeActionsOnSave` 会和工作区设置合并。必须在工作区显式设为 `"never"` 来覆盖。
- 确保 `prettier.tabWidth` 和 `.editorconfig` 的 `indent_size` 一致
- 修改 workspace settings 后需要 **Reload Window** 才生效
