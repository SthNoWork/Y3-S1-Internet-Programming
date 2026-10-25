<script setup lang="ts">
defineProps<{
  coverUrl: string;
  profileUrl: string;
  name: string;
  description: string;
}>();
</script>

<template>
  <div class="profile-card">
    <img class="cover-photo" :src="coverUrl" alt="Cover photo" />
    <img class="profile-photo" :src="profileUrl" alt="Profile photo" />
    <div class="info">
      <h2>{{ name }}</h2>
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>
.profile-card {
  position: relative;
  background: white;
  border-radius: 10px;
  overflow: hidden;
}

.cover-photo {
  display: block;
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.profile-photo {
  position: absolute;
  top: 130px;
  left: 20px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
}

.info {
  padding: 60px 20px 20px;
}

h2 { margin: 0; }
p { margin: 4px 0 0; color: #6b7280; }
</style>