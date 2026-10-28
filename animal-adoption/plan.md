# Backend Implementation Plan: Paw Finder

Based on [requirement.md](requirement.md).

## 1. Architecture & Local Stack

- **Framework**: NestJS (REST API) with Swagger documentation.
- **Database**: PostgreSQL run locally via Docker Compose.
- **ORM**: Prisma with migrations and seed scripts.
- **Authentication**: JWT, bcrypt password hashing, role and ownership guards.
- **Testing**: Jest and Supertest.

---

## 2. Local Infrastructure Setup

1. **Docker Compose (`docker-compose.yml`)**
   - Service: `postgres` (PostgreSQL 16) with persistent volume.
   - Environment: database name, user, password, port `5432`.

2. **Environment Configuration (`.env.example`)**
   - `DATABASE_URL` for Prisma.
   - `JWT_SECRET` and expiration settings.
   - `PORT` for the NestJS API (default: `3000`).

---

## 3. Database Models & Prisma Schema

All entity references use stable numeric IDs. Fixed options use lookup tables.

- **Lookups**:
  - `Role`: `{ id: 1, name: "poster" }`, `{ id: 2, name: "admin" }`
  - `AnimalStatus`: `{ id: 1, name: "available" }`, `{ id: 2, name: "adopted" }`
  - `ReportStatus`: `{ id: 1, name: "open" }`, `{ id: 2, name: "reviewed" }`
  - `Species`: `{ id, name }`
- **User**:
  - `id` (Int, PK, autoincrement)
  - `name` (String)
  - `email` (String, unique)
  - `passwordHash` (String)
  - `profilePictureUrl` (String, optional)
  - `phone` (String, optional)
  - `contactNote` (String, optional)
  - `locationName` (String, optional)
  - `latitude` (Float, optional)
  - `longitude` (Float, optional)
  - `roleId` (Int, FK -> Role)
  - `banned` (Boolean, default: false)
  - Relations: `animals` (1:N), `reports` (1:N as reported account)
- **Animal**:
  - `id` (Int, PK, autoincrement)
  - `name` (String)
  - `speciesId` (Int, FK -> Species)
  - `details` (String)
  - `requirements` (String)
  - `imageUrl` (String, optional)
  - `statusId` (Int, FK -> AnimalStatus)
  - `userId` (Int, FK -> User)
  - Relations: `tags` (M:N via `AnimalTag` or implicit M:N)
- **Tag**:
  - `id` (Int, PK, autoincrement)
  - `name` (String, unique)
  - Relations: `animals` (M:N)
- **Report**:
  - `id` (Int, PK, autoincrement)
  - `reason` (String)
  - `reportedUserId` (Int, FK -> User)
  - `statusId` (Int, FK -> ReportStatus)
  - `createdAt` (DateTime, default: now)
- **Seed Script (`prisma/seed.ts`)**:
  - Seed lookup tables (`Role`, `AnimalStatus`, `ReportStatus`, `Species`).
  - Seed default tags (e.g., vaccinated, kid-friendly).
  - Seed default admin account with hashed password.

---

## 4. API Modules & Endpoints

### 4.1 Auth Module (Stories 4, 8)
- `POST /auth/register`: Validate input, hash password (bcrypt), create user.
- `POST /auth/login`: Validate credentials, return JWT token and user info.
- Guards: `JwtAuthGuard`, `RolesGuard`, `BannedGuard` (blocks banned accounts).

### 4.2 Users Module (Stories 4, 8)
- `GET /users/me`: Return current user profile.
- `PATCH /users/me`: Update name, profile picture, location (`latitude`, `longitude`, `locationName`), contact details. Validate coordinates within valid ranges.
- `GET /accounts/:id`: Public account profile (name, picture, location, contact details, and list of available animals). Returns 404 if account not found.

### 4.3 Animals Module (Stories 3, 5, 6)
- `GET /animals`: Public search and filter:
  - Query params: `name`, `speciesId`, `tagIds`, `location`, `lat`, `lng`, `sortBy` (`newest` | `nearest`), `page` (default 1, 12 items/page).
  - Filters out animals belonging to banned accounts or with status `adopted`.
  - Calculates distance when `lat` and `lng` query parameters are provided.
- `GET /animals/:id`: Public detail of a specific animal.
- `POST /animals`: Create animal for authenticated poster (requires account location to be set).
- `PATCH /animals/:id`: Update animal (OwnershipGuard enforces 403 for non-owners). Allows changing status between Available and Adopted.
- `DELETE /animals/:id`: Delete animal (OwnershipGuard enforces 403 for non-owners).
- `GET /my/animals`: Return all animals owned by current user (including adopted).

### 4.4 Locations Module (Story 1)
- `GET /locations/pins`: Returns list of map pins (account ID, account name, latitude, longitude) only for accounts with at least one available animal and not banned.

### 4.5 Admin & Reports Module (Stories 7, 9)
- `POST /reports`: Public endpoint to report a suspicious account by `reportedUserId` with a `reason`.
- `GET /admin/reports`: Admin-only endpoint to view reports grouped or filtered by account.
- `PATCH /admin/reports/:id`: Admin-only endpoint to update report status (`reviewed`).
- `PATCH /admin/users/:id/ban`: Admin-only endpoint to toggle `banned` status on an account.
- `DELETE /admin/animals/:id`: Admin-only endpoint to remove any animal.

---

## 5. Implementation Phases

1. **Phase 1: Environment & Prisma Setup**
   - Add `docker-compose.yml` for local PostgreSQL.
   - Initialize Prisma schema, run initial migration, and create the seed script.
2. **Phase 2: NestJS Scaffolding & Core Architecture**
   - Initialize NestJS project in `api/`.
   - Setup PrismaService, global validation pipe, and Swagger at `/api/docs`.
3. **Phase 3: Auth & User Management**
   - Implement JWT authentication, bcrypt hashing, and role/banned guards.
   - Implement user registration, profile update, and public account endpoints.
4. **Phase 4: Animal Catalog & Locations**
   - Implement animal CRUD and ownership guards.
   - Implement map pins endpoint (`/locations/pins`).
   - Implement `/animals` search, filters, pagination, and distance sorting.
5. **Phase 5: Admin Moderation & Reports**
   - Implement public report submission.
   - Implement admin report viewing and account ban / animal deletion endpoints.
6. **Phase 6: Testing**
   - Write Jest unit tests for services.
   - Write Supertest integration tests for endpoints and guard rules.
