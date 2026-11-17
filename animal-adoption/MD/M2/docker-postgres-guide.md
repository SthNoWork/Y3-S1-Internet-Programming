# Docker & PostgreSQL Reference Guide

A comprehensive guide explaining where Docker images come from, how PostgreSQL Docker documentation works, and why specific versions and Linux distributions are chosen for Milestone 2.

---

## 1. Official Links & Documentation

- **Docker Hub Catalog Search:** [https://hub.docker.com/search](https://hub.docker.com/search)_The official central repository to search for verified, hardened, and official Docker container images._
- **Official PostgreSQL Image Documentation:** [https://hub.docker.com/_/postgres](https://hub.docker.com/_/postgres)
  _Detailed reference covering PostgreSQL environment variables (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`), initialization scripts, volume mounts, and supported tags._

---

## 2. Why Version `16` Specifically?

When selecting a database image tag on Docker Hub, you will see many options (`14`, `15`, `16`, `17`, `18`, `19rc2`, `latest`). We specifically pin **version `16`** for the following architectural reasons:

### 1. Stability & Long-Term Support (LTS)

PostgreSQL 16 is fully stabilized, battle-tested in production, and supported with zero compatibility issues across Prisma ORM, Node.js database drivers, and local developer workstations (macOS, Linux, Windows WSL2).

### 2. Avoids Major Breaking Changes in v18+

As explicitly warned in the [official PostgreSQL Docker documentation](https://hub.docker.com/_/postgres):

> _"The PGDATA environment variable of the image was changed to be version specific in PostgreSQL 18 and above... For 18 it is `/var/lib/postgresql/18/docker`. Later versions will replace 18 with their respective major version... Mounts and volumes should be targeted at the updated location."_

- In versions 17 and below, the standard persistent volume mount is simply `/var/lib/postgresql/data`.
- In version 18+, volume mounting changes structure, which breaks conventional tutorials and common starter configurations if not manually configured.

### 3. Never Use `latest` or `rc` (Release Candidate) Tags

- **`latest`:** This is a floating tag. If Docker pulls a brand-new major release overnight (e.g. Postgres 17 or 18), your local database schema or migrations could unexpectedly break right before an evaluation or grading deadline.
- **`19rc2`:** `rc` stands for _Release Candidate_ (pre-release software). These are unstable testing builds intended for database core developers, not for student projects or stable applications.

---

## 3. Why `-alpine` vs. Other Linux Distros?

Every PostgreSQL Docker image is packaged with an underlying Linux operating system. The suffix on the tag determines which OS runs inside the container:

| Distribution Tag               | Underlying OS           | Image Download Size | Memory Footprint | Attack Surface / CVEs                  |
| :----------------------------- | :---------------------- | :------------------ | :--------------- | :------------------------------------- |
| **`16-alpine`** _(Our Choice)_ | **Alpine Linux**        | **~80 MB**          | Very Low         | **Minimal** (strips unneeded packages) |
| **`16-bookworm`** _(Default)_  | **Debian 12**           | **~450 MB**         | Moderate         | Larger (includes full GNU toolset)     |
| **`16-trixie`**                | **Debian 13 (Testing)** | **~450 MB**         | Moderate         | Experimental testing packages          |

---

## 4. When to Use Each Flavor

### When to use `alpine` (`postgres:16-alpine`):

- **Development & University Projects:** Fast downloads over residential or university internet connections (~80 MB vs ~450 MB).
- **Fast Startup:** Container boots in 1–2 seconds.
- **Microservices & Cloud Deployments:** Consumes fewer server resources and reduces bandwidth transfer costs.
- **Security-First:** Contains near-zero unnecessary background packages, shrinking the surface for known vulnerabilities.

### When to use `bookworm` (`postgres:16-bookworm`):

- **Complex Native C Extensions:** When your database requires custom C extensions (e.g., specific PostGIS spatial analysis packages, custom full-text search dictionaries) that depend on standard GNU `glibc` libraries rather than Alpine's `musl libc`.
- **Full System Locales:** When non-UTF8 legacy system locales must be installed at the operating system level.

### When to use `trixie` (`postgres:16-trixie`):

- **Bleeding-Edge Debian Testing:** Only when you are deliberately testing compatibility with the next unreleased version of Debian.

---

## 5. Why We Chose `postgres:16-alpine` for Paw Finder

1. **Lightweight & Fast:** Downloads and starts in seconds, saving disk space on your local computer.
2. **Standard Volume Path:** Mounts reliably to `postgres_data:/var/lib/postgresql/data`.
3. **100% Prisma Compatible:** Prisma CLI, migrations, and seeding scripts communicate seamlessly with Postgres 16.
4. **Reproducible:** Using the exact tag ensures every teammate, CI pipeline, and grading instructor runs the identical database environment.

---

## 6. Ready-to-Use Docker Compose Reference

### `docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: pawfinder-postgres
    restart: always
    environment:
      POSTGRES_USER: pawfinder
      POSTGRES_PASSWORD: pawfinder_secret
      POSTGRES_DB: pawfinder_db
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Matching `.env` Connection String

```env
PORT=3000
DATABASE_URL="postgresql://pawfinder:pawfinder_secret@localhost:5432/pawfinder_db?schema=public"
```

### Port Explanation: Why Port 3000 vs 5432?

- **Port `3000` (`PORT`):** The HTTP web port for your **NestJS backend application**. Browsers, Swagger, and frontend API calls communicate with NestJS at `http://localhost:3000`.
- **Port `5432` (`DATABASE_URL`):** The internal database port for **PostgreSQL**. NestJS connects directly to PostgreSQL inside the database connection string. PostgreSQL does not speak HTTP, so browsers cannot visit port 5432 directly.

### Connection String Anatomy

```text
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
 │            │    │        │    │    │        │
 │            │    │        │    │    │        └── PostgreSQL schema (default: "public")
 │            │    │        │    │    └─────────── Database name (e.g. "pawfinder_db")
 │            │    │        │    └──────────────── PostgreSQL port ("5432")
 │            │    │        └───────────────────── Server host ("localhost")
 │            │    └────────────────────────────── Database password (e.g. "pawfinder_secret")
 │            └─────────────────────────────────── Database username (e.g. "pawfinder")
 └──────────────────────────────────────────────── Database protocol driver
```

### Basic Commands

```bash
# Start container in background
docker compose up -d

# Check running status
docker ps

# View database logs
docker logs pawfinder-postgres

# Stop container without losing data
docker compose down

# Stop and delete container AND wipe volume data
docker compose down -v
```
