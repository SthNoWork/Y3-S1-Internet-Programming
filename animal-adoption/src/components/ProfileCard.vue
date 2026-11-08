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
    <img :src="props.account?.profileImageUrl">
    <div>
      <h2>{{ props.account?.name }}</h2>
      <p>{{ props.account?.phone }}</p>
      <a>Location</a>
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

img {
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
</style>
