# Pet Adoption Project: Study Guide & Reference Sheet

A comprehensive reference covering both the **CSS layout rules** and the **Vue 3 + TypeScript architecture** used throughout this application.

---

## 1. CSS Spacing: Padding vs. Margin vs. Gap

### The Visual Box Model (ASCII Diagram)

```text
+-------------------------------------------------------+
|  CONTAINER                                            |
|                                                       |
|       +---------------------------------------+       |
|       | MARGIN (Transparent personal space)   |       |
|       |   +-------------------------------+   |       |
|       |   | BORDER                        |   |       |
|       |   |   +-----------------------+   |   |       |
|       |   |   | PADDING (Inner space) |   |   |       |
|       |   |   |   +---------------+   |   |   |       |
|       |   |   |   |    CONTENT    |   |   |   |       |
|       |   |   |   |  (Text, etc)  |   |   |   |       |
|       |   |   |   +---------------+   |   |   |       |
|       |   |   +-----------------------+   |   |       |
|       |   +-------------------------------+   |       |
|       +---------------------------------------+       |
|                                                       |
+-------------------------------------------------------+
```

### Side-by-Side Comparison

| Feature | `padding` | `margin` | `gap` |
| :--- | :--- | :--- | :--- |
| **Where it lives** | **Inside** the border | **Outside** the border | **Between** sibling elements |
| **Applied to** | The element itself | The element itself | The **parent** container |
| **Expands the box?** | **Yes** (grows colored background) | **No** (pushes others away) | **No** (adds space in between) |
| **Clickable area** | **Yes** (part of the button/box) | **No** (empty external space) | **No** (empty space between items) |

### Key Scenarios in the App

#### A. Padding Expands the Badge Surface
```css
/* Gives text breathing room inside the badge background */
.category-badge {
  background-color: #f3e5d8;
  padding: 0.25rem 0.75rem; /* Top/Bottom: 0.25rem, Left/Right: 0.75rem */
}
```

#### B. Margin vs. Gap in Lists
* **`margin-right` on items**: Pushes against the right boundary on the last child, creating uneven outer edges.
* **`gap` on parent container**: Automatically puts space **only between items**, keeping outer margins intact:

```css
.category-list {
  display: flex;
  gap: 0.5rem; /* Space between each badge */
}
```

---

## 2. CSS Alignment: Justify vs. Align

### The Golden Rule of Axes

* **`justify-`** = Controls the **MAIN axis** (The direction items flow).
* **`align-`** = Controls the **CROSS axis** (The perpendicular direction).

```text
flex-direction: row (Default)
------------------------------------------------------
  Main Axis:  ────────────────────────> (justify-*)
  Cross Axis: │
              │
              ▼ (align-*)


flex-direction: column
------------------------------------------------------
  Main Axis:  │
              │
              ▼ (justify-*)
  Cross Axis: ────────────────────────> (align-*)
```

---

## 3. The Suffixes: -items, -content, and -self

| Property | Who gets it? | What does it do? |
| :--- | :--- | :--- |
| **`*-items`** | **Parent** container | Aligns **every individual child** along the cross axis. |
| **`*-content`** | **Parent** container | Distributes lines or extra free space across the whole container. |
| **`*-self`** | **One child** element | Lets **a single child break the rule** set by the parent. |

### Visual Demonstrations from the Project

#### A. Vertical Centering in Search Bar (`align-items: center`)
```css
.search-layout {
  display: flex;
  align-items: center; /* ↕️ Vertically levels the input and the SVG icon */
  gap: 0.5rem;
}
```

```text
+-- .search-layout (align-items: center) --------------------+
|                                                            |
|          +-------------------+                             |
|          |    Search Box     |    ( O ) SearchIcon         |
|          +-------------------+                             |
|                                                            |
+------------------------------------------------------------+
```

#### B. Aligning a Single Child (`align-self: flex-end`)
Inside `.card-content`, items stack in a vertical column (`flex-direction: column; align-items: flex-start`). The link overrides the cross axis to shift to the far right:

```css
.routerlink {
  align-self: flex-end; /* Cross-axis override to the right edge */
}
```

```text
+-- .card-content (flex-direction: column; align-items: flex-start) ---+
|                                                                      |
|  [ Animal Name ]                                                     |
|  [ Description text... ]                                             |
|  [ Requirement Notice ]                                              |
|                                                                      |
|                                              [ Go to Shelter Link ]  | <-- align-self: flex-end
+----------------------------------------------------------------------+
```

---

## 4. Crucial Card & Image Styling Rules

### 1. Border-Radius: Pixels vs. Percentages
* **Percentages (`border-radius: 5%`)**: Calculates curvature relative to height and width independently. On non-square rectangles, corners distort into uneven, egg-shaped arcs.
* **Pixels (`border-radius: 6px` or `8px`)**: Ensures a uniform, consistent curve on all four corners.

### 2. Clipping Child Images (`overflow: hidden`)
When an `<img>` tag fills the width of a rounded card, its square pixels will spill over the corners unless clipped:

```css
.animal-card {
  border-radius: 8px;
  overflow: hidden; /* ✂️ Cuts off image corners that poke past 8px radius */
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### 3. Aspect Ratio and Object-Fit
To prevent images from warping or stretching:

```css
.thumbnail {
  width: 100%;
  aspect-ratio: 4 / 3; /* Maintains standard proportional height */
  object-fit: cover;   /* Crops edges cleanly without squishing the animal */
}
```

### 4. Removing the Red Focus Ring
Browsers apply default `:focus` outlines on form inputs:

```css
.search-input:focus {
  outline: none;            /* Removes default browser border/ring */
  border-color: #8b5a2b;    /* Applies brand-matching active border */
}
```

---

## 5. Vue 3 + TypeScript Architecture

### 1. Reactive Input State (`ref`)
```ts
import { ref } from 'vue';

// Holds user query; updates when user types
const searchQuery = ref('');
```

### 2. Live List Derivation (`computed`)
Never mutate or overwrite your original data array. Instead, derive a filtered view that re-evaluates automatically:

```ts
import { computed } from 'vue';

const filteredAnimals = computed(() => {
  return ANIMALS.filter((animal) => {
    // Both sides converted to lowercase for case-insensitive matching
    return animal.name.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});
```

### 3. Rendering Derived Data in Templates
Feed the computed list into `v-for`, using a stable unique key:

```html
<!-- Always bind :key with a unique ID, never an array index -->
<AnimalCard 
  v-for="animal in filteredAnimals" 
  :key="animal.id" 
  :animal="animal" 
/>
```

### 4. Two-Way Component Communication (`defineModel`)

In Vue 3.4+, child components can sync state directly with parents using `defineModel()`:

#### Child: `SearchBar.vue`
```html
<script setup lang="ts">
import SearchIcon from '@/components/icons/SearchIcon.vue';

// Acts as both a ref and an event emitter synced with v-model
const search = defineModel<string>();
</script>

<template>
  <div class="search-layout">
    <input 
      class="search-input" 
      v-model="search" 
      placeholder="Search animals by name..." 
    />
    <SearchIcon />
  </div>
</template>
```

#### Parent: `SearchView.vue`
```html
<!-- Binds directly to the child's defineModel -->
<SearchBar v-model="searchQuery" />
```

### 5. Type-Safe Props (`defineProps`)
Declare incoming object structures using TypeScript interfaces or types:

```ts
import type { Animal } from '@/types/animal';

defineProps<{
  animal: Animal;
}>();
```

---

## 6. Quick Cheat Sheet Table

| Goal | Technique | Where to place it? |
| :--- | :--- | :--- |
| Add inner breathing room to a badge | `padding: 0.25rem 0.5rem;` | On the element itself |
| Space out items in a flex row without edge spillover | `gap: 0.5rem;` | On the flex parent (`display: flex`) |
| Vertically center an input and an icon | `align-items: center;` | On the flex row parent |
| Push a link to the far right inside a column card | `align-self: flex-end;` | On the link component/tag |
| Prevent square image corners from overflowing rounded cards | `overflow: hidden; border-radius: 8px;` | On the outer card container |
| Keep images undistorted | `aspect-ratio: 4/3; object-fit: cover;` | On the `<img>` element |
| Case-insensitive search match | `item.toLowerCase().includes(query.toLowerCase())` | Inside a `computed()` filter loop |
| Two-way parent/child component binding | `const model = defineModel<string>()` | In the child `<script setup lang="ts">` |