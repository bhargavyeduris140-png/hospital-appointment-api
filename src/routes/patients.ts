import { Router } from "express";
import { cancelPatientAppointments } from "../patients";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../utils/async-handler";

const router = Router();

const patientSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().max(30).optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
});
const updatePatientSchema = patientSchema.partial();

router.post("/", asyncHandler(async (req, res) => {
  const data = patientSchema.parse(req.body);
  const patient = await prisma.patient.create({ data });
  res.status(201).json(patient);
}));

router.get("/", asyncHandler(async (_req, res) => {
  const patients = await prisma.patient.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    include: { _count: { select: { appointments: true } } },
  });
  res.json(patients);
}));

router.post("/:id/cancel-appointments", asyncHandler(async (req, res) => {
  const id = z.coerce.number().int().positive().parse(req.params.id);
  const patient = await prisma.patient.findUnique({ where: { id } });
  if (!patient) { res.status(404).json({ error: "Patient not found" }); return; }
  const result = await cancelPatientAppointments(id);
  res.json({ cancelled: result.count });
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const id = z.coerce.number().int().positive().parse(req.params.id);
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: { appointments: { include: { doctor: true }, orderBy: { scheduledAt: "desc" } } },
  });
  if (!patient) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }
  res.json(patient);
}));

router.patch("/:id", asyncHandler(async (req, res) => {
  const id = z.coerce.number().int().positive().parse(req.params.id);
  const data = updatePatientSchema.parse(req.body);
  if (Object.keys(data).length === 0) {
    res.status(400).json({ error: "Provide at least one field to update" });
    return;
  }
  const patient = await prisma.patient.update({ where: { id }, data });
  res.json(patient);
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  const id = z.coerce.number().int().positive().parse(req.params.id);
  await prisma.patient.delete({ where: { id } });
  res.status(204).send();
}));

export default router;