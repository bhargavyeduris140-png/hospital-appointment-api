import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../utils/async-handler";

const router = Router();

const doctorSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().max(30).optional().nullable(),
  specialization: z.string().trim().min(1).max(120),
});
const updateDoctorSchema = doctorSchema.partial();

router.post("/", asyncHandler(async (req, res) => {
  const data = doctorSchema.parse(req.body);
  const doctor = await prisma.doctor.create({ data });
  res.status(201).json(doctor);
}));

router.get("/", asyncHandler(async (_req, res) => {
  const doctors = await prisma.doctor.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    include: { _count: { select: { appointments: true } } },
  });
  res.json(doctors);
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const id = z.coerce.number().int().positive().parse(req.params.id);
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: { appointments: { include: { patient: true }, orderBy: { scheduledAt: "desc" } } },
  });
  if (!doctor) {
    res.status(404).json({ error: "Doctor not found" });
    return;
  }
  res.json(doctor);
}));

router.patch("/:id", asyncHandler(async (req, res) => {
  const id = z.coerce.number().int().positive().parse(req.params.id);
  const data = updateDoctorSchema.parse(req.body);
  if (Object.keys(data).length === 0) {
    res.status(400).json({ error: "Provide at least one field to update" });
    return;
  }
  const doctor = await prisma.doctor.update({ where: { id }, data });
  res.json(doctor);
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  const id = z.coerce.number().int().positive().parse(req.params.id);
  await prisma.doctor.delete({ where: { id } });
  res.status(204).send();
}));

export default router;