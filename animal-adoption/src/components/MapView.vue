<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import icon from 'leaflet/dist/images/marker-icon.png'
import icon2x from 'leaflet/dist/images/marker-icon-2x.png'
import shadow from 'leaflet/dist/images/marker-shadow.png'

// fix default marker icons broken by Vite
L.Icon.Default.mergeOptions({ iconUrl: icon, iconRetinaUrl: icon2x, shadowUrl: shadow })

const router = useRouter()
let map: L.Map

function addMarker(lat: number, lng: number, id: number) {
  const marker = L.marker([lat, lng], { draggable: true }).addTo(map)
  marker.on('dragend', () => console.log(marker.getLatLng())) // new position after drag
  marker.on('click', () => router.push(`/animal/${id}`)) // redirect
}

onMounted(() => {
  map = L.map('map').setView([11.5564, 104.9282], 13) // Phnom Penh
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  addMarker(11.5564, 104.9282, 1)

  // click empty map to create a new point
  let nextId = 2
  map.on('click', (e) => addMarker(e.latlng.lat, e.latlng.lng, nextId++))
})

onBeforeUnmount(() => map.remove())
</script>

<template>
  <div id="map" style="height: 500px"></div>
</template>
