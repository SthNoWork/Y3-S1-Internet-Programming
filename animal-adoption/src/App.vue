<!-- src/App.vue -->
<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavHeader from './components/NavHeader.vue';
</script>

<template>
  <div class="page-layout">
    <NavHeader />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.page-layout {
  display: flex;
  flex-direction: column;
  background-color: bisque;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}
</style>