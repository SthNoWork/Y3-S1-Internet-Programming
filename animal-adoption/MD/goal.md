# 14-Day Study Guide & Goal Checklist: Milestone 2 Backend API

> **Schedule:** Nov 11, 2026 – Nov 24, 2026 (6 Days Dev + 1 Day Review per week)
> **Target:** Deliver all Milestone 2 requirements for Paw Finder REST API using **NestJS**, **Prisma ORM**, and **PostgreSQL**.
> **Reference Architecture:** Follows [`MD/project_guidelines.md`](project_guidelines.md) and [`MD/PROPOSAL.md`](PROPOSAL.md).

---

## M2 Requirements Checklist Tracker

- [ ] **API contract** (`docs/api.md`) and **ERD diagram** (`docs/erd.md`) in `docs/`
- [ ] **NestJS REST API** organized with modular architecture (controller, service, DTOs per resource)
- [ ] **Prisma schema**, PostgreSQL migrations, and automated seed script running in Docker
- [ ] **CRUD endpoints** for at least 3 entities (`Account`, `Animal`, `Category`)
- [ ] **Server-side validation** with DTOs and `class-validator`
- [ ] **Correct HTTP status codes** (`200`, `201`, `204`, `400`, `404`) and consistent error JSON format
- [ ] **Security audit & review** (secrets in `.env`, CORS configured, SQL injection protection, password hash sanitization)
- [ ] **Conceptual explanation:** Why did you choose this relation (1-N or N-N) between your entities?

---

## Week 1: Planning, Database Infrastructure & ORM (Days 1 – 7)

### Day 1 (Nov 11): API Contract & ERD Documentation

**Estimated Time:** 2.5 hours

#### 1. Learn & Research

- **What is an API Contract?** A formal specification written _before_ coding that defines every endpoint, expected parameters, and response status codes.
- **HTTP Methods:**
  - `GET`: Retrieve data without altering server state.
  - `POST`: Create a new record.
  - `PATCH`: Partially update an existing record.
  - `DELETE`: Remove a record.
- **Relational Cardinality:**
  - `1-to-Many (1-N)`: One shelter account has many animals.
  - `Many-to-Many (N-N)`: One animal has multiple categories/tags; each category belongs to many animals.

#### 2. Step-by-Step Instructions

1. Create `docs/api.md` matching Appendix B in [`MD/project_guidelines.md`](project_guidelines.md#L280-L298).
2. Create `docs/erd.md` containing a Mermaid diagram depicting `Account`, `Animal`, `Species`, and `Category`.

#### 3. Files to Touch

- **Create:** `docs/api.md`
- **Create:** `docs/erd.md`

#### 4. Code Examples

**In `docs/erd.md`:**

```mermaid
erDiagram
    ACCOUNT ||--o{ ANIMAL : "owns/hosts"
    SPECIES ||--o{ ANIMAL : "classifies"
    ANIMAL }o--o{ CATEGORY : "tagged_with"

    ACCOUNT {
        int id PK
        string name
        string email UK
        string password
        string description
        string profileImageUrl
        string coverImageUrl
        string phone
        string notes
        float latitude
        float longitude
        boolean banned
    }

    ANIMAL {
        int id PK
        int accountId FK
        int speciesId FK
        string name
        date birthDate
        string gender
        string status
        string description
        string requirement
        string thumbnailUrl
        string[] imageUrls
        boolean isVaccinated
        boolean isNeutered
    }

    CATEGORY {
        int id PK
        string name UK
    }

    SPECIES {
        int id PK
        string name UK
    }
```

**In `docs/api.md`:**

```markdown
# Paw Finder API Contract

| Method   | Path            | Request Body      | Success Status   | Error Statuses | Description                                 |
| :------- | :-------------- | :---------------- | :--------------- | :------------- | :------------------------------------------ |
| `GET`    | `/animals`      | _None_            | `200 Animal[]`   | `500`          | List all animals with optional search query |
| `GET`    | `/animals/:id`  | _None_            | `200 Animal`     | `404`          | Get single animal details                   |
| `POST`   | `/animals`      | `CreateAnimalDto` | `201 Animal`     | `400`          | Add new animal listing                      |
| `PATCH`  | `/animals/:id`  | `UpdateAnimalDto` | `200 Animal`     | `400, 404`     | Update an existing animal                   |
| `DELETE` | `/animals/:id`  | _None_            | `204`            | `404`          | Delete animal listing                       |
| `GET`    | `/accounts`     | _None_            | `200 Account[]`  | `500`          | List all shelter accounts                   |
| `GET`    | `/accounts/:id` | _None_            | `200 Account`    | `404`          | Get single shelter profile                  |
| `GET`    | `/categories`   | _None_            | `200 Category[]` | `500`          | List all available tags                     |
| `GET`    | `/species`      | _None_            | `200 Species[]`  | `500`          | List all species                            |
```

#### 5. Day 1 Done Checklist

- [ ] `docs/api.md` contains table covering all endpoints.
- [ ] `docs/erd.md` renders cleanly with all 4 entities and relationships matching the frontend models.

---

### Day 2 (Nov 12): Docker Compose for PostgreSQL

**Estimated Time:** 2.0 hours

#### 1. Learn & Research

- **What is Docker Compose?** A tool for defining and running multi-container Docker applications. It allows running PostgreSQL locally without installing it manually on your operating system.
- **Named Volumes:** Containers are ephemeral (data is lost on reboot) unless backed by a persistent volume (`postgres_data:/var/lib/postgresql/data`).

#### 2. Step-by-Step Instructions

1. Create `docker-compose.yml` in the project root.
2. Create `.env.example` defining database credentials.
3. Verify your `.gitignore` contains `.env` so secrets are never pushed to GitHub.
4. Run `docker compose up -d` and verify the container starts.

#### 3. Files to Touch

- **Create:** `docker-compose.yml`
- **Create:** `.env.example`
- **Edit:** `.gitignore`

#### 4. Code Examples

**In `docker-compose.yml`:**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: pawfinder-postgres
    restart: always
    environment:
      POSTGRES_USER: pawfinder
      POSTGRES_PASSWORD: pawfinder_secret
      POSTGRES_DB: pawfinder_db
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**In `.env.example`:**

```env
PORT=3000
DATABASE_URL="postgresql://pawfinder:pawfinder_secret@localhost:5432/pawfinder_db?schema=public"
```

#### 5. Day 2 Done Checklist

- [ ] Running `docker compose up -d` starts container `pawfinder-postgres`.
- [ ] Running `docker ps` shows PostgreSQL listening on port `5432`.

---

### Day 3 (Nov 13): NestJS Application Scaffolding

**Estimated Time:** 2.5 hours

#### 1. Learn & Research

- **What is NestJS?** A progressive Node.js framework using TypeScript for building structured backend APIs.
- **Key Concepts:**
  - `main.ts`: Entry point where the HTTP server starts.
  - `app.module.ts`: Root module coordinating controllers and services.
  - `Controllers`: Receive incoming HTTP requests and return responses.
  - `Services (Providers)`: Handle business logic and database interactions.

#### 2. Step-by-Step Instructions

1. Initialize the NestJS backend in folder `backend/`:
   ```bash
   npx @nestjs/cli new backend --package-manager npm
   ```
2. Verify folder structure: `backend/src/main.ts`, `backend/src/app.module.ts`.
3. Start the dev server and test:
   ```bash
   cd backend
   npm run start:dev
   ```
4. Confirm `http://localhost:3000` returns `"Hello World!"`.

#### 3. Files to Touch

- **Create/Initialize:** `backend/`
- **Verify:** `backend/src/main.ts`, `backend/src/app.module.ts`

#### 4. Day 3 Done Checklist

- [ ] NestJS boots successfully with `npm run start:dev`.
- [ ] Browser or cURL request to `http://localhost:3000` responds `200 OK`.

---

### Day 4 (Nov 14): Prisma Schema Modeling

**Estimated Time:** 3.0 hours

#### 1. Learn & Research

- **What is Prisma?** An Object-Relational Mapping (ORM) tool turning TypeScript declarations into relational SQL tables.
- **Directives:**
  - `@id`: Primary key.
  - `@default(autoincrement())`: Generates serial IDs (1, 2, 3...).
  - `@unique`: Enforces unique values (e.g. emails).
  - `@relation`: Connects foreign keys between tables.

#### 2. Step-by-Step Instructions

1. Install Prisma inside `backend/`:
   ```bash
   cd backend
   npm install @prisma/client
   npm install -D prisma
   npx prisma init
   ```
2. Open `backend/prisma/schema.prisma` and replace content with the domain schema matching your frontend models.
3. Configure `backend/.env` with your `DATABASE_URL`.

#### 3. Files to Touch

- **Create:** `backend/prisma/schema.prisma`
- **Edit:** `backend/.env`

#### 4. Code Example (`backend/prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Account {
  id              Int      @id @default(autoincrement())
  name            String
  email           String   @unique
  password        String
  description     String?
  profileImageUrl String?
  coverImageUrl   String?
  phone           String?
  notes           String?
  latitude        Float?
  longitude       Float?
  banned          Boolean  @default(false)
  createdAt       DateTime @default(now())
  animals         Animal[]
}

model Species {
  id      Int      @id @default(autoincrement())
  name    String   @unique
  animals Animal[]
}

model Animal {
  id           Int        @id @default(autoincrement())
  accountId    Int
  account      Account    @relation(fields: [accountId], references: [id], onDelete: Cascade)
  speciesId    Int
  species      Species    @relation(fields: [speciesId], references: [id])
  name         String
  birthDate    DateTime   @db.Date
  gender       String
  status       String     @default("available")
  description  String
  requirement  String
  thumbnailUrl String?
  imageUrls    String[]
  isVaccinated Boolean    @default(false)
  isNeutered   Boolean    @default(false)
  categories   Category[]
}

model Category {
  id      Int      @id @default(autoincrement())
  name    String   @unique
  animals Animal[]
}
```

#### 5. Day 4 Done Checklist

- [ ] `schema.prisma` compiles cleanly without syntax errors (`npx prisma validate`).
- [ ] Schema contains at least 3 related entities with 1-N and N-N relations and matches the frontend [`Animal`](../src/types/animal.ts) & [`Account`](../src/types/account.ts) interfaces.

---

### Day 5 (Nov 15): Prisma Migrations & Database Seeding

**Estimated Time:** 3.0 hours

#### 1. Learn & Research

- **What is a Migration?** A recorded SQL script that updates the database structure to match your schema.
- **What is Seeding?** Automatically populating the newly migrated database with mock initial data (shelters, species, categories, and animals) matching `src/data/animals.ts`.

#### 2. Step-by-Step Instructions

1. Run initial migration:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```
2. Create `backend/prisma/seed.ts` to insert initial seed data.
3. Add `"prisma": { "seed": "ts-node prisma/seed.ts" }` in `backend/package.json`.
4. Install `ts-node`: `npm install -D ts-node`.
5. Execute seed: `npx prisma db seed`.
6. Inspect database visually using `npx prisma studio`.

#### 3. Files to Touch

- **Create:** `backend/prisma/seed.ts`
- **Edit:** `backend/package.json`

#### 4. Code Example (`backend/prisma/seed.ts`)

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Seed Species
  const dog = await prisma.species.upsert({
    where: { name: 'Dog' },
    update: {},
    create: { name: 'Dog' },
  })
  const cat = await prisma.species.upsert({
    where: { name: 'Cat' },
    update: {},
    create: { name: 'Cat' },
  })

  // 2. Seed Shelter Account
  const shelter = await prisma.account.upsert({
    where: { email: 'rescue@ppanimals.org' },
    update: {},
    create: {
      name: 'Phnom Penh Animal Rescue',
      email: 'rescue@ppanimals.org',
      password: 'hashed_password_placeholder',
      description: 'Dedicated to rescuing street animals in Phnom Penh.',
      profileImageUrl: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=200',
      coverImageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600',
      phone: '(415) 555-0142',
      latitude: 11.5564,
      longitude: 104.9282,
    },
  })

  // 3. Seed Animal
  await prisma.animal.create({
    data: {
      name: 'Bella',
      birthDate: new Date('2023-08-15'),
      gender: 'female',
      description: 'A cheerful Golden Retriever mix who loves fetch and belly rubs.',
      requirement: 'Thrives in a home with a fenced yard and daily outdoor exercise.',
      accountId: shelter.id,
      speciesId: dog.id,
      thumbnailUrl:
        'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
      imageUrls: [
        'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1000&auto=format&fit=crop&q=80',
      ],
      isVaccinated: true,
      isNeutered: true,
    },
  })

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

#### 5. Day 5 Done Checklist

- [ ] `npx prisma migrate dev` creates tables in PostgreSQL.
- [ ] `npx prisma db seed` runs and logs completion.
- [ ] `npx prisma studio` opens at `http://localhost:5555` showing real records in each table.

---

### Day 6 (Nov 16): Injectable Prisma Service

**Estimated Time:** 2.0 hours

#### 1. Learn & Research

- **Prisma in NestJS:** How to wrap `PrismaClient` in an `@Injectable()` service implementing `OnModuleInit` to connect on startup and disconnect gracefully on shutdown.

#### 2. Step-by-Step Instructions

1. Create `backend/src/prisma/prisma.service.ts`.
2. Create `backend/src/prisma/prisma.module.ts` and mark it `@Global()` so any module can inject it.
3. Import `PrismaModule` into `backend/src/app.module.ts`.

#### 3. Files to Touch

- **Create:** `backend/src/prisma/prisma.service.ts`
- **Create:** `backend/src/prisma/prisma.module.ts`
- **Edit:** `backend/src/app.module.ts`

#### 4. Code Examples

**In `backend/src/prisma/prisma.service.ts`:**

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
```

**In `backend/src/prisma/prisma.module.ts`:**

```typescript
import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

#### 5. Day 6 Done Checklist

- [ ] NestJS boots without errors while connecting to PostgreSQL through `PrismaService`.

---

### Day 7 (Nov 17): Week 1 Review & Database Infrastructure Audit Day

**Estimated Time:** 3.0 hours

#### 1. What to Look at & Review

- [ ] **1. Clean Container Reboot Test:**
  - Run `docker compose down -v && docker compose up -d`.
  - Confirm PostgreSQL recreates cleanly and accepts connections.
- [ ] **2. Migration & Seed Resilience:**
  - Run `npx prisma migrate reset --force`.
  - Confirm migrations replay from scratch and `seed.ts` populates data without duplicate key errors.
- [ ] **3. Relational Foreign Key Integrity:**
  - Open `npx prisma studio` and confirm deleting an Account cascades to its Animals, or deleting an Animal preserves the Species and Categories.
- [ ] **4. Git Secrets Isolation Check:**
  - Run `git status` and confirm `backend/.env` is ignored and never committed.
  - Verify `backend/.env.example` contains only placeholder values.

#### 2. Verification Commands

```bash
# 1. Verify container status
docker ps

# 2. Check migration status
cd backend && npx prisma migrate status

# 3. Check git staging for leaked secrets
git status
```

#### 3. Day 7 Done Checklist

- [ ] PostgreSQL restarts from scratch with zero errors.
- [ ] Migrations and seed script run cleanly in a single automated pass.
- [ ] All database secrets remain uncommitted.

---

## Week 2: CRUD Endpoints, Validation & Final Security Audit (Days 8 – 14)

### Day 8 (Nov 18): Accounts Resource Module (CRUD)

**Estimated Time:** 3.0 hours

#### 1. Learn & Research

- **Resource Module Pattern:** A controller handles HTTP requests (`GET /accounts`), delegates logic to a service, and queries Prisma.
- **Omitting Passwords:** Never return password hashes in responses. Use Prisma's `select` object.

#### 2. Step-by-Step Instructions

1. Generate accounts module:
   ```bash
   cd backend
   npx @nestjs/cli g module accounts
   npx @nestjs/cli g controller accounts --no-spec
   npx @nestjs/cli g service accounts --no-spec
   ```
2. Implement `findAll` and `findOne(id)` in `accounts.service.ts`.
3. Handle 404 with `NotFoundException` when an account ID does not exist.

#### 3. Files to Touch

- **Create/Edit:** `backend/src/accounts/accounts.module.ts`
- **Create/Edit:** `backend/src/accounts/accounts.service.ts`
- **Create/Edit:** `backend/src/accounts/accounts.controller.ts`

#### 4. Code Example (`backend/src/accounts/accounts.service.ts`)

```typescript
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.account.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        description: true,
        profileImageUrl: true,
        coverImageUrl: true,
        phone: true,
        notes: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        animals: true,
      },
    })
  }

  async findOne(id: number) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        description: true,
        profileImageUrl: true,
        coverImageUrl: true,
        phone: true,
        notes: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        animals: true,
      },
    })
    if (!account) throw new NotFoundException(`Account with ID ${id} not found`)
    return account
  }
}
```

#### 5. Day 8 Done Checklist

- [ ] `GET http://localhost:3000/accounts` returns list of shelters without password fields.
- [ ] `GET http://localhost:3000/accounts/9999` returns `404 Not Found`.

---

### Day 9 (Nov 19): Animals Resource Module (Full CRUD)

**Estimated Time:** 3.5 hours

#### 1. Learn & Research

- **Full CRUD:**
  - `GET /animals`: Find all (supports search filter query).
  - `GET /animals/:id`: Find one.
  - `POST /animals`: Create new animal (`@HttpCode(201)`).
  - `PATCH /animals/:id`: Update animal (`200 OK`).
  - `DELETE /animals/:id`: Remove animal (`@HttpCode(204)`).

#### 2. Step-by-Step Instructions

1. Generate animals module:
   ```bash
   cd backend
   npx @nestjs/cli g module animals
   npx @nestjs/cli g controller animals --no-spec
   npx @nestjs/cli g service animals --no-spec
   ```
2. Implement all 5 CRUD operations in `animals.service.ts`.
3. Wire the routes in `animals.controller.ts`.

#### 3. Files to Touch

- **Create/Edit:** `backend/src/animals/animals.module.ts`
- **Create/Edit:** `backend/src/animals/animals.service.ts`
- **Create/Edit:** `backend/src/animals/animals.controller.ts`

#### 4. Code Example (`backend/src/animals/animals.controller.ts`)

```typescript
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common'
import { AnimalsService } from './animals.service'

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Get()
  findAll(@Query('q') query?: string) {
    return this.animalsService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.animalsService.findOne(id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: any) {
    return this.animalsService.create(body)
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.animalsService.update(id, body)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.animalsService.remove(id)
  }
}
```

#### 5. Day 9 Done Checklist

- [ ] Tested all 5 endpoints using cURL or Thunder Client.
- [ ] Deleting an animal returns status code `204 No Content`.

---

### Day 10 (Nov 20): Categories & Species Lookup Modules

**Estimated Time:** 2.5 hours

#### 1. Learn & Research

- **Lookup Tables:** Small auxiliary tables (`Category`, `Species`) that feed dropdown options in forms.
- **Many-to-Many Connections in Prisma:** Connecting existing categories to animals via `categories: { connect: [{ id: 1 }, { id: 2 }] }`.

#### 2. Step-by-Step Instructions

1. Generate `categories` and `species` modules.
2. Implement `GET /categories` and `GET /species` returning list records.
3. Update `animals.service.ts` to include `categories` and `species` in responses (`include: { categories: true, species: true }`).

#### 3. Files to Touch

- **Create:** `backend/src/categories/categories.module.ts`, `categories.controller.ts`, `categories.service.ts`
- **Create:** `backend/src/species/species.module.ts`, `species.controller.ts`, `species.service.ts`
- **Edit:** `backend/src/animals/animals.service.ts`

#### 4. Day 10 Done Checklist

- [ ] `GET /categories` returns all tags (`Good with Kids`, `Active`, `Indoor Only`).
- [ ] `GET /species` returns all species (`Dog`, `Cat`, `Bird`).
- [ ] `GET /animals` includes embedded category and species objects.

---

### Day 11 (Nov 21): Server-Side DTOs & ValidationPipes

**Estimated Time:** 3.0 hours

#### 1. Learn & Research

- **What is a DTO (Data Transfer Object)?** A TypeScript class defining the exact shape of request payloads.
- **`class-validator`:** Decorators that enforce rules:
  - `@IsString()`
  - `@IsDateString()`
  - `@IsNotEmpty()`
  - `@IsEmail()`
- **Global `ValidationPipe`:**
  - `whitelist: true`: Silently strips any unexpected properties sent by users.
  - `forbidNonWhitelisted: true`: Throws a `400 Bad Request` if unapproved keys are sent.

#### 2. Step-by-Step Instructions

1. Install validation packages:
   ```bash
   cd backend
   npm install class-validator class-transformer
   ```
2. Create `CreateAnimalDto` and `UpdateAnimalDto`.
3. Register global `ValidationPipe` in `backend/src/main.ts`.

#### 3. Files to Touch

- **Create:** `backend/src/animals/dto/create-animal.dto.ts`
- **Create:** `backend/src/animals/dto/update-animal.dto.ts`
- **Edit:** `backend/src/main.ts`
- **Edit:** `backend/src/animals/animals.controller.ts` (type parameters with DTOs).

#### 4. Code Examples

**In `backend/src/animals/dto/create-animal.dto.ts`:**

```typescript
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator'

export class CreateAnimalDto {
  @IsNotEmpty({ message: 'Animal name is required' })
  @IsString()
  name: string

  @IsNotEmpty({ message: 'Birth date is required' })
  @IsDateString({}, { message: 'Birth date must be a valid ISO date string (YYYY-MM-DD)' })
  birthDate: string

  @IsNotEmpty()
  @IsString()
  gender: string

  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  description: string

  @IsNotEmpty({ message: 'Adoption requirement is required' })
  @IsString()
  requirement: string

  @IsInt()
  accountId: number

  @IsInt()
  speciesId: number

  @IsOptional()
  @IsUrl({}, { message: 'Thumbnail URL must be a valid URL' })
  thumbnailUrl?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[]

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[]

  @IsOptional()
  @IsBoolean()
  isVaccinated?: boolean

  @IsOptional()
  @IsBoolean()
  isNeutered?: boolean
}
```

**In `backend/src/animals/dto/update-animal.dto.ts`:**

```typescript
import { PartialType } from '@nestjs/mapped-types'
import { CreateAnimalDto } from './create-animal.dto'

export class UpdateAnimalDto extends PartialType(CreateAnimalDto) {}
```

#### 5. Day 11 Done Checklist

- [ ] Submitting empty payload `{}` to `POST /animals` returns `400 Bad Request` with an array of descriptive validation messages.
- [ ] Sending `{ birthDate: "invalid" }` is rejected with `"Birth date must be a valid ISO date string (YYYY-MM-DD)"`.

---

### Day 12 (Nov 22): Standardized Error Format & Filters

**Estimated Time:** 2.5 hours

#### 1. Learn & Research

- **Appendix B Standard Error Format:**
  ```json
  {
    "statusCode": 400,
    "message": ["Birth date must be a valid ISO date string (YYYY-MM-DD)"],
    "error": "Bad Request"
  }
  ```
- **NestJS Exception Filters:** How to intercept all exceptions and ensure response shapes strictly follow the course standard.

#### 2. Step-by-Step Instructions

1. Create `backend/src/common/filters/http-exception.filter.ts`.
2. Register the filter globally in `backend/src/main.ts`.

#### 3. Files to Touch

- **Create:** `backend/src/common/filters/http-exception.filter.ts`
- **Edit:** `backend/src/main.ts`

#### 4. Code Example (`backend/src/common/filters/http-exception.filter.ts`)

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null

    let message: any = 'Internal server error'
    let error: string = 'Internal Server Error'

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const resObj = exceptionResponse as any
      message = resObj.message || message
      error = resObj.error || error
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse
    }

    response.status(status).json({
      statusCode: status,
      message: Array.isArray(message) ? message : [message],
      error,
    })
  }
}
```

#### 5. Day 12 Done Checklist

- [ ] Every error (400, 404, 500) returns a consistent JSON object matching the Appendix B format.

---

### Day 13 (Nov 23): Swagger OpenAPI Documentation & CORS Setup

**Estimated Time:** 2.5 hours

#### 1. Learn & Research

- **What is Swagger (OpenAPI)?** An interactive web UI generated directly from code enabling anyone to test endpoints.
- **CORS Restriction:** How to configure Express/NestJS CORS to accept calls only from Vite's frontend (`http://localhost:5173`).

#### 2. Step-by-Step Instructions

1. Install Swagger in `backend/`:
   ```bash
   cd backend
   npm install @nestjs/swagger
   ```
2. Enable CORS and configure Swagger in `backend/src/main.ts`.
3. Open `http://localhost:3000/api/docs` in your browser.

#### 3. Files to Touch

- **Edit:** `backend/src/main.ts`

#### 4. Code Example (`backend/src/main.ts`)

```typescript
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AllExceptionsFilter } from './common/filters/http-exception.filter'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  app.useGlobalFilters(new AllExceptionsFilter())

  const config = new DocumentBuilder()
    .setTitle('Paw Finder API')
    .setDescription('Paw Finder Animal Adoption REST API documentation')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
```

#### 5. Day 13 Done Checklist

- [ ] Navigating to `http://localhost:3000/api/docs` displays the interactive Swagger documentation.
- [ ] CORS is restricted to frontend origins.

---

### Day 14 (Nov 24): Week 2 Review, Security Audit & Final M2 Submission Day

**Estimated Time:** 3.5 hours

#### 1. What to Look at & Security Review

- [ ] **1. Sensitive Password Exclusion Check:**
  - Verify that `GET /accounts` and `GET /accounts/:id` never include `password` fields.
- [ ] **2. SQL Injection Immunity Check:**
  - Verify that no raw SQL strings are concatenated. Prisma's query builders (`findMany`, `create`) automatically parameterize inputs.
- [ ] **3. Git Secrets Exposure Check:**
  - Run `git status` and verify that `backend/.env` is ignored and never committed.
- [ ] **4. Clean Container Reboot Test:**
  - Simulate instructor evaluation from a clean state:
    ```bash
    docker compose down -v
    docker compose up -d
    cd backend && npx prisma migrate dev && npx prisma db seed
    npm run start:dev
    ```

#### 2. Conceptual Explanation Deliverable

Create `docs/M2_EXPLANATION.md` answering the required question from [`MD/project_guidelines.md`](project_guidelines.md#L125):

> **Why did you choose this relation (1-N or N-N) between two of your entities?**
>
> - **1-to-Many (1-N) Relation between Account and Animal:**
>   - _What:_ One `Account` (Shelter) has many `Animals`, but each `Animal` belongs strictly to one `Account`.
>   - _Why:_ In an animal adoption domain, every rescue animal must have one clear organization legally responsible for vetting adopters and handling adoption logistics. Splitting ownership across multiple accounts would introduce conflicting contact info and custody ambiguity.
> - **Many-to-Many (N-N) Relation between Animal and Category:**
>   - _What:_ One `Animal` can have multiple tags (`Good with Kids`, `Active`), and a `Category` describes multiple `Animals`.
>   - _Why:_ Tags are non-hierarchical, open-ended metadata. An implicit join table allows the frontend search filters to query by tags without duplicating strings or fixing hard limits.

#### 3. Final Milestone 2 Done Checklist

- [ ] Clean container reboot works with one command sequence.
- [ ] All checklist items in `docs/M2_EXPLANATION.md` completed.
- [ ] Commit all work with message: `feat: complete milestone 2 backend API`.
- [ ] Create git tag: `git tag m2 && git push origin m2`.
