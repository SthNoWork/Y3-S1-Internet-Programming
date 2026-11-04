# Campus Events API — Week 6 Instructions & Checklist

## Overview
- **Project:** Campus Events API (NestJS + in-memory store)
- **Requirement:** Node 24 LTS (npm 11)
- **API Specification:** [`docs/api-contract.md`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/docs/api-contract.md)
- **Schedule:** In-class (Parts A & B), At home (Part C, `ANSWERS.md`, Part D)

---

## Target Files to Touch / Create

### Campus Events API Implementation
- [`src/events/dto/create-event.dto.ts`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/src/events/dto/create-event.dto.ts)
- [`src/events/events.service.ts`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/src/events/events.service.ts)
- [`src/events/events.controller.ts`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/src/events/events.controller.ts)
- [`src/bookings/dto/create-booking.dto.ts`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/src/bookings/dto/create-booking.dto.ts)
- [`src/bookings/bookings.service.ts`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/src/bookings/bookings.service.ts)

### Deliverables
- [`ANSWERS.md`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/ANSWERS.md) (or `week06/ANSWERS.md`)
- Personal project `docs/api-contract.md` (Milestone 2 specification)
- Personal backend starter repository (`npx @nestjs/cli new api`)

---

## Part A: Validate the Input (In-Class, ~20 min)
- <input type="checkbox"> Open [`src/events/dto/create-event.dto.ts`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/src/events/dto/create-event.dto.ts) (**TODO A1**) and add `class-validator` decorators:
  - `title`: `@IsString()`, `@Length(3, 100)`
  - `category`: `@IsIn(CATEGORIES)`
  - `startsAt`: `@IsISO8601({ strict: true })`
  - `location`: `@IsString()`, `@Length(1, 100)`
  - `capacity`: `@IsInt()`, `@Min(1)`, `@Max(1000)`
  - `description`: `@IsOptional()`, `@IsString()`, `@MaxLength(500)`
- <input type="checkbox"> Remove the placeholder `void [...]` line at the bottom of [`create-event.dto.ts`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/src/events/dto/create-event.dto.ts#L34).
- <input type="checkbox"> Open [`src/setup.ts`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/src/setup.ts) and review `ValidationPipe` configuration (`whitelist`, `forbidNonWhitelisted`, `transform`).
- <input type="checkbox"> Send the "Invalid" request in [`requests.http`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/requests.http) and verify 400 response with individual error messages.
- <input type="checkbox"> Temporarily remove `forbidNonWhitelisted: true`, re-send request with `"booked": 99`, note behavior, and restore the option.

---

## Part B: Create, Update, Delete (In-Class, ~30 min)
- <input type="checkbox"> **B1** in [`EventsService.create`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/src/events/events.service.ts#L36-L39):
  - Assign next ID (`this.nextId++`).
  - Set `booked: 0`.
  - Set `description: dto.description ?? ''`.
  - Push event to `this.events` and return it.
- <input type="checkbox"> **B2** in [`EventsService.update`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/src/events/events.service.ts#L42-L44):
  - Look up event via `this.findOne(id)` (throws 404 if missing).
  - Shallow copy/assign only fields present in `dto`.
  - Return updated event.
- <input type="checkbox"> **B3** in [`EventsService.remove`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/src/events/events.service.ts#L47-L49):
  - Check event exists (throw `NotFoundException` if missing).
  - Remove from `this.events`.
- <input type="checkbox"> Run `npm test` and verify `EventsService` unit tests pass.
- <input type="checkbox"> **B4** in [`EventsController`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/src/events/events.controller.ts#L33-L38): Implement three route handlers:
  - `@Post()` `create(@Body() dto: CreateEventDto)` (returns 201)
  - `@Patch(':id')` `update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEventDto)` (returns 200)
  - `@Delete(':id')` `@HttpCode(204)` `remove(@Param('id', ParseIntPipe) id: number)` (returns 204)
- <input type="checkbox"> Test all event endpoints in [`requests.http`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/requests.http) and via `curl`:
  ```bash
  curl -i -X POST http://localhost:3000/events -H 'Content-Type: application/json' -d '{"title":"Pitch Night","category":"social","startsAt":"2026-12-01T18:00:00.000Z","location":"Hall","capacity":50}'
  curl -i -X DELETE http://localhost:3000/events/7
  curl -i http://localhost:3000/events/7
  ```
- <input type="checkbox"> Restart server and confirm data resets in memory.

---

## Part C: Bookings with Server Rules (At Home, ~20 min)
- <input type="checkbox"> **C1** in [`CreateBookingDto`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/src/bookings/dto/create-booking.dto.ts#L8-L12): Add `class-validator` decorators:
  - `name`: `@IsString()`, `@Length(2, 100)`
  - `email`: `@IsEmail()`
  - `seats`: `@IsInt()`, `@Min(1)`, `@Max(4)`
- <input type="checkbox"> Remove placeholder `void [...]` line in [`create-booking.dto.ts`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/src/bookings/dto/create-booking.dto.ts#L14).
- <input type="checkbox"> **C2** in [`BookingsService.create`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/src/bookings/bookings.service.ts#L23-L26):
  - Find event via `this.events.findOne(eventId)` (throws 404 if missing).
  - Calculate remaining seats: `const left = event.capacity - event.booked;`.
  - Throw `new ConflictException(\`Only ${left} seat(s) left\`)` if `dto.seats > left`.
  - Increment `event.booked += dto.seats`.
  - Save and return new booking (`id`, `eventId`, `name`, `email`, `seats`, `createdAt: new Date().toISOString()`).
- <input type="checkbox"> **C3** in [`BookingsService.remove`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/src/bookings/bookings.service.ts#L29-L32):
  - Find booking (throw `NotFoundException` if missing).
  - Restore event seats: `event.booked -= booking.seats`.
  - Delete booking from `this.bookings`.

---

## Code Verification
- <input type="checkbox"> Run `npm test` (all 8 unit tests pass).
- <input type="checkbox"> Run `npm run test:e2e` (all 13 e2e tests pass).
- <input type="checkbox"> Run `npm run build` (zero TypeScript errors).

---

## Conceptual Questions: `ANSWERS.md`
Answer each in 2–4 sentences inside [`ANSWERS.md`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/ANSWERS.md):
- <input type="checkbox"> **Q1 (Idempotency):** `DELETE /events/2` returns 204 and the second call returns 404. Is `DELETE` still idempotent? Explain with what idempotent means.
- <input type="checkbox"> **Q2 (CORS):** The Vue app on port 5173 calls the API on port 3000. Which program blocks the response when CORS is not configured, and why can `curl` read it anyway?
- <input type="checkbox"> **Q3 (Dependency Injection):** `EventsController` never writes `new EventsService()`. Who creates the service, when, and how many are created?
- <input type="checkbox"> **Q4 (Validation):** A client sends `{ "title": "Pitch Night", ..., "booked": 50 }`. Which line of code refuses it, and what would happen to `booked` without it?
- <input type="checkbox"> **Q5 (Architecture):** Why is the "not enough seats" rule in `BookingsService` and not in `BookingsController` or only in the Vue form?

---

## Part D: Personal Project Contract & Setup (Milestone 2)
- <input type="checkbox"> Demonstrate Milestone 1 check to instructor.
- <input type="checkbox"> Write `docs/api-contract.md` for personal app matching the Campus Events specification format.
- <input type="checkbox"> Scaffold personal backend (`npx @nestjs/cli new api`) and build first in-memory module with DTOs and validation.

---

## Departure Checkpoint
- <input type="checkbox"> Parts A and B completed; events tests pass.
- <input type="checkbox"> Executed every request in `requests.http` and verified status codes.
- <input type="checkbox"> Milestone 1 checked.
- <input type="checkbox"> At home: Part C completed (8/8 unit tests, 13/13 e2e tests).
- <input type="checkbox"> Personal `docs/api-contract.md` and initial NestJS module created.
- <input type="checkbox"> `ANSWERS.md` answered for all 5 questions.

