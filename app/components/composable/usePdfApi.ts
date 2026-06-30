export const usePdfApi = () => {
    const pdfServiceUrl = 'http://localhost:5050/api/Pdf/from-url'

    const generatePdf = async (pagePath: string, filename?: string) => {
        const targetUrl = `http://localhost:3000${pagePath}`

        // 使用传入的标题作为默认文件名，确保有 .pdf 后缀
        if (!filename) {
            filename = 'document.pdf'
        } else if (!filename.endsWith('.pdf')) {
            filename = `${filename}.pdf`
        }

        try {
            const response = await fetch(pdfServiceUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: targetUrl, filename }),
            })
            if (!response.ok) throw new Error(`PDF 生成失败: ${response.statusText}`)

            // 从 Content-Disposition 头提取文件名
            const contentDisposition = response.headers.get('content-disposition')
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename\*?=(?:UTF-8'')?([^;]+)/i)
                if (filenameMatch) {
                    filename = decodeURIComponent(filenameMatch[1] as any)
                }
            }

            // 将响应作为 Blob 并在浏览器内置 PDF 查看器中预览
            const blob = await response.blob()
            const blobUrl = URL.createObjectURL(blob)

            // 直接在新标签页打开，浏览器会使用内置 PDF 查看器
            const previewWindow = window.open(blobUrl, '_blank')
            if (!previewWindow) {
                // 如果弹窗被拦截，回退到下载模式
                const a = document.createElement('a')
                a.href = blobUrl
                a.download = filename
                document.body.appendChild(a)
                a.click()
                a.remove()
            }

            // 延迟清理 Blob URL（等 PDF 加载完成后）
            setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)

            return blobUrl
        } catch (err) {
            console.error('err', err)
            throw err
        }
    }
    return { generatePdf }
}
