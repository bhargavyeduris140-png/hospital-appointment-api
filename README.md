# Hospital Appointment API

TypeScript + Express + **Prisma 7** + PostgreSQL hospital CRUD assignment.

## Setup

Requirements: Node.js 20.19+ (or 22.12+), PostgreSQL, npm.

```bash
npm install
cp .env.example .env
# Set DATABASE_URL in .env
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run seed
npm run typecheck
npm test
npm run build
npm run dev
```

Prisma 7 reads DATABASE_URL from `prisma.config.ts`; the runtime uses `@prisma/adapter-pg`. Never commit the real .env file.

## CRUD module

- `src/patients.ts`: createPatient, listPatients, getPatient, updatePatient, deletePatient, cancelPatientAppointments.
- `src/doctors.ts`: createDoctor, listDoctors, getDoctor, updateDoctor, deleteDoctor, searchDoctorsBySpecialty.
- `src/appointments.ts`: createAppointment, listAppointments, getAppointment, updateAppointment, deleteAppointment, getUpcomingAppointments.

## HTTP API

All resources support `GET /api/{resource}`, `GET /api/{resource}/:id`, `POST /api/{resource}`, `PATCH /api/{resource}/:id`, and `DELETE /api/{resource}/:id`, where resource is patients, doctors, or appointments.

Additional endpoints:
- `GET /api/doctors?specialty=cardio`: case-insensitive specialty search.
- `GET /api/appointments/upcoming`: scheduled appointments from the current time onward.
- `GET /api/appointments?status=SCHEDULED`: status filter.
- `POST /api/patients/:id/cancel-appointments`: cancel all currently scheduled appointments belonging to that patient, returns cancellation count.

Example:

```bash
curl http://localhost:3000/api/doctors?specialty=cardio
curl http://localhost:3000/api/appointments/upcoming
curl -X POST http://localhost:3000/api/patients/1/cancel-appointments
```

## Schema

Prisma models Patient, Doctor, Appointment use snake_case PostgreSQL table/column names through `@@map` and `@map`; date of birth uses `@db.Date`, timestamps use `@db.Timestamptz(6)`. Foreign keys enforce patient/doctor appointment relationships.

## Tests and evidence

`npm test` runs repository-level schema/adapter checks without a database. To verify live CRUD, start PostgreSQL, migrate and seed, then exercise endpoints above. **A real screenshot of the local test terminal output is still required for submission**; it cannot be fabricated. Save it as `docs/test-output.png` and commit it after running tests.

## Pull request

Feature branch: `feature/hospital-crud`; target branch: `main`.
PR: https://github.com/bhargavyeduris140-png/hospital-appointment-api/pull/1

Review changes on the PR before merging. Test results must be captured from an actual run.
