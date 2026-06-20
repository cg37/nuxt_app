<template>
  <div style="padding: 20px;">
    <button @click="exportPDF" :disabled="loading">
      {{ loading ? '导出中...' : '导出 PDF' }}
    </button>
    <iframe v-if="url" :src="url" style="width: 100%; height: 80vh; margin-top: 16px; border: 1px solid #ddd;" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const url = ref("");
const loading = ref(false);

async function exportPDF() {
  loading.value = true;
  try {
    const resumeContent = await fetch("/resume.mdx").then(r => {
      if (!r.ok) throw new Error("无法加载 resume.mdx");
      return r.text();
    });
    const response = await fetch("/api/export-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "陈港 - 前端开发工程师简历",
        content: resumeContent
      })
    });
    if (!response.ok) throw new Error(await response.text());
    const blob = await response.blob();
    url.value = URL.createObjectURL(blob);
  } catch (e: any) {
    alert("导出失败: " + e.message);
  } finally {
    loading.value = false;
  }
}
</script>
