import { prisma } from "./lib/prisma";
import type { Prisma } from "@prisma/client";

export const createPatient = (data: Prisma.PatientCreateInput) => prisma.patient.create({ data });
export const listPatients = () => prisma.patient.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] });
export const getPatient = (id: number) => prisma.patient.findUnique({ where: { id }, include: { appointments: true } });
export const searchPatients = (search: string) =>
  prisma.patient.findMany({
    where: {
      OR: [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ],
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
export const updatePatient = (id: number, data: Prisma.PatientUpdateInput) => prisma.patient.update({ where: { id }, data });
export const updatePatientPhone = (id: number, phone: string) =>
  prisma.patient.update({ where: { id }, data: { phone } });
export const deletePatient = (id: number) => prisma.patient.delete({ where: { id } });
export const cancelPatientAppointments = (patientId: number) =>
  prisma.appointment.updateMany({ where: { patientId, status: "SCHEDULED" }, data: { status: "CANCELLED" } });
