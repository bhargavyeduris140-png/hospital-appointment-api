import type { ErrorRequestHandler } from "express";
import { Prisma } from "../generated/prisma/client";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: "Validation failed",
      details: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Record not found" });
      return;
    }
    if (error.code === "P2002") {
      res.status(409).json({ error: "A record with this unique value already exists" });
      return;
    }
    if (error.code === "P2003") {
      res.status(409).json({ error: "Related record does not exist or is still in use" });
      return;
    }
  }

  console.error(error);
  res.status(500).json({ error: "Internal server error" });
};