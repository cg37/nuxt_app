<!-- CustomLink.vue -->
<template>
  <!-- 这里可以随意写你的样式和逻辑 -->
  <a
    :href="href"
    class="custom-link"
    :target="isExternal ? '_blank' : '_self'"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
  >
    <slot /> <!-- 插槽用于接收 MDX 中的链接文本 -->
  </a>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  href: String
})

// 简单判断是否为外部链接
const isExternal = computed(() => {
  return props.href && (props.href.startsWith('http://') || props.href.startsWith('https://'))
})
</script>

<style scoped>
.custom-link {
  color: #b19433;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.custom-link:hover {
  color: #16be10;
  border-bottom-style: solid;
}
</style>
