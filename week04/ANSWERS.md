# Week 04 Questions & Answers

### 1. In EventList, what goes wrong if you use the array index as `:key` and the list gets filtered while a card has local state (for example an open details panel)?

When using array indices as `:key`, Vue assumes the component at index `0` is always the same instance across renders because its key does not change. When the list is filtered, Vue reuses and patches the existing DOM node and component instance in-place rather than unmounting or repositioning it. Consequently, any internal component state (such as an open details toggle, local counter, or form input) will incorrectly linger on whichever different event shifts into that index position after the filter.

---

### 2. Why is `visible` a computed and not a function called from the template? What is the difference when you type in the search box?

A `computed` property caches its returned value based on its reactive dependencies (`search`, `category`, `props.events`) and only recalculates when one of those dependencies actually changes. In contrast, a function invoked directly within the template executes on every single component render cycle, even when triggered by completely unrelated updates. When typing in the search box, the computed property calculates the filtered array once per keystroke and efficiently shares that cached result between the count text and the `v-for` loop, whereas a template function would redundantly filter the entire list multiple times per render.

---

### 3. EventCard emits `book` instead of changing `event.booked`. Give two reasons.

First, this follows Vue's unidirectional data flow principle ("props down, events up"), where child components must never mutate props directly so that data mutations remain predictable, trackable, and maintainable. Second, booking an event involves application-wide state management and side effects, such as appending to `myBookings`, updating the total booking count, and persisting data to `localStorage`. Because the parent (`App.vue`) owns and coordinates this data, `EventCard` should only emit an event to announce user intent rather than attempting to modify the shared data source itself.

---

### 4. You write `const { booked } = reactive(event); booked++`. The page does not change. Why?

Destructuring a `reactive` object extracts `booked` as a primitive JavaScript number, which is passed and copied by value rather than by reference. As a result, `booked` becomes an isolated local variable detached from Vue's reactive proxy. Incrementing `booked++` modifies only this local variable without invoking the reactive proxy's setter, meaning Vue is never notified of a change and therefore does not trigger a DOM re-render.

---

### 5. Where does `myBookings` live, and why not in EventCard or EventList?

`myBookings` lives in the top-level root component, `App.vue`. It cannot live in `EventCard` because each card is isolated to a single event and is frequently unmounted when filtered out of the DOM. It cannot live in `EventList` because other parts of the application outside the list—specifically the `App.vue` header showing the total booking count ("You have booked N seats") and the `watch` effect syncing with `localStorage`—need access to it. Under the "lift state up" architectural rule, shared state must reside in the lowest common ancestor of all components that depend on it.
