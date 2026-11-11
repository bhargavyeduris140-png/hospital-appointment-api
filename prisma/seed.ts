import { prisma } from "../src/lib/prisma";

async function main() {
  const patient = await prisma.patient.upsert({
    where: { email: "seed.patient@example.com" },
    update: {},
    create: { firstName: "Asha", lastName: "Kumar", email: "seed.patient@example.com", dateOfBirth: new Date("2000-05-12") },
  });
  const doctor = await prisma.doctor.upsert({
    where: { email: "seed.doctor@example.com" },
    update: {},
    create: { firstName: "Ravi", lastName: "Shah", email: "seed.doctor@example.com", specialization: "Cardiology" },
  });
  const existing = await prisma.appointment.findFirst({ where: { patientId: patient.id, doctorId: doctor.id, reason: "Seed checkup" } });
  if (!existing) await prisma.appointment.create({
    data: { patientId: patient.id, doctorId: doctor.id, scheduledAt: new Date(Date.now() + 86400000), reason: "Seed checkup" },
  });
  console.log("Seed completed: patient, doctor, appointment");
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
