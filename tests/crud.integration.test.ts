import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/prisma";
import { createPatient, searchPatients, updatePatientPhone } from "../src/patients";
import { createDoctor, getUpcomingAppointmentsForDoctor } from "../src/doctors";
import { bookAppointment, updateAppointmentStatus, cancelAppointment } from "../src/appointments";

let patientId = 0;
let doctorId = 0;
let appointmentId = 0;
const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

before(async () => {
  await prisma.$connect();
  const patient = await createPatient({
    firstName: "Test", lastName: "Patient", email: `patient-${suffix}@example.test`, phone: "8000000000",
  });
  patientId = patient.id;
  const doctor = await createDoctor({
    firstName: "Test", lastName: "Doctor", email: `doctor-${suffix}@example.test`, specialization: "Cardiology",
  });
  doctorId = doctor.id;
});

after(async () => {
  if (appointmentId) await prisma.appointment.deleteMany({ where: { id: appointmentId } });
  if (patientId) await prisma.patient.deleteMany({ where: { id: patientId } });
  if (doctorId) await prisma.doctor.deleteMany({ where: { id: doctorId } });
  await prisma.$disconnect();
});

test("patient search finds created patient", async () => {
  const found = await searchPatients(`patient-${suffix}`);
  assert.ok(found.some(patient => patient.id === patientId));
});

test("phone-only update changes only the phone field", async () => {
  const updated = await updatePatientPhone(patientId, "8111111111");
  assert.equal(updated.phone, "8111111111");
  assert.equal(updated.email, `patient-${suffix}@example.test`);
});

test("booking connects existing patient and doctor; doctor upcoming list includes it", async () => {
  const appointment = await bookAppointment({
    patientId, doctorId, scheduledAt: new Date(Date.now() + 86400000), reason: "Integration test",
  });
  appointmentId = appointment.id;
  assert.equal(appointment.patient.id, patientId);
  assert.equal(appointment.doctor.id, doctorId);
  const upcoming = await getUpcomingAppointmentsForDoctor(doctorId);
  assert.ok(upcoming.some(item => item.id === appointmentId));
});

test("appointment status and cancel operations update database", async () => {
  const completed = await updateAppointmentStatus(appointmentId, "COMPLETED");
  assert.equal(completed.status, "COMPLETED");
  const cancelled = await cancelAppointment(appointmentId);
  assert.equal(cancelled.status, "CANCELLED");
});
