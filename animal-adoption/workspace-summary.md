# Workspace Summary

## Stack & Commands

- Runtime: Node.js (>=22.18.0 || >=24.12.0), TypeScript 6.0 (strict mode)
- Frontend: Vue 3.5 (Composition API, `<script setup>`), Vite 8, Vue Router 5, Pinia 4, Leaflet 1.9
- Dev: `npm run dev`
- Build: `npm run build`
- Type-check: `npm run type-check` or `npx vue-tsc --noEmit`
- Lint: `npm run lint` (`oxlint` + `eslint`)
- Format: `npm run format`

## Architecture & Boundaries

- **AGENT DIRECTIVE:** Read `src/` first. Do NOT inspect root configs, `backend/`, `e2e/`, or other directories unless task explicitly requires it.
- `src/` - Core frontend Vue 3 application source code.
- `src/components/` - Reusable UI widgets (`AnimalCard`, `SearchBar`, `NavHeader`).
- `src/views/` - Route page components (`HomeView`, `SearchView`, `MapView`, `AccountView`, `ManageView`).
- `src/router/` - Vue Router configuration and route declarations.
- `src/stores/` - Pinia state management stores (`adoptionStore`, `counter`).
- `src/services/` - Async API client and mock data layer.
- `src/types/` - TypeScript interface declarations (`animal.ts`).
- `src/data/` - Static mock fixtures and seed data (`animals.ts`).
- `docs/` - Project documentation, wireframes, and deliverables.
- `backend/` - NestJS REST API (future milestone).

## File Map

- `src/main.ts` - Application entry point; mounts Pinia and Vue Router to root app.
- `src/App.vue` - Root layout; renders navigation header and `<RouterView />`.
- `src/components/NavHeader.vue` - Top navigation bar with links; conditionally shows `/manage` when logged in.
- `src/components/AnimalCard.vue` - Card displaying animal bio, tags, shelter link, and optional `@edit` button.
- `src/components/SearchBar.vue` - Search input field for filtering animals by name.
- `src/views/HomeView.vue` - Landing page with app description.
- `src/views/SearchView.vue` - Search and filter page listing animal cards.
- `src/views/MapView.vue` - Leaflet interactive map displaying account location pins.
- `src/views/AccountView.vue` - Account detail page showing profile info, animals, and empty/not-found states.
- `src/views/SignUpView.vue` - Account registration form with reactive client-side validation.
- `src/views/LogInView.vue` - Account authentication with reactive client-side validation.
- `src/views/ManageView.vue` - Poster dashboard protected by auth redirect with profile and animal CRUD forms.
- `src/router/index.ts` - Route definitions (`/home`, `/search`, `/map`, `/accounts/:id`, `/manage`).
- `src/types/animal.ts` - Data types for `Animal`, `User`/`Account`, `Tag`, `Species`.
- `src/types/account.ts` - Interface for `Account` (`name`, `email`, `password`, `description`, etc.).
- `src/data/animals.ts` - Mock data fixtures for animals and species lookups.
- `src/data/accounts.ts` - Mock `ACCOUNTS` map fixtures.
- `MD/PROPOSAL.md` - System requirements, user stories, MVP scope, and entity relationships.
- `MD/goal.md` - 7-day study guide and milestone checklist for Frontend Prototype (M1).
- `MD/vue-defines-guide.md` - Guide for `defineProps`, `defineEmits`, and `defineModel` patterns and examples.
- `src/services/adoptionService.ts` - Mock async API service (`getAnimals`, `getAccountById`).
- `src/stores/adoptionStore.ts` - Pinia adoption store (`animals`, `publicAccount`, `privateAccount`, `myAnimals`, `loading`, `error`, `loadAnimals`, `loadAccount`).

## Symbol Index

- `Account` (`src/types/account.ts#L1-L14`) - Entity interface (id, name, email, password, description, profileImageUrl, coverImageUrl, phone, notes, latitude, longitude, banned)
- `Animal` (`src/types/animal.ts#L1-L16`) - Entity interface (id, accountId, name, speciesId, age, gender, status, description, requirement, categoryIds, thumbnail/image URLs)
- `ANIMALS` (`src/data/animals.ts#L6-L123`) - Mock array of 10 animal records
- `SPECIES_BY_ID` (`src/data/animals.ts#L125-L130`) - Record mapping species id to name
- `CATEGORY_NAMES_BY_ID` (`src/data/animals.ts#L132-L141`) - Record mapping category/tag id to label
- `router` (`src/router/index.ts#L9-L37`) - VueRouter instance configured with WebHistory
- `GET /` -> Redirect to `/home`
- `GET /home` -> `HomeView`
- `GET /search` -> `SearchView`
- `GET /map` -> `MapView`
- `GET /accounts/:id` -> `AccountView`
- `GET /manage` -> `ManageView`
