<template>
    <MDXProvider :components="mdxComponents">
        <NuxtPage />
    </MDXProvider>
</template>

<script lang="ts" setup>
import { MDXProvider } from '@mdx-js/vue'
import CustomLink from '/components/CustomLink.vue'
import CustomH1 from '/components/mdxComponent/CustomH1'
import CodeBlock from '/components/mdxComponent/CodeBlock'

const mdxComponents = {
    a: CustomLink,
    h1: CustomH1,
    pre: CodeBlock,
}
</script>
