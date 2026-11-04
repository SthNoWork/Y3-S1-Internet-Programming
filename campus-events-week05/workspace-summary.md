# Workspace Summary

## 1. Stack & Purpose
- Vue 3 + Vite + TypeScript + Pinia + Vue Router single-page app for Campus Events with mock json-server API.

## 2. Map & Flow
- `src/main.ts: createApp(L1-7)` mounts Pinia and Vue Router.
- `src/router/index.ts: routes(L11-23), makeRouter(L25-39)` handles lazy-loaded routes and `organiserOnly` beforeEach guard.
- `src/stores/events.ts: useEventsStore(L8-61)` manages event listing, fetchAll, fetchOne, byId getter, create.
- `src/stores/bookings.ts: useBookingsStore(L10-64)` manages bookings, seat checks, create and cancel actions.
- `src/stores/session.ts: useSessionStore` manages user roles (student/organiser).
- `src/validation.ts: validateBooking(L11-19), validateEvent(L21-32)` form validation rules.
- `src/composables/useEventFilters.ts: useEventFilters(L7-18)` reusable search and category filtering.
- `src/components/BookingForm.vue: BookingForm(L1-60)` validated reactive booking form.

## 3. Data & Conventions
- Data entities: events (`CampusEvent`), bookings (`Booking`), categories (`Category`).
- Types defined in `src/types.ts`.

## 4. Decisions
- Route guard checks `to.meta.organiserOnly` prior to invoking `useSessionStore()` to prevent store access before Pinia plugin initialization during early navigation in tests.

## 5. State
- Parts A through E completed.
- Answers written in `week05/ANSWERS.md` and `ANSWERS.md`.

## 6. Commands
- Run API: `npm run api`
- Run dev app: `npm run dev`
- Tests: `npm test`
- Typecheck: `npm run check`
- Build: `npm run build`

## 7. Verified Working
- Vitest suite passing (29/29 tests).
- Typecheck clean (`npm run check`).
- Production build passes (`npm run build`).

