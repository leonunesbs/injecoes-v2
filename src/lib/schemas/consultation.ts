import { z } from "zod";

// Consultation Schema (simplified for settings)
export const consultationSettingsSchema = z.object({
  id: z.string().optional(),
  patientId: z.string().min(1, "Paciente é obrigatório"),
  consultationDate: z.date(),
  notes: z.string().optional(),
  nextVisit: z.date().optional(),
  status: z
    .enum(["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"])
    .default("COMPLETED"),
});

export type ConsultationSettingsFormData = z.infer<
  typeof consultationSettingsSchema
>;
