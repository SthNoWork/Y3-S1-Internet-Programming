<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  name: string
  description: string
  imageUrl: string
}>()

</script>
<template>
  <div class="profile-card">
    <h2>{{ props.name }}</h2>
    <p>{{ props.description }}</p>
    <img :src="props.imageUrl" alt="Profile Image" />
  </div>
</template>
