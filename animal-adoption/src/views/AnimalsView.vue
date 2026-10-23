<script setup lang="ts">
import { ref, computed } from 'vue'
import { animals as initialAnimals } from '../data/animals'
import { users } from '../data/users'
import { tags } from '../data/tags'
import AnimalCard from '../components/AnimalCard.vue'
import AnimalFilters from '../components/AnimalFilters.vue'
import PaginationBar from '../components/PaginationBar.vue'

// Component state ownership (as documented in docs/components.md)
const search = ref('')
const species = ref('')
const selectedTagId = ref<number | null>(null)
const sort = ref('newest')
const page = ref(1)
const pageSize = 4

const getOwner = (userId: number) => {
  return users.find((u) => u.id === userId)
}

// Computed: Filter and sort logic
const filteredAnimals = computed(() => {
  return initialAnimals.filter((animal) => {
    // Hide animals belonging to banned users
    const owner = getOwner(animal.userId)
    if (owner && owner.banned) {
      return false
    }

    // Filter by search query
    if (search.value.trim() !== '') {
      const q = search.value.toLowerCase()
      const matchesName = animal.name.toLowerCase().includes(q)
      const matchesDetails = animal.details.toLowerCase().includes(q)
      if (!matchesName && !matchesDetails) {
        return false
      }
    }

    // Filter by species
    if (species.value && animal.species !== species.value) {
      return false
    }

    // Filter by tag
    if (selectedTagId.value !== null && !animal.tagIds.includes(selectedTagId.value)) {
      return false
    }

    return true
  }).sort((a, b) => {
    if (sort.value === 'name-asc') {
      return a.name.localeCompare(b.name)
    }
    if (sort.value === 'name-desc') {
      return b.name.localeCompare(a.name)
    }
    // Default newest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})

const pageCount = computed(() => {
  return Math.max(1, Math.ceil(filteredAnimals.value.length / pageSize))
})

const pageItems = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredAnimals.value.slice(start, start + pageSize)
})

// Event handlers updating state
const onSearchUpdate = (val: string) => {
  search.value = val
  page.value = 1
}

const onSpeciesUpdate = (val: string) => {
  species.value = val
  page.value = 1
}

const onTagUpdate = (tagId: number | null) => {
  selectedTagId.value = tagId
  page.value = 1
}

const onSortUpdate = (val: string) => {
  sort.value = val
}

const onPageChange = (newPage: number) => {
  page.value = newPage
}
</script>

<template>
  <div class="animals-view">
    <div class="view-header">
      <h1 class="view-title">Find Your New Best Friend</h1>
      <p class="view-subtitle">
        Browse rescue dogs, cats, and small animals looking for safe and loving homes.
      </p>
    </div>

    <!-- AnimalFilters: Props down, events up -->
    <AnimalFilters
      :tags="tags"
      :search="search"
      :species="species"
      :selected-tag-id="selectedTagId"
      :sort="sort"
      @update:search="onSearchUpdate"
      @update:species="onSpeciesUpdate"
      @update:tag="onTagUpdate"
      @update:sort="onSortUpdate"
    />

    <!-- Results count -->
    <div class="results-meta">
      <span>Showing {{ pageItems.length }} of {{ filteredAnimals.length }} animals</span>
    </div>

    <!-- Animal Cards Grid -->
    <div v-if="pageItems.length > 0" class="animals-grid">
      <AnimalCard
        v-for="animal in pageItems"
        :key="animal.id"
        :animal="animal"
        :owner="getOwner(animal.userId)"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <p class="empty-title">🐾 No animals found matching your criteria</p>
      <p class="empty-desc">Try clearing your search query or selecting a different filter.</p>
    </div>

    <!-- Pagination Bar -->
    <PaginationBar
      :page="page"
      :page-count="pageCount"
      @change="onPageChange"
    />
  </div>
</template>

<style scoped>
.animals-view {
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px 16px;
}

.view-header {
  margin-bottom: 24px;
}

.view-title {
  margin: 0 0 6px 0;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
}

.view-subtitle {
  margin: 0;
  font-size: 15px;
  color: #64748b;
}

.results-meta {
  margin-bottom: 16px;
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.animals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.empty-state {
  text-align: center;
  padding: 48px 20px;
  background: #ffffff;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  margin: 20px 0;
}

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 6px 0;
}

.empty-desc {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}
</style>
