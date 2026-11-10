# Workspace Summary

## Stack & Commands

- Runtime: Node.js (>=22.18.0 || >=24.12.0), TypeScript 6.0 (strict mode)
- Frontend: Vue 3.5 (Composition API, `<script setup>`), Vite 8, Vue Router 5, Pinia 4, Leaflet 1.9
- Dev: `npm run dev` (configured with `server.allowedHosts: true` for tunneling)
- Build: `npm run build`
- Type-check: `npm run type-check` or `npx vue-tsc --noEmit`
- Lint: `npm run lint` (`oxlint` + `eslint`)
- Format: `npm run format`

## Architecture & Boundaries

- **AGENT DIRECTIVE:** Read `src/` first. Do NOT inspect root configs, `backend/`, `e2e/`, or other directories unless task explicitly requires it.
- `src/` - Core frontend Vue 3 application source code.
- `src/components/` - Reusable UI widgets (`AnimalCard`, `SearchBar`, `NavHeader`, `ProfileCard`).
- `src/views/` - Route page components (`HomeView`, `SearchView`, `MapView`, `AccountView`, `ManageView`, `SignUpView`, `LogInView`).
- `src/router/` - Vue Router configuration and route declarations.
- `src/stores/` - Pinia state management stores (`adoptionStore`, `counter`).
- `src/services/` - Async API client and mock data layer.
- `src/types/` - TypeScript interface declarations (`animal.ts`, `account.ts`).
- `src/data/` - Static mock fixtures and seed data (`animals.ts`, `accounts.ts`, `species.ts`, `categories.ts`).
- `src/utils/` - Shared helper utilities (`date.ts`).
- `docs/` - Project documentation, wireframes, and deliverables.
- `backend/` - NestJS REST API (future milestone).

## File Map

- `src/main.ts` - Application entry point; mounts Pinia and Vue Router to root app.
- `src/App.vue` - Root layout; renders navigation header, `<RouterView />`, `<Footer />`, and absolute full-document background paw layer.
- `src/components/NavHeader.vue` - Top navigation bar with cat PawIcon brand logo and route links; conditionally shows `/manage` when logged in.
- `src/components/Footer.vue` - Global page footer with branding, links, and student disclaimer.
- `src/components/ProfileCard.vue` - Poster and shelter profile card widget with responsive avatar, details, and map deep-link.
- `src/components/AnimalCard.vue` - Card displaying animal bio, tags, shelter link, formatted age, and optional `@edit` button.
- `src/views/HomeView.vue` - Landing page with hero banner, 3 featured animals, how-it-works guide, and shelter rehoming banner.
- `src/components/icons/PawIcon.vue` - Configurable SVG animal track icon supporting dog, cat, and bird with custom size, color, and rotation.
- `src/views/SearchView.vue` - Search page with decorative animal quote and paw print cluster, pill search input with clear button, and result counts.
- `src/views/MapView.vue` - Leaflet interactive map with shelter pins, popup details, and `?accountId` deep-link auto-pan focus.
- `src/views/AccountView.vue` - Account detail page showing profile info, animals, and empty/not-found states.
- `src/views/SignUpView.vue` - Account registration form with reactive client-side validation.
- `src/views/LogInView.vue` - Account authentication with reactive client-side validation.
- `src/views/ManageView.vue` - Poster dashboard with profile editor, interactive Leaflet location picker, and animal CRUD form with categories and birthday picker.
- `src/router/index.ts` - Route definitions (`/home`, `/search`, `/map`, `/accounts/:id`, `/manage`).
- `src/types/animal.ts` - Data types for `Animal`, `Tag`, `Species`.
- `src/types/account.ts` - Interface for `Account` (`name`, `email`, `password`, `description`, etc.).
- `src/data/animals.ts` - Mock data fixtures for animals with birthDate strings.
- `src/data/accounts.ts` - Mock `ACCOUNTS` map fixtures with Phnom Penh coordinates and localStorage sync.
- `src/data/species.ts` - Species lookup record fixture.
- `src/data/categories.ts` - Category names lookup dictionary fixture.
- `src/utils/date.ts` - Date and age calculation utilities (`formatAge`).
- `docs/PROPOSAL.md` - System requirements, user stories, MVP scope, and entity relationships.
- `docs/M1_COMPELETION.MD` - Milestone 1 completion report with checklist, architecture breakdown, and conceptual write-up.
- `MD/goal.md` - 7-day study guide and milestone checklist for Frontend Prototype (M1).
- `MD/vue-defines-guide.md` - Guide for `defineProps`, `defineEmits`, and `defineModel` patterns and examples.
- `src/services/adoptionService.ts` - Mock async API service (`getAnimals`, `getAccountById`).
- `src/stores/adoptionStore.ts` - Pinia adoption store (`animals`, `publicAccount`, `privateAccount`, `myAnimals`, `loading`, `error`, `loadAnimals`, `loadAccount`).

## Symbol Index

- `Account` (`src/types/account.ts#L1-L14`) - Entity interface (id, name, email, password, description, profileImageUrl, coverImageUrl, phone, notes, latitude, longitude, banned)
- `Animal` (`src/types/animal.ts#L1-L15`) - Entity interface (id, accountId, name, birthDate, gender, speciesId, status, description, requirement, thumbnailUrl, imageUrls, categoryIds, isVaccinated, isNeutered)
- `formatAge(birthDateStr?: string) -> string` (`src/utils/date.ts#L3-L27`) - Calculates and formats age dynamically into days, weeks, months, or years
- `ANIMALS` (`src/data/animals.ts#L7-L198`) - Mock array of 10 animal records with birthDate
- `SPECIES_BY_ID` (`src/data/species.ts#L3-L8`) - Record mapping species id to name
- `CATEGORY_NAMES_BY_ID` (`src/data/categories.ts#L4-L13`) - Record mapping category/tag id to label
- `router` (`src/router/index.ts#L9-L37`) - VueRouter instance configured with WebHistory
- `GET /` -> Redirect to `/home`
- `GET /home` -> `HomeView`
- `GET /search` -> `SearchView`
- `GET /map` -> `MapView`
- `GET /accounts/:id` -> `AccountView`
- `GET /manage` -> `ManageView`
