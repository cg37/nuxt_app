export const usePdfApi = () => {
  const pdfServiceUrl = 'http:192.168.8.204:5000/api/pdf/form-url'

  const generatePdf = async (pagePath: string, filename: string = 'document.pdf') => {
    const targetUrl = `http://192.168.8.220:3000${pagePath}`

    try {
      const response = await fetch(pdfServiceUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      })
      if (!response.ok) throw new Error(`PDF 生成失败: ${response.statusText}`)

      const result = await response.json()
      const downloadUrl = result.url

      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()

      return downloadUrl
    } catch (err) {
      console.error('err', err)
      throw err
    }
  }
  return { generatePdf }
}
