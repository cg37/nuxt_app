<template>
    <MDXProvider :components="mdxComponents">
        <NuxtPage />
    </MDXProvider>
</template>

<script lang="ts" setup>
import { MDXProvider } from '@mdx-js/vue'
import CustomLink from './components/CustomLink.vue'

const mdxComponents = {
    a: CustomLink,
}
</script>
