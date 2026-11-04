<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue';
import AnimalCard from '@/components/AnimalCard.vue';
import { ANIMALS } from '@/data/animals';
import { computed, ref } from 'vue'

const searchQuery = ref('')

const filteredAnimals = computed(() => {
  return ANIMALS.filter((x) => {
    return x.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})
</script>

<template>
  <div class="search-page">
    <h2>Welcome to search page</h2>
    <SearchBar v-model="searchQuery" />
    <div class="animal-grid">
      <AnimalCard v-for="x in filteredAnimals" :key="x.id" :animal="x"> </AnimalCard>
    </div>
  </div>

</template>

<style scoped>
.search-page {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  width: 100%;
  max-width: 1200px;
  /* 📏 Matches the account page width */
  margin: 0 auto;
  /* 🎯 Centers the whole container on wide screens */
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
