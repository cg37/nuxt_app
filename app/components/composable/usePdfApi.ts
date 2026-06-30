export const usePdfApi = () => {
    const pdfServiceUrl = 'http://localhost:5050/api/Pdf/from-url'

    const generatePdf = async (pagePath: string, filename?: string) => {
        const targetUrl = `http://localhost:3000${pagePath}`

        // 使用传入的标题作为默认文件名，确保有 .pdf 后缀
        if (!filename) {
            filename = 'document.pdf'
        } else if (!filename.endsWith('.pdf')) {
            filename = `${filename}`
        }

        try {
            const response = await fetch(pdfServiceUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            console.error('err', err)
            throw err
        }
    }
    return { generatePdf }
}
