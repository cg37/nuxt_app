<template>
  <table class="work-table">
    <tbody>
      <tr v-for="item in WorkInformation" :key="item.company">
        <td class="col-company">{{ item.company }}</td>
        <td class="col-team">{{ item.team }} {{ item.title }}</td>
        <td class="col-time">
          <span class="mono">{{ item.timeStart }}</span>
          <span> – </span>
          <span class="mono">{{ item.timeEnd ?? '至今' }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
const WorkInformation = [
  { company: '威星仪表', team: '研发中心', title: '嵌入式开发', timeStart: '2020.02', timeEnd: '2021.08' },
  { company: '极氪', team: '数字发展中心', title: '前端开发(外包)', timeStart: '2021.09', timeEnd: '2023.10' },
  { company: '华为', team: '华为云 EI产品服务部', title: '前端开发(OD)', timeStart: '2023.11', timeEnd: '2025.07' },
  { company: '美团', team: '闪购技术部', title: '前端开发(外包)', timeStart: '2025.07', timeEnd: null },
]
</script>

<style lang="scss" scoped>
.work-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  line-height: 1.5;
  border: none;
}

.work-table td {
  border: none;
  padding: 8px 12px;
  vertical-align: middle;
}

.col-company {
  width: 28%;
}

.col-team {
  width: 42%;
}

.col-time {
  width: 30%;
  white-space: nowrap;
}

.mono {
  font-family: 'SF Mono', 'Fira Code', 'Consolas', 'Courier New', monospace;
}
</style>
