/**
 * 导出 resume.mdx 为 PDF
 *
 * 使用方法:
 * npx tsx scripts/export-resume-pdf.ts
 */
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

// 读取 resume.mdx 内容
const resumePath = join(projectRoot, 'app/resume.mdx')
const resumeContent = readFileSync(resumePath, 'utf-8')

// 调用本地 Nuxt 开发服务器 API
const API_URL = process.env.NUXT_DEV_SERVER_URL || 'http://localhost:3000'

async function exportResumePDF() {
  console.log('📄 正在读取 resume.mdx...')
  console.log(`   文件路径: ${resumePath}`)
  console.log(`   内容长度: ${resumeContent.length} 字符`)

  console.log('\n🔄 正在请求 PDF 导出 API...')
  console.log(`   API 地址: ${API_URL}/api/export-pdf`)

  try {
    const response = await fetch(`${API_URL}/api/export-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '陈港 - 前端开发工程师简历',
        content: resumeContent,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`API 返回错误 (${response.status}): ${errText}`)
    }

    // 获取 PDF 二进制数据
    const pdfBuffer = Buffer.from(await response.arrayBuffer())

    // 保存到项目根目录
    const outputPath = join(projectRoot, 'resume.pdf')
    const { writeFileSync } = await import('fs')
    writeFileSync(outputPath, pdfBuffer)

    const sizeKB = (pdfBuffer.length / 1024).toFixed(1)
    console.log(`\n✅ PDF 导出成功!`)
    console.log(`   保存路径: ${outputPath}`)
    console.log(`   文件大小: ${sizeKB} KB`)
  } catch (error: any) {
    console.error('\n❌ PDF 导出失败:')
    console.error(`${error.message}`)

    if (error.cause?.code === 'ECONNREFUSED') {
      console.error('\n💡 提示: 请先启动 Nuxt 开发服务器:')
      console.error('   pnpm dev')
    }

    process.exit(1)
  }
}

exportResumePDF()
