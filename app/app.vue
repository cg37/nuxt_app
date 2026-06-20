<template>
  <div class="layout">
    <!-- Tab 切换 -->
    <div class="tabs">
      <button
        :class="['tab-btn', { active: activeTab === 'mdx' }]"
        @click="activeTab = 'mdx'"
      >
        📄 MDX 预览
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'pdf' }]"
        @click="activeTab = 'pdf'"
      >
        📑 PDF 预览
      </button>
    </div>

    <!-- MDX 预览 -->
    <div v-if="activeTab === 'mdx'" class="mdx-view">
      <MDXProvider>
        <Resume />
      </MDXProvider>
    </div>

    <!-- PDF 预览 -->
    <ClientOnly v-else>
      <PDFViewer
        v-if="rawContent"
        ref="pdfViewerRef"
        :enableProvideBridge="false"
        class="pdf-viewer"
      >
        <ResumeDocument
          :content="rawContent"
          :title="title"
        />
      </PDFViewer>
      <div v-else class="loading">
        正在加载简历...
      </div>
    </ClientOnly>

    <!-- 操作栏 -->
    <div class="toolbar">
      <button @click="exportPDF" :disabled="loading">
        {{ loading ? '导出中...' : '📥 导出 PDF' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MDXProvider } from '@mdx-js/vue'
import { PDFViewer, fontStore } from '@ceereals/vue-pdf'
import ResumeDocument from './components/ResumeDocument.vue'
import Resume from './n/resume.mdx'

const title = '陈港 - 前端开发工程师简历'
const rawContent = ref('')
const loading = ref(false)
const activeTab = ref<'mdx' | 'pdf'>('mdx')

// 在浏览器端注册中文字体
fontStore.register({
  family: 'NotoSansSC',
  fonts: [{ src: '/fonts/NotoSansSC-Regular.ttf', fontWeight: 400, fontStyle: 'normal' }],
})

onMounted(async () => {
  try {
    const res = await fetch('/resume.mdx')
    if (!res.ok) throw new Error('无法加载 resume.mdx')
    rawContent.value = await res.text()
  } catch (e: any) {
    console.error('加载简历失败:', e.message)
  }
})

async function exportPDF() {
  loading.value = true
  try {
    const response = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content: rawContent.value,
      }),
    })
    if (!response.ok) throw new Error(await response.text())

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '简历.pdf'
    a.click()
    URL.revokeObjectURL(url)
  } catch (e: any) {
    alert('导出失败: ' + e.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.tabs {
  display: flex;
  gap: 4px;
  padding: 12px 20px 0;
  background: #fafafa;
  border-bottom: 1px solid #eee;
}

.tab-btn {
  padding: 10px 24px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  background: #f0f0f0;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: #e8e8e8;
}

.tab-btn.active {
  background: #fff;
  color: #1662dc;
  border-color: #1662dc;
  font-weight: 500;
}

.mdx-view {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  padding-bottom: 80px;
}

.pdf-viewer {
  flex: 1;
  width: 100%;
  height: calc(100vh - 110px);
}

.loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 16px;
}

.toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.95);
  border-top: 1px solid #eee;
  z-index: 100;
}

.toolbar button {
  padding: 10px 28px;
  font-size: 15px;
  border: none;
  border-radius: 8px;
  background: #1662dc;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}

.toolbar button:hover {
  background: #0f4faf;
}

.toolbar button:disabled {
  background: #999;
  cursor: not-allowed;
}
</style>
