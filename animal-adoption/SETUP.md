# Project Setup & Development Environment Guide

This guide details how to clone, configure, and run **Paw Finder** on a new machine or laptop from scratch.

---

## 1. Prerequisites to Install

Make sure the following tools are installed on your machine:

| Tool | Recommended Version | Check Command | Download Link |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>= 20.x` (LTS) | `node -v` | [nodejs.org](https://nodejs.org/) |
| **npm** | `>= 10.x` | `npm -v` | Bundled with Node |
| **Docker Desktop** | Latest (WSL2 engine on Windows) | `docker --version` | [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/) |
| **Git** | Latest | `git --version` | [git-scm.com](https://git-scm.com/) |

> [!IMPORTANT]
> Make sure Docker Desktop is **running** in the background before starting the database or running backend migrations.

---

## 2. Clone the Repository

```bash
git clone <your-repo-url>
cd animal-adoption
git checkout M2
```

---

## 3. Environment Variables Configuration (`.env`)

Because `.env` files contain sensitive credentials and are ignored by Git (`.gitignore`), you must configure them on any new machine.

### A. Root `.env` (Docker Compose)
Copy `.env.example` to `.env` in the root folder:
```powershell
cp .env.example .env
```
*Contents (`.env`):*
```env
PORT=3000
DATABASE_URL="postgresql://pawfinder:pawfinder_secret@localhost:5432/pawfinder_db?schema=public"
NODE_ENV=development
```

### B. Backend `.env` (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```powershell
cp backend/.env.example backend/.env
```
*Contents (`backend/.env`):*
```env
PORT=3000
DATABASE_URL="postgresql://pawfinder:pawfinder_secret@localhost:5432/pawfinder_db?schema=public"
```

---

## 4. Install Dependencies

Install packages for both frontend (root) and backend:

```powershell
# 1. Frontend dependencies (from project root)
npm install

# 2. Backend dependencies
cd backend
npm install
cd ..
```

---

## 5. Start the PostgreSQL Database (Docker)

From the project root:

```powershell
docker compose up -d
```

- Verify the container is running:
  ```powershell
  docker ps
  ```
  You should see `pawfinder-postgres` running with port mapping `0.0.0.0:5432->5432/tcp`.

---

## 6. Run Database Migrations & Seeding

Generate the database tables and populate mock data (species, tags, shelter accounts, and pets):

```powershell
cd backend

# Run migrations (creates tables in PostgreSQL)
npx prisma migrate dev

# Run seed script (inserts 4 species, 8 categories, 5 shelters, 10 animals)
npx prisma db seed
```

*(Optional) Launch Prisma Studio to visually inspect database rows:*
```powershell
npx prisma studio
```
Prisma Studio opens at `http://localhost:5555`.

---

## 7. Running the Application

Open two terminal windows:

### Terminal 1: Backend API (NestJS)
```powershell
cd backend
npm run start:dev
```
- API server runs at: `http://localhost:3000`

### Terminal 2: Frontend (Vue 3 + Vite)
```powershell
# From project root
npm run dev
```
- Frontend app runs at: `http://localhost:5173`

---

## 8. Summary of Quick Commands (Cheat Sheet)

```powershell
# Start Database
docker compose up -d

# Stop Database
docker compose down

# Re-run Migrations & Seed
cd backend
npx prisma migrate dev
npx prisma db seed

# Start Backend
npm run start:dev

# Start Frontend (from root)
npm run dev
```
