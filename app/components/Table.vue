<template>
    <div class="tableContainer">
        <div class="flexRowItem" v-for="item in WorkInformation" :key="item.company">
            <div class="company common_text">{{ item.company }}</div>
            <div class="team common_text">{{ item.team }} {{ item.title }}</div>
            <div class="time">
                <span class="timeItem">{{ item.timeStart }}</span>
                <span>-</span>
                <span class="timeItem">{{ item.timeEnd ?? '至今' }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const WorkInformation = [
    {
        company: '威星智能仪表',
        team: '研发中心',
        title: '嵌入式开发',
        timeStart: '2020.02',
        timeEnd: '2021.08',
    },
    { company: '极氪', team: '数字发展中心', title: '前端开发(外包)', timeStart: '2021.09', timeEnd: '2023.10' },
    { company: '华为', team: '华为云 EI产品服务部', title: '前端开发(OD)', timeStart: '2023.11', timeEnd: '2025.07' },
    { company: '美团', team: '闪购技术部', title: '前端开发(外包)', timeStart: '2025.07', timeEnd: '2026.07' },
]
</script>
<style lang="scss" scoped>
.tableContainer {
    display: flex;
    flex-direction: column;
}
.flexRowItem {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .company {
        flex: 2;
        text-align: left;
    }
    .team {
        flex: 5;
        text-align: left;
    }
    .time {
        flex: 3;
        display: flex;
        align-items: center;
        gap: 4px;
        .timeItem {
            font-family: 'SF Mono', 'Fira Code', 'Consolas', 'Courier New', monospace;
            font-size: 18px;
            line-height: 1;
            text-align: center;
        }
    }
}
</style>
