<script setup lang="ts">
import type { Account } from '@/types/account';


const props = defineProps<{
  account: Account
  enableEditBtn: boolean
}>()

const isEditing = defineModel<boolean>({ default: false })

</script>

<template>
  <main>
    <div class="avatar-container">
      <img :src="props.account?.profileImageUrl" alt="Profile image">
    </div>
    <div>
      <h2>{{ props.account?.name }}</h2>
      <p>{{ props.account?.phone }}</p>
      <RouterLink
        v-if="props.account?.latitude && props.account?.longitude"
        :to="{ path: '/map', query: { accountId: props.account.id } }"
        class="location-link"
      >
        📍 View on Map
      </RouterLink>
      <span v-else class="location-not-set">Location not set</span>
      <p>{{ props.account?.description }}</p>
      <p><b>Notes: </b>{{ props.account?.notes }}</p>
    </div>
    <button v-if="enableEditBtn" @click="isEditing = !isEditing">Edit</button>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: row;
  gap: 2rem;

  align-items: center;
}

.avatar-container {
  width: clamp(96px, 15vw, 180px);
  aspect-ratio: 1;
  flex-shrink: 0;
  border-radius: 100%;
  overflow: hidden;
  background-color: #e5e7eb;
}

img {
  width: 100%;
  height: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 100%;
}

div {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h2,
p {
  margin: 0;
}

button {
  margin-left: auto;
}

.location-link {
  color: #ea580c;
  text-decoration: underline;
  cursor: pointer;
  width: fit-content;
}

.location-not-set {
  color: #9ca3af;
  font-size: 0.9rem;
}
</style>
