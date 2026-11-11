import { prisma } from "./lib/prisma";
import type { Prisma } from "./generated/prisma/client";
import type { AppointmentStatus } from "./generated/prisma/enums";

export interface BookAppointmentInput {
  patientId: number;
  doctorId: number;
  scheduledAt: Date;
  reason?: string | null;
}
export const bookAppointment = ({ patientId, doctorId, scheduledAt, reason }: BookAppointmentInput) =>
  prisma.appointment.create({
    data: {
      scheduledAt,
      reason,
      patient: { connect: { id: patientId } },
      doctor: { connect: { id: doctorId } },
    },
    include: { patient: true, doctor: true },
  });
export const createAppointment = (data: Prisma.AppointmentCreateInput) =>
  prisma.appointment.create({ data, include: { patient: true, doctor: true } });
export const listAppointments = (status?: AppointmentStatus) =>
  prisma.appointment.findMany({ where: status ? { status } : undefined, include: { patient: true, doctor: true }, orderBy: { scheduledAt: "asc" } });
export const getAppointment = (id: number) =>
  prisma.appointment.findUnique({ where: { id }, include: { patient: true, doctor: true } });
export const updateAppointment = (id: number, data: Prisma.AppointmentUncheckedUpdateInput) =>
  prisma.appointment.update({ where: { id }, data, include: { patient: true, doctor: true } });
export const updateAppointmentStatus = (id: number, status: AppointmentStatus) =>
  prisma.appointment.update({ where: { id }, data: { status }, include: { patient: true, doctor: true } });
export const cancelAppointment = (id: number) => updateAppointmentStatus(id, "CANCELLED");
export const deleteAppointment = (id: number) => prisma.appointment.delete({ where: { id } });
export const getUpcomingAppointments = (from = new Date()) =>
  prisma.appointment.findMany({
    where: { scheduledAt: { gte: from }, status: "SCHEDULED" },
    include: { patient: true, doctor: true },
    orderBy: { scheduledAt: "asc" },
  });
