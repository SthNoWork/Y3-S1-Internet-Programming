<script setup lang="ts">
import AnimalCard from '@/components/AnimalCard.vue'
import { useAdoptionStore } from '@/stores/adoptionStore'
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const store = useAdoptionStore()

onMounted(() => {
  store.loadAnimals()
})

const featuredAnimals = computed(() => {
  return store.animals.slice(0, 3)
})
</script>

<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="hero-content">
        <h1>Find Their Forever Home</h1>
        <p>
          Adopt rescue dogs, cats, and pets directly from local shelters and caring individuals across Phnom Penh.
          No sign-up required to browse and contact shelters.
        </p>
        <div class="hero-cta">
          <RouterLink to="/search" class="btn btn-primary">Browse Animals</RouterLink>
          <RouterLink to="/map" class="btn btn-secondary">Explore Map</RouterLink>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2>Recently Available Pets</h2>
        <RouterLink to="/search" class="see-all-link">View all animals &rarr;</RouterLink>
      </div>

      <div v-if="store.loading" class="state-message">
        <p>Loading available animals...</p>
      </div>

      <div v-else-if="featuredAnimals.length === 0" class="state-message">
        <p>No animals currently available.</p>
      </div>

      <div v-else class="animal-grid">
        <AnimalCard v-for="animal in featuredAnimals" :key="animal.id" :animal="animal" />
      </div>
    </section>

    <section class="section how-it-works">
      <h2>How Paw Finder Works</h2>
      <div class="steps-grid">
        <div class="step-card">
          <span class="step-icon">🔍</span>
          <h3>1. Search & Map</h3>
          <p>Browse animal profiles or explore interactive rescue pins around Phnom Penh.</p>
        </div>
        <div class="step-card">
          <span class="step-icon">📋</span>
          <h3>2. Review Requirements</h3>
          <p>Check vaccination details, health requirements, and adoption criteria up front.</p>
        </div>
        <div class="step-card">
          <span class="step-icon">🤝</span>
          <h3>3. Adopt Directly</h3>
          <p>Contact the shelter or caregiver via phone or email to arrange a meeting.</p>
        </div>
      </div>
    </section>

    <section class="rehome-banner">
      <div class="banner-text">
        <h3>Are you a Shelter or Rehoming a Pet?</h3>
        <p>Create a free account to list animals, mark locations on the map, and find great homes.</p>
      </div>
      <RouterLink :to="store.privateAccount ? '/manage' : '/signup'" class="btn btn-dark">
        {{ store.privateAccount ? 'Go to Manage' : 'Register to Post' }}
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding: 1.5rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.hero-section {
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
}

.hero-content {
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.hero-content h1 {
  font-size: 2.4rem;
  color: #431407;
  margin: 0;
}

.hero-content p {
  font-size: 1.1rem;
  color: #7c2d12;
  line-height: 1.6;
  margin: 0;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.15s ease;
}

.btn:hover {
  opacity: 0.9;
}

.btn-primary {
  background-color: #d0a85d;
  color: #ffffff;
}

.btn-secondary {
  background-color: #ffffff;
  color: #431407;
  border: 1px solid #fed7aa;
}

.btn-dark {
  background-color: #2c2523;
  color: #ffffff;
  white-space: nowrap;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.section-header h2,
.how-it-works h2 {
  font-size: 1.6rem;
  color: #2c2523;
  margin: 0;
}

.see-all-link {
  font-weight: 600;
  color: #ea580c;
  text-decoration: none;
}

.see-all-link:hover {
  text-decoration: underline;
}

.animal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.how-it-works {
  text-align: center;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.step-card {
  background-color: #ffffff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
}

.step-icon {
  font-size: 2.2rem;
}

.step-card h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c2523;
}

.step-card p {
  margin: 0;
  font-size: 0.95rem;
  color: #555555;
  line-height: 1.4;
}

.rehome-banner {
  background-color: #fef3c7;
  border-left: 5px solid #d97706;
  border-radius: 0.5rem;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.banner-text h3 {
  margin: 0 0 0.25rem 0;
  color: #78350f;
}

.banner-text p {
  margin: 0;
  color: #92400e;
  font-size: 0.95rem;
}

.state-message {
  padding: 1.5rem;
  text-align: center;
  color: #666;
}
</style>
