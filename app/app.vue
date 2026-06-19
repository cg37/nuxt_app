<template>
    <MDXProvider :components="components">
        <HelloMdx />
    </MDXProvider>
</template>
<script setup lang="ts">
import { MDXProvider } from "@mdx-js/vue";
import HelloMdx from "./posttest.mdx";
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
