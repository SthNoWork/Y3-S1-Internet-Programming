# Paw Finder

Paw Finder is a web-based system where people who have animals that need a new home can create an account, set their location and post the animals they have available. Anyone can find an animal to adopt without an account, by browsing a map of locations or searching a list of all animals with filters. Adoption itself happens by contacting the poster directly.

## Technology stack

| Layer          | Technology                                                   |
| -------------- | ------------------------------------------------------------ |
| Language       | TypeScript (strict mode)                                     |
| Frontend       | Vue 3, Vite, Vue Router, Pinia                               |
| Map            | Leaflet with OpenStreetMap                                   |
| Backend        | NestJS (REST API), documented with Swagger                   |
| Database       | PostgreSQL with Prisma ORM (migrations and seed script)      |
| Authentication | Password hashing (bcrypt), JWT, guards for roles and ownership |
| Quality        | ESLint, Vitest (frontend), Jest and Supertest (backend)      |
| Deployment     | Docker, docker compose, Nginx, GitHub Actions                |

## Problem

People who need to find a new home for animals have to rely on scattered social media groups where posts get buried and details like location and requirements are missing. People who want to adopt have no single place to see where animals are available and to search and filter them, and should not have to sign up just to look.

## Users and roles

- Visitor (no account): finds animals on a map or in a filtered list, reads the adoption requirements and sees the poster's contact details. Visitors never need to log in.
- Poster (member): creates an account only to post animals for adoption. Each account has one location and can post any number of animals. They edit or delete their own animals and mark them as adopted.
- Admin: moderates the platform by removing animals or banning accounts that break the rules (scams, spam, inappropriate content).

## User stories

1. As a visitor, I want to see a map of all locations that have animals for adoption so that I can find the ones close to me.
   Accepted when:
   - The map shows one pin per account that has at least one available animal, and I can drag and zoom it.
   - Clicking a pin opens a popup with the account name and a link to that account's page.
   - Accounts with no available animals do not appear on the map.
   - A loading state is shown while the pins load, and an error message if they fail to load.

2. As a visitor, I want to open an account's page so that I can see the animals available at that location and contact the poster.
   Accepted when:
   - The page shows the account's name, location, contact details and a list of its available animals.
   - Each animal shows its photo, name, species, tags, details and adoption requirements (for example "needs a fenced yard, no small children").
   - The page needs no login.
   - An unknown account id shows a "not found" page, and an account with no available animals shows an empty state.

3. As a visitor, I want to see a list of all available animals with search and filters so that I only see animals that fit what I am looking for.
   Accepted when:
   - I can search by name and filter by species, tag and location.
   - Results load 10 per page, and changing a filter returns me to page 1.
   - Results can be sorted by newest first.
   - Each result links to its account's page.
   - No results shows an empty state with a way to clear the filters.

4. As a poster, I want to register, log in and set my location and contact details once so that I can post animals.
   Accepted when:
   - Registration checks the fields on the client and on the server, and the password is stored hashed.
   - An email that is already registered is rejected with a clear message.
   - I set my account's location (name and coordinates) and my contact details, and they are shown on my account page.
   - Pages for posting and managing animals send me to the login page when I am not logged in.

5. As a poster, I want to post an animal that needs a home so that people can find it and contact me.
   Accepted when:
   - I can create an animal with name, species, details, adoption requirements, image and tags.
   - The animal belongs to my account and uses my account's location.
   - Required fields are validated on the client and on the server, and the server answers 400 with a clear error when they are invalid.
   - The new animal is visible to everyone right after I save.

6. As a poster, I want to edit, delete and mark my animals as adopted so that the list only shows animals that are still available.
   Accepted when:
   - I can edit or delete only my own animals, and trying another account's animal returns 403.
   - An animal has a status of Available or Adopted, and I can change it back to Available if the adoption falls through.
   - Adopted animals disappear from the map, the account page and the list.
   - I can see all of my own animals, including adopted ones, in one list.

7. As an admin, I want to remove inappropriate animals and ban accounts so that adopters can trust what they see on the platform.
   Accepted when:
   - Only an admin can remove any animal or ban any account.
   - Banning an account hides its animals and its pin, and the account cannot log in.
   - The admin account is created by the seed script.

8. As a poster, I want to click on a map to choose my location so that I do not have to type coordinates.
   Accepted when:
   - Clicking the map puts a pin and fills in the latitude and longitude.
   - Coordinates outside the valid range are rejected on the client and on the server.

9. As a visitor, I want to report a suspicious account so that the admin can review it.
   Accepted when:
   - I can send a report with a short reason without logging in.
   - The admin can see the reports for each account.

## MVP scope

Must have:

- Story 1 : Map page with one pin per location
- Story 2 : Account page with its available animals
- Story 3 : List of all animals with search, filters and pagination (stretch feature)
- Story 4 : Poster registers, logs in and sets location and contact details
- Story 5 : Poster posts an animal
- Story 6 : Poster edits, deletes and marks animals as adopted
- Story 7 : Admin moderation

Nice to have:

- Story 8 : Click on the map to choose a location
- Story 9 : Report a suspicious account

## Entities

| Entity | Main attributes                                                                                     | Relations                                          |
| ------ | --------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| User   | name, email, password hash, phone, contact note, location name, latitude, longitude, role (poster, admin), banned | has many Animals                       |
| Animal | name, species, details, requirements, image URL, status (available, adopted)                        | belongs to one User; has many Tags                 |
| Tag    | name (for example dog, cat, kid-friendly, vaccinated)                                               | has many Animals                                   |

User to Animals is one-to-many: one account has one location and any number of animals. Animals and Tags is many-to-many. Tags come from a fixed list created by the seed script, so there are no duplicates such as "Dog" and "dogs".

## Pages

| Page                        | Route            | Who can see it |
| --------------------------- | ---------------- | -------------- |
| Map                         | /map             | everyone       |
| Account (location, animals) | /accounts/:id    | everyone       |
| All animals with filters    | /animals         | everyone       |
| Register and login          | /register, /login | everyone      |
| My animals and my account   | /my              | poster         |
| Admin                       | /admin           | admin          |

## Stretch feature

One of: search + pagination.
What it does in this app:

**Search + filter (pagination)**

- Allows visitors to search animals by name and filter by species, tag and location.
- Results show the photo, name, species, location and tags, sorted by newest first.
- Results load 10 per page, and the server does the filtering and paging.

## Repository

https://github.com/<you>/<project>
