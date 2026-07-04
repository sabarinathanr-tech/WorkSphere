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

## Current implementation

- Premium responsive React/Vite dashboard experience.
- Role-aware auth preview for Admin, HR and Employee.
- Interactive modules for employees, attendance, leave, payroll, profile, reports, notifications and settings.
- Express API structure with controllers, middleware, routes and JWT validation.
- Production-level Prisma schema for users, employees, departments, attendance, leave, payroll, notifications, activity logs and documents.
A modern Human Resource Management System for employee management, attendance, leave management, and workforce analytics.
