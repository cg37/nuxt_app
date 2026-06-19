/** 代理请求微服务 */
export default defineEventHandler(async (event) => {
  // 1. 接收前端传来的数据
  const body = await readBody(event);
  const { title, content } = body;

  // 2. 拼装 HTML (这里可以引入你的 Vue 组件进行 SSR，或者直接写模板)
  // 注意：如果需要中文，建议在 HTML 的 <head> 中引入 Web 字体 (如 Google Fonts)
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif; color: #333; line-height: 1.6; }
        h1 { color: #0052d9; border-bottom: 2px solid #0052d9; padding-bottom: 10px; }
        a { color: #0052d9; text-decoration: underline; }
        .footer { margin-top: 50px; font-size: 12px; color: #999; text-align: center; }
      </style>
    </head>
    <body>
      <h1>${title || '默认标题'}</h1>
      <div>${content || '默认内容'}</div>
      <p>这是一个测试链接：<a href="https://nuxt.com" target="_blank">Nuxt 官网</a></p>
      <div class="footer">生成时间：${new Date().toLocaleString()}</div>
    </body>
    </html>
  `;

  // 3. 调用 Node.js 微服务
  // 注意：生产环境中，这个 URL 应该从环境变量读取 (如 process.env.PDF_SERVICE_URL)
  const microserviceUrl = process.env.PDF_SERVICE_URL || 'http://localhost:3001/api/generate-pdf';
  
  try {
    const response = await fetch(microserviceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        htmlContent, 
        fileName: 'nuxt-report.pdf' 
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw createError({ statusCode: 500, message: `微服务报错: ${errText}` });
    }

    // 4. 获取 PDF 二进制流并透传给前端
    const pdfBuffer = await response.arrayBuffer();
    
    setResponseHeaders(event, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="nuxt-report.pdf"',
      'Content-Length': pdfBuffer.byteLength.toString(),
    });

    return pdfBuffer;

  } catch (error: any) {
    console.error('Nuxt API Error:', error);
    throw createError({ statusCode: 500, message: error.message || 'PDF 生成失败' });
  }
});