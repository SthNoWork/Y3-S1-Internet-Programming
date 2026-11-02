<script setup lang="ts">
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
        <span>Species ID: {{ animal.speciesId }} | </span>
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
        <span v-for="id in animal.categoryIds" :key="id" class="category-badge">
          Tag #{{ id }}
        </span>
      </div>

      <RouterLink to="/account">Go to Shelter</RouterLink>
    </div>
  </div>
</template>

<style scoped></style>
