<template>
  <div class="container">
    <h1>Nuxt PDF 导出测试</h1>
    
    <div class="form-group">
      <label>标题：</label>
      <input v-model="formData.title" placeholder="请输入标题" />
    </div>
    
    <div class="form-group">
      <label>内容：</label>
      <textarea v-model="formData.content" rows="5" placeholder="请输入内容，支持 HTML 标签"></textarea>
    </div>

    <button @click="handleExport" :disabled="loading">
      {{ loading ? '生成中...' : '导出 PDF' }}
    </button>
    
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const formData = reactive({
  title: '我的 Nuxt 报告',
  content: '<p>这是一段包含 <strong>加粗</strong> 和 <a href="https://vuejs.org">链接</a> 的内容。</p>'
});

const loading = ref(false);
const error = ref('');

const handleExport = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // 调用 Nuxt 后端的 API
    const response = await $fetch('/api/export-pdf', {
      method: 'POST',
      body: formData,
      responseType: 'blob' // 关键：告诉 Nuxt 返回的是二进制流
    });

    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'nuxt-report.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (err) {
    error.value = '导出失败，请检查微服务是否启动';
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.container { max-width: 600px; margin: 50px auto; font-family: sans-serif; }
.form-group { margin-bottom: 15px; }
label { display: block; margin-bottom: 5px; font-weight: bold; }
input, textarea { width: 100%; padding: 8px; box-sizing: border-box; }
button { padding: 10px 20px; background: #0052d9; color: white; border: none; cursor: pointer; border-radius: 4px; }
button:disabled { background: #ccc; cursor: not-allowed; }
.error { color: red; margin-top: 10px; }
</style>