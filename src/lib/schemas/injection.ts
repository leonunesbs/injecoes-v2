import { z } from "zod";

// Injection Schema
export const injectionSchema = z.object({
  id: z.string().optional(),
  patientId: z.string().min(1, "Paciente é obrigatório"),
  scheduledDate: z.date(),
  appliedDate: z.date().optional(),
  appliedAt: z.date().optional(),
  injectionOD: z
    .number()
    .min(0, "Injeções OD não podem ser negativas")
    .default(0),
  injectionOS: z
    .number()
    .min(0, "Injeções OS não podem ser negativas")
    .default(0),
  status: z
    .enum(["SCHEDULED", "APPLIED", "CANCELLED", "RESCHEDULED", "MISSED"])
    .default("SCHEDULED"),
  observations: z.string().optional(),
  sideEffects: z.string().optional(),
});

export type InjectionFormData = z.infer<typeof injectionSchema>;
