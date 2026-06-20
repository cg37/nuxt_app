/**
 * Nuxt Server API — PDF 导出
 *
 * 接收 { title, content }，解析 Markdown 为 PDF 组件树，渲染为 PDF
 */
import { h } from 'vue'
import { resolve } from 'path'
import { existsSync } from 'fs'
import { styles, parseInline, parseMarkdownToElements } from '../../utils/parse-markdown'

// 注册中文字体（服务端 fontStore 需要文件系统绝对路径）
// dev: cwd=项目根 → public/fonts/...
// production(build): cwd=.output/ → .output/public/fonts/...
const fontPath = (() => {
  const candidates = [
    resolve(process.cwd(), 'public/fonts/NotoSansSC-Regular.ttf'),
    resolve(process.cwd(), '.output/public/fonts/NotoSansSC-Regular.ttf'),
  ]
  return candidates.find(existsSync) ?? candidates[0]
})()

let fontRegistered = false

function ensureFontRegistered(fontStore: any) {
  if (fontRegistered) return
  fontStore.register({
    family: 'NotoSansSC',
    fonts: [{ src: fontPath, fontWeight: 400, fontStyle: 'normal' }],
  })
  fontRegistered = true
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { title, content } = body

  if (!content) {
    throw createError({ statusCode: 400, message: '缺少 content 参数' })
  }

  const vuePdf = await import('@ceereals/vue-pdf')
  const { renderToBuffer, fontStore, Document, Page, Text, View, Link } = vuePdf

  ensureFontRegistered(fontStore)

  const date = new Date().toLocaleString('zh-CN')
  const lines = content.split('\n')
  const bodyElements = parseMarkdownToElements(lines, Text, View, Link)

  const pdfBuffer = await renderToBuffer(
    h(Document, { title: title || 'PDF' }, [
      h(Page, { size: 'A4', style: styles.page }, [
        ...(title
          ? [
              h(Text, { style: styles.h1 }, title),
              h(Text, { style: styles.date }, `生成时间：${date}`),
              h(View, { style: styles.divider }),
            ]
          : []),
        ...bodyElements,
      ]),
    ]),
  )

  setResponseHeader(event, 'Content-Type', 'application/pdf')
  setResponseHeader(
    event,
    'Content-Disposition',
    `attachment; filename="${encodeURIComponent(title || 'export')}.pdf"`,
  )
  setResponseHeader(event, 'Content-Length', pdfBuffer.length)

  return pdfBuffer
})
