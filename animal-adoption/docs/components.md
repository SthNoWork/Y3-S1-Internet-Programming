# Component Architecture (`docs/components.md`)

This document defines the component hierarchy, props, events, and state ownership for the Animal Adoption application as specified in Part E.

---

## Screen 1: Animals Browse & Search View (`/animals`)

### Component Tree
```text
AnimalsView (Page / Route View)
  ├── AnimalFilters
  ├── AnimalCard (rendered via v-for)
  └── PaginationBar
```

### State Ownership & Data Flow

#### **`AnimalsView` (Parent View)**
- **Owns State**:
  - `search: string` — Current search query for animal name or details
  - `species: string` — Selected species filter (`""` for all, `"dog"`, `"cat"`, `"other"`)
  - `selectedTagId: number | null` — Selected tag filter (or `null` for all)
  - `sort: "newest" | "name-asc" | "name-desc"` — Sort order
  - `page: number` — Current active pagination page (starts at 1)
  - `pageSize: number` — Items per page (default: 4)
- **Computed Values**:
  - `filteredAnimals: Animal[]` — Filtered and sorted list based on search, species, tag, and sort
  - `pageCount: number` — Total number of pages (`Math.ceil(filteredAnimals.length / pageSize)`)
  - `pageItems: Animal[]` — Sliced animals for the active page
- **Methods / Event Handlers**:
  - `onSearchUpdate(val: string)` — Updates search state and resets `page = 1`
  - `onSpeciesUpdate(val: string)` — Updates species state and resets `page = 1`
  - `onTagUpdate(tagId: number | null)` — Updates selected tag and resets `page = 1`
  - `onSortUpdate(val: string)` — Updates sort state
  - `onPageChange(newPage: number)` — Sets `page = newPage`

#### **`AnimalFilters` (Child Component)**
- **Props**:
  - `tags: Tag[]` — Full list of available tags
  - `search: string` — Current search text
  - `species: string` — Current species selection
  - `selectedTagId: number | null` — Currently active tag ID
  - `sort: string` — Current sort order
- **Events Emitted**:
  - `update:search (value: string)` — Emitted on search input change
  - `update:species (value: string)` — Emitted when species dropdown/pill changes
  - `update:tag (tagId: number | null)` — Emitted when tag selection changes
  - `update:sort (value: string)` — Emitted when sort option changes
- **Owns State**: None (stateless, pure presentational component with two-way event contracts).

#### **`AnimalCard` (Child Component - Reused in both views)**
- **Props**:
  - `animal: Animal` — The animal entity to display
  - `owner?: User` — Optional owner/shelter account information
- **Events Emitted**: None (links directly to route `/accounts/:id` or details).
- **Owns State**: None.

#### **`PaginationBar` (Child Component)**
- **Props**:
  - `page: number` — Active page number
  - `pageCount: number` — Total number of pages
- **Events Emitted**:
  - `change (newPage: number)` — Emitted when next/previous or specific page button is clicked
- **Owns State**: None.

---

## Screen 2: Account / Shelter Profile View (`/accounts/:id`)

### Component Tree
```text
AccountView (Page / Route View)
  ├── AccountHeader
  └── AnimalCard (rendered via v-for for each animal owned)
```

### State Ownership & Data Flow

#### **`AccountView` (Parent View)**
- **Owns State**:
  - Nothing directly editable by the visitor.
  - Route dependency: Reads `route.params.id`.
- **Computed Values**:
  - `account: User | undefined` — User matched by ID from mock dataset
  - `userAnimals: Animal[]` — All animals where `animal.userId === account.id`
  - `availableAnimals: Animal[]` — Filtered subset where `animal.status === 'available'`
  - `isBanned: boolean` — Whether the account is banned (`account.banned === true`)
- **Behaviors**:
  - Displays empty state message if `availableAnimals.length === 0`.
  - Displays moderation warning if the account is banned.

#### **`AccountHeader` (Child Component)**
- **Props**:
  - `account: User` — User object containing name, avatar, contact note, phone, location name, coordinates, role, and banned status.
- **Events Emitted**: None.
- **Owns State**: None.

#### **`AnimalCard` (Child Component)**
- **Props**:
  - `animal: Animal` — The user's animal.
- **Events Emitted**: None.
- **Owns State**: None.

---

## Summary of Props Down and Events Up Flow

| Screen | Parent | Child Component | Props Down | Events Up |
|---|---|---|---|---|
| `/animals` | `AnimalsView` | `AnimalFilters` | `tags`, `search`, `species`, `selectedTagId`, `sort` | `update:search`, `update:species`, `update:tag`, `update:sort` |
| `/animals` | `AnimalsView` | `AnimalCard` | `animal`, `owner` | *(None)* |
| `/animals` | `AnimalsView` | `PaginationBar` | `page`, `pageCount` | `change` |
| `/accounts/:id` | `AccountView` | `AccountHeader` | `account` | *(None)* |
| `/accounts/:id` | `AccountView` | `AnimalCard` | `animal` | *(None)* |
