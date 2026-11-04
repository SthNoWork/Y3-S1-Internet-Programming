<script setup lang="ts">
import AnimalCard from '@/components/AnimalCard.vue';
import { ACCOUNTS } from '@/data/accounts';
import { ANIMALS } from '@/data/animals';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const account = computed(() =>
  ACCOUNTS[Number(route.params.id)]
)
</script>

<template>
  <div class="account-page">
    <img :src="account?.coverImageUrl" class="coverImage">

    <div class="profileflexbox">
      <img :src="account?.profileImageUrl">
      <div class="profileInformation">
        <h2>{{ account?.name }}</h2>
        <p>{{ account?.phone }}</p>
        <a>Location Button</a>
        <p>{{ account?.description }}</p>
        <p><b>Notes: </b>{{ account?.notes }}</p>
      </div>
    </div>
    <div class="animal-grid">
      <AnimalCard v-for="x in ANIMALS.filter((x) => x.accountId === Number(route.params.id))" :key="x.id" :animal="x">
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
