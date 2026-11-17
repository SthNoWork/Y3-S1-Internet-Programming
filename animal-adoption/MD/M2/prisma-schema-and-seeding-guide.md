# Prisma Schema & Database Seeding Guide: Paw Finder

This guide explains how **Prisma ORM** works, breaks down our current schema in [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma), clarifies relations (1-N vs M-N), and lists the essential CLI commands for migrations and seeding.

---

## 1. How Prisma Works: The Core Pieces

Prisma consists of three primary tools:
1. **Prisma Schema (`schema.prisma`):** The single source of truth for your database models and relationships.
2. **Prisma Migrate (`npx prisma migrate`):** Reads changes in your schema and generates timestamped SQL migration files to apply to PostgreSQL.
3. **Prisma Client (`@prisma/client`):** An auto-generated, type-safe query builder tailored specifically to your models so you get full TypeScript autocomplete when querying the database.

---

## 2. Anatomy of Our Current `schema.prisma`

### A. Datasource & Generator Block

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

- **`datasource db`**: Tells Prisma which database engine to connect to (`postgresql`) and where to find the connection string (`env("DATABASE_URL")`).
- **`generator client`**: Instructs Prisma to generate the TypeScript `PrismaClient` when you run `npx prisma generate` or `npx prisma migrate dev`.

---

### B. Understanding Physical Columns vs. Virtual Relations

A common point of confusion is seeing both `accountId` and `account` inside `Animal`:

```prisma
model Animal {
  id           Int        @id @default(autoincrement())
  accountId    Int
  account      Account    @relation(fields: [accountId], references: [id], onDelete: Cascade)
  ...
}
```

| Field | Type | What it actually is in PostgreSQL |
| :--- | :--- | :--- |
| **`accountId`** | `Int` | **Real physical column** in the `Animal` table. This is the Foreign Key (`FK`) storing the integer ID of the shelter. |
| **`account`** | `Account` | **Virtual Prisma relation field**. It does **NOT** exist as a column in PostgreSQL. It is purely for Prisma in TypeScript so you can write `prisma.animal.findUnique({ include: { account: true } })`. |
| **`@relation(...)`** | Directive | Tells Prisma: *"Use the `accountId` column in this table to look up the `id` column in the `Account` table."* |
| **`onDelete: Cascade`** | Rule | If an `Account` is deleted, all `Animal` records owned by that account are automatically deleted by PostgreSQL. |

---

### C. 1-to-Many (1:N) vs. Many-to-Many (M:N) Relations

#### 1. One-to-Many (1:N): `Account` $\leftrightarrow$ `Animal`
- **Rule:** One shelter account hosts **many** animals. Each animal belongs to **exactly one** shelter account.
- **In `Account`:**
  ```prisma
  animals Animal[] // Virtual back-relation: list of animals owned by this account
  ```
- **In `Animal`:**
  ```prisma
  accountId Int     // Physical Foreign Key column
  account   Account @relation(...)
  ```

#### 2. Implicit Many-to-Many (M:N): `Animal` $\leftrightarrow$ `Category`
- **Rule:** One animal can have **many** tags (e.g., `Active`, `Good with Kids`). One tag can belong to **many** animals.
- **In `Animal`:**
  ```prisma
  categories Category[]
  ```
- **In `Category`:**
  ```prisma
  animals Animal[]
  ```

> [!NOTE]
> **How PostgreSQL handles `Category[]`:**
> Relational databases cannot store arrays of foreign keys in a single column.
> When Prisma sees `Category[]` on both models, it automatically generates a hidden join table in PostgreSQL called **`_AnimalToCategory`**:
> - Column `A` (`Int`): Foreign key pointing to `Animal.id`
> - Column `B` (`Int`): Foreign key pointing to `Category.id`
> - Unique Composite Primary Key on `(A, B)`.

---

## 3. Breakdown of All 4 Models

| Model | Primary Key | Key Fields | Relationships |
| :--- | :--- | :--- | :--- |
| **`Account`** | `id` (`Int`, autoincrement) | `name`, `email` (unique), `password`, `latitude`, `longitude`, `banned` | Has many `Animal` records (`1:N`) |
| **`Species`** | `id` (`Int`, autoincrement) | `name` (unique: `Dog`, `Cat`, `Rabbit`, `Bird`) | Has many `Animal` records (`1:N`) |
| **`Animal`** | `id` (`Int`, autoincrement) | `name`, `birthDate` (`@db.Date`), `gender`, `status`, `thumbnailUrl`, `imageUrls` (PostgreSQL array), `isVaccinated`, `isNeutered` | Belongs to `Account` (`1:N`), Belongs to `Species` (`1:N`), Has many `Category` tags (`M:N`) |
| **`Category`** | `id` (`Int`, autoincrement) | `name` (unique: `Active`, `Indoor Only`, etc.) | Belongs to many `Animal` records (`M:N`) |

---

## 4. Prisma Commands & Seeding Reference

All commands below should be executed from the **`backend/`** directory in your terminal:

### 1. Run Migrations (Apply Schema Changes to PostgreSQL)
```powershell
cd backend
npx prisma migrate dev --name <migration_name>
```
- Creates a SQL file in `prisma/migrations/`.
- Executes SQL on the running Docker PostgreSQL container.
- Regenerates `@prisma/client`.

### 2. Validate Schema Syntax
```powershell
npx prisma validate
```
- Checks `schema.prisma` for syntax errors, missing relation fields, or unreferenced models without touching the database.

### 3. Run the Database Seed Script
```powershell
npx prisma db seed
```
- Runs `backend/prisma/seed.ts` via `tsx`.
- Populates PostgreSQL with the complete dataset from `src/data/` (4 species, 8 categories, 5 shelters, and 10 animals).

### 4. Open Prisma Studio (Visual Web Interface)
```powershell
npx prisma studio
```
- Opens a GUI in your web browser at `http://localhost:5555`.
- Lets you view, filter, add, edit, and delete rows in any table directly without typing SQL queries.

### 5. Reset the Entire Database (Fresh Start)
```powershell
npx prisma migrate reset
```
- Drops the entire database.
- Re-applies all migration scripts from scratch.
- Automatically executes `npx prisma db seed` at the end.
