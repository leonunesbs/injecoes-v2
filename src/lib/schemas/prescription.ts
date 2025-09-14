import { z } from "zod";

// Prescription Schema
export const prescriptionSchema = z.object({
  id: z.string().optional(),
  consultationId: z.string().min(1, "Consulta é obrigatória"),
  prescribedOD: z
    .number()
    .min(0, "Prescrição OD não pode ser negativa")
    .default(0),
  prescribedOS: z
    .number()
    .min(0, "Prescrição OS não pode ser negativa")
    .default(0),
  notes: z.string().optional(),
  status: z
    .enum(["ACTIVE", "COMPLETED", "CANCELLED", "EXPIRED"])
    .default("ACTIVE"),
});

export type PrescriptionFormData = z.infer<typeof prescriptionSchema>;
