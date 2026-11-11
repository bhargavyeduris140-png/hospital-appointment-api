import { prisma } from "./lib/prisma";
import type { Prisma } from "@prisma/client";

export const createDoctor = (data: Prisma.DoctorCreateInput) => prisma.doctor.create({ data });
export const listDoctors = () => prisma.doctor.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] });
export const getDoctor = (id: number) => prisma.doctor.findUnique({ where: { id }, include: { appointments: true } });
export const updateDoctor = (id: number, data: Prisma.DoctorUpdateInput) => prisma.doctor.update({ where: { id }, data });
export const deleteDoctor = (id: number) => prisma.doctor.delete({ where: { id } });
export const searchDoctorsBySpecialty = (specialty: string) =>
  prisma.doctor.findMany({ where: { specialization: { contains: specialty, mode: "insensitive" } }, orderBy: { lastName: "asc" } });
