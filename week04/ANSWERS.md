# Week 04 Questions & Answers

### 1. In EventList, what goes wrong if you use the array index as `:key` and the list gets filtered while a card has local state (for example an open details panel)?

If you filter the list, the items change positions, but their index keys (`0, 1, 2...`) stay the same. 

Because Vue reuses elements based on their key, the card at index `0` stays rendered even if a different event moves into that spot. Any local state (like an open details toggle or form input) will stay open on the wrong card instead of following the original event. Using a unique ID like `:key="event.id"` fixes this.

---

### 2. Why is `visible` a computed and not a function called from the template? What is the difference when you type in the search box?

- **Caching:** A `computed` property caches its result and only recalculates when dependencies (`search`, `category`, `props.events`) change. A template function runs on every single render, even for unrelated updates.
- **When typing in the search box:** The `computed` property filters the array once per keystroke and reuses the result for both the count display and the `v-for` list. Calling a function in the template would run the filtering logic multiple times on every keystroke.

---

### 3. EventCard emits `book` instead of changing `event.booked`. Give two reasons.

1. **One-way data flow (Props down, events up):** Child components should not mutate props directly. Keeping data flow one-way prevents bugs and makes it clear which component is responsible for changing state.
2. **App-level logic belongs in the parent:** Booking an event doesn't just change that card—it updates `myBookings`, updates the header's total count, and syncs to `localStorage`. `App.vue` owns this data, so `EventCard` should just notify the parent by emitting an event.

---

### 4. You write `const { booked } = reactive(event); booked++`. The page does not change. Why?

Destructuring breaks reactivity. 

`booked` is a primitive number, so destructuring it just copies the raw number value into a local variable. Incrementing `booked++` only changes that local variable, not the original `event` object. Because the reactive object was never modified, Vue doesn't know anything changed and doesn't update the DOM. (You would need `toRefs()` to keep reactivity when destructuring).

---

### 5. Where does `myBookings` live, and why not in EventCard or EventList?

It lives in `App.vue`.

- **Why not `EventCard`:** Each card only handles one event and can be unmounted when filtered out. A single card shouldn't hold the user's entire booking history.
- **Why not `EventList`:** Components outside `EventList` also need `myBookings`—specifically the booking counter in the `App.vue` header and the `watch` effect that saves data to `localStorage`.

By lifting the state up to `App.vue`, both the header and `EventList` can easily share the same data.

