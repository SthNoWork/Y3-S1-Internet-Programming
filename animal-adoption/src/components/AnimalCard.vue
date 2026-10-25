<script setup lang="ts">
defineProps<{
  image: string;
  name: string;
  description: string;
  tags: string[];
}>();
</script>

<template>
  <div class="card">
    <img :src="image" :alt="name" />
    <ul>
      <li>{{ name }}</li>
      <li>{{ description }}</li>
      <li v-for="tag in tags" :key="tag">{{ tag }}</li>
    </ul>
  </div>
</template>

<style scoped>
.card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  aspect-ratio: 2 / 1;
  background: white;
  border-radius: 10px;
  overflow: hidden;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

ul {
  margin: 0;
  padding: 16px;
  list-style: none;
  overflow: auto;
  justify-items: start;
}
</style>