/**
 * 导出简历为 PDF（独立脚本）
 *
 * 将本地运行的简历页面发送到 Playwright PDF 服务，生成 PDF 并保存到本地。
 *
 * 使用方式:
 *   pnpm tsx scripts/export-resume-pdf.ts
 *
 * 环境变量:
 *   PDF_SERVICE_URL - PDF 服务地址 (默认 http://localhost:5050)
 *   RESUME_URL      - 简历页面 URL (默认 http://localhost:3000/n/2026/resume)
 *   OUTPUT_PATH     - 输出文件路径 (默认 ./resume.pdf)
 */

import axios from 'axios'

const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || 'http://localhost:5050'
const RESUME_URL = process.env.RESUME_URL || 'http://localhost:3000/n/2026/resume'
const OUTPUT_PATH = process.env.OUTPUT_PATH || './resume.pdf'

async function exportResumePdf() {
    console.log(`📄 正在导出简历 PDF...`)
    console.log(`   PDF 服务: ${PDF_SERVICE_URL}`)
    console.log(`   简历 URL: ${RESUME_URL}`)
    console.log(`   输出路径: ${OUTPUT_PATH}`)
    console.log()

    const response = await axios.post(
        `${PDF_SERVICE_URL}/api/pdf/from-url`,
        { url: RESUME_URL },
        { responseType: 'arraybuffer' },
    )

    const contentType: any = response.headers['content-type'] || ''

    if (contentType.includes('application/json')) {
        // JSON 响应 → 解码 base64 数据
        const text = new TextDecoder().decode(response.data as ArrayBuffer)
        const result: { success: boolean; message?: string; data?: string } = JSON.parse(text)
        if (!result.success) {
            throw new Error(`PDF 生成失败: ${result.message}`)
        }
        if (!result.data) {
            throw new Error('PDF 服务未返回文件数据')
        }
        const buffer = Buffer.from(result.data, 'base64')
        await savePdf(buffer)
    } else {
        // 直接返回 PDF 二进制流
        const buffer = Buffer.from(response.data as ArrayBuffer)
        await savePdf(buffer)
    }
}

async function savePdf(buffer: Buffer) {
    const { writeFile } = await import('node:fs/promises')
    const { resolve } = await import('node:path')

    const outputPath = resolve(process.cwd(), OUTPUT_PATH)
    await writeFile(outputPath, buffer)
    console.log(`✅ PDF 已保存到: ${outputPath}`)
    console.log(`   文件大小: ${(buffer.length / 1024).toFixed(1)} KB`)
}

exportResumePdf().catch((err: Error) => {
    console.error('❌ 导出失败:', err.message)
    process.exit(1)
})
