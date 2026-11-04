# Week 5 Practice: ANSWERS

## 1. Refreshing /events/2
In development, Vite's dev server with json-server answers the request by proxying `GET /events/2` from `db.json`. In production, the server must serve the same API endpoint so `/events/2` still loads the correct event.

## 2. Guard stops students from /events/new
The guard only blocks route navigation — students can still create events via the API directly (e.g., curl). What must stop them is a production backend that enforces authentication/authorization, unlike the client-only guard.

## 3. EventDetailPage watch vs onMounted
`onMounted` alone would cause a bug where the event data is undefined on initial render because the navigation guard redirects before the component mounts, and `onMounted` fires after the component is already in the DOM.

## 4. storeToRefs vs destructuring
`EventsPage` uses `storeToRefs(store)` because Pinia stores are reactive proxies — destructuring them loses reactivity. `storeToRefs` creates ref objects that stay reactive when destructured.

## 5. Booking two requests
If the PATCH fails after the POST succeeds, the booking exists but the event's seat count isn't updated (orphaned booking). The server should use a transaction or atomic operation so both succeed or both fail together.