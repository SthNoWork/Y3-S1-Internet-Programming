<script setup lang="ts">
const props = defineProps<{
  page: number
  pageCount: number
}>()

const emit = defineEmits<{
  (e: 'change', newPage: number): void
}>()

const goToPage = (p: number) => {
  if (p >= 1 && p <= props.pageCount && p !== props.page) {
    emit('change', p)
  }
}
</script>

<template>
  <div v-if="props.pageCount > 1" class="pagination-wrapper">
    <button
      class="page-btn nav-btn"
      :disabled="props.page <= 1"
      @click="goToPage(props.page - 1)"
    >
      ← Previous
    </button>

    <div class="page-numbers">
      <button
        v-for="p in props.pageCount"
        :key="p"
        class="page-btn number-btn"
        :class="{ active: p === props.page }"
        @click="goToPage(p)"
      >
        {{ p }}
      </button>
    </div>

    <button
      class="page-btn nav-btn"
      :disabled="props.page >= props.pageCount"
      @click="goToPage(props.page + 1)"
    >
      Next →
    </button>
  </div>
</template>

<style scoped>
.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
  margin-bottom: 24px;
}

.page-numbers {
  display: flex;
  gap: 6px;
}

.page-btn {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #334155;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.nav-btn {
  padding: 8px 14px;
}

.number-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn.active {
  background: #0284c7;
  color: #ffffff;
  border-color: #0284c7;
  font-weight: 700;
}
</style>
