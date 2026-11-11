# Hospital Appointment API

A TypeScript + Express + Prisma 7 + PostgreSQL CRUD module for patients, doctors and appointments.

## Setup

Requirements: Node.js 20.19+ (or 22.12+), npm and PostgreSQL.

```bash
npm install
cp .env.example .env
# Set DATABASE_URL in .env to your PostgreSQL connection string
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run seed
npm run typecheck
npm test
npm run build
npm run dev
```

Prisma 7 reads the connection URL from `prisma.config.ts`. Runtime database access uses `@prisma/adapter-pg`. Do not commit `.env`.

**Important:** `npm run seed` clears the appointments, patients and doctors tables before inserting its sample dataset. Use it only with a development/test database.

## Required CRUD functions

- `src/patients.ts`: `createPatient`, `listPatients`, `getPatient`, `searchPatients`, `updatePatient`, `updatePatientPhone`, `deletePatient`, `cancelPatientAppointments`.
- `src/doctors.ts`: `createDoctor`, `listDoctors`, `getDoctor`, `updateDoctor`, `deleteDoctor`, `searchDoctorsBySpecialty`, `getUpcomingAppointmentsForDoctor`.
- `src/appointments.ts`: `bookAppointment` (connects existing Patient and Doctor records using Prisma `connect`), `createAppointment`, `listAppointments`, `getAppointment`, `updateAppointment`, `updateAppointmentStatus`, `cancelAppointment`, `deleteAppointment`, `getUpcomingAppointments`.

## HTTP endpoints

All three resources provide list, retrieve-by-ID, create, update and delete endpoints under `/api/patients`, `/api/doctors` and `/api/appointments`.

Assignment-specific operations:

| Operation | Endpoint |
| --- | --- |
| Search patients by name, email or phone | `GET /api/patients?search=asha` |
| Update only a patient's phone | `PATCH /api/patients/:id/phone` with `{"phone":"8000000000"}` |
| Search doctors by specialty | `GET /api/doctors?specialty=cardio` |
| List upcoming appointments for one doctor | `GET /api/doctors/:id/appointments/upcoming` |
| List upcoming appointments overall | `GET /api/appointments/upcoming` |
| Change appointment status | `PATCH /api/appointments/:id/status` with `{"status":"COMPLETED"}` |
| Cancel one appointment | `POST /api/appointments/:id/cancel` |
| Cancel a patient's scheduled appointments | `POST /api/patients/:id/cancel-appointments` |

Appointment status values: `SCHEDULED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`.

## Database schema

Models use PascalCase Prisma names and explicit snake_case mappings with `@@map` and `@map`. PostgreSQL date of birth uses `@db.Date`; database timestamps use the requested `@db.Timestamp(6)`. Appointment foreign keys reference Patient and Doctor records.

## Tests and submission evidence

`tests/crud.integration.test.ts` connects to the configured PostgreSQL database and exercises patient search, phone-only update, appointment booking with relation connections, doctor-specific upcoming appointments, status updates and cancellation. `tests/schema.test.ts` checks schema mappings and Prisma 7 adapter configuration.

Run the following against a dedicated test database:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run seed
npm test
npm run build
```

Capture a screenshot of the **actual successful terminal output** after running those commands and attach it to the submission (for example, save it as `docs/test-output.png`). A screenshot must come from a real run; it is not generated or claimed by this repository.

## Pull request details

- Repository: `bhargavyeduris140-png/hospital-appointment-api`
- Feature branch: `feature/hospital-crud`
- Base branch: `main`
- Pull request: https://github.com/bhargavyeduris140-png/hospital-appointment-api/pull/1
