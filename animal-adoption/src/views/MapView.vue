<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { users } from '../data/users'
import { animals } from '../data/animals'
import type { User } from '../types'

const router = useRouter()
const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
const markers = new Map<number, L.Marker>()
const activePosterId = ref<number | null>(null)

// Active (non-banned) posters with shelter locations
const activePosters = computed(() => {
  return users.filter((u) => u.role === 'poster' && !u.banned)
})

const getAvailableAnimalCount = (userId: number) => {
  return animals.filter((a) => a.userId === userId && a.status === 'available').length
}

// Custom circular PFP marker icon
const createCircularPfpIcon = (poster: User) => {
  return L.divIcon({
    className: 'pfp-marker-icon-wrapper',
    html: `
      <div class="pfp-marker-pin">
        <div class="pfp-marker-avatar">
          <img src="${poster.profilePictureUrl}" alt="${poster.name}" />
        </div>
        <div class="pfp-marker-badge">🐾</div>
        <div class="pfp-marker-pointer"></div>
      </div>
    `,
    iconSize: [46, 54],
    iconAnchor: [23, 54],
    popupAnchor: [0, -56],
  })
}

const focusPosterOnMap = (poster: User) => {
  if (!map) return
  activePosterId.value = poster.id
  map.setView([poster.latitude, poster.longitude], 15, { animate: true })
  const marker = markers.get(poster.id)
  if (marker) {
    marker.openPopup()
  }
}

onMounted(() => {
  if (!mapContainer.value) return

  // Initialize Leaflet map centered at Phnom Penh
  map = L.map(mapContainer.value).setView([11.5564, 104.9282], 13)

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map)

  // Add custom circular PFP marker for each active poster
  activePosters.value.forEach((poster) => {
    if (!map) return
    const count = getAvailableAnimalCount(poster.id)

    const marker = L.marker([poster.latitude, poster.longitude], {
      icon: createCircularPfpIcon(poster),
      title: poster.name,
    }).addTo(map)

    // Popup content with shelter circular pfp, details, and CTA
    const popupContent = document.createElement('div')
    popupContent.className = 'map-popup-card'
    popupContent.innerHTML = `
      <div style="font-family: inherit; min-width: 200px;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
          <img src="${poster.profilePictureUrl}" alt="${poster.name}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 2px solid #0284c7; flex-shrink: 0;" />
          <div>
            <div style="font-weight: 700; font-size: 14px; color: #0f172a; line-height: 1.2;">
              ${poster.name}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
              📍 ${poster.locationName}
            </div>
          </div>
        </div>
        <div style="font-size: 12px; font-weight: 600; color: #0284c7; margin-bottom: 6px; padding: 4px 8px; background: #f0f9ff; border-radius: 6px; display: inline-block;">
          🐾 ${count} animal${count === 1 ? '' : 's'} available
        </div>
        <div style="font-size: 11px; font-weight: 700; color: #2563eb; padding-top: 6px; border-top: 1px solid #f1f5f9; cursor: pointer;">
          Click marker to view profile →
        </div>
      </div>
    `

    marker.bindPopup(popupContent, {
      offset: L.point(0, -6),
      closeButton: false,
    })

    // Hover event: show popup
    marker.on('mouseover', () => {
      marker.openPopup()
      activePosterId.value = poster.id
    })

    // Mouse leave event: close popup
    marker.on('mouseout', () => {
      marker.closePopup()
      activePosterId.value = null
    })

    // Click event: redirect to that poster's account page
    marker.on('click', () => {
      router.push(`/accounts/${poster.id}`)
    })

    markers.set(poster.id, marker)
  })
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div class="map-view-page">
    <div class="map-header">
      <div>
        <h1 class="page-title">Shelters & Foster Map</h1>
        <p class="page-subtitle">
          Hover over location markers to view posters and available animals. Click any marker to view their profile.
        </p>
      </div>
      <div class="header-action">
        <RouterLink to="/animals" class="back-btn">← Back to Animal List</RouterLink>
      </div>
    </div>

    <div class="map-layout">
      <!-- Leaflet Map Container -->
      <div class="map-wrapper">
        <div ref="mapContainer" class="leaflet-container-box"></div>
      </div>

      <!-- Posters Sidebar Directory -->
      <aside class="posters-sidebar">
        <h3 class="sidebar-title">Registered Caretakers ({{ activePosters.length }})</h3>
        <p class="sidebar-hint">Select a caretaker below to pinpoint their location on the map:</p>

        <div class="posters-list">
          <div
            v-for="poster in activePosters"
            :key="poster.id"
            class="poster-item"
            :class="{ active: activePosterId === poster.id }"
            @click="focusPosterOnMap(poster)"
          >
            <img :src="poster.profilePictureUrl" :alt="poster.name" class="poster-thumb" />
            <div class="poster-info">
              <h4 class="poster-name">{{ poster.name }}</h4>
              <p class="poster-loc">📍 {{ poster.locationName }}</p>
              <div class="poster-meta">
                <span class="count-tag">
                  {{ getAvailableAnimalCount(poster.id) }} available
                </span>
                <RouterLink :to="`/accounts/${poster.id}`" class="profile-link" @click.stop>
                  View Profile →
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.map-view-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 16px;
  flex-wrap: wrap;
}

.page-title {
  margin: 0 0 6px 0;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
}

.page-subtitle {
  margin: 0;
  font-size: 15px;
  color: #64748b;
}

.back-btn {
  display: inline-block;
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  color: #334155;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.15s ease;
}

.back-btn:hover {
  background: #f1f5f9;
  border-color: #0284c7;
  color: #0284c7;
}

.map-layout {
  display: flex;
  gap: 20px;
  align-items: stretch;
}

.map-wrapper {
  flex: 2;
  min-height: 580px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.leaflet-container-box {
  width: 100%;
  height: 100%;
  min-height: 580px;
}

/* Custom circular PFP marker styling */
:deep(.pfp-marker-icon-wrapper) {
  background: transparent !important;
  border: none !important;
}

:deep(.pfp-marker-pin) {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 3px solid #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, border-color 0.2s ease;
  cursor: pointer;
}

:deep(.pfp-marker-pin:hover) {
  transform: scale(1.22);
  border-color: #0284c7;
  box-shadow: 0 8px 20px rgba(2, 132, 199, 0.45);
  z-index: 9999 !important;
}

:deep(.pfp-marker-avatar) {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

:deep(.pfp-marker-avatar img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

:deep(.pfp-marker-pointer) {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 9px solid #ffffff;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
}

:deep(.pfp-marker-pin:hover .pfp-marker-pointer) {
  border-top-color: #0284c7;
}

:deep(.pfp-marker-badge) {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #0284c7;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  padding: 4px;
}

:deep(.leaflet-popup-content) {
  margin: 10px 12px;
  line-height: 1.4;
}

/* Sidebar styling */
.posters-sidebar {
  flex: 1;
  min-width: 300px;
  max-width: 380px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.sidebar-hint {
  margin: 0 0 14px 0;
  font-size: 12px;
  color: #64748b;
}

.posters-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  max-height: 500px;
  padding-right: 4px;
}

.poster-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.15s ease;
}

.poster-item:hover,
.poster-item.active {
  background: #f0f9ff;
  border-color: #38bdf8;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(2, 132, 199, 0.08);
}

.poster-thumb {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
  flex-shrink: 0;
}

.poster-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.poster-name {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.poster-loc {
  margin: 0;
  font-size: 12px;
  color: #64748b;
}

.poster-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.count-tag {
  font-size: 11px;
  font-weight: 600;
  color: #0369a1;
  background: #e0f2fe;
  padding: 2px 8px;
  border-radius: 10px;
}

.profile-link {
  font-size: 12px;
  font-weight: 600;
  color: #0284c7;
  text-decoration: none;
}

.profile-link:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .map-layout {
    flex-direction: column;
  }
  .map-wrapper {
    min-height: 400px;
  }
  .leaflet-container-box {
    min-height: 400px;
  }
  .posters-sidebar {
    max-width: 100%;
  }
}
</style>
