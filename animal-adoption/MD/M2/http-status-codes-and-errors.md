# HTTP Status Codes & Error Handling Guide

A practical reference guide for REST APIs in NestJS, specifically designed for Paw Finder (Milestone 2 & Milestone 3).

---

## 1. Quick Decision Matrix

| Method | Typical Action | Success Status | Potential Error Statuses | Rule of Thumb |
| :--- | :--- | :--- | :--- | :--- |
| **`GET`** | List items (e.g. `/animals`) | `200 OK` | `400` *(if query invalid)* | Empty list returns `200 []`, **not** `404`. |
| **`GET`** | Get single item (e.g. `/animals/:id`) | `200 OK` | `400`, `404` | Returns `404` if the ID does not exist. |
| **`POST`** | Create record (e.g. `/animals`) | `201 Created` | `400`, `401`, `409` | Returns `201` when new row is inserted. |
| **`PATCH`** | Partial update (e.g. `/animals/:id`) | `200 OK` | `400`, `401`, `403`, `404` | Returns `403` if client does not own the resource. |
| **`DELETE`**| Remove record (e.g. `/animals/:id`) | `204 No Content` | `401`, `403`, `404` | Body is empty on successful deletion. |

---

## 2. Success Status Codes (`2xx`)

### `200 OK`
- **What it means:** The request succeeded, and data is returned in the response body.
- **When to use:**
  - `GET /animals` (returns array of animals).
  - `GET /animals/:id` (returns single animal).
  - `PATCH /animals/:id` (returns the updated animal).
- **Why:** In HTTP/REST, `200` communicates that the server performed the read or update operation and is sending back the payload.

### `201 Created`
- **What it means:** The request succeeded, and a brand-new resource was created in the database.
- **When to use:**
  - `POST /animals` (new animal listing created).
  - `POST /accounts/register` (new user/shelter account registered).
- **Why:** Differentiates between just processing data (`200`) vs creating a persistent database entity (`201`).

### `204 No Content`
- **What it means:** The action was executed successfully, but there is no content to send back.
- **When to use:**
  - `DELETE /animals/:id` (animal removed from database).
- **Why:** Returning data after deleting an entity is redundant. `204` saves bandwidth and signals to the client that the item is gone.

---

## 3. Client Error Status Codes (`4xx`)

### `400 Bad Request`
- **What it means:** The client sent invalid data or a malformed request that failed validation.
- **When to use:**
  - Missing required fields (e.g., submitting `{}` without `name` or `birthDate`).
  - Invalid data formats (e.g., sending `birthDate: "tomorrow-sometime"` or `email: "not-an-email"`).
  - Value out of bounds (e.g., negative numbers, empty strings when non-empty required).
- **Why:** The client made a mistake in their request payload. The server refuses to process it until the client corrects the data.

### `401 Unauthorized` *(Introduced in M3)*
- **What it means:** Authentication failed or is missing entirely (**"Who are you?"**).
- **When to use:**
  - Request is missing the `Authorization: Bearer <token>` header or auth cookie.
  - The JWT token is invalid, tampered with, or expired.
  - Invalid credentials on login (`POST /auth/login` with wrong password).
- **Why:** Tells the client that they must log in or refresh their session before accessing this endpoint.

### `403 Forbidden` *(Introduced in M3)*
- **What it means:** The server knows who the user is, but they lack permission (**"I know who you are, but you are not allowed to do this"**).
- **When to use:**
  - **Ownership check:** Shelter A is logged in, but tries to run `PATCH /animals/42` or `DELETE /animals/42` on an animal owned by Shelter B.
  - **Role check:** A regular user tries to access admin-only endpoints (`GET /admin/users`).
  - **Account status:** A user account has `banned: true` and attempts to post an animal.
- **Why:** Prevents authenticated users from tampering with resources that do not belong to them.

> ### Summary Comparison: `401` vs `403`
> | Code | Core Meaning | Identity Known? | Example |
> | :--- | :--- | :--- | :--- |
> | **`401 Unauthorized`** | Missing or invalid authentication | **No** | Guest tries to post an animal without logging in. |
> | **`403 Forbidden`** | Insufficient permissions / Not owner | **Yes** | Shelter A tries to delete Shelter B's animal. |

### `404 Not Found`
- **What it means:** The requested resource does not exist in the database or the URL path is invalid.
- **When to use:**
  - `GET /animals/9999` where ID `9999` is not found in the database.
  - `PATCH /animals/9999` or `DELETE /animals/9999` where the target row does not exist.
  - `GET /accounts/9999` where the shelter account is not found.
- **Why:** Clearly informs the client that the lookup key is absent rather than throwing a generic server crash.

### `409 Conflict`
- **What it means:** The request violates a database constraint or unique business rule.
- **When to use:**
  - Registering an account with an email that is already in use (`email UK`).
  - Attempting to adopt an animal that has already been marked as `adopted`.
- **Why:** Distinguishes between syntax errors (`400`) and logical state conflicts with existing database data (`409`).

---

## 4. Server Error Status Codes (`5xx`)

### `500 Internal Server Error`
- **What it means:** The server encountered an unexpected error or unhandled exception.
- **When to use:**
  - Database connection pool drops or PostgreSQL is unreachable.
  - Unhandled code bug (e.g. `TypeError: Cannot read properties of undefined`).
- **Why:** Generic fallback indicating the problem is on the server infrastructure side, not caused by the client's payload.

---

## 5. Course-Mandated Error Response Shape

As required by Appendix B in `MD/project_guidelines.md`, every error response must strictly adhere to the following JSON structure:

```json
{
  "statusCode": 400,
  "message": [
    "Animal name is required",
    "Birth date must be a valid ISO date string (YYYY-MM-DD)"
  ],
  "error": "Bad Request"
}
```

### Response Field Breakdown:
- **`statusCode`** (`number`): The HTTP status code number (`400`, `401`, `403`, `404`, `500`).
- **`message`** (`string[]`): An array of specific, human-readable error descriptions.
- **`error`** (`string`): The standard HTTP error phrase (e.g. `"Bad Request"`, `"Forbidden"`, `"Not Found"`).
