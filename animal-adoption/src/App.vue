<!-- src/App.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import NavHeader from './components/NavHeader.vue';
import Footer from './components/FooterCard.vue';
import PawIcon from './components/icons/PawIcon.vue';

interface BackgroundPaw {
  top: string;
  left: string;
  size: number;
  type: 'dog' | 'cat' | 'bird';
  rotation: number;
  opacity: number;
}

const route = useRoute();
const backgroundPaws = ref<BackgroundPaw[]>([]);

const PAW_TYPES: ('dog' | 'cat' | 'bird')[] = ['dog', 'cat', 'bird'];

function generateRandomPaws(count = 28): BackgroundPaw[] {
  const paws: BackgroundPaw[] = [];
  const coords: { top: number; left: number }[] = [];
  const minDistance = 8;
  let attempts = 0;

  while (paws.length < count && attempts < 300) {
    attempts++;
    const topNum = Math.floor(Math.random() * 90) + 5;
    const leftNum = Math.floor(Math.random() * 92) + 4;

    const isTooClose = coords.some(
      (c) => Math.hypot(c.top - topNum, c.left - leftNum) < minDistance,
    );

    if (!isTooClose) {
      coords.push({ top: topNum, left: leftNum });
      paws.push({
        top: `${topNum}%`,
        left: `${leftNum}%`,
        size: Math.floor(Math.random() * 26) + 48,
        type: PAW_TYPES[Math.floor(Math.random() * PAW_TYPES.length)] ?? 'dog',
        rotation: Math.floor(Math.random() * 70) - 35,
        opacity: +(Math.random() * 0.06 + 0.12).toFixed(2),
      });
    }
  }
  return paws;
}

watch(
  () => route.path,
  () => {
    backgroundPaws.value = generateRandomPaws(28);
  },
  { immediate: true },
);
</script>

<template>
  <div class="page-layout">
    <div class="background-paws" aria-hidden="true">
      <PawIcon v-for="(paw, i) in backgroundPaws" :key="'bg-paw-' + i" :type="paw.type" :size="paw.size"
        :rotation="paw.rotation" color="#c2410c" :opacity="paw.opacity"
        :style="{ position: 'absolute', top: paw.top, left: paw.left }" />
    </div>

    <NavHeader class="content-layer" />
    <main class="main-content content-layer">
      <RouterView v-slot="{ Component }">
        <Transition name="page-fade" mode="out-in">
          <component :is="Component" :key="$route.fullPath" />
        </Transition>
      </RouterView>
    </main>
    <Footer class="content-layer" />
  </div>
</template>

<style scoped>
.page-layout {
  display: flex;
  flex-direction: column;
  background-color: bisque;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.background-paws {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.content-layer {
  position: relative;
  z-index: 1;
}

.main-content {
  flex: 1;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
