<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-brand">
        <h3>🐾 Paw Finder</h3>
        <p>Connecting rescue animals with loving forever homes across Phnom Penh.</p>
      </div>

      <div class="footer-links">
        <h4>Navigation</h4>
        <RouterLink to="/home">Home</RouterLink>
        <RouterLink to="/search">Browse Animals</RouterLink>
        <RouterLink to="/map">Shelter Map</RouterLink>
        <RouterLink to="/login">Shelter Login</RouterLink>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} Paw Finder. Student Project for Internet Programming.</p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: #2c2523;
  color: #f5f5f5;
  padding: 2rem 1.5rem 1rem;
  margin-top: 2rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-brand {
  max-width: 380px;
}

.footer-brand h3 {
  margin: 0 0 0.5rem;
}

.footer-brand p {
  color: #d1d5db;
  font-size: 0.9rem;
  line-height: 1.4;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-links h4 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}

.footer-links a {
  color: #d1d5db;
  text-decoration: none;
  font-size: 0.9rem;
}

.footer-links a:hover {
  color: #ffffff;
  text-decoration: underline;
}

.footer-bottom {
  border-top: 1px solid #443c39;
  margin-top: 1.5rem;
  padding-top: 1rem;
  text-align: center;
  font-size: 0.8rem;
  color: #9ca3af;
}
</style>
