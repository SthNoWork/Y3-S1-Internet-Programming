<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { users } from '../data/users'
import { animals } from '../data/animals'
import AccountHeader from '../components/AccountHeader.vue'
import AnimalCard from '../components/AnimalCard.vue'

const route = useRoute()

// Computed account lookup from route parameter
const account = computed(() => {
  const accountId = Number(route.params.id)
  return users.find((u) => u.id === accountId)
})

// Animals belonging to this account
const userAnimals = computed(() => {
  const currentAccount = account.value
  if (!currentAccount) return []
  return animals.filter((a) => a.userId === currentAccount.id)
})

const availableAnimals = computed(() => {
  return userAnimals.value.filter((a) => a.status === 'available')
})
</script>

<template>
  <div class="account-view">
    <div class="navigation-back">
      <RouterLink to="/animals" class="back-link">← Back to Animal Listings</RouterLink>
    </div>

    <!-- If user not found -->
    <div v-if="!account" class="not-found-card">
      <h2>Account Not Found</h2>
      <p>The shelter or poster profile you are looking for does not exist.</p>
      <RouterLink to="/animals" class="primary-btn">Browse All Animals</RouterLink>
    </div>

    <div v-else>
      <!-- Account Header Component (Props down) -->
      <AccountHeader :account="account" />

      <!-- Animal listings section -->
      <section class="account-animals-section">
        <div class="section-header">
          <h2 class="section-title">Available Animals From This Caretaker</h2>
          <span class="count-badge">{{ availableAnimals.length }} available</span>
        </div>

        <!-- Banned user check: listings are hidden -->
        <div v-if="account.banned" class="empty-state banned-notice">
          <p class="empty-title">Listings Unavailable</p>
          <p class="empty-desc">
            This account is currently suspended, so its animal listings are not publicly accessible.
          </p>
        </div>

        <!-- If user has available animals -->
        <div v-else-if="availableAnimals.length > 0" class="animals-grid">
          <AnimalCard
            v-for="animal in availableAnimals"
            :key="animal.id"
            :animal="animal"
            :owner="account"
          />
        </div>

        <!-- Empty case: account has no available animals -->
        <div v-else class="empty-state">
          <p class="empty-title">No Available Animals Currently</p>
          <p class="empty-desc">
            All animals from this caretaker have either found homes or no listings are active.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.account-view {
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px 16px;
}

.navigation-back {
  margin-bottom: 20px;
}

.back-link {
  color: #0284c7;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
}

.back-link:hover {
  text-decoration: underline;
}

.not-found-card {
  text-align: center;
  padding: 60px 20px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.primary-btn {
  display: inline-block;
  margin-top: 16px;
  background: #0284c7;
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}

.account-animals-section {
  margin-top: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.section-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.count-badge {
  background: #e2e8f0;
  color: #334155;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
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
}

.empty-state.banned-notice {
  border-color: #fca5a5;
  background: #fef2f2;
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
