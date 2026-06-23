<template>
    <a v-if="isExternal" :href="href" class="modern-link is-external" target="_blank" rel="noopener noreferrer">
        <slot></slot>
        <ExternalLinkIcon />
    </a>
    <NuxtLink v-else :to="href" class="modern-link">
        <slot></slot>
    </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ExternalLinkIcon from './ExternalLinkIcon.vue'

const props = defineProps<{
    href: string
}>()

const isExternal = computed(() => {
    return props.href && (props.href.startsWith('http://') || props.href.startsWith('https://'))
})
</script>

<style>
.modern-link {
    color: #4285f0;
    text-decoration: underline;
    text-underline-offset: 2px;
    text-decoration-color: transparent;
    transition:
        color 0.15s ease,
        text-decoration-color 0.15s ease;
}
.modern-link:hover {
    color: #2a67ec;
    text-decoration-color: currentColor;
}
</style>
