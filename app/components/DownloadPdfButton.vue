<template>
    <button class="pdf-btn" :disabled="loading" @click="handleExport" :title="loading ? '生成中...' : '导出 PDF'">
        <span v-if="loading" class="spinner" />
        <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
    </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePdfApi } from '@/composable/usePdfApi'

const props = defineProps<{
    title?: string
}>()

const route = useRoute()
const { generatePdf } = usePdfApi()
const loading = ref(false)

async function handleExport() {
    loading.value = true
    try {
        await generatePdf(route.fullPath, `${props.title || 'document'}.pdf`)
    } catch {
        alert('PDF 导出失败，请稍后重试aaa')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.pdf-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    background: #3b82f6;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    transition:
        background 0.2s,
        transform 0.2s;
}
.pdf-btn:hover:not(:disabled) {
    background: #2563eb;
    transform: scale(1.05);
}
.pdf-btn:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    box-shadow: none;
}

.spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
