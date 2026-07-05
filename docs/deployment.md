# WorkSphere Deployment

Use this setup for a public demo link:

- Database: Neon PostgreSQL
- Backend API: Render Web Service
- Frontend: Vercel

## 1. Create Online PostgreSQL

Create a Neon project and copy the pooled PostgreSQL connection string.

Use it as `DATABASE_URL` in Render. It should look like:

```text
postgresql://USER:PASSWORD@HOST/worksphere?sslmode=require
```

## 2. Deploy Backend on Render

Create a Render Web Service from this repository.

Use:

```text
Root Directory: server
Build Command: npm install && npm run prisma:generate
Start Command: npm start
Health Check Path: /health
```

Environment variables:

```text
DATABASE_URL=<your Neon connection string>
JWT_SECRET=<long random secret>
JWT_REFRESH_SECRET=<different long random secret>
CLIENT_URL=https://your-worksphere-demo.vercel.app
CLIENT_URLS=https://your-worksphere-demo.vercel.app
NODE_ENV=production
PORT=5000
```

After the first deploy, run from your machine with the Neon `DATABASE_URL`:

```bash
npm --prefix server run db:push
npm --prefix server run seed
```

Then verify:

```text
https://your-worksphere-api.onrender.com/health
```

It should return `"database":"connected"`.

## 3. Deploy Frontend on Vercel

Import the repository into Vercel.

Use:

```text
Root Directory: client
Build Command: npm run build
Output Directory: dist
```

Environment variable:

```text
VITE_API_URL=https://your-worksphere-api.onrender.com
```

After deployment, open the Vercel URL and sign in with:

```text
admin@worksphere.io / WorkSphere@123!
hr@worksphere.io / WorkSphere@123!
employee@worksphere.io / WorkSphere@123!
```

## Notes

- Do not deploy with the local `server/.env`.
- Keep `DATABASE_URL`, `JWT_SECRET`, and `JWT_REFRESH_SECRET` only in host environment variables.
- If the frontend gets a CORS error, add the exact Vercel URL to `CLIENT_URLS` in Render.
