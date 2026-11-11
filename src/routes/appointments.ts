import { Router } from "express";
import { bookAppointment, cancelAppointment, getUpcomingAppointments, updateAppointmentStatus } from "../appointments";
import { AppointmentStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../utils/async-handler";

const router = Router();

const appointmentSchema = z.object({
  patientId: z.coerce.number().int().positive(),
  doctorId: z.coerce.number().int().positive(),
  scheduledAt: z.coerce.date(),
  reason: z.string().trim().max(500).optional().nullable(),
  status: z.nativeEnum(AppointmentStatus).optional(),
});
const updateAppointmentSchema = appointmentSchema.partial();

router.post("/", asyncHandler(async (req, res) => {
  const data = appointmentSchema.parse(req.body);
  const appointment = await bookAppointment(data);
  res.status(201).json(appointment);
}));

router.get("/", asyncHandler(async (req, res) => {
  const status = req.query.status
    ? z.nativeEnum(AppointmentStatus).parse(req.query.status)
    : undefined;
  const appointments = await prisma.appointment.findMany({
    where: status ? { status } : undefined,
    orderBy: { scheduledAt: "asc" },
    include: { patient: true, doctor: true },
  });
  res.json(appointments);
}));

router.get("/upcoming", asyncHandler(async (_req, res) => {
  res.json(await getUpcomingAppointments());
}));

router.patch("/:id/status", asyncHandler(async (req, res) => {
  const id = z.coerce.number().int().positive().parse(req.params.id);
  const body = z.object({ status: z.nativeEnum(AppointmentStatus) }).parse(req.body);
  res.json(await updateAppointmentStatus(id, body.status));
}));

router.post("/:id/cancel", asyncHandler(async (req, res) => {
  const id = z.coerce.number().int().positive().parse(req.params.id);
  res.json(await cancelAppointment(id));
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const id = z.coerce.number().int().positive().parse(req.params.id);
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { patient: true, doctor: true },
  });
  if (!appointment) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }
  res.json(appointment);
}));

router.patch("/:id", asyncHandler(async (req, res) => {
  const id = z.coerce.number().int().positive().parse(req.params.id);
  const data = updateAppointmentSchema.parse(req.body);
  if (Object.keys(data).length === 0) {
    res.status(400).json({ error: "Provide at least one field to update" });
    return;
  }
  const appointment = await prisma.appointment.update({
    where: { id },
    data,
    include: { patient: true, doctor: true },
  });
  res.json(appointment);
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  const id = z.coerce.number().int().positive().parse(req.params.id);
  await prisma.appointment.delete({ where: { id } });
  res.status(204).send();
}));

export default router;