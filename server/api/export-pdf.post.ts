/**
 * Nuxt Server API — PDF 导出
 *
 * 接收 { title, content }，解析 Markdown 为 PDF 组件树，渲染为 PDF
 */
import { h } from 'vue'

// 注册中文字体
const fontPath = '/Users/craig/Code/mdx_pdf/nuxt_app/server/fonts/NotoSansSC-Regular.ttf'

let fontRegistered = false

function ensureFontRegistered(fontStore: any) {
  if (fontRegistered) return
  fontStore.register({
    family: 'NotoSansSC',
    fonts: [{ src: fontPath, fontWeight: 400, fontStyle: 'normal' }],
  })
  fontRegistered = true
}

// ---- 简易 Markdown → PDF 组件树解析器 ----

const styles = {
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
};

function parseInline(text: string, Text: any, Link: any) {
  const parts: any[] = []
  let remaining = text
  while (remaining.length > 0) {
    // 优先级：链接 > 粗体 > 斜体 > 代码
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
        codeMatch ? codeMatch.index! : Infinity
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
  return parts.length ? parts : text
}

function parseMarkdownToElements(lines: string[], Text: any, View: any, Link: any) {
  const elements: any[] = []
  let inList = false

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('---')) {
      elements.push(h(View, { style: styles.divider }))
      continue
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) inList = true
      elements.push(h(Text, { style: styles.li }, parseInline(trimmed.slice(2), Text, Link)))
      continue
    }

    if (inList && trimmed === '') {
      inList = false
      continue
    }

    const hMatch = trimmed.match(/^(#{1,3})\s+(.+)/)
    if (hMatch) {
      const level = hMatch[1].length
      elements.push(h(Text, { style: styles[`h${level}`] }, parseInline(hMatch[2], Text, Link)))
      continue
    }

    if (trimmed) {
      elements.push(h(Text, { style: styles.p }, parseInline(trimmed, Text, Link)))
    }
  }
  return elements
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { title, content } = body;

  if (!content) {
    throw createError({ statusCode: 400, message: '缺少 content 参数' });
  }

  const vuePdf = await import('@ceereals/vue-pdf');
  const { renderToBuffer, fontStore, Document, Page, Text, View, Link } = vuePdf;

  ensureFontRegistered(fontStore);

  const date = new Date().toLocaleString('zh-CN');
  const lines = content.split('\n');
  const bodyElements = parseMarkdownToElements(lines, Text, View, Link);

  const pdfBuffer = await renderToBuffer(
    h(Document, { title: title || 'PDF' }, [
      h(Page, { size: 'A4', style: styles.page }, [
        ...(title ? [
          h(Text, { style: styles.h1 }, title),
          h(Text, { style: styles.date }, `生成时间：${date}`),
          h(View, { style: styles.divider }),
        ] : []),
        ...bodyElements,
      ]),
    ])
  );

  setResponseHeader(event, 'Content-Type', 'application/pdf');
  setResponseHeader(event, 'Content-Disposition', `attachment; filename="${encodeURIComponent(title || 'export')}.pdf"`);
  setResponseHeader(event, 'Content-Length', pdfBuffer.length.toString());

  return pdfBuffer;
});
