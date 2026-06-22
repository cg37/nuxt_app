<template>
  <div class="site-wrapper">
    <main class="site-main">
      <NuxtPage />
    </main>
  </div>
</template>

<style scoped>
.site-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-main {
  flex: 1;
}
</style>
