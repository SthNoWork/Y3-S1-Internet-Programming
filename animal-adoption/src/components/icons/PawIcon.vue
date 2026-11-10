<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: 'dog' | 'cat' | 'bird'
    size?: number | string
    color?: string
    rotation?: number
    opacity?: number
  }>(),
  {
    type: 'dog',
    size: 32,
    color: '#ea580c',
    rotation: 0,
    opacity: 1,
  }
)

const pixelSize = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    :width="pixelSize"
    :height="pixelSize"
    :style="{
      transform: `rotate(${rotation}deg)`,
      opacity: opacity,
      transition: 'transform 0.2s ease',
    }"
    fill="none"
  >
    <!-- 🐶 Dog Paw -->
    <g v-if="type === 'dog'" :fill="color">
      <path d="M12 11c-2.8 0-5 1.8-5 4 0 2.2 2.3 4 5 4s5-1.8 5-4c0-2.2-2.2-4-5-4z" />
      <ellipse cx="6" cy="10" rx="1.6" ry="2.2" transform="rotate(-25 6 10)" />
      <ellipse cx="9.5" cy="6.5" rx="1.6" ry="2.2" transform="rotate(-10 9.5 6.5)" />
      <ellipse cx="14.5" cy="6.5" rx="1.6" ry="2.2" transform="rotate(10 14.5 6.5)" />
      <ellipse cx="18" cy="10" rx="1.6" ry="2.2" transform="rotate(25 18 10)" />
    </g>

    <!-- 🐱 Cat Paw -->
    <g v-else-if="type === 'cat'" :fill="color">
      <path d="M12 12c-2.2 0-3.8 1.4-3.8 3.2 0 1.6 1.2 2.8 3.8 2.8s3.8-1.2 3.8-2.8c0-1.8-1.6-3.2-3.8-3.2z" />
      <circle cx="6.5" cy="10" r="1.5" />
      <circle cx="9.8" cy="7" r="1.5" />
      <circle cx="14.2" cy="7" r="1.5" />
      <circle cx="17.5" cy="10" r="1.5" />
    </g>

    <!-- 🦜 Bird Track -->
    <g v-else-if="type === 'bird'" :stroke="color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="14" x2="12" y2="4" />
      <line x1="12" y1="14" x2="6" y2="7" />
      <line x1="12" y1="14" x2="18" y2="7" />
      <line x1="12" y1="14" x2="12" y2="20" />
    </g>
  </svg>
</template>
