<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const myAnimals = ref<any[]>([])
const loading = ref(true)
const showCreateModal = ref(false)

const name = ref('')
const species = ref('dog')
const details = ref('')
const requirements = ref('')
const imageUrl = ref('')

const fetchMyAnimals = async () => {
  try {
    loading.value = true
    const res = await fetch('http://localhost:3000/animals', {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    const data = await res.json()
    myAnimals.value = data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleCreate = async () => {
  try {
    await fetch('http://localhost:3000/animals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        name: name.value,
        speciesId: species.value === 'dog' ? 1 : species.value === 'cat' ? 2 : 3,
        details: details.value,
        requirements: requirements.value,
        imageUrl: imageUrl.value || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400',
      }),
    })
    showCreateModal.value = false
    name.value = ''
    details.value = ''
    requirements.value = ''
    imageUrl.value = ''
    await fetchMyAnimals()
  } catch (err) {
    console.error(err)
  }
}

const handleDelete = async (id: number) => {
  if (!confirm('Are you sure you want to delete this animal?')) return
  try {
    await fetch(`http://localhost:3000/admin/animals/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    await fetchMyAnimals()
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.push('/auth')
  } else {
    fetchMyAnimals()
  }
})
</script>

<template>
  <div class="manage-animals-view">
    <div class="manage-header">
      <div>
        <h1 class="view-title">Manage Animals</h1>
        <p class="view-subtitle">Add, edit, or delete listings for rescue animals under your care.</p>
      </div>
      <button @click="showCreateModal = true" class="add-btn">
        🐾 Add Rescue Animal
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      Loading animals...
    </div>

    <div v-else-if="myAnimals.length > 0" class="animals-grid">
      <div v-for="animal in myAnimals" :key="animal.id" class="manage-card">
        <div class="image-wrapper">
          <img :src="animal.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400'" :alt="animal.name" class="animal-image" />
        </div>
        <div class="card-content">
          <h3 class="animal-name">{{ animal.name }}</h3>
          <p class="animal-details">{{ animal.details }}</p>
          <div class="card-actions">
            <button @click="handleDelete(animal.id)" class="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p class="empty-title">You haven't added any animals yet</p>
      <p class="empty-desc">Click the "Add Rescue Animal" button to get started!</p>
    </div>

    <!-- Create Animal Modal -->
    <div v-if="showCreateModal" class="modal-backdrop" @click="showCreateModal = false">
      <div class="modal-card" @click.stop>
        <h2 class="modal-title">Add Rescue Animal</h2>
        <form @submit.prevent="handleCreate" class="modal-form">
          <div class="form-group">
            <label for="animal-name">Name</label>
            <input id="animal-name" v-model="name" type="text" required placeholder="Fido" />
          </div>

          <div class="form-group">
            <label for="animal-species">Species</label>
            <select id="animal-species" v-model="species">
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label for="animal-details">Details</label>
            <textarea id="animal-details" v-model="details" required placeholder="Loving and playful pup..." rows="3"></textarea>
          </div>

          <div class="form-group">
            <label for="animal-requirements">Requirements</label>
            <input id="animal-requirements" v-model="requirements" type="text" required placeholder="Fenced yard required" />
          </div>

          <div class="form-group">
            <label for="animal-image">Image URL</label>
            <input id="animal-image" v-model="imageUrl" type="text" placeholder="https://..." />
          </div>

          <div class="modal-buttons">
            <button type="button" @click="showCreateModal = false" class="cancel-btn">Cancel</button>
            <button type="submit" class="submit-btn">Add Animal</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.manage-animals-view {
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px 16px;
}

.manage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.view-title {
  margin: 0 0 6px 0;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
}

.view-subtitle {
  margin: 0;
  font-size: 15px;
  color: #64748b;
}

.add-btn {
  background: #0284c7;
  color: #ffffff;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.add-btn:hover {
  background: #0369a1;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 48px 20px;
  background: #ffffff;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  margin: 20px 0;
}

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 6px 0;
}

.empty-desc {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.animals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.manage-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 180px;
  background-color: #f1f5f9;
}

.animal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
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

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
}

.delete-btn {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fee2e2;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.delete-btn:hover {
  background: #fee2e2;
}

/* Modal Styling */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-card {
  background: #ffffff;
  width: 100%;
  max-width: 500px;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-title {
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.form-group input, .form-group select, .form-group textarea {
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.cancel-btn {
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.submit-btn {
  background: #0284c7;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
