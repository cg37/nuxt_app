<template>
    <div class="page_title">
        {{ title }}
    </div>
</template>
<script setup lang="ts">
const props = defineProps<{
    title: string
}>()
</script>

<style lang="scss" scoped>
.page_title {
    font-size: 32px;
    font-width: 800;
}
</style>
