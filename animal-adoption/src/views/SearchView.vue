<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue';
import AnimalCard from '@/components/AnimalCard.vue';
import { computed, onMounted, ref } from 'vue'
import { useAdoptionStore } from '@/stores/adoptionStore'

const searchQuery = ref('')
const store = useAdoptionStore()

onMounted(() => {
  store.loadAnimals()
})


const filteredAnimals = computed(() => {
  return store.animals.filter((x) => {
    return x.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})
</script>

<template>
  <main class="search-page">
    <h2>Welcome to search page</h2>
    <SearchBar v-model="searchQuery" />

    <div v-if="store.loading">
      <p>Loading animals from shelter...</p>
    </div>

    <div v-if="store.error">
      <p>{{ store.error }}</p>
      <button @click="store.loadAnimals()">Try Again</button>
    </div>

    <div v-else-if="filteredAnimals.length === 0">
      <p>
        No animals matches your search!
      </p>
    </div>

    <div v-else class="animal-grid">
      <AnimalCard v-for="x in filteredAnimals" :key="x.id" :animal="x"> </AnimalCard>
    </div>
  </main>

</template>

<style scoped>
.search-page {
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
