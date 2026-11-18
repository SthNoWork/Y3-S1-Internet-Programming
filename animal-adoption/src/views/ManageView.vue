<script setup lang="ts">
import AnimalCard from '@/components/AnimalCard.vue';
import ProfileCard from '@/components/ProfileCard.vue';
import { ACCOUNTS } from '@/data/accounts';
import { SPECIES_BY_ID } from '@/data/animals';
import router from '@/router';
import { useAdoptionStore } from '@/stores/adoptionStore';
import type { Account } from '@/types/account';
import type { Animal } from '@/types/animal';
import { onMounted, reactive, ref, watch } from 'vue';

const store = useAdoptionStore()
const isEditing = ref(false)

onMounted(() => {
  if (!store.privateAccount) {
    router.push('/login')
    return
  }
  store.loadAnimals()
})

const editForm = reactive<Partial<Account>>({ ...store.privateAccount })
const profileErrors = reactive({
  name: '',
  email: '',
  password: ''
})

watch(isEditing, (editing) => {
  if (editing && store.privateAccount) {
    Object.assign(editForm, store.privateAccount)
    profileErrors.name = ''
    profileErrors.email = ''
    profileErrors.password = ''
  }
})

function validateProfile(): boolean {
  profileErrors.name = ''
  profileErrors.email = ''
  profileErrors.password = ''

  let isValid = true
  if (!editForm.name?.trim()) {
    profileErrors.name = 'Name is required'
    isValid = false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!editForm.email || !emailRegex.test(editForm.email)) {
    profileErrors.email = 'Please provide a valid email'
    isValid = false
  }
  if (!editForm.password || editForm.password.length < 6) {
    profileErrors.password = 'Password must be at least 6 characters'
    isValid = false
  }
  return isValid
}

function saveProfile() {
  if (!validateProfile()) return
  if (store.privateAccount) {
    Object.assign(store.privateAccount, editForm)
    localStorage.setItem('accounts', JSON.stringify(ACCOUNTS))
  }
  isEditing.value = false
}

function createBlankAnimal(): Partial<Animal> {
  return {
    name: '',
    age: 0,
    gender: 'male',
    speciesId: 1,
    status: 'available',
    description: '',
    requirement: '',
    thumbnailUrl: '',
    imageUrls: [],
    categoryIds: [1],
    isVaccinated: false,
    isNeutered: false,
  }
}

const animalForm = reactive<Partial<Animal>>(createBlankAnimal())
const isEditingAnimal = ref(false)
const animalErrors = reactive({
  name: '',
  age: '',
  requirement: ''
})

function validateAnimal(): boolean {
  animalErrors.name = ''
  animalErrors.age = ''
  animalErrors.requirement = ''

  let isValid = true
  if (!animalForm.name?.trim()) {
    animalErrors.name = 'Animal name is required'
    isValid = false
  }
  if (animalForm.age === undefined || animalForm.age === null || Number(animalForm.age) < 0) {
    animalErrors.age = 'Age must be 0 or greater'
    isValid = false
  }
  if (!animalForm.requirement?.trim() || animalForm.requirement.length < 5) {
    animalErrors.requirement = 'Please specify requirements (at least 5 characters)'
    isValid = false
  }
  return isValid
}

function startEditAnimal(animal: Animal) {
  isEditingAnimal.value = true
  Object.assign(animalForm, animal)
  animalErrors.name = ''
  animalErrors.age = ''
  animalErrors.requirement = ''
}

function resetAnimalForm() {
  isEditingAnimal.value = false
  const blank = createBlankAnimal()
  Object.assign(animalForm, blank)
  delete animalForm.id
  delete animalForm.accountId
  animalErrors.name = ''
  animalErrors.age = ''
  animalErrors.requirement = ''
}

function saveAnimal() {
  if (!validateAnimal()) return
  if (!store.privateAccount) return

  if (animalForm.id) {
    const index = store.animals.findIndex((a) => a.id === animalForm.id)
    const target = store.animals[index]
    if (target) {
      Object.assign(target, animalForm)
    }
  } else {
    const newAnimal: Animal = {
      id: Date.now(),
      accountId: store.privateAccount.id,
      name: animalForm.name || '',
      age: Number(animalForm.age) || 0,
      gender: animalForm.gender || 'male',
      speciesId: Number(animalForm.speciesId) || 1,
      status: animalForm.status || 'available',
      description: animalForm.description || '',
      requirement: animalForm.requirement || '',
      thumbnailUrl: animalForm.thumbnailUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400',
      imageUrls: animalForm.imageUrls || [],
      categoryIds: animalForm.categoryIds || [1],
      isVaccinated: Boolean(animalForm.isVaccinated),
      isNeutered: Boolean(animalForm.isNeutered),
    }
    store.animals.unshift(newAnimal)
  }
  resetAnimalForm()
}

function deleteAnimal(id: number) {
  const index = store.animals.findIndex((a) => a.id === id)
  if (index !== -1) {
    store.animals.splice(index, 1)
  }
  if (animalForm.id === id) {
    resetAnimalForm()
  }
}
</script>

<template>
  <main class="manage-page">
    <h2>Welcome to manage page</h2>
    <ProfileCard v-if="store.privateAccount" :account="store.privateAccount" :enableEditBtn="true" v-model="isEditing">
    </ProfileCard>
    <form v-if="isEditing" @submit.prevent="saveProfile" novalidate>
      <div class="field">
        <input v-model="editForm.name" type="text" placeholder="Name">
        <span v-if="profileErrors.name" class="error-text">{{ profileErrors.name }}</span>
      </div>
      <div class="field">
        <input v-model="editForm.email" type="email" placeholder="Email">
        <span v-if="profileErrors.email" class="error-text">{{ profileErrors.email }}</span>
      </div>
      <div class="field">
        <input v-model="editForm.password" type="password" placeholder="Password">
        <span v-if="profileErrors.password" class="error-text">{{ profileErrors.password }}</span>
      </div>
      <input v-model="editForm.phone" type="tel" placeholder="Phone">
      <input v-model="editForm.profileImageUrl" type="url" placeholder="Profile Image URL">
      <input v-model="editForm.coverImageUrl" type="url" placeholder="Cover Image URL">
      <textarea v-model="editForm.description" placeholder="Description"></textarea>
      <textarea v-model="editForm.notes" placeholder="Notes"></textarea>
      <div class="location-picker">
        <span>Location: {{ editForm.latitude && editForm.longitude ? `${editForm.latitude}, ${editForm.longitude}` :
          'Not set' }}</span>
        <button type="button" disabled>Pick on Map (Coming Soon)</button>
      </div>
      <button type="submit">Save</button>
    </form>

    <div></div>
    <section class="animal-section">
      <h3>{{ isEditingAnimal ? `Edit Animal: ${animalForm.name || ''}` : 'Post an Animal' }}</h3>
      <form @submit.prevent="saveAnimal" class="animal-form" novalidate>
        <div class="field">
          <input v-model="animalForm.name" type="text" placeholder="Animal Name">
          <span v-if="animalErrors.name" class="error-text">{{ animalErrors.name }}</span>
        </div>
        <div class="field">
          <input v-model.number="animalForm.age" type="number" min="0" placeholder="Age (years)">
          <span v-if="animalErrors.age" class="error-text">{{ animalErrors.age }}</span>
        </div>

        <div class="row">
          <label>Gender:</label>
          <select v-model="animalForm.gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <label>Species:</label>
          <select v-model.number="animalForm.speciesId">
            <option v-for="(name, id) in SPECIES_BY_ID" :key="id" :value="Number(id)">{{ name }}</option>
          </select>

          <label>Status:</label>
          <select v-model="animalForm.status">
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="adopted">Adopted</option>
          </select>
        </div>

        <input v-model="animalForm.thumbnailUrl" type="url" placeholder="Photo URL">
        <textarea v-model="animalForm.description" placeholder="Description"></textarea>
        <div class="field">
          <input v-model="animalForm.requirement" type="text" placeholder="Special Requirements (e.g. Needs a yard)">
          <span v-if="animalErrors.requirement" class="error-text">{{ animalErrors.requirement }}</span>
        </div>

        <div class="checkbox-row">
          <label><input type="checkbox" v-model="animalForm.isVaccinated"> Vaccinated</label>
          <label><input type="checkbox" v-model="animalForm.isNeutered"> Neutered</label>
        </div>

        <div class="form-buttons">
          <button type="submit">{{ isEditingAnimal ? 'Update Animal' : 'Post Animal' }}</button>
          <button v-if="isEditingAnimal" type="button" @click="resetAnimalForm">Cancel</button>
          <button v-if="isEditingAnimal && animalForm.id" type="button" class="delete-btn"
            @click="deleteAnimal(animalForm.id)">Delete</button>
        </div>
      </form>
    </section>

    <div class="animal-grid">
      <AnimalCard v-for="x in store.myAnimals" :key="x.id" :animal="x" :enableEditBtn="true"
        @edit="startEditAnimal(x)" />
    </div>
  </main>
</template>

<style scoped>
.manage-page {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

h2 {
  align-self: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

form input,
form textarea {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  outline: none;
}

.location-picker {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.error-text {
  color: #dc2626;
  font-size: 0.85rem;
}

.animal-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
  padding: 1rem;
  border-radius: 0.5rem;
}

.animal-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.row,
.checkbox-row,
.form-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.delete-btn {
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.animal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}
</style>
