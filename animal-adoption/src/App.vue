<script setup lang="ts">
// import MapView from './components/MapView.vue'
import AnimalCard from './components/AnimalCard.vue';
import ProfileCard from './components/ProfileCard.vue'
</script>

<template>
  <!-- <MapView /> -->
  <div class="page">
    <ProfileCard coverUrl="/image.png" profileUrl="/image.png" name="john" description="heyyo" />
    <div class="grid">
      <AnimalCard image="/dog.png" name="bob" description="friendly dwag"
        :tags="['german', 'vaccinated', 'kid-friendly']" />
      <AnimalCard image="/dog.png" name="bob" description="friendly dwag"
        :tags="['german', 'vaccinated', 'kid-friendly']" />
    </div>

  </div>
</template>

<style scoped>
:global(body) {
  background: #f0f2f5;
}

.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: rgb(73, 54, 29);
}

.grid {
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
</style>