<script setup lang="ts">
import AnimalCard from '@/components/AnimalCard.vue';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAdoptionStore } from '@/stores/adoptionStore';
import router from '@/router';
import ProfileCard from '@/components/ProfileCard.vue';

const store = useAdoptionStore()
const route = useRoute();

const targetId = computed<number | null>(() => {
  if (route.params.id) return Number(route.params.id)
  return store.privateAccount?.id ?? store.LOGGED_IN_ACCOUNT_ID
})

onMounted(() => {
  if (targetId.value) {
    store.loadAccount(targetId.value)
    store.loadAnimals()
  } else {
    router.push(`/signup`)
  }
})

const animalsInAccount = computed(() => {
  return store.animals.filter((x) => x.accountId === targetId.value)
})

const currentAccount = computed(() => {
  if (route.params.id) return store.publicAccount
  return store.privateAccount || store.publicAccount
})
</script>

<template>
  <main class="account-page">
    <div v-if="store.loading">
      <p>Loading account</p>
    </div>

    <div v-else-if="store.error">
      <p>{{ store.error }}</p>
    </div>

    <div v-else-if="currentAccount">
      <img :src="currentAccount?.coverImageUrl" class="coverImage">

      <ProfileCard :account="currentAccount" :enableEditBtn="false"></ProfileCard>
      <div class="animal-grid">
        <div v-if="animalsInAccount.length === 0">
          <p>This Shelter has no animals</p>
        </div>
        <AnimalCard v-else v-for="x in animalsInAccount" :key="x.id" :animal="x">
        </AnimalCard>
      </div>
    </div>

    <div v-else>
      <h1>No Account found!</h1>
    </div>

  </main>

</template>

<style scoped>
.coverImage {
  aspect-ratio: 3/1;
  width: 100%;
  object-fit: cover;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;

}

.animal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

div {
  display: flex;
  flex-direction: column;
  gap: 1rem
}
</style>
