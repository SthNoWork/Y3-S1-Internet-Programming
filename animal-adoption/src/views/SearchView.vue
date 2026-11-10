<script setup lang="ts">
import AnimalCard from '@/components/AnimalCard.vue';
import SearchIcon from '@/components/icons/SearchIcon.vue';
import PawIcon from '@/components/icons/PawIcon.vue';
import { computed, onMounted, ref } from 'vue'
import { useAdoptionStore } from '@/stores/adoptionStore'
import { SPECIES_BY_ID } from '@/data/species'
import { CATEGORY_NAMES_BY_ID } from '@/data/categories'

const searchQuery = ref('')
const selectedSpeciesIds = ref<number[]>([])
const selectedCategoryIds = ref<number[]>([])
const matchAllCategories = ref(true)

const store = useAdoptionStore()

onMounted(() => {
  store.loadAnimals()
})

function toggleFilter(list: number[], id: number) {
  const index = list.indexOf(id)
  if (index === -1) {
    list.push(id)
  } else {
    list.splice(index, 1)
  }
}

function clearAllFilters() {
  searchQuery.value = ''
  selectedSpeciesIds.value = []
  selectedCategoryIds.value = []
}

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value.trim().length > 0 ||
    selectedSpeciesIds.value.length > 0 ||
    selectedCategoryIds.value.length > 0
  )
})

const filteredAnimals = computed(() => {
  return store.animals.filter((animal) => {
    // 1. Search name
    const matchesName = animal.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    if (!matchesName) return false

    // 2. Species multi-select
    if (
      selectedSpeciesIds.value.length > 0 &&
      !selectedSpeciesIds.value.includes(animal.speciesId)
    ) {
      return false
    }

    // 3. Category multi-select
    // matchAllCategories = true (Hard filter: must have ALL selected categories)
    // matchAllCategories = false (Soft filter: must have AT LEAST ONE selected category)
    if (selectedCategoryIds.value.length > 0) {
      const matchesCategory = matchAllCategories.value
        ? selectedCategoryIds.value.every((id) => animal.categoryIds.includes(id))
        : selectedCategoryIds.value.some((id) => animal.categoryIds.includes(id))

      if (!matchesCategory) return false
    }

    return true
  })
})
</script>

<template>
  <main class="search-page">
    <section class="decor-banner">
      <div class="decor-text">
        <span class="decor-badge">Adopt, Don't Shop</span>
        <h2>Find Your New Best Friend</h2>
        <blockquote class="decor-quote">
          “Saving one animal won't change the world, but surely for that one animal, the world will change forever.”
        </blockquote>
        <p class="decor-author">— Karen Davison</p>
      </div>
      <div class="paw-cluster" aria-hidden="true">
        <PawIcon type="dog" :size="72" color="#c2410c" :rotation="24" :opacity="0.85" class="paw paw-1" />
        <PawIcon type="cat" :size="54" color="#ea580c" :rotation="-18" :opacity="0.9" class="paw paw-2" />
        <PawIcon type="dog" :size="48" color="#f97316" :rotation="12" :opacity="0.75" class="paw paw-3" />
        <PawIcon type="bird" :size="42" color="#b45309" :rotation="-28" :opacity="0.7" class="paw paw-4" />
      </div>
    </section>

    <div class="search-section">
      <div class="search-bar-container">
        <SearchIcon class="search-icon" />
        <input class="search-input" v-model="searchQuery" type="text"
          placeholder="Search by animal name (e.g. Bella, Max, Luna)..." />
        <button v-if="searchQuery" type="button" class="clear-btn" @click="searchQuery = ''" aria-label="Clear search">
          ✕
        </button>
      </div>
      <div class="search-stats">
        <span>Showing <strong>{{ filteredAnimals.length }}</strong> {{ filteredAnimals.length === 1 ? 'pet' : 'pets'
        }}</span>
      </div>
    </div>

    <!-- Multi-select Filter Bar -->
    <div class="filters-container">
      <div class="filter-group">
        <span class="filter-label">Species:</span>
        <div class="filter-pills">
          <button v-for="(name, id) in SPECIES_BY_ID" :key="id" type="button" class="filter-pill"
            :class="{ active: selectedSpeciesIds.includes(Number(id)) }" @click="toggleFilter(selectedSpeciesIds, Number(id))">
            {{ name }}
          </button>
        </div>
      </div>

      <div class="filter-group">
        <div class="filter-header-row">
          <span class="filter-label">Categories:</span>
          <div class="filter-mode-toggle" title="Choose filter behavior">
            <button type="button" class="mode-btn" :class="{ active: matchAllCategories }"
              @click="matchAllCategories = true">
              Match All
            </button>
            <button type="button" class="mode-btn" :class="{ active: !matchAllCategories }"
              @click="matchAllCategories = false">
              Match Any
            </button>
          </div>
        </div>
        <div class="filter-pills">
          <button v-for="(name, id) in CATEGORY_NAMES_BY_ID" :key="id" type="button" class="filter-pill"
            :class="{ active: selectedCategoryIds.includes(Number(id)) }" @click="toggleFilter(selectedCategoryIds, Number(id))">
            {{ name }}
          </button>
        </div>
      </div>

      <button v-if="hasActiveFilters" type="button" class="clear-all-btn" @click="clearAllFilters">
        Clear All Filters
      </button>
    </div>

    <div v-if="store.loading" class="state-box">
      <p>Loading animals from shelters...</p>
    </div>

    <div v-else-if="store.error" class="state-box error-box">
      <p>{{ store.error }}</p>
      <button @click="store.loadAnimals()">Try Again</button>
    </div>

    <div v-else-if="filteredAnimals.length === 0" class="state-box empty-box">
      <p>No animals matched your search criteria.</p>
      <button v-if="hasActiveFilters" @click="clearAllFilters" class="reset-btn">Clear All Filters</button>
    </div>

    <div v-else class="animal-grid">
      <AnimalCard v-for="x in filteredAnimals" :key="x.id" :animal="x" />
    </div>
  </main>
</template>

<style scoped>
.search-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.decor-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 1rem;
  padding: 2rem;
  gap: 2rem;
}

.decor-text {
  flex: 1;
  max-width: 600px;
}

.decor-badge {
  display: inline-block;
  background-color: #ea580c;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  margin-bottom: 0.75rem;
}

.decor-text h2 {
  font-size: 2rem;
  color: #431407;
  margin: 0 0 0.75rem 0;
}

.decor-quote {
  margin: 0;
  font-size: 1.05rem;
  font-style: italic;
  color: #7c2d12;
  line-height: 1.5;
}

.decor-author {
  margin: 0.5rem 0 0 0;
  font-size: 0.85rem;
  color: #9a3412;
  font-weight: 600;
}

.paw-cluster {
  position: relative;
  width: 200px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.paw {
  position: absolute;
  filter: drop-shadow(0 2px 4px rgba(67, 20, 7, 0.15));
}

.paw-1 {
  top: 10px;
  right: 25px;
}

.paw-2 {
  bottom: 12px;
  right: 90px;
}

.paw-3 {
  top: 15px;
  left: 20px;
}

.paw-4 {
  bottom: 10px;
  right: 15px;
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.search-bar-container {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 9999px;
  padding: 0.5rem 1.25rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-bar-container:focus-within {
  border-color: #ea580c;
  box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.15);
}

.search-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  color: #1f2937;
  background: transparent;
  padding: 0.25rem 0;
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-btn {
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0 0.5rem;
  line-height: 1;
}

.clear-btn:hover {
  color: #374151;
}

.search-stats {
  font-size: 0.9rem;
  color: #6b7280;
  padding-left: 0.5rem;
}

.filters-container {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  background-color: #ffffff;
  padding: 1.25rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.filter-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-header-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-mode-toggle {
  display: inline-flex;
  background-color: #f3f4f6;
  padding: 0.15rem;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
}

.mode-btn {
  background: transparent;
  border: none;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mode-btn.active {
  background-color: #ea580c;
  color: #ffffff;
}

.filter-label {
  font-weight: 600;
  font-size: 0.875rem;
  color: #4b5563;
  min-width: 90px;
}

.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-pill {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #374151;
  font-size: 0.8125rem;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.filter-pill:hover {
  background-color: #e5e7eb;
}

.filter-pill.active {
  background-color: #ea580c;
  border-color: #ea580c;
  color: #ffffff;
  font-weight: 600;
}

.clear-all-btn {
  align-self: flex-start;
  background: none;
  border: none;
  color: #ea580c;
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  padding: 0.25rem 0;
}

.clear-all-btn:hover {
  color: #c2410c;
}

.state-box {
  min-height: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: #6b7280;
  background-color: #ffffff;
  border-radius: 0.75rem;
}

.reset-btn {
  margin-top: 0.75rem;
  background-color: #ea580c;
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.animal-grid {
  min-height: 450px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  align-content: start;
}

@media (max-width: 768px) {
  .decor-banner {
    flex-direction: column-reverse;
    text-align: center;
    padding: 1.5rem;
  }

  .paw-cluster {
    width: 100%;
    max-width: 200px;
    height: 120px;
  }
}
</style>
