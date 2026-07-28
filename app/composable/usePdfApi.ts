export const usePdfApi = () => {
    const generatePdf = async (pagePath: string, filename?: string) => {
        // 根据 hostname 判断是否线上环境
        const isProd = typeof window !== 'undefined' && window.location.hostname === 'app.cg37.dev'

        // PDF 服务地址
        const pdfServiceUrl = isProd
            ? `${window.location.origin}:5050/api/Pdf/from-url`
            : 'http://127.0.0.1:5051/api/Pdf/from-url'

        // 目标页面地址：PDF 服务需要能访问到的地址
        // 本地测试时，使用你本机的局域网 IP（让 PDF 服务能访问到）
        const targetUrl = isProd ? `${window.location.origin}/api${pagePath}` : `http://127.0.0.1:3000${pagePath}`

        console.log('[PDF] 请求地址:', pdfServiceUrl)
        console.log('[PDF] 目标 URL:', targetUrl)

        // 使用传入的标题作为默认文件名，确保有 .pdf 后缀
        if (!filename) {
            filename = 'document.pdf'
        } else if (!filename.endsWith('.pdf')) {
            filename = `${filename}`
        }

        try {
            const response = await fetch(pdfServiceUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': 'test-key-123',
                },
                body: JSON.stringify({ url: targetUrl, filename }),
            })
            if (!response.ok) throw new Error(`PDF 生成失败: ${response.statusText}`)

            // API 返回 JSON，包含 PDF 的 URL
            const result = await response.json()
            const pdfUrl = result.url

            if (!pdfUrl) throw new Error('API 未返回 PDF URL')

            // 在新窗口直接打开 PDF URL
            window.open(pdfUrl, '_blank')

            return pdfUrl
        } catch (err) {
            console.error('[PDF] 导出错误:', err)
            throw err
        }
    }
    return { generatePdf }
}
