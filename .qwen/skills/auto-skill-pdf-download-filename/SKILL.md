---
name: pdf-download-filename
description: Handle PDF download with correct filename when using Blob URLs in browser
source: auto-skill
extracted_at: '2026-06-30T09:45:14.803Z'
---

# PDF 下载 - 正确处理文件名

## 问题

当使用 `fetch` 获取 PDF 二进制流并通过 `URL.createObjectURL(blob)` 创建 Blob URL 后：

- `window.open(blobUrl, '_blank')` 会在浏览器内置 PDF 查看器中打开，但**地址栏显示的是随机 blob UUID**（如 `blob:http://localhost:3000/abc-123`），不是原始文件名
- 即使用户点击 PDF 查看器的"下载"按钮，浏览器也会使用 blob UUID 作为默认文件名

## 解决方案

使用 `<a download="filename.pdf">` 主动触发下载，浏览器会使用 `download` 属性指定的文件名：

```ts
const blob = await response.blob()
const blobUrl = URL.createObjectURL(blob)

// 触发下载（使用正确文件名）
const a = document.createElement('a')
a.href = blobUrl
a.download = '正确文件名.pdf'
document.body.appendChild(a)
a.click()
a.remove()

// 可选：同时打开预览窗口
const previewWindow = window.open('', '_blank')
if (previewWindow) {
    previewWindow.document.write(`
        <iframe src="${blobUrl}" style="width:100%;height:100vh;border:none;"></iframe>
    `)
    previewWindow.document.close()
}

// 延迟清理 Blob URL
setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
```

## 从 Content-Disposition 提取文件名

如果服务端返回 `Content-Disposition: attachment; filename=doc.pdf; filename*=UTF-8''doc.pdf`，可以解析：

```ts
const contentDisposition = response.headers.get('content-disposition')
if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename\*?=(?:UTF-8'')?([^;]+)/i)
    if (filenameMatch) {
        filename = decodeURIComponent(filenameMatch[1])
    }
}
```

## 关键约束

- 必须在 `<a>` 元素上设置 `download` 属性，且同源（Blob URL 算同源）
- 下载触发后才能确保文件名正确，仅靠 `window.open(blobUrl)` 无法传递文件名
- Blob URL 使用后应调用 `URL.revokeObjectURL()` 释放内存
