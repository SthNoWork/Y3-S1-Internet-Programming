# Milestone 3: Integrated Application & Authentication Overview

> **Due:** Week 9  
> **Core Objective:** Replace the frontend mock service layer with real HTTP API calls to the NestJS backend, introduce user authentication (registration, login, logout, password hashing), and enforce role-based access control and resource ownership.

---

## 1. M3 Requirements Checklist

- [ ] **Real API Integration:**
  - `src/services/adoptionService.ts` replaces local static mock data (`ANIMALS`, `ACCOUNTS`) with `fetch` / `axios` calls to the live NestJS backend (`http://localhost:3000`).
  - Loading, error, and empty states remain fully reactive.
- [ ] **Authentication & Security:**
  - Password hashing on backend with `bcrypt`.
  - User registration (`POST /auth/register`), login (`POST /auth/login`), and logout.
  - JWT token generation, signed with a secret stored in `.env`.
- [ ] **API Authorization & Guards (Backend):**
  - NestJS `AuthGuard` (JWT validation).
  - Role guard (`RolesGuard`) for administrative actions.
  - Ownership guard (`OwnershipGuard`): Shelter accounts can only edit/delete their own animal listings.
- [ ] **Route & UI Guards (Frontend):**
  - Vue Router navigation guards (`router.beforeEach`) preventing unauthenticated access to `/manage`.
  - UI dynamically hides or disables buttons for actions unauthorized for the logged-in user.
- [ ] **3-Minute Practice Session Demo:**
  - Demonstrate registration, login, viewing listings from the live database, posting an animal, and logout.
- [ ] **Conceptual Question (`MILESTONES.md`):**
  - *Where is the token stored in the browser (localStorage vs HttpOnly cookie), and what attack does that choice protect against or expose (XSS vs CSRF)?*

---

## 2. Architecture: M1 Mock vs M3 Real Integration

### M1 Frontend Architecture (Mock Layer)
```
[Vue Component]
       │
       ▼
[Pinia Store (adoptionStore)]
       │
       ▼
[adoptionService.ts] ──► Reads local mock files (src/data/animals.ts, accounts.ts)
```

### M3 Integrated Architecture (Full Stack)
```
[Vue Component]
       │
       ▼
[Pinia Store (adoptionStore)]
       │
       ▼
[adoptionService.ts] ──► HTTP Requests (Bearer JWT)
                               │
                               ▼
                    [NestJS Controller]
                               │
                               ▼
                        [Auth / Roles Guard]
                               │
                               ▼
                         [Prisma Service]
                               │
                               ▼
                       [PostgreSQL (Docker)]
```

---

## 3. Key Concepts to Master for M3

### 1. Token Storage Tradeoffs (XSS vs CSRF)
- **`localStorage`:**
  - *Pros:* Easiest to implement in single-page applications; automatically avoids CSRF attacks.
  - *Cons:* Vulnerable to Cross-Site Scripting (XSS). Any malicious script injected into the page can read the token.
- **`HttpOnly` Cookie:**
  - *Pros:* Immune to JavaScript reading (XSS cannot steal the token directly).
  - *Cons:* Vulnerable to Cross-Site Request Forgery (CSRF); requires SameSite attributes or CSRF tokens.

### 2. Ownership Verification Pattern (Backend)
When updating or deleting an animal (`PATCH /animals/:id` or `DELETE /animals/:id`):
```typescript
// Example NestJS Ownership check
const animal = await this.prisma.animal.findUnique({ where: { id } })
if (!animal) throw new NotFoundException()
if (animal.accountId !== currentUser.id) {
  throw new ForbiddenException('You do not own this animal listing') // 403 Forbidden
}
```

### 3. Vue Router Navigation Guard
```typescript
// src/router/index.ts
router.beforeEach((to, from, next) => {
  const store = useAdoptionStore()
  if (to.meta.requiresAuth && !store.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})
```
