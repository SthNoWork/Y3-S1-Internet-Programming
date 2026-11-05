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
  <div class="search-page">
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
