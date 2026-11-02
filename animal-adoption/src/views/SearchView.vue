<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue';
import AnimalCard from '@/components/AnimalCard.vue';
import { ANIMALS } from '@/data/animals';

</script>

<template>
  <div class="search-page">
    <h2>Welcome to search page</h2>
    <SearchBar />
    <AnimalCard v-for="animal in ANIMALS" :key="animal.id" :animal="animal"> </AnimalCard>
  </div>
</template>

<style scoped>
.search-page {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

h2 {
  align-self: center;
}
</style>
