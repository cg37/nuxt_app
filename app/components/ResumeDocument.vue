<template>
  <Document>
    <Page size="A4" :style="styles.page">
      <RenderNodes :nodes="bodyElements" />
    </Page>
  </Document>
</template>
<script setup lang="ts">
/**
 * 简历 PDF 文档组件
 * 接收原始 Markdown 内容，解析为 @ceereals/vue-pdf 的 Document/Page/Text/View 组件树
 */
import { h, defineComponent, computed } from 'vue'
import { Document, Page, Text, View, Link } from '@ceereals/vue-pdf'
import { parseMarkdownToElements, styles } from '../../utils/parse-markdown'
import TablePDF from './TablePDF.vue'

const props = defineProps<{
  content: string
}>()

/** 将 Markdown 解析为 PDF 原语 VNode 数组 */
const bodyElements = computed(() => {
  const lines = props.content.split('\n')
  const tableVNode = h(TablePDF)
  return parseMarkdownToElements(lines, Text, View, Link, tableVNode)
})

/**
 * 辅助组件：在模板中渲染动态 VNode 数组
 * Vue 3 的 <script setup> 模板不支持直接展开 VNode[]，
 * 通过此组件的 render 函数将数组作为 fragment 渲染。
 */
const RenderNodes = defineComponent({
  props: { nodes: { type: Array, default: () => [] } },
  setup(props) {
    return () => props.nodes
  },
})
</script>
