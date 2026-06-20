import { h, type VNode } from 'vue'
import type { Style } from '@ceereals/vue-pdf'

export const styles: Record<string, Style> = {
  page: { padding: 40, fontFamily: 'NotoSansSC' },
  h1: { fontSize: 22, fontWeight: 'bold', marginTop: 0, marginBottom: 8 },
  h2: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 6 },
  h3: { fontSize: 14, fontWeight: 'bold', marginTop: 10, marginBottom: 4 },
  p: { fontSize: 12, lineHeight: 1.6, marginBottom: 6 },
  li: { fontSize: 12, lineHeight: 1.6, marginLeft: 16, marginBottom: 2 },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
  code: { fontSize: 11, fontFamily: 'Courier', backgroundColor: '#f0f0f0' },
  link: { fontSize: 12, color: '#1662dc', textDecoration: 'underline' },
  divider: { marginVertical: 12, borderBottom: '1px solid #ddd' },
  date: { fontSize: 10, color: '#666', marginBottom: 16 },
}

/**
 * 解析行内格式：链接、粗体、斜体、行内代码
 */
export function parseInline(text: string, Text: any, Link: any): string | VNode[] {
  const parts: (string | VNode)[] = []
  let remaining = text
  while (remaining.length > 0) {
    const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/)
    const boldMatch = !linkMatch ? remaining.match(/\*\*(.+?)\*\*/) : null
    const italicMatch = !linkMatch && !boldMatch ? remaining.match(/\*(.+?)\*/) : null
    const codeMatch = !linkMatch && !boldMatch && !italicMatch ? remaining.match(/`(.+?)`/) : null

    const match = linkMatch || boldMatch || italicMatch || codeMatch

    if (match && match.index === 0) {
      if (linkMatch) {
        parts.push(h(Link, { src: linkMatch[2], style: styles.link }, linkMatch[1]))
        remaining = remaining.slice(linkMatch[0].length)
      } else if (boldMatch) {
        parts.push(h(Text, { style: styles.bold }, boldMatch[1]))
        remaining = remaining.slice(boldMatch[0].length)
      } else if (italicMatch) {
        parts.push(h(Text, { style: styles.italic }, italicMatch[1]))
        remaining = remaining.slice(italicMatch[0].length)
      } else if (codeMatch) {
        parts.push(h(Text, { style: styles.code }, codeMatch[1]))
        remaining = remaining.slice(codeMatch[0].length)
      }
    } else {
      const nextIdx = Math.min(
        linkMatch ? linkMatch.index! : Infinity,
        boldMatch ? boldMatch.index! : Infinity,
        italicMatch ? italicMatch.index! : Infinity,
        codeMatch ? codeMatch.index! : Infinity,
      )
      if (nextIdx === Infinity) {
        parts.push(remaining)
        remaining = ''
      } else {
        parts.push(remaining.slice(0, nextIdx))
        remaining = remaining.slice(nextIdx)
      }
    }
  }
  return parts.length ? (parts as VNode[]) : text
}

/**
 * 将 Markdown 行数组解析为 PDF 原语 VNode 数组
 * @param lines - markdown 文本按 \n 分割的数组
 * @param Text - @ceereals/vue-pdf 的 Text 组件
 * @param View - @ceereals/vue-pdf 的 View 组件
 * @param Link - @ceereals/vue-pdf 的 Link 组件
 * @param tableVNode - 可选的 Table 组件 VNode，当遇到 <Table /> 时插入
 */
export function parseMarkdownToElements(
  lines: string[],
  Text: any,
  View: any,
  Link: any,
  tableVNode?: VNode | null,
): VNode[] {
  const elements: VNode[] = []
  let inList = false

  for (const line of lines) {
    const trimmed = line.trim()

    // 跳过 import 语句
    if (trimmed.startsWith('import ')) continue

    // 处理 <Table /> 标签
    if (trimmed === '<Table />' && tableVNode) {
      elements.push(tableVNode)
      continue
    }

    if (trimmed.startsWith('---')) {
      elements.push(h(View, { style: styles.divider }))
      continue
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) inList = true
      const inline = parseInline(trimmed.slice(2), Text, Link)
      elements.push(h(Text, { style: styles.li }, inline))
      continue
    }

    if (inList && trimmed === '') {
      inList = false
      continue
    }

    const hMatch = trimmed.match(/^(#{1,3})\s+(.+)/)
    if (hMatch && hMatch[1] && hMatch[2]) {
      const level = hMatch[1].length
      const inline = parseInline(hMatch[2], Text, Link)
      elements.push(h(Text, { style: styles[`h${level}` as keyof typeof styles] as Style }, inline))
      continue
    }

    if (trimmed) {
      const inline = parseInline(trimmed, Text, Link)
      elements.push(h(Text, { style: styles.p }, inline))
    }
  }
  return elements
}
