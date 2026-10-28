# Running Paw Finder

## Prerequisites

- Node.js and npm
- Docker Desktop with the Docker engine running

## Start the database

From the project root:

```powershell
cd db
docker compose up -d
```

The PostgreSQL database runs on `localhost:5432`.

## Start the API

Open another PowerShell terminal:

```powershell
cd api
npm install
npx prisma migrate deploy
npm run start:dev
```

The API runs at `http://localhost:3000`.

## Start the frontend

Open another PowerShell terminal:

```powershell
npm install
npm run dev
```

The frontend normally runs at `http://localhost:5173`.

## Default administrator

Run the seed command once after starting the database:

```powershell
cd api
npm run prisma:seed
```

The seed creates an administrator account using the credentials documented in the API seed configuration. Change the password before using the application outside local development.

## Stop the database

```powershell
cd db
docker compose down
```
