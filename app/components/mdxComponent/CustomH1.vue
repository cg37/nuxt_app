<template>
    <div class="customH1">
        <slot />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title?: string
}>()
</script>
<style lang="scss" scoped>
.customH1 {
    font-size: 32px;
}
</style>
