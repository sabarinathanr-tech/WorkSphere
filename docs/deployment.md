# WorkSphere Railway Deployment

Use Railway for the web app. For the database, use a free managed PostgreSQL provider such as Neon Free or Supabase Free. Do not use AWS RDS or any paid AWS PostgreSQL service for this demo.

The deployed Railway URL serves the React frontend and Express API from one service.

## 1. Create Free PostgreSQL

Recommended no-AWS options:

- Neon Free PostgreSQL
- Supabase Free PostgreSQL

Create a free Postgres project and copy the pooled connection string.

It should look like:

```text
postgresql://USER:PASSWORD@HOST/worksphere?sslmode=require
```

If the provider gives you a default database name like `neondb` or `postgres`, that is also fine. Use the exact connection string they provide.

## 2. Create Railway Project

1. Push this repository to GitHub.
2. In Railway, create a new project from the GitHub repository.
3. Do not add a paid AWS/RDS database.
4. Add the free Postgres connection string as `DATABASE_URL` in the Railway web service variables.

Railway also offers a trial/usage-credit path, but it is not the best choice if you want a strictly free database after the trial period.

## 3. Web Service Settings

Railway uses `railway.json` from the repository root.

Build command:

```bash
npm run railway:build
```

Start command:

```bash
npm start
```

Health check:

```text
/health
```

`/health` is a liveness check for Railway and does not require database access. Use `/ready` to verify PostgreSQL.

The backend serves the built frontend from `client/dist` when `NODE_ENV=production`.

## 4. Environment Variables

Set these in the Railway web service:

```text
DATABASE_URL=<your free Neon or Supabase PostgreSQL connection string>
JWT_SECRET=<long random secret>
JWT_REFRESH_SECRET=<different long random secret>
NODE_ENV=production
CLIENT_URL=https://your-railway-app.up.railway.app
CLIENT_URLS=https://your-railway-app.up.railway.app
```

Do not set `VITE_API_URL` for the single-service Railway deployment. The frontend will call `/api/...` on the same domain.

## 5. Initialize Database

After the first deployment succeeds, open Railway Shell for the web service and run:

```bash
npm run railway:seed
```

This runs Prisma schema sync and inserts demo data.

## 6. Verify Demo

Open:

```text
https://your-railway-app.up.railway.app/ready
```

Expected:

```json
{
  "status": "ready",
  "service": "WorkSphere API",
  "database": "connected"
}
```

Railway health checks use:

```text
https://your-railway-app.up.railway.app/health
```

Expected:

```json
{
  "status": "ok",
  "service": "WorkSphere API"
}
```

Then open:

```text
https://your-railway-app.up.railway.app
```

Demo accounts:

```text
admin@worksphere.io / WorkSphere@123!
hr@worksphere.io / WorkSphere@123!
employee@worksphere.io / WorkSphere@123!
```

## Notes

- Real secrets must stay in Railway environment variables only.
- `server/.env` is for local development and is ignored by Git.
- If you change the Railway public URL, update `CLIENT_URL` and `CLIENT_URLS`.
- Avoid AWS RDS for this demo if you want to keep database cost at zero.
