<script setup lang="ts">
import type { Tag } from '../types'

const props = defineProps<{
  tags: Tag[]
  search: string
  species: string
  selectedTagId: number | null
  sort: string
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:species', value: string): void
  (e: 'update:tag', tagId: number | null): void
  (e: 'update:sort', value: string): void
}>()

const onSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:search', target.value)
}

const onSpeciesChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:species', target.value)
}

const onTagChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const val = target.value ? Number(target.value) : null
  emit('update:tag', val)
}

const onSortChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:sort', target.value)
}
</script>

<template>
  <div class="filters-card">
    <div class="filters-grid">
      <!-- Search input -->
      <div class="filter-group flex-2">
        <label for="filter-search" class="filter-label">Search Animals</label>
        <input
          id="filter-search"
          type="text"
          :value="props.search"
          placeholder="Search by name, details..."
          class="filter-input"
          @input="onSearchInput"
        />
      </div>

      <!-- Species selector -->
      <div class="filter-group">
        <label for="filter-species" class="filter-label">Species</label>
        <select
          id="filter-species"
          :value="props.species"
          class="filter-select"
          @change="onSpeciesChange"
        >
          <option value="">All Species</option>
          <option value="dog">Dogs</option>
          <option value="cat">Cats</option>
          <option value="other">Other Animals</option>
        </select>
      </div>

      <!-- Tag selector -->
      <div class="filter-group">
        <label for="filter-tag" class="filter-label">Filter by Tag</label>
        <select
          id="filter-tag"
          :value="props.selectedTagId === null ? '' : String(props.selectedTagId)"
          class="filter-select"
          @change="onTagChange"
        >
          <option value="">All Tags</option>
          <option v-for="tag in props.tags" :key="tag.id" :value="tag.id">
            {{ tag.name }}
          </option>
        </select>
      </div>

      <!-- Sort selector -->
      <div class="filter-group">
        <label for="filter-sort" class="filter-label">Sort By</label>
        <select
          id="filter-sort"
          :value="props.sort"
          class="filter-select"
          @change="onSortChange"
        >
          <option value="newest">Newest First</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filters-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
}

.filters-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 150px;
}

.filter-group.flex-2 {
  flex: 2;
  min-width: 200px;
}

.filter-label {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-input,
.filter-select {
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background-color: #f8fafc;
  color: #1e293b;
  outline: none;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.filter-input:focus,
.filter-select:focus {
  border-color: #0284c7;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
}
</style>
