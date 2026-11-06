# Week 6 Practice: ANSWERS.md

### 1. `DELETE /events/2` returns 204 and the second call returns 404. Is DELETE still idempotent? Explain with what idempotent means.
Yes, `DELETE` is idempotent. An HTTP method is idempotent if making multiple identical requests has the same intended effect on the server's resource state as a single request. After the first call deletes event 2, subsequent calls leave event 2 deleted (absent from the server); differing status codes (204 No Content vs. 404 Not Found) reflect the lookup result, not a change in the server's persistent state.

### 2. The Vue app on port 5173 calls the API on port 3000. Which program blocks the response when CORS is not configured, and why can `curl` read it anyway?
The web browser blocks the response, not the server. Browsers enforce the Same-Origin Policy (SOP) and inspect response headers, refusing to pass data to client-side JavaScript if the `Access-Control-Allow-Origin` header is absent or does not match the requesting origin. In contrast, `curl` is a command-line client that does not implement or enforce the browser security sandbox, so it displays whatever bytes the server returns regardless of CORS headers.

### 3. `EventsController` never writes `new EventsService()`. Who creates the service, when, and how many are created?
The NestJS Inversion of Control (IoC) runtime container instantiates `EventsService`. It creates the instance during application bootstrap when resolving dependencies before the server begins accepting requests. By default, NestJS providers have singleton scope, so exactly one shared instance is created for the entire application lifecycle.

### 4. A client sends `{ "title": "Pitch Night", ..., "booked": 50 }`. Which line of code refuses it, and what would happen to `booked` without it?
It is refused by `forbidNonWhitelisted: true` in the `ValidationPipe` options configured in [`src/setup.ts`](file:///c:/Main/Github/Y3-S1-Internet-Programming/campus-events-api-week06/src/setup.ts). Without this option, `whitelist: true` would strip `booked` silently; if whitelisting were completely disabled, `booked: 50` would pass into the handler and allow the client to arbitrarily overwrite server-managed booking counts.

### 5. Why is the "not enough seats" rule in `BookingsService` and not in `BookingsController` or only in the Vue form?
The rule belongs in `BookingsService` because services encapsulate domain logic and data integrity rules, while controllers should remain thin adapters solely responsible for HTTP routing and parameter mapping. Placing the check only in the frontend Vue form leaves the API vulnerable to direct HTTP requests or race conditions; placing it in the service guarantees that capacity limits are always enforced regardless of the client or interface used.

