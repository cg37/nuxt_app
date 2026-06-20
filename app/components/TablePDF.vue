<template>
  <View :style="{ marginTop: 8, marginBottom: 8 }">
    <!-- 表体 -->
    <View v-for="(item, index) in WorkInformation" :key="index" :style="rowStyle">
      <Text :style="cellStyle('flex:3')">{{ item.company }}</Text>
      <Text :style="cellStyle('flex:6')">{{ item.team }} {{ item.title }}</Text>
      <Text :style="[cellStyle('flex:3'), { fontFamily: 'Courier', fontSize: 10 }]">
        {{ item.timeStart }} – {{ item.timeEnd ?? '至今' }}
      </Text>
    </View>
  </View>
</template>

<script setup lang="ts">
import { View, Text } from '@ceereals/vue-pdf'
import type { Style } from '@ceereals/vue-pdf'

const WorkInformation = [
  { company: '浙江威星仪表', team: '研发中心', title: '嵌入式开发', timeStart: '2020.02', timeEnd: '2021.08' },
  { company: '极氪', team: '数字发展中心', title: '前端开发(外包)', timeStart: '2021.09', timeEnd: '2023.10' },
  { company: '华为', team: '华为云 EI产品服务部', title: '前端开发(OD)', timeStart: '2023.11', timeEnd: '2025.07' },
  { company: '美团', team: '闪购技术部', title: '前端开发(外包)', timeStart: '2025.07', timeEnd: null },
]

const baseFont: Style = { fontSize: 11, lineHeight: 1.4 }

const headerRowStyle: Style = {
  ...baseFont,
  flexDirection: 'row',
  fontWeight: 'bold',
  backgroundColor: '#f5f5f5',
  paddingTop: 6,
  paddingBottom: 6,
  paddingLeft: 8,
  paddingRight: 8,
}

const rowStyle: Style = {
  ...baseFont,
  flexDirection: 'row',
  paddingTop: 4,
  paddingBottom: 4,
  paddingLeft: 8,
  paddingRight: 8,
  borderBottom: 'none',
}

function headerCellStyle(flex: string): Style {
  return { flex, fontWeight: 'bold' }
}

function cellStyle(flex: string): Style {
  return { flex }
}
</script>
