# WorkSphere

WorkSphere is a production-oriented HRMS portfolio project for employee management, attendance, leave, payroll, reporting, notifications, profile management and settings.

## Run locally

```bash
npm --prefix client install
npm --prefix server install
npm run dev
```

The frontend runs at `http://127.0.0.1:5173`.

For the API:

```bash
npm --prefix server run dev
```

Set `DATABASE_URL`, `JWT_SECRET` and `CLIENT_URL` in the server environment before connecting the Prisma models to a PostgreSQL database.

## PostgreSQL

Create `server/.env` from `server/.env.example`, then run:

```bash
npm --prefix server run db:push
npm --prefix server run seed
```

The backend health endpoint confirms both API and database status:

```text
http://127.0.0.1:5000/health
```

Seeded demo accounts use password `WorkSphere@123!`:

- `admin@worksphere.io`
- `hr@worksphere.io`
- `employee@worksphere.io`

Authentication is JWT-based with short-lived access tokens and rotating refresh sessions:

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/logout-all`
- `POST /api/auth/change-password`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

## Current implementation

- Premium responsive React/Vite dashboard experience.
- Role-aware auth preview for Admin, HR and Employee.
- Interactive modules for employees, attendance, leave, payroll, profile, reports, notifications and settings.
- Express API with PostgreSQL-backed auth, employees, attendance, leave, payroll, profile and dashboard data.
- Production-level Prisma schema for users, employees, departments, attendance, leave, payroll, notifications, activity logs and documents.
A modern Human Resource Management System for employee management, attendance, leave management, and workforce analytics.
