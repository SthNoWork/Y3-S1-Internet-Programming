<script setup lang="ts">
import AnimalCard from '@/components/AnimalCard.vue';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAdoptionStore } from '@/stores/adoptionStore';

const store = useAdoptionStore()
const route = useRoute();


const accountId = computed<number | null>(() => {
  if (route.params.id) {
    return Number(route.params.id)
  }

  if (store.LOGGED_IN_ACCOUNT_ID) {
    return store.LOGGED_IN_ACCOUNT_ID
  }

  return null
})

onMounted(() => {
  if (accountId.value) {
    store.loadAccount(accountId.value)
  }
  store.loadAnimals()
})

const animalsInAccount = computed(() => {
  return store.animals.filter((x) => x.accountId === accountId.value)
})
</script>

<template>
  <div v-if="store.loading">
    <p>Loading account</p>
  </div>

  <div v-else-if="store.error">
    <p>{{ store.error }}</p>
  </div>

  <div v-else class="account-page">
    <img :src="store.account?.coverImageUrl" class="coverImage">

    <div class="profileflexbox">
      <img :src="store.account?.profileImageUrl">
      <div class="profileInformation">
        <h2>{{ store.account?.name }}</h2>
        <p>{{ store.account?.phone }}</p>
        <a>Location Button</a>
        <p>{{ store.account?.description }}</p>
        <p><b>Notes: </b>{{ store.account?.notes }}</p>
      </div>
    </div>
    <div class="animal-grid">
      <div v-if="animalsInAccount.length === 0">
        <p>This Shelter has no animals</p>
      </div>
      <AnimalCard v-else v-for="x in animalsInAccount" :key="x.id" :animal="x">
      </AnimalCard>
    </div>
  </div>


</template>

<style scoped>
.account-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

}

@media (orientation: landscape) {
  .account-page {
    max-width: 1200px;
    margin: 0 auto;
  }
}

.coverImage {
  aspect-ratio: 3/1;
  width: 100%;
  object-fit: cover;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;

}

.profileflexbox {
  display: flex;
  flex-direction: row;
  gap: 2rem;

  align-items: center;
}

.profileflexbox img {
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 100%;
}

.profileInformation {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profileInformation h2,
.profileInformation p {
  margin: 0;
  /* 🧹 Clears default browser push */
}

.animal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}
</style>
