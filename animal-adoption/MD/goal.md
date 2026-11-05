# 7-Day Study Guide & Goal Checklist: Milestone 1 Frontend Prototype

> **Deadline:** 7 Days  
> **Target:** Deliver all 6 checklist items for Milestone 1 + conceptual explanation.  
> **Reference Architecture:** Follows [`PROPOSAL.md`](PROPOSAL.md). The detail page with a route parameter is `/accounts/:id` (Account/Shelter profile). Animal cards do not have their own detail view; they display info directly and link visitors to the shelter account page.

---

## M1 Requirements Checklist Tracker

- [ ] **Wireframes** (photo or tool) of main screens in `docs/`
- [ ] **Vue 3 + TypeScript** app created with Vite; strict mode on; ESLint passes (`npm run lint`)
- [ ] **At least 4 routes**, including a detail page with a route parameter (`/accounts/:id`)
- [ ] **At least one form** with client-side validation (in `ManageView.vue`)
- [x] **A Pinia store & service layer** calling a mock API (simulated latency + error handling)
- [x] **Loading, empty and error states** visible in the UI
- [ ] **Concept Explanation:** What state lives in the store and what stays inside a component? Why?

---

## Daily Schedule

### Day 1: Clean Linting & Wireframes in `docs/`

#### 1. Learn & Review
- **Topics:** Vue 3 TypeScript strictness; ESLint / Oxlint `no-unused-vars` rules; Quick wireframing tools (Excalidraw, Figma, or pen-and-paper scan).
- **Core Goal:** Fix current linter errors so `npm run lint` is clean, and generate wireframes for the 4 primary views.

#### 2. Files to Touch
- **Edit:** `src/data/animals.ts`
  - **Remove:** Unused `Category, Species` imports from line 2.
- **Create:** `docs/wireframes/`
  - **Add:** Screenshots/drawings of main screens:
    - `docs/wireframes/search-view.png` (Search + filters + animal cards)
    - `docs/wireframes/account-detail.png` (Shelter profile, contact details, poster's animals)
    - `docs/wireframes/map-view.png` (Pins per shelter location)
    - `docs/wireframes/manage-form.png` (Poster "Add Animal" form with validation errors)
  - **Add:** `docs/README.md` linking to these wireframe images.

#### 3. Code Example (Fixing `src/data/animals.ts`)
```typescript
// src/data/animals.ts - Line 2
// Replace: import type { Animal, Category, Species } from '@/types/animal'
// With:
import type { Animal } from '@/types/animal'
```

#### 4. Day 1 Done Checklist
- [ ] Ran `npm run lint` and it exited with code 0 (no errors, no warnings).
- [ ] Created `docs/wireframes/` containing images for Search, Account Detail, Map, and Manage.

---

### Day 2: Account Detail Route (`/accounts/:id`) & Card Navigation

#### 1. Learn & Review
- **Topics:** Vue Router 5 dynamic route matching (`:id`); `useRoute()` composition API; type-safe route params.
- **Concepts:** Per [`PROPOSAL.md`](PROPOSAL.md), animal cards give immediate information, and their link points to `/accounts/:id` (the shelter/poster account).

#### 2. Files to Touch
- **Edit:** `src/types/animal.ts`
  - **Add:** Ensure `Animal` interface contains `userId: number` and add `Account` (or `User`) interface.
- **Edit:** `src/data/animals.ts`
  - **Add:** Ensure animals have a `userId` property.
  - **Add:** Export mock `ACCOUNTS` array with mock contact info and locations.
- **Edit:** `src/router/index.ts`
  - **Update:** Replace static `/account` with dynamic path `/accounts/:id`.
- **Edit:** `src/components/AnimalCard.vue`
  - **Update:** Change `<RouterLink to="/account">` to `:to="'/accounts/' + animal.userId"`.
- **Edit:** `src/views/AccountView.vue`
  - **Update:** Use `useRoute()` to read `route.params.id` and display the shelter's details.

#### 3. Code Example

**In `src/router/index.ts`:**
```typescript
{
  path: '/accounts/:id',
  name: 'account-detail',
  component: () => import('@/views/AccountView.vue'),
}
```

**In `src/components/AnimalCard.vue`:**
```vue
<RouterLink :to="`/accounts/${animal.userId}`" class="shelter-link">
  Contact Shelter
</RouterLink>
```

**In `src/views/AccountView.vue`:**
```vue
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const accountId = computed(() => Number(route.params.id))
</script>

<template>
  <div class="account-page">
    <h2>Shelter Account #{{ accountId }}</h2>
  </div>
</template>
```

#### 4. Day 2 Done Checklist
- [ ] Navigating to `/accounts/1` displays AccountView reading ID `1`.
- [ ] Clicking "Contact Shelter" on an animal card navigates to `/accounts/:id`.
- [ ] At least 4 routes are registered in `src/router/index.ts`: `/home`, `/search`, `/map`, `/accounts/:id`, `/manage`.

---

### Day 3: Mock API & Service Layer

#### 1. Learn & Review
- **Topics:** The Service Layer pattern in frontend apps; simulating asynchronous API requests using Promises and `setTimeout`; handling network rejections.
- **Goal:** Decouple components and stores from raw data arrays so swapping to a real NestJS REST API later requires zero component changes.

#### 2. Files to Touch
- **Create:** `src/services/adoptionService.ts`
  - **Add:** Methods:
    - `fetchAnimals(): Promise<Animal[]>`
    - `fetchAccountById(id: number): Promise<{ account: Account; animals: Animal[] }>`
    - Simulated delay (e.g. 500ms `setTimeout`).
    - Optional error trigger parameter to test error states.

#### 3. Code Example (`src/services/adoptionService.ts`)
```typescript
import { ANIMALS } from '@/data/animals'
import type { Animal } from '@/types/animal'

const DELAY_MS = 600

export const adoptionService = {
  async fetchAnimals(simulateError = false): Promise<Animal[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (simulateError) {
          reject(new Error('Failed to load animals. Please try again.'))
        } else {
          resolve([...ANIMALS])
        }
      }, DELAY_MS)
    })
  },

  async fetchAccountById(userId: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const animals = ANIMALS.filter((a) => a.userId === userId)
        resolve({
          id: userId,
          name: `Shelter Partner #${userId}`,
          location: 'San Francisco, CA',
          email: `shelter${userId}@example.com`,
          phone: '(555) 019-2834',
          animals,
        })
      }, DELAY_MS)
    })
  },
}
```

#### 4. Day 3 Done Checklist
- [x] `src/services/adoptionService.ts` created and exports typed async functions.
- [ ] `npx vue-tsc --noEmit` passes without type errors.

---

### Day 4: Pinia Store Architecture

#### 1. Learn & Review
- **Topics:** Pinia setup stores (`defineStore` with `<script setup>` syntax); store state, getters, and actions; store state vs. component local state.
- **Concept Write-Up Prep:** Formulate the answer to the required milestone question:
  - *Store State:* Shared domain entities (animals, active account, search query).
  - *Component State:* Ephemeral UI (isDropdownOpen, form validation errors before submit).

#### 2. Files to Touch
- **Create:** `src/stores/adoptionStore.ts`
  - **Add:** State: `animals`, `currentAccount`, `loading`, `error`.
  - **Add:** Actions: `loadAnimals()`, `loadAccount(id: number)`.
- **Remove:** `src/stores/counter.ts` (cleanup unused boilerplate).

#### 3. Code Example (`src/stores/adoptionStore.ts`)
```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adoptionService } from '@/services/adoptionService'
import type { Animal } from '@/types/animal'

export const useAdoptionStore = defineStore('adoption', () => {
  const animals = ref<Animal[]>([])
  const currentAccount = ref<any | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  async function loadAnimals(simulateError = false) {
    loading.value = true
    error.value = null
    try {
      animals.value = await adoptionService.fetchAnimals(simulateError)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      animals.value = []
    } finally {
      loading.value = false
    }
  }

  async function loadAccount(id: number) {
    loading.value = true
    error.value = null
    try {
      currentAccount.value = await adoptionService.fetchAccountById(id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load account'
    } finally {
      loading.value = false
    }
  }

  return {
    animals,
    currentAccount,
    loading,
    error,
    loadAnimals,
    loadAccount,
  }
})
```

#### 4. Day 4 Done Checklist
- [x] Pinia store handles `loading`, `error`, and `animals` states.
- [x] Store actions call the service layer instead of importing data directly.

---

### Day 5: Loading, Empty, and Error UI States

#### 1. Learn & Review
- **Topics:** Conditional rendering in Vue 3 (`v-if`, `v-else-if`, `v-else`); skeleton loaders and accessible status messages.
- **Goal:** Make loading spinners, error alerts (with retry buttons), and empty result messages visible and interactive.

#### 2. Files to Touch
- **Edit:** `src/views/SearchView.vue`
  - **Remove:** Direct import of `ANIMALS`.
  - **Add:** Import and invoke `useAdoptionStore()`.
  - **Add:** Template blocks for:
    1. Loading state (`v-if="store.loading"`)
    2. Error state (`v-else-if="store.error"` with a Retry button)
    3. Empty state (`v-else-if="store.animals.length === 0"`)
    4. Data display (`v-else` with `AnimalCard` loop)
- **Edit:** `src/views/AccountView.vue`
  - **Add:** Equivalent loading, error, and empty state templates when viewing a shelter account.

#### 3. Code Example (`src/views/SearchView.vue`)
```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import AnimalCard from '@/components/AnimalCard.vue'
import { useAdoptionStore } from '@/stores/adoptionStore'

const store = useAdoptionStore()

onMounted(() => {
  store.loadAnimals()
})
</script>

<template>
  <div class="search-page">
    <h2>Available Animals</h2>
    <SearchBar />

    <!-- 1. Loading State -->
    <div v-if="store.loading" class="state-box loading">
      <p>⏳ Loading animals from shelter network...</p>
    </div>

    <!-- 2. Error State -->
    <div v-else-if="store.error" class="state-box error">
      <p>⚠️ {{ store.error }}</p>
      <button @click="store.loadAnimals(false)">Try Again</button>
    </div>

    <!-- 3. Empty State -->
    <div v-else-if="store.animals.length === 0" class="state-box empty">
      <p>No animals currently available matching your criteria.</p>
    </div>

    <!-- 4. Success State -->
    <div v-else class="cards-grid">
      <AnimalCard v-for="animal in store.animals" :key="animal.id" :animal="animal" />
    </div>
  </div>
</template>
```

#### 4. Day 5 Done Checklist
- [x] Loading state appears when fetching data.
- [x] Empty state renders when the array is empty.
- [x] Error banner displays on rejection with a functioning retry mechanism.

---

### Day 6: Client-Side Form Validation

#### 1. Learn & Review
- **Topics:** Controlled forms in Vue 3 (`v-model`); client-side validation logic; error display and blocking submission (`@submit.prevent`).
- **Use Case:** Poster "Post an Animal" form in `src/views/ManageView.vue` (User Story 5 from [`PROPOSAL.md`](PROPOSAL.md)).

#### 2. Files to Touch
- **Edit:** `src/views/ManageView.vue`
  - **Add:** Form fields:
    - Animal Name (required, min 2 chars)
    - Species (required selection)
    - Age (required, number >= 0)
    - Contact Email (required, valid email pattern)
    - Description / Requirements (required, min 10 chars)
  - **Add:** Reactive `form` model and reactive `errors` record.
  - **Add:** Validation function returning boolean.
  - **Add:** Success confirmation banner upon valid submission.

#### 3. Code Example (`src/views/ManageView.vue`)
```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive({
  name: '',
  speciesId: '',
  age: '',
  email: '',
  requirement: '',
})

const errors = reactive<Record<string, string>>({})
const submitted = ref(false)

function validateForm(): boolean {
  Object.keys(errors).forEach((key) => delete errors[key])

  if (!form.name.trim() || form.name.length < 2) {
    errors.name = 'Animal name is required (at least 2 characters).'
  }
  if (!form.speciesId) {
    errors.speciesId = 'Please select a species.'
  }
  if (form.age === '' || Number(form.age) < 0) {
    errors.age = 'Age must be a valid non-negative number.'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email || !emailRegex.test(form.email)) {
    errors.email = 'Please provide a valid contact email.'
  }
  if (!form.requirement.trim() || form.requirement.length < 10) {
    errors.requirement = 'Please describe requirements (at least 10 characters).'
  }

  return Object.keys(errors).length === 0
}

function handleSubmit() {
  if (!validateForm()) return
  submitted.value = true
}
</script>

<template>
  <div class="manage-page">
    <h2>Post an Animal for Adoption</h2>

    <div v-if="submitted" class="success-banner">
      Animal "{{ form.name }}" posted successfully!
    </div>

    <form v-else @submit.prevent="handleSubmit" novalidate>
      <div class="form-group">
        <label for="name">Animal Name *</label>
        <input id="name" v-model="form.name" type="text" />
        <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label for="species">Species *</label>
        <select id="species" v-model="form.speciesId">
          <option value="">Select species</option>
          <option value="1">Dog</option>
          <option value="2">Cat</option>
          <option value="3">Rabbit</option>
        </select>
        <span v-if="errors.speciesId" class="error-text">{{ errors.speciesId }}</span>
      </div>

      <div class="form-group">
        <label for="age">Age (years) *</label>
        <input id="age" v-model="form.age" type="number" min="0" />
        <span v-if="errors.age" class="error-text">{{ errors.age }}</span>
      </div>

      <div class="form-group">
        <label for="email">Contact Email *</label>
        <input id="email" v-model="form.email" type="email" />
        <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label for="requirement">Adoption Requirements *</label>
        <textarea id="requirement" v-model="form.requirement" rows="3"></textarea>
        <span v-if="errors.requirement" class="error-text">{{ errors.requirement }}</span>
      </div>

      <button type="submit">Submit Animal</button>
    </form>
  </div>
</template>

<style scoped>
.error-text {
  color: #dc2626;
  font-size: 0.875rem;
}
.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
</style>
```

#### 4. Day 6 Done Checklist
- [ ] Submitting empty fields displays inline error messages under each invalid input.
- [ ] Valid submission blocks error triggers and displays success state.

---

### Day 7: Milestone Audit & Conceptual Write-Up

#### 1. Conceptual Explanation Deliverable
Ensure the following explanation is ready in your presentation or `docs/m1-explanation.md`:

> **What state lives in the store and what stays inside a component? Why?**
>
> - **Store State (Global / Domain):**
>   - *What:* The shared animals catalog, shelter account profile, active filter parameters, and asynchronous network status (`loading`, `error`).
>   - *Why:* Multiple disconnected views (`SearchView`, `AccountView`, `MapView`) require access to the same records. Centralizing this data in Pinia ensures a single source of truth, eliminates prop drilling, and preserves data across route transitions.
>
> - **Component State (Local / Ephemeral):**
>   - *What:* Form input values (`form.name`, `form.email`), validation error messages (`errors`), dropdown toggles, and UI modal flags.
>   - *Why:* Other pages do not need access to unfinished form entries or transient UI state. Keeping them local enforces component encapsulation and frees memory automatically when the component unmounts.

#### 2. Verification Commands
Run each command from the workspace root:
```bash
# 1. Lint check (must exit 0)
npm run lint

# 2. Strict TypeScript check (must exit 0)
npx vue-tsc --noEmit

# 3. Production build test
npm run build
```

#### 4. Final Audit Checklist
- [ ] Wireframes exist in `docs/wireframes/`
- [ ] Strict mode enabled, `npm run lint` passes
- [ ] 5 routes working including `/accounts/:id` with dynamic route parameter
- [ ] Client-side validated form in `ManageView.vue`
- [ ] Pinia store + service layer with mock API
- [ ] Loading, empty, and error UI states visible
- [ ] Conceptual explanation completed

