# WorkSphere Railway Deployment

Use Railway for both the web app and PostgreSQL. The deployed Railway URL serves the React frontend and Express API from one service.

## 1. Create Railway Project

1. Push this repository to GitHub.
2. In Railway, create a new project from the GitHub repository.
3. Add a Railway PostgreSQL database plugin/service.
4. Railway will provide `DATABASE_URL` automatically if the web service is connected to the database.

## 2. Web Service Settings

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

The backend serves the built frontend from `client/dist` when `NODE_ENV=production`.

## 3. Environment Variables

Set these in the Railway web service:

```text
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<long random secret>
JWT_REFRESH_SECRET=<different long random secret>
NODE_ENV=production
CLIENT_URL=https://your-railway-app.up.railway.app
CLIENT_URLS=https://your-railway-app.up.railway.app
```

Do not set `VITE_API_URL` for the single-service Railway deployment. The frontend will call `/api/...` on the same domain.

## 4. Initialize Database

After the first deployment succeeds, open Railway Shell for the web service and run:

```bash
npm run railway:seed
```

This runs Prisma schema sync and inserts demo data.

## 5. Verify Demo

Open:

```text
https://your-railway-app.up.railway.app/health
```

Expected:

```json
{
  "status": "ok",
  "service": "WorkSphere API",
  "database": "connected"
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
