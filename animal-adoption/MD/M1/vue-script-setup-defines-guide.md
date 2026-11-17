# Vue 3 Script Setup Defines Guide

A reference for `defineProps`, `defineEmits`, and `defineModel` in Vue 3 (`<script setup>`).

---

## 1. Quick Summary & Common Practice

In modern Vue 3 with TypeScript, developers almost always use **TypeScript generic syntax** rather than runtime object options because it provides full type safety and auto-completion with less boilerplate.

| Macro | Purpose | Typical Syntax |
| :--- | :--- | :--- |
| `defineProps` | Receives data **down** from parent (read-only) | `defineProps<{ title: string }>()` |
| `defineEmits` | Sends events **up** to parent | `defineEmits<{ (e: 'submit', id: number): void }>()` |
| `defineModel` | **Two-way** binding (`v-model`) | `const value = defineModel<string>({ default: '' })` |

---

## 2. `defineProps` (Parent -> Child)

Props pass data downwards. Props are **read-only** in the child.

### What People Usually Use (TypeScript Generics)
```vue
<script setup lang="ts">
import type { Account } from '@/types/account'

// 1. Basic typed props
const props = defineProps<{
  account: Account
  disabled?: boolean
}>()

// Access in script: props.account
</script>

<template>
  <div>
    <h3>{{ account.name }}</h3>
  </div>
</template>
```

### Setting Default Values (`withDefaults`)
When using TypeScript generics, use `withDefaults()` to set fallback values for optional props:
```vue
<script setup lang="ts">
interface Props {
  count?: number
  theme?: 'light' | 'dark'
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  theme: 'light'
})
</script>
```

### Runtime Syntax (Alternative without TS interfaces)
```vue
<script setup lang="ts">
defineProps({
  name: { type: String, required: true },
  age: { type: Number, default: 0 }
})
</script>
```

---

## 3. `defineEmits` (Child -> Parent)

Emits trigger events on the parent component, optionally passing a payload.

### What People Usually Use (TypeScript Generics)
```vue
<script setup lang="ts">
// Define event names and argument types
const emit = defineEmits<{
  (e: 'save', data: { name: string }): void
  (e: 'cancel'): void
}>()

function onSave() {
  emit('save', { name: 'Max' })
}
</script>

<template>
  <button @click="onSave">Save</button>
  <button @click="emit('cancel')">Cancel</button>
</template>
```

### In the Parent Component
```vue
<ChildComponent @save="handleSave" @cancel="isModalOpen = false" />
```

### Runtime Syntax (Alternative)
```vue
<script setup lang="ts">
const emit = defineEmits(['save', 'cancel'])
</script>
```

---

## 4. `defineModel` (Two-Way Sync `v-model`)

Introduced in Vue 3.4. Replaces the old boilerplate of declaring a `modelValue` prop and an `update:modelValue` emit. `defineModel` returns a `Ref` that automatically stays in sync with the parent.

### Scenario A: Default `v-model` (Most Common)
Child:
```vue
<script setup lang="ts">
// Creates a two-way binding on v-model (prop: modelValue)
const isEditing = defineModel<boolean>({ default: false })
</script>

<template>
  <button @click="isEditing = !isEditing">
    {{ isEditing ? 'Stop Editing' : 'Edit' }}
  </button>
</template>
```

Parent:
```vue
<script setup lang="ts">
import { ref } from 'vue'
import ProfileCard from '@/components/ProfileCard.vue'

const editing = ref(false)
</script>

<template>
  <!-- Synchronizes 'editing' in parent with 'isEditing' in child -->
  <ProfileCard v-model="editing" />
</template>
```

### Scenario B: Named `v-model` (Multiple Models on One Component)
Child:
```vue
<script setup lang="ts">
const firstName = defineModel<string>('firstName', { default: '' })
const lastName = defineModel<string>('lastName', { default: '' })
</script>

<template>
  <input v-model="firstName" placeholder="First Name" />
  <input v-model="lastName" placeholder="Last Name" />
</template>
```

Parent:
```vue
<CustomForm v-model:firstName="user.first" v-model:lastName="user.last" />
```

### Scenario C: Modifiers & Transformers (`get` / `set`)
When you need to clean or format data before reading or writing:
```vue
<script setup lang="ts">
const title = defineModel<string>({
  default: '',
  // Trim string before updating parent
  set(value) {
    return value.trim()
  }
})
</script>
```

---

## 5. Rules of Thumb

1. **One-way data down?** Use `defineProps<{ ... }>()`.
2. **Action notification up?** Use `defineEmits<{ ... }>()`.
3. **Form input / toggle state shared between parent & child?** Use `defineModel<T>()`.
4. **Never mutate props directly:** Never do `props.account = ...`. If the child needs to edit a value owned by the parent, use `defineModel` or emit an event for the parent to update its own state.
