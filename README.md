# Hospital Appointment API

A Node.js, TypeScript, and Prisma CRUD API for managing patients, doctors, and appointments.

## Features

- Create, read, update, and delete patients.
- Create, read, update, and delete doctors.
- Create, read, update, and delete appointments.
- Prisma ORM with relational database models.
- Input validation and consistent error handling.

## Requirements

- Node.js 20+
- npm
- PostgreSQL (or another Prisma-supported database configured in the Prisma schema)

## Setup

```bash
npm install
cp .env.example .env
```

Set `DATABASE_URL` in `.env` to your database connection string.

Generate the Prisma client and apply the schema:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Suggested API resources

| Resource | Operations |
| --- | --- |
| Patients | GET, GET by ID, POST, PUT/PATCH, DELETE |
| Doctors | GET, GET by ID, POST, PUT/PATCH, DELETE |
| Appointments | GET, GET by ID, POST, PUT/PATCH, DELETE |

## Data model

- Patient: patient identity and contact information.
- Doctor: doctor identity, specialization, and contact information.
- Appointment: links one patient and one doctor with a scheduled date/time and status.

An appointment must reference existing patient and doctor records. The database schema should enforce these relations with foreign keys.

## Environment variables

Create a local `.env` file based on `.env.example`. Never commit real credentials or secrets.

## Development

```bash
npm run dev
npm run build
npm test
```

The scripts depend on the package configuration. Add or adjust them as needed for the chosen server framework and test runner.
