<script setup lang="ts">
import type { Animal, User } from '../types'
import { tags } from '../data/tags'
import { RouterLink } from 'vue-router'

const props = defineProps<{
  animal: Animal
  owner?: User
}>()

const getTagName = (id: number): string => {
  const match = tags.find((t) => t.id === id)
  return match ? match.name : `Tag #${id}`
}
</script>

<template>
  <div class="animal-card" :class="{ 'is-adopted': props.animal.status === 'adopted' }">
    <div class="image-wrapper">
      <img :src="props.animal.imageUrl" :alt="props.animal.name" class="animal-image" />
      <span
        class="status-badge"
        :class="props.animal.status === 'available' ? 'status-available' : 'status-adopted'"
      >
        {{ props.animal.status.toUpperCase() }}
      </span>
      <span class="species-badge">{{ props.animal.species }}</span>
    </div>

    <div class="card-content">
      <div class="card-header">
        <h3 class="animal-name">{{ props.animal.name }}</h3>
      </div>

      <p class="animal-details">{{ props.animal.details }}</p>

      <div class="requirements-box">
        <small><strong>Requirements:</strong> {{ props.animal.requirements }}</small>
      </div>

      <div v-if="props.animal.tagIds.length > 0" class="tag-list">
        <span v-for="tagId in props.animal.tagIds" :key="tagId" class="tag-pill">
          #{{ getTagName(tagId) }}
        </span>
      </div>

      <div v-if="props.owner" class="card-footer">
        <span class="owner-label">Posted by:</span>
        <RouterLink :to="`/accounts/${props.owner.id}`" class="owner-link">
          {{ props.owner.name }} →
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animal-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.animal-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
}

.animal-card.is-adopted {
  opacity: 0.85;
  border-color: #cbd5e1;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  background-color: #f1f5f9;
}

.animal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.status-available {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #10b981;
}

.status-adopted {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #94a3b8;
}

.species-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.7);
  color: #ffffff;
  font-size: 12px;
  text-transform: capitalize;
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.animal-name {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.animal-details {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #475569;
  flex-grow: 1;
}

.requirements-box {
  background: #f8fafc;
  padding: 8px 10px;
  border-radius: 6px;
  border-left: 3px solid #0ea5e9;
  font-size: 12px;
  color: #334155;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-pill {
  font-size: 11px;
  background: #f1f5f9;
  color: #475569;
  padding: 3px 8px;
  border-radius: 12px;
}

.card-footer {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.owner-label {
  color: #64748b;
}

.owner-link {
  color: #0284c7;
  font-weight: 600;
  text-decoration: none;
}

.owner-link:hover {
  text-decoration: underline;
}
</style>
