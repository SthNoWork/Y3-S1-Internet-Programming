<script setup lang="ts">
import { ACCOUNTS } from '@/data/accounts'
import { useAdoptionStore } from '@/stores/adoptionStore'
import type { Account } from '@/types/account'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { computed, nextTick, onMounted, ref } from 'vue'

const store = useAdoptionStore()
const mapEl = ref<HTMLElement | null>(null)
const popupContainer = ref<HTMLElement | null>(null)
const selectedAccount = ref<Account | null>(null)

const selectedAnimalCount = computed(() => {
  if (!selectedAccount.value) return 0
  return store.animals.filter((a) => a.accountId === selectedAccount.value?.id).length
})

onMounted(() => {
  store.loadAnimals()
  if (!mapEl.value) return
  const leafletMap = L.map(mapEl.value).setView([11.5564, 104.9282], 13)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap)
  loadShelters(leafletMap)
})

function loadShelters(leafletMap: L.Map): void {
  Object.values(ACCOUNTS).forEach((x) => {
    if (x.latitude && x.longitude) {
      const lat = x.latitude
      const lng = x.longitude

      const icon = L.icon({
        iconUrl: x.profileImageUrl || 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=200',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        className: 'shelter-pin',
      })

      const marker = L.marker([lat, lng], { icon }).addTo(leafletMap)

      marker.on('click', async () => {
        selectedAccount.value = x
        await nextTick()
        if (popupContainer.value) {
          marker.bindPopup(popupContainer.value, {
            autoPan: true,
            autoPanPadding: [50, 50],
          }).openPopup()
        }
        leafletMap.panTo([lat, lng])
      })
    }
  })
}
</script>
<template>
  <main>
    <div class="map" ref="mapEl"></div>

    <div style="display: none;">
      <div ref="popupContainer" v-if="selectedAccount" class="shelter-popup">
        <h3>{{ selectedAccount.name }}</h3>
        <p class="animal-count">🐾 {{ selectedAnimalCount }} {{ selectedAnimalCount === 1 ? 'animal' : 'animals' }} available</p>
        <p v-if="selectedAccount.description" class="desc">{{ selectedAccount.description }}</p>
        <RouterLink :to="`/account/${selectedAccount.id}`" class="visit-btn">
          Visit Shelter <span>&rarr;</span>
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
.map {
  width: 100%;
  height: 60vh;
  border-radius: 0.5rem;
  overflow: hidden;
}

.shelter-popup {
  display: flex;
  flex-direction: column;
  min-width: 200px;
}

.shelter-popup h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
}

.animal-count {
  margin: 0.25rem 0;
  font-weight: 600;
  color: #10b981;
}

.desc {
  margin: 0.25rem 0 0.5rem 0;
  color: #555;
  font-size: 0.9rem;
}

.visit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: auto;
  font-weight: 600;
  text-decoration: none;
  color: #2563eb;
}

.visit-btn:hover {
  text-decoration: underline;
}

:deep(.shelter-pin) {
  border-radius: 50%;
  border: 3px solid #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
  object-fit: cover;
}
</style>
