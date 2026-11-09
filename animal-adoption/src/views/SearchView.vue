<script setup lang="ts">
import AnimalCard from '@/components/AnimalCard.vue';
import SearchIcon from '@/components/icons/SearchIcon.vue';
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
    <div class="search-layout">
      <input class="search-input" v-model="searchQuery" placeholder="Doggo is a good boy">
      <SearchIcon />
    </div>

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

.search-layout {
  display: flex;
  padding: 1rem 0;
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

.animal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}
</style>
