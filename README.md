# Berry Fitness for Health API

Backend for the Berry Fitness for Health website (`../berry`). Express, Prisma and MariaDB, with its own database.

## Run it locally

Needs Node.js 20+ and MariaDB.

```bash
npm install
cp .env.example .env          # set DATABASE_URL and JWT_SECRET
npm run prisma:deploy         # create the tables
BERRY_ADMIN_PASSWORD='choose-a-strong-password' npm run seed
npm run dev                   # http://localhost:4001, Swagger docs at /docs
```

`npm run seed` loads Berry's content. It is safe to re-run and never overwrites edits made in the admin. It reads gallery photos from `../berry/seed/gallery`; set `BERRY_DIR` if the website is elsewhere.

Create the database as a MariaDB admin:

```sql
CREATE DATABASE berry_fitness CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'berry_fitness'@'localhost' IDENTIFIED BY 'a-strong-password';
GRANT ALL PRIVILEGES ON berry_fitness.* TO 'berry_fitness'@'localhost';
```

Every `/api` request must send `X-App-Key: berry`; the website adds it automatically. The API reference is in `../berry/docs/API.md`.

Manage the app record and admin logins with `npm run app` (see `scripts/app.ts`).
