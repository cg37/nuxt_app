<template>
  <Document :title="title">
    <Page size="A4" :style="styles.page">
      <Text :style="styles.h1">{{ title }}</Text>
      <Text :style="styles.date">生成时间：{{ dateStr }}</Text>
      <View :style="styles.divider" />
      <slot></slot>
    </Page>
  </Document>
</template>

<script setup lang="ts">
import { Document, Page, Text, View } from '@ceereals/vue-pdf'
import { styles } from '../../utils/parse-markdown'

defineProps<{
  title?: string
}>()

const dateStr = new Date().toLocaleString('zh-CN')
</script>
