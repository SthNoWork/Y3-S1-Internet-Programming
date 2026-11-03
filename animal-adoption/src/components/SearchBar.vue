<script setup lang="ts">
const search = defineModel<string>()
import SearchIcon from '@/components/icons/SearchIcon.vue';
</script>

<template>
  <div class="search-layout">
    <input class="search-input" v-model="search" placeholder="Doggo is a good boy">
    <SearchIcon />
  </div>
</template>

<style scoped>
.search-layout {
  display: flex;
  padding: 1rem;
  align-items: center;
  gap: 0.5rem;
}

.search-input {
  border-radius: 5%;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 15rem;
  padding: 0.25rem 0.25rem;
  outline: none;
}

h2 {
  align-self: center;
}
</style>
