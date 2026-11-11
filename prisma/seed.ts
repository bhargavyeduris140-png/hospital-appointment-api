import { prisma } from "../src/lib/prisma";

async function main() {
  // Reset in FK-safe order so every seed run starts from a predictable dataset.
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();

  const patients = await prisma.patient.createMany({
    data: [
      { firstName: "Asha", lastName: "Kumar", email: "asha.kumar@example.com", phone: "9000000001", dateOfBirth: new Date("2000-05-12") },
      { firstName: "Arjun", lastName: "Rao", email: "arjun.rao@example.com", phone: "9000000002", dateOfBirth: new Date("1998-09-20") },
      { firstName: "Meera", lastName: "Shah", email: "meera.shah@example.com", phone: "9000000003", dateOfBirth: new Date("2002-01-15") },
    ],
  });
  const doctors = await prisma.doctor.createMany({
    data: [
      { firstName: "Ravi", lastName: "Shah", email: "ravi.shah@example.com", phone: "9111111111", specialization: "Cardiology" },
      { firstName: "Neha", lastName: "Iyer", email: "neha.iyer@example.com", phone: "9222222222", specialization: "Dermatology" },
      { firstName: "Kiran", lastName: "Das", email: "kiran.das@example.com", phone: "9333333333", specialization: "Neurology" },
    ],
  });
  const patientRows = await prisma.patient.findMany({ orderBy: { id: "asc" } });
  const doctorRows = await prisma.doctor.findMany({ orderBy: { id: "asc" } });
  const now = Date.now();
  await prisma.appointment.createMany({
    data: [
      { patientId: patientRows[0].id, doctorId: doctorRows[0].id, scheduledAt: new Date(now + 86400000), reason: "Routine heart check" },
      { patientId: patientRows[1].id, doctorId: doctorRows[1].id, scheduledAt: new Date(now + 172800000), reason: "Skin consultation" },
      { patientId: patientRows[2].id, doctorId: doctorRows[2].id, scheduledAt: new Date(now + 259200000), reason: "Neurology follow-up" },
    ],
  });
  console.log(`Seed complete: ${patients.count} patients, ${doctors.count} doctors, 3 appointments`);
}
main().catch(error => { console.error("Seed failed:", error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
