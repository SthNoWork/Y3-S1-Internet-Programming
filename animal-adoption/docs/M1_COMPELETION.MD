# Milestone 1 Completion Report

## 1. Requirements Checklist

- [x] **Wireframes:** Screen layouts planned for all primary views in `docs/wireframes/` and implemented across [`src/views/`](../src/views).
- [x] **Vue 3 + TypeScript:** Initialized via Vite with Composition API (`<script setup>`), TypeScript strict mode, and ESLint / Oxlint configuration.
- [x] **At Least 4 Routes:** 7 routes defined in [`src/router/index.ts`](../src/router/index.ts), including the detail view with dynamic route parameter (`/account/:id?`).
- [x] **Client-Side Validation:** Reactive form validation across [`SignUpView.vue`](../src/views/SignUpView.vue), [`LogInView.vue`](../src/views/LogInView.vue), and [`ManageView.vue`](../src/views/ManageView.vue).
- [x] **Pinia Store & Service Layer:** Asynchronous service layer in [`adoptionService.ts`](../src/services/adoptionService.ts) and reactive global store in [`adoptionStore.ts`](../src/stores/adoptionStore.ts).
- [x] **Loading, Empty, and Error States:** Graceful conditional rendering with `v-if`, `v-else-if`, and `v-else` across all data-fetching views.
- [x] **Conceptual Explanation:** Complete architectural breakdown explaining store state vs. component local state.

---

## 2. Wireframes (Only Screenshots of the Website)

The primary screens are implemented as dedicated Single File Components in [`src/views/`](../src/views):

1. **Home View ([`src/views/HomeView.vue`](../src/views/HomeView.vue)):**
   - Landing portal featuring a welcoming banner, featured pet highlights pulled from the store, a 3-step "How Paw Finder Works" guide, and a shelter onboarding banner.
2. **Search View ([`src/views/SearchView.vue`](../src/views/SearchView.vue)):**
   - Animal catalog with a pill search input, clear button, decorative animal track badge, dynamic search count, and a responsive grid of [`AnimalCard.vue`](../src/components/AnimalCard.vue) components.
3. **Map View ([`src/views/MapView.vue`](../src/views/MapView.vue)):**
   - Interactive Leaflet map centered on Phnom Penh with custom circular avatar pins for all 5 partner shelters, popup info showing available animal metrics, and direct links to shelter profiles.
4. **Account Detail View ([`src/views/AccountView.vue`](../src/views/AccountView.vue)):**
   - Detail view supporting dynamic parameter lookup (`/account/:id`). Displays shelter profile banner, contact info, bio, and all animals posted by that specific shelter.
5. **Manage View ([`src/views/ManageView.vue`](../src/views/ManageView.vue)):**
   - Authenticated poster dashboard allowing shelter owners to create, edit, and delete animal listings and manage profile details.
6. **Authentication Views ([`src/views/SignUpView.vue`](../src/views/SignUpView.vue), [`src/views/LogInView.vue`](../src/views/LogInView.vue)):**
   - Clean registration and sign-in cards with real-time field validation.

---

## 3. Vue Router Configuration

All application routes are defined in [`src/router/index.ts`](../src/router/index.ts) using `createRouter` and `createWebHistory`:

- **`GET /`:** Automatically redirects to `/home`.
- **`GET /home`:** Loads [`HomeView.vue`](../src/views/HomeView.vue).
- **`GET /search`:** Loads [`SearchView.vue`](../src/views/SearchView.vue).
- **`GET /map`:** Loads [`MapView.vue`](../src/views/MapView.vue).
- **`GET /account/:id?`:** Loads [`AccountView.vue`](../src/views/AccountView.vue) with an optional `:id` dynamic route parameter for viewing specific shelter accounts or the logged-in user.
- **`GET /manage`:** Loads [`ManageView.vue`](../src/views/ManageView.vue) (protected by auth state).
- **`GET /signup`:** Loads [`SignUpView.vue`](../src/views/SignUpView.vue).
- **`GET /login`:** Loads [`LogInView.vue`](../src/views/LogInView.vue).

---

## 4. Mock API & Service Layer

### Service Layer ([`src/services/adoptionService.ts`](../src/services/adoptionService.ts))

- Encapsulates network operations away from UI components.
- Provides typed asynchronous functions: `fetchAnimals(simulateError?: boolean)` and `fetchAccountById(id: number, simulateError?: boolean)`.
- Implements a simulated 300ms network delay using JavaScript Promises and `setTimeout` to mimic realistic REST API latency, with error throwing when requested.

### Pinia Store ([`src/stores/adoptionStore.ts`](../src/stores/adoptionStore.ts))

- Serves as the single source of truth across all views.
- **State:**
  - `animals: Ref<Animal[]>` - Catalog of all adoptable animals.
  - `accounts: Ref<Record<number, Account>>` - Registry of all registered shelters.
  - `privateAccount: Ref<Account | null>` - Currently authenticated user profile.
  - `loading: Ref<boolean>` - Global asynchronous fetching flag.
  - `error: Ref<string | null>` - Error message if network request fails.
- **Actions:**
  - `loadAnimals()` - Triggers service call, toggles `loading`, sets `animals`, and captures any errors.
  - `loadAccount(id)` - Loads single account record into state.
  - Account authentication and animal CRUD actions (`login`, `signup`, `addAnimal`, `updateAnimal`, `deleteAnimal`).

---

## 5. Client-Side Form Validation

Forms employ reactive validation returning instant inline feedback under invalid inputs:

1. **Sign Up Form ([`src/views/SignUpView.vue`](../src/views/SignUpView.vue)):**
   - Validates required organization/user name (minimum 2 characters).
   - Validates valid email format via RFC regular expression.
   - Enforces password minimum length of 6 characters.
   - Enforces confirmation password matching.
2. **Log In Form ([`src/views/LogInView.vue`](../src/views/LogInView.vue)):**
   - Validates email presence and email formatting.
   - Validates password presence.
   - Verifies credentials against local mock registry and sets authentication state.
3. **Animal Management Form ([`src/views/ManageView.vue`](../src/views/ManageView.vue)):**
   - Validates animal name length (minimum 2 characters).
   - Validates species selection dropdown.
   - Validates age as a non-negative number.
   - Validates adoption requirement description length (minimum 10 characters).

---

## 6. UI Lifecycle States (Loading, Empty, and Error)

Data-driven views conditionally render distinct UI layouts depending on store status using `v-if`, `v-else-if`, and `v-else`:

- **Loading State:**
  - Displayed when `store.loading === true` (e.g. animated spinner or "Loading animals..." message).
  - Visible in [`SearchView.vue`](../src/views/SearchView.vue), [`AccountView.vue`](../src/views/AccountView.vue), and [`MapView.vue`](../src/views/MapView.vue).
- **Empty State:**
  - Displayed when data array is empty or when search query yields zero matches (e.g., "No animals match your search" with clear filter button in [`SearchView.vue`](../src/views/SearchView.vue), or "No animals listed yet" in [`AccountView.vue`](../src/views/AccountView.vue)).
- **Error State:**
  - Displayed when `store.error` contains an error message (e.g., red error banner with retry button in [`SearchView.vue`](../src/views/SearchView.vue)).
- **Success State:**
  - Displayed upon valid form submission (e.g., green confirmation banner in [`ManageView.vue`](../src/views/ManageView.vue)).

---

## 7. Concept Explanation: Store State vs. Component State

### **State that lives inside a store (Pinia):**

- **What:** Shared domain records and global network status:
  - The animal catalog (`animals`), registered shelter profiles (`accounts`), the currently logged-in account (`privateAccount`), and data fetching status flags (`loading`, `error`).
- **Why:** Multiple disconnected pages ([`SearchView.vue`](../src/views/SearchView.vue), [`MapView.vue`](../src/views/MapView.vue), [`AccountView.vue`](../src/views/AccountView.vue), and [`NavHeader.vue`](../src/components/NavHeader.vue)) require access to the exact same information. Centralizing this data in Pinia:
  1. Establishes a **single source of truth** so all views stay in sync when an animal or account is added/edited.
  2. Eliminates **prop drilling** across unrelated component trees.
  3. **Preserves loaded data** across route navigation so records don't need to be refetched on every page click.

### **State that stays inside a component:**

- **What:** Private, temporary, and localized UI state:
  - Form field inputs (`form.name`, `form.email`), client-side validation errors (`errors`), local submission banners (`submitted`), dropdown toggles, and component-specific visual elements (such as `backgroundPaws` in [`App.vue`](../src/App.vue)).
- **Why:** Other views have no need for intermediate, unfinished inputs:
  1. **Encapsulation:** Neither [`HomeView.vue`](../src/views/HomeView.vue) nor [`MapView.vue`](../src/views/MapView.vue) needs to know what characters the user is currently typing in [`ManageView.vue`](../src/views/ManageView.vue).
  2. **Automatic Cleanup:** When the user navigates away from a form, the component unmounts and its local memory is automatically released, preventing global store bloat.
