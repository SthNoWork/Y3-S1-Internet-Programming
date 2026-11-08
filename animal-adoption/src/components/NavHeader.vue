<!-- src/components/NavHeader.vue -->
<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useAdoptionStore } from '@/stores/adoptionStore';

const store = useAdoptionStore();
</script>

<template>
  <nav class="nav-header">
    <div class="logo">
      <h2>Paw Finder</h2>
    </div>

    <div class="nav-links">
      <RouterLink to="/home" class="nav-btn">Home</RouterLink>
      <RouterLink to="/search" class="nav-btn">Search</RouterLink>
      <RouterLink to="/map" class="nav-btn">Map</RouterLink>
      <RouterLink to="/account" class="nav-btn">Account</RouterLink>
      <RouterLink v-if="store.privateAccount" to="/manage" class="nav-btn">Manage</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.nav-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0rem 1rem;
}

.nav-btn {
  text-decoration: none;
  padding: 0rem 1rem;
}

.nav-btn.router-link-exact-active {
  font-weight: bold;
  background-color: bisque;
}
</style>
