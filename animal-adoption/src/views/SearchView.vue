<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue';
import AnimalCard from '@/components/AnimalCard.vue';
import { ANIMALS } from '@/data/animals';

</script>

<template>
  <div class="search-page">
    <h2>Welcome to search page</h2>
    <SearchBar />
    <div class="animal-grid">
      <AnimalCard v-for="animal in ANIMALS" :key="animal.id" :animal="animal"> </AnimalCard>
    </div>
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

.animal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}
</style>
