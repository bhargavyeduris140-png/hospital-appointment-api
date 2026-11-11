import { prisma } from "./lib/prisma";
import type { Prisma, AppointmentStatus } from "@prisma/client";

export const createAppointment = (data: Prisma.AppointmentUncheckedCreateInput) =>
  prisma.appointment.create({ data, include: { patient: true, doctor: true } });
export const listAppointments = (status?: AppointmentStatus) =>
  prisma.appointment.findMany({ where: status ? { status } : undefined, include: { patient: true, doctor: true }, orderBy: { scheduledAt: "asc" } });
export const getAppointment = (id: number) =>
  prisma.appointment.findUnique({ where: { id }, include: { patient: true, doctor: true } });
export const updateAppointment = (id: number, data: Prisma.AppointmentUncheckedUpdateInput) =>
  prisma.appointment.update({ where: { id }, data, include: { patient: true, doctor: true } });
export const deleteAppointment = (id: number) => prisma.appointment.delete({ where: { id } });
export const getUpcomingAppointments = (from = new Date()) =>
  prisma.appointment.findMany({
    where: { scheduledAt: { gte: from }, status: "SCHEDULED" },
    include: { patient: true, doctor: true },
    orderBy: { scheduledAt: "asc" },
  });
