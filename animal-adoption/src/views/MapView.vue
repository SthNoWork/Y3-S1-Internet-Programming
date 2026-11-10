<script setup lang="ts">
import { ACCOUNTS } from '@/data/accounts'
import { useAdoptionStore } from '@/stores/adoptionStore'
import PawIcon from '@/components/icons/PawIcon.vue'
import type { Account } from '@/types/account'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const store = useAdoptionStore()
const route = useRoute()
const mapEl = ref<HTMLElement | null>(null)
const popupContainer = ref<HTMLElement | null>(null)
const selectedAccount = ref<Account | null>(null)
let leafletMap: L.Map | null = null
const shelterMarkers: Record<number, { marker: L.Marker; account: Account }> = {}

const selectedAnimalCount = computed(() => {
  if (!selectedAccount.value) return 0
  return store.animals.filter((a) => a.accountId === selectedAccount.value?.id).length
})

async function focusAccount(account: Account, marker: L.Marker) {
  if (!leafletMap) return
  selectedAccount.value = account
  await nextTick()
  if (popupContainer.value) {
    marker.bindPopup(popupContainer.value, {
      autoPan: true,
      autoPanPadding: [50, 50],
    }).openPopup()
  }
  leafletMap.setView([account.latitude!, account.longitude!], 14, { animate: true })
}

onMounted(() => {
  store.loadAnimals()
  if (!mapEl.value) return
  const initialLat = 11.5564
  const initialLng = 104.9282
  leafletMap = L.map(mapEl.value).setView([initialLat, initialLng], 12)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap)
  loadShelters()

  const targetId = Number(route.query.accountId)
  if (targetId && shelterMarkers[targetId]) {
    const { account, marker } = shelterMarkers[targetId]
    focusAccount(account, marker)
  }
})

watch(() => route.query.accountId, (newId) => {
  const targetId = Number(newId)
  if (targetId && shelterMarkers[targetId]) {
    const { account, marker } = shelterMarkers[targetId]
    focusAccount(account, marker)
  }
})

function loadShelters(): void {
  if (!leafletMap) return
  const map = leafletMap
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

      const marker = L.marker([lat, lng], { icon }).addTo(map)
      shelterMarkers[x.id] = { marker, account: x }

      marker.on('click', () => {
        focusAccount(x, marker)
      })
    }
  })
}
</script>
<template>
  <main class="map-page">
    <section class="map-header">
      <div class="header-text">
        <span class="badge">Rescue Map</span>
        <h2>Explore Animal Shelters</h2>
        <p>Interactive map of verified animal rescues across Phnom Penh. Tap any shelter avatar to see their available
          pets.</p>
      </div>
      <div class="header-paws" aria-hidden="true">
        <PawIcon type="dog" :size="56" color="#ea580c" :rotation="20" :opacity="0.85" />
        <PawIcon type="cat" :size="42" color="#c2410c" :rotation="-15" :opacity="0.8" />
      </div>
    </section>

    <div v-if="store.loading" class="map-status-overlay">
      <span>⏳ Loading rescue shelters...</span>
    </div>

    <div v-else-if="store.error" class="map-error-banner">
      <span>⚠️ {{ store.error }}</span>
      <button type="button" class="state-retry-btn" @click="store.loadAnimals(false, true)">Try Again</button>
    </div>

    <div class="map" ref="mapEl"></div>

    <div style="display: none;">
      <div ref="popupContainer" v-if="selectedAccount" class="shelter-popup">
        <h3>{{ selectedAccount.name }}</h3>
        <p class="animal-count">🐾 {{ selectedAnimalCount }} {{ selectedAnimalCount === 1 ? 'animal' : 'animals' }}
          available</p>
        <p v-if="selectedAccount.description" class="desc">{{ selectedAccount.description }}</p>
        <RouterLink :to="`/account/${selectedAccount.id}`" class="visit-btn">
          Visit Shelter <span>&rarr;</span>
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
.map-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.map-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 1rem;
  padding: 1.75rem 2rem;
}

.header-text {
  max-width: 650px;
}

.badge {
  display: inline-block;
  background-color: #ea580c;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  margin-bottom: 0.5rem;
}

.header-text h2 {
  font-size: 1.8rem;
  color: #431407;
  margin: 0 0 0.5rem 0;
}

.header-text p {
  font-size: 1rem;
  color: #7c2d12;
  margin: 0;
  line-height: 1.5;
}

.header-paws {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.map {
  width: 100%;
  height: 60vh;
  border-radius: 0.5rem;
  overflow: hidden;
}

@media (max-width: 768px) {
  .map-header {
    flex-direction: column;
    text-align: center;
    padding: 1.25rem;
  }
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

.map-status-overlay {
  align-self: center;
  background: #ffffff;
  padding: 0.65rem 1.25rem;
  border-radius: 9999px;
  color: #ea580c;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
}

.map-error-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}
</style>
