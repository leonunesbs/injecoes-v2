import { z } from "zod";

// Prescription Schema
export const prescriptionSchema = z.object({
  id: z.string().optional(),
  patientId: z.string().min(1, "Paciente é obrigatório"),
  indicationId: z.string().min(1, "Indicação é obrigatória"),
  indicationOther: z.string().optional(),
  medicationId: z.string().min(1, "Medicação é obrigatória"),
  medicationOther: z.string().optional(),
  swalisId: z.string().min(1, "Classificação Swalis é obrigatória"),
  prescribedOD: z
    .number()
    .min(0, "Prescrição OD não pode ser negativa")
    .default(0),
  prescribedOS: z
    .number()
    .min(0, "Prescrição OS não pode ser negativa")
    .default(0),
  startWithOD: z.boolean().default(true),
  notes: z.string().optional(),
  status: z
    .enum(["ACTIVE", "COMPLETED", "CANCELLED", "EXPIRED"])
    .default("ACTIVE"),
});

export type PrescriptionFormData = z.infer<typeof prescriptionSchema>;
