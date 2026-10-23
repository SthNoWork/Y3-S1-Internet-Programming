<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="header-container">
        <RouterLink to="/animals" class="brand-link">
          <span class="brand-logo">🐾</span>
          <span class="brand-title">PawMatch</span>
        </RouterLink>

        <nav class="nav-links">
          <RouterLink to="/animals" class="nav-item">Browse Animals</RouterLink>
          <RouterLink to="/accounts/1" class="nav-item">Shelter Profile</RouterLink>
          <RouterLink to="/accounts/2" class="nav-item test-tag">Test Empty Case</RouterLink>
          <RouterLink to="/accounts/3" class="nav-item test-tag">Test Banned Case</RouterLink>
        </nav>
      </div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>

    <footer class="app-footer">
      <div class="footer-container">
        <p>© 2026 PawMatch Animal Adoption Platform — Internet Programming Y3-S1</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* Global resets & typography */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f8fafc;
  color: #1e293b;
  line-height: 1.5;
}
</style>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-container {
  max-width: 1080px;
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #0f172a;
}

.brand-logo {
  font-size: 24px;
}

.brand-title {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #0284c7;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.nav-item {
  color: #475569;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.nav-item:hover {
  color: #0284c7;
  background: #f0f9ff;
}

.nav-item.router-link-active {
  color: #0284c7;
  background: #e0f2fe;
}

.nav-item.test-tag {
  font-size: 12px;
  color: #64748b;
  border: 1px dashed #cbd5e1;
}

.nav-item.test-tag:hover {
  border-color: #0284c7;
}

.app-main {
  flex-grow: 1;
}

.app-footer {
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  padding: 20px 16px;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
}

.footer-container {
  max-width: 1080px;
  margin: 0 auto;
}
</style>
