import express from "express";
import cors from "cors";
import patientsRouter from "./routes/patients";
import doctorsRouter from "./routes/doctors";
import appointmentsRouter from "./routes/appointments";
import { errorHandler } from "./middleware/error-handler";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "hospital-appointment-api" });
});

app.use("/api/patients", patientsRouter);
app.use("/api/doctors", doctorsRouter);
app.use("/api/appointments", appointmentsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);