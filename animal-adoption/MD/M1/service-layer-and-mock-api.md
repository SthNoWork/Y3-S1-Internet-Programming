# Day 3 Study Guide: The Service Layer & Async Data

Welcome to Day 3! Today’s goal is to understand what a **Service Layer** is, why we use it, and how to write one step-by-step without getting overwhelmed.

---

## Part 1: The Waiter Analogy (What is a Service Layer?)

Imagine you are sitting in a restaurant:
1. **You (The Customer)** = The Vue Component (e.g., `SearchView.vue` or a Pinia Store).
2. **The Waiter** = The **Service Layer** (`adoptionService.ts`).
3. **The Kitchen / Storage** = The Database or Backend API (or mock data array).

### Why not walk into the kitchen yourself?
If the customer walks directly into the kitchen to grab ingredients:
- The customer needs to know how the kitchen is arranged.
- If the restaurant changes the kitchen layout tomorrow, the customer gets lost.

**In Code:**
If `SearchView.vue` imports `ANIMALS` directly from `animals.ts`:
- Today, it's a local TypeScript array.
- In Week 6, when you switch to NestJS, you would have to open every single Vue file and rewrite how they get data.

**The Solution (The Waiter):**
The component simply tells the service: *"Hey service, please `getAnimals()` for me."*  
The component does not care *how* the service gets the animals (whether from local mock data today or a NestJS server next week). When you switch to NestJS, you **only update the service file**. Your Vue components stay 100% untouched!

---

## Part 2: What is a `Promise` and why use `setTimeout`?

### 1. What is a `Promise`?
In JavaScript, a `Promise` is like a **restaurant buzzer**:
- When you order food, the waiter hands you a buzzer. The food isn't ready yet (it is **pending**).
- You can keep chatting at your table while waiting.
- When the food is ready, the buzzer vibrates:
  - **`resolve(food)`**: Here is your meal! You receive the data.
  - **`reject(error)`**: Sorry, the kitchen ran out of ingredients. An error occurred.

### 2. Why use `setTimeout` for mock data?
A computer reads local mock files in `0.001` milliseconds. That is instantaneous.  
However, the Milestone 1 rubric requires:
> **"Loading, empty, and error states visible"**

If data loads in `0.001` milliseconds:
- Your loading spinner will flash for 1 millisecond and disappear before human eyes can see it.
- By adding a `500ms` delay using `setTimeout`, your loading spinner stays on screen just long enough to prove your loading state works!

---

## Part 3: Step-by-Step Code Walkthrough

Build `src/services/adoptionService.ts` in 3 small mini-steps:

### Step 1: Return Animals with a Delay
Create the function and wrap the return in `new Promise` and `setTimeout`:

```typescript
import { ANIMALS } from '@/data/animals'
import type { Animal } from '@/types/animal'

export const adoptionService = {
  async getAnimals(): Promise<Animal[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // After 500ms, deliver the animals array
        resolve([...ANIMALS])
      }, 500)
    })
  }
}
```

### Step 2: Add an Error Switch (To Test Error States)
Add a flag `simulateError = false`. If you pass `true`, it rejects instead of resolving:

```typescript
async getAnimals(simulateError = false): Promise<Animal[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (simulateError) {
        // Simulates server down / 500 error
        reject(new Error('Failed to load animals from shelter network.'))
      } else {
        resolve([...ANIMALS])
      }
    }, 500)
  })
}
```

### Step 3: Fetch a Shelter by ID (and their animals)
When a user clicks "Contact Shelter", you need that shelter's profile and their specific animals:

```typescript
import { ACCOUNTS } from '@/data/accounts'
import type { Account } from '@/types/account'

async getAccountById(accountId: number): Promise<{ account: Account; animals: Animal[] } | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const account = ACCOUNTS.find((acc) => acc.id === accountId)
      if (!account) {
        resolve(null)
        return
      }

      // Filter only animals belonging to this shelter
      const animals = ANIMALS.filter((a) => a.accountId === accountId)
      resolve({ account, animals })
    }, 500)
  })
}
```

---

## Part 4: DTO vs. Service (Quick Reference)

| Term | What is it? | Real-World Analogy | Example in this Project |
| :--- | :--- | :--- | :--- |
| **DTO / Type** | The **shape** of the data | The order ticket / menu item | `interface Account`, `interface Animal` |
| **Service** | The **worker** that fetches/sends data | The waiter delivering the food | `adoptionService.getAnimals()` |

---

## Part 5: Quick Self-Check

1. **Why shouldn't `SearchView.vue` import `ANIMALS` directly?**  
   *Answer:* Because when you switch to NestJS in Week 6, you would have to rewrite every Vue component instead of just changing one service file.

2. **Why do we add a 500ms `setTimeout`?**  
   *Answer:* To simulate real internet latency so you can visually verify that your loading spinner works.

3. **What is the difference between `resolve()` and `reject()`?**  
   *Answer:* `resolve()` delivers the successful data; `reject()` triggers the error state.

