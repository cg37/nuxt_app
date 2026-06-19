<template>
    <MDXProvider :components="components">
        <PDFTest />
    </MDXProvider>
</template>
<script setup lang="ts">
import { MDXProvider } from "@mdx-js/vue";
// import HelloMdx from "./resume.mdx";
import PDFTest from './PDFTest'
import Table from "./components/Table";

const components = {
    Table
};
</script>
<style lang="scss" scoped>
.body-div {
    border: 1px solid red;
    width: 100%;
    height: 100%;
}
</style>
