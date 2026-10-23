<script setup lang="ts">
import type { User } from '../types'

const props = defineProps<{
  account: User
}>()
</script>

<template>
  <div class="account-header-card" :class="{ 'is-banned': props.account.banned }">
    <div class="profile-main">
      <img
        :src="props.account.profilePictureUrl"
        :alt="props.account.name"
        class="profile-avatar"
      />
      <div class="profile-details">
        <div class="name-row">
          <h2 class="profile-name">{{ props.account.name }}</h2>
          <span class="role-badge">{{ props.account.role.toUpperCase() }}</span>
          <span v-if="props.account.banned" class="banned-badge">SUSPENDED</span>
        </div>

        <p class="profile-location">
          📍 {{ props.account.locationName }}
          <span class="coords">({{ props.account.latitude }}, {{ props.account.longitude }})</span>
        </p>

        <p class="profile-phone">
          📞 <strong>Phone:</strong> {{ props.account.phone }}
        </p>

        <p class="profile-note">
          "{{ props.account.contactNote }}"
        </p>
      </div>
    </div>

    <div v-if="props.account.banned" class="banned-alert">
      ⚠️ <strong>Account Suspended:</strong> This account has been flagged for policy violations.
      Its listings are hidden from public adoption searches.
    </div>
  </div>
</template>

<style scoped>
.account-header-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 28px;
}

.account-header-card.is-banned {
  border-color: #fca5a5;
  background-color: #fffaf0;
}

.profile-main {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.profile-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e2e8f0;
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.profile-name {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
}

.role-badge {
  background: #e0e7ff;
  color: #4338ca;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 12px;
}

.banned-badge {
  background: #fee2e2;
  color: #b91c1c;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 12px;
}

.profile-location,
.profile-phone {
  margin: 0;
  font-size: 14px;
  color: #475569;
}

.coords {
  color: #94a3b8;
  font-size: 12px;
}

.profile-note {
  margin: 6px 0 0 0;
  font-style: italic;
  font-size: 14px;
  color: #334155;
  background: #f8fafc;
  padding: 10px 14px;
  border-radius: 8px;
}

.banned-alert {
  margin-top: 16px;
  padding: 12px 16px;
  background-color: #fef2f2;
  color: #991b1b;
  border-left: 4px solid #ef4444;
  border-radius: 6px;
  font-size: 13px;
}

@media (max-width: 600px) {
  .profile-main {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
