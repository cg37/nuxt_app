<template>
    {{ text }}
    <div ref="tableRef" class="tableContainer">
        <div class="flexRowItem" v-for="item in WorkInformation">
            <div class="company">
                {{ item.company }}
            </div>
            <div class="team">
                {{ `${item.team} ${item.title}` }}
            </div>
            <div class="time">
                <div class="timeItem">
                    {{ `${item.timeStart}` }}
                </div>
                -
                <div class="timeItem">
                    {{ `${item.timeEnd ?? "至今"}` }}
                </div>
            </div>
        </div>
    </div>
    <button @click="download">下载 PDF</button>
</template>
<script setup lang="ts">
defineProps<{
    text: string;
}>();

const tableRef = ref<HTMLElement>();
const { exportToPdf } = useExportPdf();

async function download() {
    console.log(111);
    if (tableRef.value) {
        await exportToPdf("工作经历.pdf", tableRef.value);
    }
}

const WorkInformation = ref([
    {
        company: "浙江威星智能仪表股份有限公司",
        team: "研发中心",
        title: "嵌入式开发",
        timeStart: "2020.02",
        timeEnd: "2021.08"
    },
    {
        company: "极氪",
        team: "数字发展中心",
        title: "前端开发(外包)",
        timeStart: "2021.09",
        timeEnd: "2023.10"
    },
    {
        company: "华为",
        team: "华为云 EI产品服务部",
        title: "前端开发(OD)",
        timeStart: "2023.11",
        timeEnd: " 2025.07"
    },
    {
        company: "美团",
        team: "闪购技术部",
        title: "前端开发(外包)",
        timeStart: "2025.07",
        timeEnd: null
    }
]);
</script>
<style lang="scss" scoped>
.tableContainer {
    display: flex;
    flex-direction: column;
}
.flexRowItem {
    display: flex;
    flex-direction: row;

    .company {
        flex: 3;
        text-align: left;
    }
    .team {
        flex: 6;
        text-align: left;
    }
    .time {
        flex: 3;
        display: flex;
        align-items: center;
        gap: 4px;
        .timeItem {
            font-family: "SF Mono", "Fira Code", "Consolas", "Courier New", monospace;
        }
    }
}
</style>
