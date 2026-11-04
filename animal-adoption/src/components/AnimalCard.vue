<script setup lang="ts">
import { CATEGORY_NAMES_BY_ID, SPECIES_BY_ID } from '@/data/animals';
import type { Animal } from '@/types/animal';

defineProps<{
  animal: Animal
}>()
</script>
<template>
  <div class="animal-card">
    <img :src="animal.thumbnailUrl" :alt="animal.name" class="thumbnail" />

    <div class="card-content">
      <!-- 🏷️ Heading -->
      <h2>{{ animal.name }}</h2>

      <!-- 🐾 Quick Stats Row -->
      <div class="stats-row">
        <span>Species ID: {{ SPECIES_BY_ID[animal.speciesId] }} | </span>
        <span>{{ animal.age }} years old | </span>
        <span>{{ animal.gender }}</span>
      </div>

      <!-- 📖 Bio -->
      <p class="description">{{ animal.description }}</p>

      <!-- 📌 Highlighted Requirement -->
      <div v-if="animal.requirement" class="requirement-box">
        <strong>Requirement:</strong> {{ animal.requirement }}
      </div>

      <!-- 🏷️ Categories Loop -->
      <div class="category-list">
        <span>Categories: </span>
        <span v-for="id in animal.categoryIds" :key="id" class="category-badge">{{ CATEGORY_NAMES_BY_ID[id] }}</span>
      </div>

      <RouterLink to="/account" class="routerlink">Go to Shelter</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.animal-card {
  border-radius: 5%;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
}

.category-badge {
  padding: 0rem 1rem
}

.card-content {
  display: flex;
  padding: 1rem;
  flex-direction: column;
}

.thumbnail {
  aspect-ratio: 4/3;
  object-fit: cover;
  width: 100%;
  gap: 1.5rem;
}

.routerlink {
  align-self: flex-end;
}
</style>
