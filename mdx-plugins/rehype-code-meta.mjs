/**
 * rehype 插件：把代码块的 info string（语言后的元信息）暴露到 <code> 元素上，
 * 否则 @mdx-js/mdx 会直接丢弃它。
 *
 * 支持两种写法（文件名可包含 / 路径）：
 *   ```ts title="src/utils/tree/treenode.ts"
 *   ```ts src/utils/tree/treenode.ts
 *
 * 解析出的文件名会写到 <code data-file="..."> 上，供组件读取。
 */

export default function rehypeCodeMeta() {
    return (tree) => {
        visit(tree, (node) => {
            if (node.type === 'element' && node.tagName === 'code' && node.data?.meta) {
                const file = extractFilename(node.data.meta)
                if (file) {
                    node.properties = node.properties || {}
                    node.properties['data-file'] = file
                }
            }
        })
    }
}

/** 深度优先遍历 hast 树 */
function visit(node, cb) {
    if (!node || typeof node !== 'object') return
    cb(node)
    if (Array.isArray(node.children)) {
        for (const child of node.children) visit(child, cb)
    }
}

/** 从 info string 中解析文件名 */
function extractFilename(meta) {
    const text = String(meta)

    // 优先匹配 title= / file= / filename= 的引号包裹值
    const quoted = text.match(/(?:title|file|filename)\s*=\s*["']([^"']+)["']/i)
    if (quoted) return quoted[1]

    // 没有 key=value 语法时，把整个剩余串当作文件名（可能含 /）
    if (!/=\s*["']?[^\s"']/.test(text)) {
        const trimmed = text.trim()
        return trimmed || null
    }

    return null
}
